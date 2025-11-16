import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import DefaultService from '../../../packages/default.service.js';
import { UserClubEntity, UserClubORM } from './userClub.orm.js';
import { CreateUserClubDto, UpdateUserClubDto } from './userClub.model';
import { UserClubQueryService } from './userClub.query.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class UserClubService extends DefaultService<
	UserClubEntity,
	CreateUserClubDto,
	UpdateUserClubDto
> {
	constructor(
		orm: UserClubORM,
		queryService: UserClubQueryService,
		@Inject(PrismaService) private readonly prisma: PrismaService
	) {
		super(orm, queryService);
	}

  private async validateUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  private async validateClubExists(clubId: string): Promise<void> {
    const club = await this.prisma.club.findUnique({
      where: { id: clubId, deletedAt: null, isActive: true },
    });

    if (!club) {
      throw new NotFoundException(`Club with ID ${clubId} not found or inactive`);
    }
  }

  private validateRelationshipType(relationshipType: string): void {
    const validTypes = ['1', '2', '3', '4']; // OWNER, TEACHER, STAFF, MEMBER
    if (!validTypes.includes(relationshipType)) {
      throw new BadRequestException('Invalid relationship type');
    }
  }

  private validateTeacherFields(relationshipType: string, data: CreateUserClubDto | UpdateUserClubDto): void {
    if (relationshipType === '2') { // TEACHER
      const specialties = 'specialties' in data ? data.specialties : undefined;
      if (!specialties || specialties.length === 0) {
        throw new BadRequestException('Teachers must specify at least one specialty');
      }
    }
  }

	/**
	 * Validates if the data is valid for the user club
	 */
	protected async validateEntity(
		data: CreateUserClubDto | UpdateUserClubDto,
		id?: string
	): Promise<void> {
		// For create operations
		if ('userId' in data && data.userId && 'clubId' in data && data.clubId) {
			await this.validateUserExists(data.userId);
			await this.validateClubExists(data.clubId);

			if ('relationshipType' in data && data.relationshipType) {
				this.validateRelationshipType(data.relationshipType);
				this.validateTeacherFields(data.relationshipType, data);
			}

			// Check if relationship already exists
			const existingRelationship = await this.prisma.userClub.findUnique({
				where: {
					userId_clubId: {
						userId: data.userId,
						clubId: data.clubId,
					},
				},
			});

			if (existingRelationship) {
				throw new ConflictException('User is already associated with this club');
			}
		}

		// For update operations
		if (id && 'relationshipType' in data && data.relationshipType) {
			this.validateRelationshipType(data.relationshipType);
			this.validateTeacherFields(data.relationshipType, data);
		}
	}

	/**
	 * Validates if the id is valid for the user club
	 * Note: UserClub uses composite key, so this method may not be called directly
	 */
	protected async validateId(id: number | string): Promise<void> {
		// Not applicable for composite key entities
	}

  async getUserClubs(userId: string) {
    await this.validateUserExists(userId);

    return this.prisma.userClub.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getClubUsers(clubId: string) {
    await this.validateClubExists(clubId);

    return this.prisma.userClub.findMany({
      where: {
        clubId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        relationshipType: 'asc',
      },
    });
  }

  async getClubTeachers(clubId: string) {
    await this.validateClubExists(clubId);

    return this.prisma.userClub.findMany({
      where: {
        clubId,
        relationshipType: '2', // TEACHER
        deletedAt: null,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getClubStaff(clubId: string) {
    await this.validateClubExists(clubId);

    return this.prisma.userClub.findMany({
      where: {
        clubId,
        relationshipType: { in: ['1', '3'] }, // OWNER, STAFF
        deletedAt: null,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        relationshipType: 'asc',
      },
    });
  }

  async getClubMembers(clubId: string) {
    await this.validateClubExists(clubId);

    return this.prisma.userClub.findMany({
      where: {
        clubId,
        relationshipType: '4', // MEMBER
        deletedAt: null,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getRelationshipStats(clubId: string) {
    await this.validateClubExists(clubId);

    const stats = await this.prisma.userClub.groupBy({
      by: ['relationshipType'],
      where: {
        clubId,
        deletedAt: null,
        isActive: true,
      },
      _count: true,
    });

    const totalUsers = await this.prisma.userClub.count({
      where: {
        clubId,
        deletedAt: null,
        isActive: true,
      },
    });

    return {
      totalUsers,
      relationshipBreakdown: stats,
    };
  }

	/**
	 * Find a user club relationship by userId and clubId (composite key)
	 */
	async findOne(userId: string, clubId: string) {
		const userClub = await this.prisma.userClub.findUnique({
			where: {
				userId_clubId: {
					userId,
					clubId,
				},
			},
			include: {
				user: {
					select: {
						id: true,
						email: true,
					},
				},
				club: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		if (!userClub || userClub.deletedAt) {
			throw new NotFoundException(`User club relationship not found`);
		}

		return userClub;
	}

	/**
	 * Update a user club relationship by userId and clubId (composite key)
	 */
	async updateRelationship(userId: string, clubId: string, updateUserClubDto: UpdateUserClubDto) {
		const userClub = await this.findOne(userId, clubId);
		
		if (updateUserClubDto.relationshipType) {
			this.validateRelationshipType(updateUserClubDto.relationshipType);
			this.validateTeacherFields(updateUserClubDto.relationshipType, updateUserClubDto);
		}
		
		return this.prisma.$transaction(async (tx) => {
			return tx.userClub.update({
				where: {
					userId_clubId: {
						userId,
						clubId,
					},
				},
				data: {
					...updateUserClubDto,
					updatedAt: new Date(),
				},
				include: {
					user: {
						select: {
							id: true,
							email: true,
						},
					},
					club: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			});
		});
	}

	/**
	 * Remove a user club relationship by userId and clubId (composite key)
	 */
	async removeRelationship(userId: string, clubId: string) {
		await this.findOne(userId, clubId); // Validate relationship exists
		
		return this.prisma.$transaction(async (tx) => {
			return tx.userClub.update({
				where: {
					userId_clubId: {
						userId,
						clubId,
					},
				},
				data: {
					deletedAt: new Date(),
					updatedAt: new Date(),
				},
			});
		});
	}
}
