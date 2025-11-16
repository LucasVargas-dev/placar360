import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import DefaultService from '../../../packages/default.service.js';
import { NotificationEntity, NotificationORM } from './notification.orm.js';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationResponseDto,
  CreateNotificationPreferencesDto,
  UpdateNotificationPreferencesDto,
  NotificationPreferencesResponseDto,
} from './notification.model';
import { NotificationQueryService } from './notification.query.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  NotificationChannelValue,
  MatchReminderData,
  MatchResultData,
  TournamentUpdateData,
  BookingConfirmationData,
  TournamentStartingData,
} from '../../../packages/enums/notification.types.js';
import { NotificationSchedulerService } from './handle/notificationScheduler.service.js';

@Injectable()
export class NotificationService extends DefaultService<
	NotificationEntity,
	CreateNotificationDto,
	UpdateNotificationDto
> {
	constructor(
		orm: NotificationORM,
		queryService: NotificationQueryService,
		@Inject(PrismaService) private readonly prisma: PrismaService,
		private scheduler: NotificationSchedulerService,
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

  private async validateTournamentExists(tournamentId: string): Promise<void> {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId, deletedAt: null },
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${tournamentId} not found`);
    }
  }

  private async validateBookingExists(bookingId: string): Promise<void> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId, deletedAt: null },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
  }

	/**
	 * Validates if the data is valid for the notification
	 */
	protected async validateEntity(
		data: CreateNotificationDto | UpdateNotificationDto,
		id?: string
	): Promise<void> {
		// Validate user exists if userId is provided
		if ('userId' in data && data.userId) {
			await this.validateUserExists(data.userId);
		}

		// Validate tournament exists if provided
		if ('tournamentId' in data && data.tournamentId) {
			await this.validateTournamentExists(data.tournamentId);
		}

		// Validate booking exists if provided
		if ('bookingId' in data && data.bookingId) {
			await this.validateBookingExists(data.bookingId);
		}
	}

	/**
	 * Validates if the id is valid for the notification
	 */
	protected async validateId(id: number | string): Promise<void> {
		const notificationExists = await this.show(id);

		if (!notificationExists) {
			throw new NotFoundException(`Notification with ID ${id} not found`);
		}
	}

	/**
	 * Override create to add scheduling logic
	 */
	async create(data: CreateNotificationDto, args?: any) {
		const notification = await super.create({
			...data,
			// Remove status property to match expected type
		}, args);

		// Schedule the notification if scheduledFor is provided (outside transaction)
		const notificationId = typeof notification === 'string' ? notification : notification.id;
		if (data.scheduledFor) {
			await this.scheduler.scheduleNotification(notificationId, data.scheduledFor);
		} else {
			// Send immediately (outside transaction)
			await this.scheduler.sendNotification(notificationId);
		}

		return notification;
	}

	// Keep the old method name for backward compatibility
	async createNotification(data: CreateNotificationDto): Promise<NotificationResponseDto> {
		return await this.create(data) as any;
	}

  // Get notifications for a user
  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ notifications: NotificationResponseDto[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const where = {
      userId,
    };

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        include: {
          user: {
            include: {
              person: true,
            },
          },
          tournament: true,
          booking: {
            include: {
              court: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      notifications: notifications as any,
      total,
      page,
      totalPages,
    };
  }

  // Mark all notifications as read for a user (removed since isRead field was removed from schema)
  async markAllAsRead(userId: string): Promise<{ count: number }> {
    // Since isRead field was removed, we can't mark notifications as read
    // This method is kept for API compatibility but doesn't perform any action
    const count = await this.prisma.notification.count({
      where: { userId },
    });

    return { count };
  }

  // Update notification
  async updateNotification(
    notificationId: string,
    data: UpdateNotificationDto,
    userId: string,
  ): Promise<NotificationResponseDto> {
    await this.validateUserExists(userId);

    return this.prisma.$transaction(async (tx) => {
      const notification = await tx.notification.findFirst({
        where: {
          id: notificationId,
          userId,
        },
      });

      if (!notification) {
        throw new NotFoundException('Notification not found');
      }

      const updatedNotification = await tx.notification.update({
        where: { id: notificationId },
        data,
        include: {
          user: {
            include: {
              person: true,
            },
          },
          tournament: true,
          booking: {
            include: {
              court: true,
            },
          },
        },
      });

      return updatedNotification as any;
    });
  }

  // Delete notification
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    await this.validateUserExists(userId);

    return this.prisma.$transaction(async (tx) => {
      const notification = await tx.notification.findFirst({
        where: {
          id: notificationId,
          userId,
        },
      });

      if (!notification) {
        throw new NotFoundException('Notification not found');
      }

      await tx.notification.delete({
        where: { id: notificationId },
      });
    });
  }

  // Notification Preferences Management
  async createNotificationPreferences(
    data: CreateNotificationPreferencesDto,
  ): Promise<NotificationPreferencesResponseDto> {
    await this.validateUserExists(data.userId);

    return this.prisma.$transaction(async (tx) => {
      // Check if preferences already exist
      const existingPreferences = await tx.notificationPreferences.findUnique({
        where: { userId: data.userId },
      });

      if (existingPreferences) {
        throw new BadRequestException('Notification preferences already exist for this user');
      }

      const preferences = await tx.notificationPreferences.create({
        data: data as any,
      });

      return preferences as any;
    });
  }

  async getNotificationPreferences(userId: string): Promise<NotificationPreferencesResponseDto> {
    await this.validateUserExists(userId);

    return this.prisma.$transaction(async (tx) => {
      let preferences = await tx.notificationPreferences.findUnique({
        where: { userId },
      });

      // Create default preferences if they don't exist
      if (!preferences) {
        preferences = await tx.notificationPreferences.create({
          data: {
            userId,
          },
        });
      }

      return preferences as any;
    });
  }

  async updateNotificationPreferences(
    userId: string,
    data: UpdateNotificationPreferencesDto,
  ): Promise<NotificationPreferencesResponseDto> {
    await this.validateUserExists(userId);

    return this.prisma.$transaction(async (tx) => {
      const preferences = await tx.notificationPreferences.upsert({
        where: { userId },
        create: {
          userId,
          ...(data as any),
        },
        update: data as any,
      });

      return preferences as any;
    });
  }

  // Helper methods for creating specific notification types
  async createMatchReminderNotification(
    userId: string,
    data: MatchReminderData,
    channel: NotificationChannelValue = NotificationChannel.BOTH,
  ): Promise<NotificationResponseDto> {
    await this.validateUserExists(userId);
    await this.validateBookingExists(data.bookingId);

    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: data.bookingId },
        include: {
          court: true,
          tournament: true,
        },
      });

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      const title = `Lembrete de Partida - ${booking.court.name}`;
      const message = `Sua partida está agendada para ${data.startTime.toLocaleString('pt-BR')} na quadra ${booking.court.name}.${data.opponentName ? ` Você jogará contra ${data.opponentName}.` : ''}${data.tournamentName ? ` Torneio: ${data.tournamentName}` : ''}`;

      const notification = await tx.notification.create({
        data: {
          userId,
          type: NotificationType.MATCH_REMINDER,
          channel,
          title,
          message,
          data: data as any,
          scheduledFor: new Date(data.startTime.getTime() - (60 * 60 * 1000)), // 1 hour before
          bookingId: data.bookingId,
          tournamentId: data.tournamentName ? booking.tournamentId : undefined,
          status: NotificationStatus.PENDING,
        },
        include: {
          user: {
            include: {
              person: true,
            },
          },
          tournament: true,
          booking: {
            include: {
              court: true,
            },
          },
        },
      });

      // Schedule the notification
      await this.scheduler.scheduleNotification(notification.id, notification.scheduledFor);

      return notification as any;
    });
  }

  async createMatchResultNotification(
    userId: string,
    data: MatchResultData,
    channel: NotificationChannelValue = NotificationChannel.BOTH,
  ): Promise<NotificationResponseDto> {
    await this.validateUserExists(userId);
    await this.validateBookingExists(data.bookingId);

    return this.prisma.$transaction(async (tx) => {
      const title = `Resultado da Partida - ${data.courtName}`;
      const message = `Sua partida na quadra ${data.courtName} foi finalizada.${data.result ? ` Resultado: ${data.result}` : ''}${data.score ? ` Placar: ${data.score}` : ''}${data.tournamentName ? ` Torneio: ${data.tournamentName}` : ''}`;

      const notification = await tx.notification.create({
        data: {
          userId,
          type: NotificationType.MATCH_RESULT,
          channel,
          title,
          message,
          data: data as any,
          bookingId: data.bookingId,
          status: NotificationStatus.PENDING,
        },
        include: {
          user: {
            include: {
              person: true,
            },
          },
          tournament: true,
          booking: {
            include: {
              court: true,
            },
          },
        },
      });

      // Send immediately
      await this.scheduler.sendNotification(notification.id);

      return notification as any;
    });
  }

  async createTournamentUpdateNotification(
    userId: string,
    data: TournamentUpdateData,
    channel: NotificationChannelValue = NotificationChannel.BOTH,
  ): Promise<NotificationResponseDto> {
    await this.validateUserExists(userId);
    await this.validateTournamentExists(data.tournamentId);

    return this.prisma.$transaction(async (tx) => {
      const title = `Atualização do Torneio - ${data.tournamentName}`;
      const message = data.message;

      const notification = await tx.notification.create({
        data: {
          userId,
          type: NotificationType.TOURNAMENT_UPDATE,
          channel,
          title,
          message,
          data: data as any,
          tournamentId: data.tournamentId,
          status: NotificationStatus.PENDING,
        },
        include: {
          user: {
            include: {
              person: true,
            },
          },
          tournament: true,
          booking: {
            include: {
              court: true,
            },
          },
        },
      });

      // Send immediately
      await this.scheduler.sendNotification(notification.id);

      return notification as any;
    });
  }

  async createBookingConfirmationNotification(
    userId: string,
    data: BookingConfirmationData,
    channel: NotificationChannelValue = NotificationChannel.BOTH,
  ): Promise<NotificationResponseDto> {
    await this.validateUserExists(userId);
    await this.validateBookingExists(data.bookingId);

    return this.prisma.$transaction(async (tx) => {
      const title = `Confirmação de Reserva - ${data.courtName}`;
      const message = `Sua reserva foi confirmada para ${data.startTime.toLocaleString('pt-BR')} na quadra ${data.courtName}.${data.totalAmount ? ` Valor total: R$ ${data.totalAmount.toFixed(2)}` : ''}`;

      const notification = await tx.notification.create({
        data: {
          userId,
          type: NotificationType.BOOKING_CONFIRMATION,
          channel,
          title,
          message,
          data: data as any,
          bookingId: data.bookingId,
          status: NotificationStatus.PENDING,
        },
        include: {
          user: {
            include: {
              person: true,
            },
          },
          tournament: true,
          booking: {
            include: {
              court: true,
            },
          },
        },
      });

      // Send immediately
      await this.scheduler.sendNotification(notification.id);

      return notification as any;
    });
  }

  async createTournamentStartingNotification(
    userId: string,
    data: TournamentStartingData,
    channel: NotificationChannelValue = NotificationChannel.BOTH,
  ): Promise<NotificationResponseDto> {
    await this.validateUserExists(userId);
    await this.validateTournamentExists(data.tournamentId);

    return this.prisma.$transaction(async (tx) => {
      const title = `Torneio Iniciando - ${data.tournamentName}`;
      const message = `O torneio ${data.tournamentName} está começando em breve! Local: ${data.location}`;

      const notification = await tx.notification.create({
        data: {
          userId,
          type: NotificationType.TOURNAMENT_STARTING,
          channel,
          title,
          message,
          data: data as any,
          scheduledFor: new Date(data.startDate.getTime() - (30 * 60 * 1000)), // 30 minutes before
          tournamentId: data.tournamentId,
          status: NotificationStatus.PENDING,
        },
        include: {
          user: {
            include: {
              person: true,
            },
          },
          tournament: true,
          booking: {
            include: {
              court: true,
            },
          },
        },
      });

      // Schedule the notification
      await this.scheduler.scheduleNotification(notification.id, notification.scheduledFor);

      return notification as any;
    });
  }

  // Get notification statistics
  async getNotificationStats(userId: string): Promise<{
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    const [total, byType, byStatus] = await Promise.all([
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.groupBy({
        by: ['type'],
        where: { userId },
        _count: { type: true },
      }),
      this.prisma.notification.groupBy({
        by: ['status'],
        where: { userId },
        _count: { status: true },
      }),
    ]);

    return {
      total,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      }, {} as Record<string, number>),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
