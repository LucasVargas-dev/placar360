import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  CreateNotificationSchema,
  UpdateNotificationSchema,
  CreateNotificationDto,
  UpdateNotificationDto,
} from './notification.model';
import DefaultController from '../../../packages/default.controller.js';
import { NotificationEntity } from './notification.orm.js';
import { ZodSchema } from 'zod';
import { NotificationChannel } from '../../../packages/enums/notification.types';

@Controller('notifications')
export class NotificationController extends DefaultController<
	NotificationEntity,
	CreateNotificationDto,
	UpdateNotificationDto
> {
	constructor(private readonly notificationService: NotificationService) {
		super(notificationService);
	}

	/**
	 * Custom endpoint to get user notifications
	 */
	@Get('user/:userId')
	async getUserNotifications(
		@Param('userId') userId: string,
		@Query('page') page?: string,
		@Query('limit') limit?: string,
	) {
		const pageNum = page ? parseInt(page, 10) : 1;
		const limitNum = limit ? parseInt(limit, 10) : 20;
		return await this.notificationService.getUserNotifications(userId, pageNum, limitNum);
	}

	/**
	 * Custom endpoint to mark all notifications as read for a user
	 */
	@Patch('user/:userId/mark-all-read')
	async markAllAsRead(@Param('userId') userId: string) {
		return await this.notificationService.markAllAsRead(userId);
	}

	/**
	 * Custom endpoint to update notification (requires userId)
	 */
	@Patch(':id')
	async updateNotificationStatus(
		@Param('id') id: string,
		@Body() updateNotificationDto: UpdateNotificationDto,
		@Query('userId') userId: string,
	) {
		return await this.notificationService.updateNotification(id, updateNotificationDto, userId);
	}

	/**
	 * Custom endpoint to delete notification (requires userId)
	 */
	@Delete(':id')
	async remove(
		@Param('id') id: string,
		@Query('userId') userId: string,
	) {
		return await this.notificationService.deleteNotification(id, userId);
	}

  // Essential notification creation endpoints
  @Post('booking-confirmation')
  @HttpCode(HttpStatus.CREATED)
  async createBookingConfirmationNotification(
    @Body() data: {
      userId: string;
      bookingId: string;
      courtName: string;
      startTime: Date;
      endTime: Date;
      totalAmount?: number;
      channel?: string;
    },
  ) {
    return this.notificationService.createBookingConfirmationNotification(
      data.userId,
      {
        bookingId: data.bookingId,
        courtName: data.courtName,
        startTime: data.startTime,
        endTime: data.endTime,
        totalAmount: data.totalAmount,
      },
      (data.channel as any) || NotificationChannel.BOTH,
    );
  }

  @Post('match-reminder')
  @HttpCode(HttpStatus.CREATED)
  async createMatchReminderNotification(
    @Body() data: {
      userId: string;
      bookingId: string;
      courtName: string;
      startTime: Date;
      endTime: Date;
      opponentName?: string;
      tournamentName?: string;
      channel?: string;
    },
  ) {
    return this.notificationService.createMatchReminderNotification(
      data.userId,
      {
        bookingId: data.bookingId,
        courtName: data.courtName,
        startTime: data.startTime,
        endTime: data.endTime,
        opponentName: data.opponentName,
        tournamentName: data.tournamentName,
      },
      (data.channel as any) || NotificationChannel.BOTH,
    );
  }

  @Post('match-result')
  @HttpCode(HttpStatus.CREATED)
  async createMatchResultNotification(
    @Body() data: {
      userId: string;
      bookingId: string;
      courtName: string;
      startTime: Date;
      endTime: Date;
      result?: string;
      score?: string;
      tournamentName?: string;
      channel?: string;
    },
  ) {
    return this.notificationService.createMatchResultNotification(
      data.userId,
      {
        bookingId: data.bookingId,
        courtName: data.courtName,
        startTime: data.startTime,
        endTime: data.endTime,
        result: data.result,
        score: data.score,
        tournamentName: data.tournamentName,
      },
      (data.channel as any) || NotificationChannel.BOTH,
    );
  }

  @Post('tournament-update')
  @HttpCode(HttpStatus.CREATED)
  async createTournamentUpdateNotification(
    @Body() data: {
      userId: string;
      tournamentId: string;
      tournamentName: string;
      updateType: 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'SCHEDULE_UPDATED' | 'CANCELLED';
      message: string;
      channel?: string;
    },
  ) {
    return this.notificationService.createTournamentUpdateNotification(
      data.userId,
      {
        tournamentId: data.tournamentId,
        tournamentName: data.tournamentName,
        updateType: data.updateType,
        message: data.message,
      },
      (data.channel as any) || NotificationChannel.BOTH,
    );
  }

  @Post('tournament-starting')
  @HttpCode(HttpStatus.CREATED)
  async createTournamentStartingNotification(
    @Body() data: {
      userId: string;
      tournamentId: string;
      tournamentName: string;
      startDate: Date;
      location: string;
      channel?: string;
    },
  ) {
    return this.notificationService.createTournamentStartingNotification(
      data.userId,
      {
        tournamentId: data.tournamentId,
        tournamentName: data.tournamentName,
        startDate: data.startDate,
        location: data.location,
      },
      (data.channel as any) || NotificationChannel.BOTH,
    );
  }

	/**
	 * The zod create schema
	 */
	protected createSchema(): ZodSchema {
		return CreateNotificationSchema;
	}

	/**
	 * The zod update schema
	 */
	protected updateSchema(): ZodSchema {
		return UpdateNotificationSchema;
	}
}
