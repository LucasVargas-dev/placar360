import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import DefaultService from '../../../packages/default.service.js';
import { TournamentEntity, TournamentORM } from './tournament.orm.js';
import { CreateTournamentDto, UpdateTournamentDto } from './tournament.model';
import { TournamentQueryService } from './tournament.query.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { NotificationService } from '../notification/notification.service.js';
import { NotificationChannel } from '../../../packages/enums/notification.types.js';

@Injectable()
export class TournamentService extends DefaultService<
	TournamentEntity,
	Partial<Omit<CreateTournamentDto, 'entryFee'>> & { entryFee: TournamentEntity['entryFee'] },
	Partial<Omit<UpdateTournamentDto, 'entryFee'>> & { entryFee?: TournamentEntity['entryFee'] }
> {
	constructor(
		orm: TournamentORM,
		queryService: TournamentQueryService,
		@Inject(PrismaService) private readonly prisma: PrismaService,
		@Inject(forwardRef(() => NotificationService))
		private notificationService: NotificationService,
	) {
		super(orm, queryService);
	}

  private async validateClubExists(clubId: string): Promise<void> {
    const club = await this.prisma.club.findUnique({
      where: { id: clubId, deletedAt: null, isActive: true },
    });

    if (!club) {
      throw new NotFoundException(`Club with ID ${clubId} not found or inactive`);
    }
  }

  private async validateClubsExist(clubIds: string[]): Promise<void> {
		if (!clubIds.length) {
			throw new BadRequestException('Selecione ao menos um clube válido');
		}

		const clubs = await this.prisma.club.findMany({
			where: {
				id: { in: clubIds },
				deletedAt: null,
				isActive: true,
			},
			select: { id: true },
		});

		if (clubs.length !== clubIds.length) {
			throw new NotFoundException('Um ou mais clubes informados não foram encontrados');
		}
	}

  private async validateCityExists(cityId: number): Promise<void> {
		const city = await this.prisma.city.findUnique({
			where: { id: cityId },
		});

		if (!city) {
			throw new NotFoundException(`City with ID ${cityId} not found`);
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

  private validateTournamentDates(
    startDate: Date,
    endDate: Date,
    registrationStart: Date,
    registrationEnd: Date
  ): void {
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (registrationStart >= registrationEnd) {
      throw new BadRequestException('Registration start must be before registration end');
    }

    if (registrationEnd >= startDate) {
      throw new BadRequestException('Registration end must be before tournament start');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Cannot create tournament in the past');
    }
  }

	/**
	 * Validates if the data is valid for the tournament
	 */
	protected async validateEntity(
		data: Partial<Omit<CreateTournamentDto, 'entryFee'>> & { entryFee: TournamentEntity['entryFee'] } | Partial<Omit<UpdateTournamentDto, 'entryFee'>> & { entryFee?: TournamentEntity['entryFee'] },
		id?: string
	): Promise<void> {
		// Validate organizer exists if organizerId is provided
		if ('organizerId' in data && data.organizerId) {
			await this.validateUserExists(data.organizerId);
		}

		// Validate city exists if provided
		if ('cityId' in data && data.cityId) {
			await this.validateCityExists(Number(data.cityId));
		}

		// Validate dates
		let startDate: Date | undefined;
		let endDate: Date | undefined;
		let registrationStart: Date | undefined;
		let registrationEnd: Date | undefined;

		if ('startDate' in data && data.startDate && 'endDate' in data && data.endDate &&
			'registrationStart' in data && data.registrationStart && 'registrationEnd' in data && data.registrationEnd) {
			startDate = new Date(data.startDate);
			endDate = new Date(data.endDate);
			registrationStart = new Date(data.registrationStart);
			registrationEnd = new Date(data.registrationEnd);
		} else if (id && ('startDate' in data || 'endDate' in data || 'registrationStart' in data || 'registrationEnd' in data)) {
			const existing = await this.show(id);
			if (existing) {
				startDate = 'startDate' in data && data.startDate ? new Date(data.startDate) : existing.startDate;
				endDate = 'endDate' in data && data.endDate ? new Date(data.endDate) : existing.endDate;
				registrationStart = 'registrationStart' in data && data.registrationStart ? new Date(data.registrationStart) : existing.registrationStart;
				registrationEnd = 'registrationEnd' in data && data.registrationEnd ? new Date(data.registrationEnd) : existing.registrationEnd;
			}
		}

		if (startDate && endDate && registrationStart && registrationEnd) {
			this.validateTournamentDates(startDate, endDate, registrationStart, registrationEnd);
		}
	}

	/**
	 * Validates if the id is valid for the tournament
	 */
	protected async validateId(id: number | string): Promise<void> {
		const tournamentExists = await this.show(id);

		if (!tournamentExists) {
			throw new NotFoundException(`Tournament with ID ${id} not found`);
		}
	}

	/**
	 * Override create to add notification logic
	 */
	async create(
		data: Partial<Omit<CreateTournamentDto, 'entryFee'>> & { entryFee: TournamentEntity['entryFee'] } & {
			clubIds?: string[];
			selectedDates?: string[];
		},
		args?: any
	) {
		const { clubIds = [], selectedDates = [], ...tournamentPayload } = data;

		await this.validateClubsExist(clubIds);

		const tournament = await super.create(
			tournamentPayload as Partial<Omit<CreateTournamentDto, 'entryFee'>> & { entryFee: TournamentEntity['entryFee'] },
			args
		);

		// Send notification to tournament organizer
		try {
			await this.notificationService.createTournamentUpdateNotification(
				data.organizerId,
				{
					tournamentId: typeof tournament === 'string' ? tournament : tournament.id,
					tournamentName: data.name,
					updateType: 'REGISTRATION_OPEN',
					message: `O torneio "${data.name}" foi criado com sucesso! As inscrições estão abertas até ${new Date(data.registrationEnd).toLocaleDateString('pt-BR')}.`,
				},
				NotificationChannel.BOTH,
			);
		} catch (error) {
			console.error('Failed to send tournament creation notification:', error);
		}

		const tournamentId =
			typeof tournament === 'string' ? tournament : (tournament?.id ?? '');

		if (!tournamentId) {
			return tournament;
		}

		if (clubIds.length > 0) {
			await this.prisma.clubHasTournament.createMany({
				data: clubIds.map(clubId => ({
					clubId,
					tournamentId,
				})),
				skipDuplicates: true,
			});
		}

		if (selectedDates.length > 0) {
			console.info(
				`[TournamentService] selected dates received for tournament ${tournamentId}:`,
				selectedDates
			);
		}

		return await this.prisma.tournament.findUnique({
			where: { id: tournamentId },
			include: this.getTournamentInclude(),
		});
	}

	/**
	 * Override update to add notification logic
	 */
	async update(id: number | string, data: Partial<Omit<UpdateTournamentDto, 'entryFee'>> & { entryFee?: TournamentEntity['entryFee'] }, args?: any) {
		const existing = await this.show(id);
		if (!existing) {
			throw new NotFoundException(`Tournament with ID ${id} not found`);
		}

		const oldStatus = existing.status;
		const updatedTournament = await super.update(id, data, args);

		// Send notifications for status changes
		if (data.status && oldStatus !== data.status) {
			await this.sendStatusChangeNotifications(updatedTournament as any, oldStatus, data.status);
		}

		// Send notification when tournament is about to start
		if (data.status === 'IN_PROGRESS' && oldStatus !== 'IN_PROGRESS') {
			await this.sendTournamentStartingNotifications(updatedTournament as any);
		}

		return updatedTournament;
	}

  private getTournamentInclude() {
		return {
			organizer: {
				select: {
					id: true,
					email: true,
				},
			},
			city: {
				select: {
					id: true,
					name: true,
					state: {
						select: {
							id: true,
							name: true,
							uf: true,
						},
					},
				},
			},
			clubHasTournaments: {
				where: {
					deletedAt: null,
				},
				select: {
					clubId: true,
					tournamentId: true,
					club: {
						select: {
							id: true,
							name: true,
							city: true,
							state: true,
						},
					},
				},
			},
		} as const;
	}

  async getTournamentsByClub(clubId: string) {
		await this.validateClubExists(clubId);

		return this.prisma.tournament.findMany({
			where: {
				deletedAt: null,
				clubHasTournaments: {
					some: {
						clubId,
						deletedAt: null,
					},
				},
			},
			include: this.getTournamentInclude(),
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

  async getTournamentsByOrganizer(organizerId: string) {
		await this.validateUserExists(organizerId);

		return this.prisma.tournament.findMany({
			where: {
				organizerId,
				deletedAt: null,
			},
			include: this.getTournamentInclude(),
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

  async getActiveTournaments() {
		return this.prisma.tournament.findMany({
			where: {
				deletedAt: null,
				isActive: true,
				status: {
					in: ['1', '2'], // PLANNING, REGISTRATION_OPEN
				},
			},
			include: this.getTournamentInclude(),
			orderBy: {
				registrationStart: 'asc',
			},
		});
	}

  // Helper methods for sending notifications
  private async sendStatusChangeNotifications(
    tournament: any,
    oldStatus: string,
    newStatus: string,
  ): Promise<void> {
    try {
      const participants = tournament.participants || [];
      const updateType = this.getUpdateTypeFromStatus(newStatus);
      
      const message = this.getStatusChangeMessage(tournament.name, oldStatus, newStatus);

      // Send to organizer
      await this.notificationService.createTournamentUpdateNotification(
        tournament.organizerId,
        {
          tournamentId: tournament.id,
          tournamentName: tournament.name,
          updateType,
          message,
        },
        NotificationChannel.BOTH,
      );

      // Send to all participants
      for (const participant of participants) {
        try {
          await this.notificationService.createTournamentUpdateNotification(
            participant.user.id,
            {
              tournamentId: tournament.id,
              tournamentName: tournament.name,
              updateType,
              message,
            },
            NotificationChannel.BOTH,
          );
        } catch (error) {
          console.error(`Failed to send notification to participant ${participant.user.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to send status change notifications:', error);
    }
  }

  private async sendTournamentStartingNotifications(tournament: any): Promise<void> {
    try {
      const participants = tournament.participants || [];
      
      // Send to organizer
      await this.notificationService.createTournamentStartingNotification(
        tournament.organizerId,
        {
          tournamentId: tournament.id,
          tournamentName: tournament.name,
          startDate: tournament.startDate,
          location: tournament.club.name,
        },
        NotificationChannel.BOTH,
      );

      // Send to all participants
      for (const participant of participants) {
        try {
          await this.notificationService.createTournamentStartingNotification(
            participant.user.id,
            {
              tournamentId: tournament.id,
              tournamentName: tournament.name,
              startDate: tournament.startDate,
              location: tournament.club.name,
            },
            NotificationChannel.BOTH,
          );
        } catch (error) {
          console.error(`Failed to send tournament starting notification to participant ${participant.user.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to send tournament starting notifications:', error);
    }
  }

  private getUpdateTypeFromStatus(status: string): 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'SCHEDULE_UPDATED' | 'CANCELLED' {
    switch (status) {
      case 'REGISTRATION_OPEN':
        return 'REGISTRATION_OPEN';
      case 'REGISTRATION_CLOSED':
        return 'REGISTRATION_CLOSED';
      case 'CANCELLED':
        return 'CANCELLED';
      default:
        return 'SCHEDULE_UPDATED';
    }
  }

  private getStatusChangeMessage(tournamentName: string, oldStatus: string, newStatus: string): string {
    const statusLabels = {
      'PLANNING': 'Em Planejamento',
      'REGISTRATION_OPEN': 'Inscrições Abertas',
      'REGISTRATION_CLOSED': 'Inscrições Encerradas',
      'IN_PROGRESS': 'Em Andamento',
      'COMPLETED': 'Concluído',
      'CANCELLED': 'Cancelado',
    };

    const oldLabel = statusLabels[oldStatus] || oldStatus;
    const newLabel = statusLabels[newStatus] || newStatus;

    return `O status do torneio "${tournamentName}" mudou de "${oldLabel}" para "${newLabel}".`;
  }
}
