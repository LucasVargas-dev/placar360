import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationStatus, NotificationChannel } from '../../../../packages/enums/notification.types';
import { EmailService } from './email.service';
import { WhatsAppService } from './whatsapp.service';

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private whatsappService: WhatsAppService,
  ) {}

  // Schedule a notification for later delivery
  async scheduleNotification(notificationId: string, scheduledFor: Date): Promise<void> {
    try {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { scheduledFor },
      });
      
      this.logger.log(`Notification ${notificationId} scheduled for ${scheduledFor.toISOString()}`);
    } catch (error) {
      this.logger.error(`Failed to schedule notification ${notificationId}:`, error);
      throw error;
    }
  }

  async sendNotification(notificationId: string): Promise<void> {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id: notificationId },
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

      if (!notification) {
        this.logger.error(`Notification ${notificationId} not found`);
        return;
      }

      if (notification.status !== NotificationStatus.PENDING) {
        this.logger.warn(`Notification ${notificationId} is not in PENDING status`);
        return;
      }

      // Check user's notification preferences
      const preferences = await this.prisma.notificationPreferences.findUnique({
        where: { userId: notification.userId },
      });

      if (preferences && !this.shouldSendNotification(notification, preferences)) {
        await this.prisma.notification.update({
          where: { id: notificationId },
          data: { 
            status: NotificationStatus.CANCELLED,
          },
        });
        return;
      }

      let emailSent = false;
      let whatsappSent = false;

      // Send via email if enabled
      if (this.shouldSendEmail(notification.channel, preferences)) {
        try {
          await this.emailService.sendNotificationEmail(notification);
          emailSent = true;
          this.logger.log(`Email sent for notification ${notificationId}`);
        } catch (error) {
          this.logger.error(`Failed to send email for notification ${notificationId}:`, error);
        }
      }

      // Send via WhatsApp if enabled
      if (this.shouldSendWhatsApp(notification.channel, preferences)) {
        try {
          await this.whatsappService.sendNotificationMessage(notification);
          whatsappSent = true;
          this.logger.log(`WhatsApp message sent for notification ${notificationId}`);
        } catch (error) {
          this.logger.error(`Failed to send WhatsApp message for notification ${notificationId}:`, error);
        }
      }

      // Update notification status
      const status = (emailSent || whatsappSent) ? NotificationStatus.SENT : NotificationStatus.FAILED;

      await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          status,
          sentAt: new Date(),
        },
      });

    } catch (error) {
      this.logger.error(`Failed to send notification ${notificationId}:`, error);
      
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: NotificationStatus.FAILED,
        },
      });
    }
  }

  // Cron job to process scheduled notifications
  @Cron(CronExpression.EVERY_MINUTE)
  async processScheduledNotifications(): Promise<void> {
    try {
      const now = new Date();
      
      const scheduledNotifications = await this.prisma.notification.findMany({
        where: {
          status: NotificationStatus.PENDING,
          scheduledFor: {
            lte: now,
          },
        },
        include: {
          user: {
            include: {
              person: true,
            },
          },
        },
      });

      this.logger.log(`Processing ${scheduledNotifications.length} scheduled notifications`);

      for (const notification of scheduledNotifications) {
        await this.sendNotification(notification.id);
      }

    } catch (error) {
      this.logger.error('Error processing scheduled notifications:', error);
    }
  }

  // Helper methods
  private shouldSendNotification(notification: any, preferences: any): boolean {
    if (!preferences) return true;

    // Check if user has disabled notifications for this type
    switch (notification.type) {
      case 'MATCH_REMINDER':
        return preferences.matchReminders;
      case 'MATCH_RESULT':
        return preferences.matchResults;
      case 'TOURNAMENT_UPDATE':
        return preferences.tournamentUpdates;
      case 'TOURNAMENT_STARTING':
        return preferences.tournamentStarting;
      case 'BOOKING_CONFIRMATION':
        return preferences.bookingConfirmations;
      case 'BOOKING_CANCELLATION':
        return preferences.bookingCancellations;
      default:
        return true;
    }
  }

  private shouldSendEmail(channel: string, preferences: any): boolean {
    if (!preferences?.emailEnabled) return false;
    
    return channel === NotificationChannel.EMAIL || channel === NotificationChannel.BOTH;
  }

  private shouldSendWhatsApp(channel: string, preferences: any): boolean {
    if (!preferences?.whatsappEnabled) return false;
    
    return channel === NotificationChannel.WHATSAPP || channel === NotificationChannel.BOTH;
  }

  // Cancel a scheduled notification
  async cancelScheduledNotification(notificationId: string): Promise<void> {
    try {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { 
          status: NotificationStatus.CANCELLED,
        },
      });
      
      this.logger.log(`Cancelled scheduled notification ${notificationId}`);
    } catch (error) {
      this.logger.error(`Failed to cancel notification ${notificationId}:`, error);
      throw error;
    }
  }

  // Reschedule a notification
  async rescheduleNotification(notificationId: string, newScheduledFor: Date): Promise<void> {
    try {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { 
          scheduledFor: newScheduledFor,
          status: NotificationStatus.PENDING,
        },
      });
      
      this.logger.log(`Rescheduled notification ${notificationId} for ${newScheduledFor.toISOString()}`);
    } catch (error) {
      this.logger.error(`Failed to reschedule notification ${notificationId}:`, error);
      throw error;
    }
  }

  // Process failed notifications (retry logic)
  @Cron(CronExpression.EVERY_10_MINUTES)
  async retryFailedNotifications(): Promise<void> {
    try {
      const failedNotifications = await this.prisma.notification.findMany({
        where: {
          status: NotificationStatus.FAILED,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Only retry notifications from the last 24 hours
          },
        },
        take: 10, // Limit retries to avoid overwhelming the system
      });

      this.logger.log(`Retrying ${failedNotifications.length} failed notifications`);

      for (const notification of failedNotifications) {
        // Reset status to pending for retry
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { 
            status: NotificationStatus.PENDING,
          },
        });
        
        // Try to send again
        await this.sendNotification(notification.id);
      }

    } catch (error) {
      this.logger.error('Error retrying failed notifications:', error);
    }
  }
}
