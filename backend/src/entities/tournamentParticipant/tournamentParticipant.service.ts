import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import DefaultService from '../../../packages/default.service.js';
import { TournamentParticipantEntity, TournamentParticipantORM } from './tournamentParticipant.orm.js';
import { CreateTournamentParticipantDto, UpdateTournamentParticipantDto } from './tournamentParticipant.model';
import { TournamentParticipantQueryService } from './tournamentParticipant.query.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class TournamentParticipantService extends DefaultService<
	TournamentParticipantEntity,
	CreateTournamentParticipantDto,
	UpdateTournamentParticipantDto
> {
	constructor(
		orm: TournamentParticipantORM,
		queryService: TournamentParticipantQueryService,
		@Inject(PrismaService) private readonly prisma: PrismaService
	) {
		super(orm, queryService);
	}

  private async validateTournamentExists(tournamentId: string): Promise<void> {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId, deletedAt: null },
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${tournamentId} not found`);
    }
  }

  private async validateUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  private async validateRegistrationPeriod(tournamentId: string): Promise<void> {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: { registrationStart: true, registrationEnd: true, status: true },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    const now = new Date();
    if (now < tournament.registrationStart) {
      throw new BadRequestException('Registration has not started yet');
    }

    if (now > tournament.registrationEnd) {
      throw new BadRequestException('Registration period has ended');
    }

    if (tournament.status !== '2') { // REGISTRATION_OPEN
      throw new BadRequestException('Tournament is not accepting registrations');
    }
  }

  private async validateMaxParticipants(tournamentId: string): Promise<void> {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: { maxParticipants: true },
    });

    if (!tournament?.maxParticipants) {
      return; // No limit set
    }

    const participantCount = await this.prisma.tournamentParticipant.count({
      where: { tournamentId },
    });

    if (participantCount >= tournament.maxParticipants) {
      throw new ConflictException('Tournament has reached maximum participants');
    }
  }

	/**
	 * Validates if the data is valid for the tournament participant
	 */
	protected async validateEntity(
		data: CreateTournamentParticipantDto | UpdateTournamentParticipantDto,
		id?: string
	): Promise<void> {
		// For create operations
		if ('tournamentId' in data && data.tournamentId && 'userId' in data && data.userId) {
			await this.validateTournamentExists(data.tournamentId);
			await this.validateUserExists(data.userId);
			await this.validateRegistrationPeriod(data.tournamentId);
			await this.validateMaxParticipants(data.tournamentId);

			// Check if user is already registered
			const existingParticipant = await this.prisma.tournamentParticipant.findUnique({
				where: {
					tournamentId_userId: {
						tournamentId: data.tournamentId,
						userId: data.userId,
					},
				},
			});

			if (existingParticipant) {
				throw new ConflictException('User is already registered for this tournament');
			}
		}
	}

	/**
	 * Validates if the id is valid for the tournament participant
	 * Note: TournamentParticipant uses composite key, so this method may not be called directly
	 */
	protected async validateId(id: number | string): Promise<void> {
		// Not applicable for composite key entities
	}

  async getParticipantsByTournament(tournamentId: string) {
    await this.validateTournamentExists(tournamentId);

    return this.prisma.tournamentParticipant.findMany({
      where: { tournamentId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        registeredAt: 'asc',
      },
    });
  }

  async getParticipationsByUser(userId: string) {
    await this.validateUserExists(userId);

    return this.prisma.tournamentParticipant.findMany({
      where: { userId },
      include: {
        tournament: {
          select: {
            id: true,
            name: true,
            sportType: true,
            status: true,
          },
        },
      },
      orderBy: {
        registeredAt: 'desc',
      },
    });
  }

  async getParticipantStats(tournamentId: string) {
    await this.validateTournamentExists(tournamentId);

    const stats = await this.prisma.tournamentParticipant.groupBy({
      by: ['status'],
      where: { tournamentId },
      _count: true,
    });

    const totalParticipants = await this.prisma.tournamentParticipant.count({
      where: { tournamentId },
    });

    return {
      totalParticipants,
      statusBreakdown: stats,
    };
  }

	/**
	 * Find a participant by tournamentId and userId (composite key)
	 */
	async findOne(tournamentId: string, userId: string) {
		const participant = await this.prisma.tournamentParticipant.findUnique({
			where: {
				tournamentId_userId: {
					tournamentId,
					userId,
				},
			},
			include: {
				tournament: {
					select: {
						id: true,
						name: true,
						sportType: true,
					},
				},
				user: {
					select: {
						id: true,
						email: true,
					},
				},
			},
		});

		if (!participant) {
			throw new NotFoundException(`Tournament participant not found`);
		}

		return participant;
	}

	/**
	 * Update a participant by tournamentId and userId (composite key)
	 */
	async updateParticipant(tournamentId: string, userId: string, updateTournamentParticipantDto: UpdateTournamentParticipantDto) {
		await this.findOne(tournamentId, userId); // Validate participant exists
		
		return this.prisma.$transaction(async (tx) => {
			return tx.tournamentParticipant.update({
				where: {
					tournamentId_userId: {
						tournamentId,
						userId,
					},
				},
				data: updateTournamentParticipantDto,
				include: {
					tournament: {
						select: {
							id: true,
							name: true,
							sportType: true,
						},
					},
					user: {
						select: {
							id: true,
							email: true,
						},
					},
				},
			});
		});
	}

	/**
	 * Remove a participant by tournamentId and userId (composite key)
	 */
	async removeParticipant(tournamentId: string, userId: string) {
		await this.findOne(tournamentId, userId); // Validate participant exists
		
		return this.prisma.$transaction(async (tx) => {
			return tx.tournamentParticipant.delete({
				where: {
					tournamentId_userId: {
						tournamentId,
						userId,
					},
				},
			});
		});
	}
}
