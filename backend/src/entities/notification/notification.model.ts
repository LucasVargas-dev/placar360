import { z } from 'zod';
import { NotificationType, NotificationChannel, NotificationStatus } from '../../../packages/enums/notification.types';

// Create Notification Schema
export const CreateNotificationSchema = z.object({
  createdBy: z.string().optional(),
  userId: z.string(),
  type: z.enum([
    NotificationType.MATCH_REMINDER,
    NotificationType.MATCH_RESULT,
    NotificationType.TOURNAMENT_UPDATE,
    NotificationType.BOOKING_CONFIRMATION,
    NotificationType.BOOKING_CANCELLATION,
    NotificationType.TOURNAMENT_STARTING,
  ]),
  channel: z.enum([
    NotificationChannel.EMAIL,
    NotificationChannel.WHATSAPP,
    NotificationChannel.BOTH,
  ]),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  data: z.record(z.any()).optional(),
  scheduledFor: z.date().optional(),
  tournamentId: z.string().optional(),
  bookingId: z.string().optional(),
});

// Update Notification Schema
export const UpdateNotificationSchema = z.object({
  status: z.enum([
    NotificationStatus.PENDING,
    NotificationStatus.SENT,
    NotificationStatus.FAILED,
    NotificationStatus.CANCELLED,
  ]).optional(),
  sentAt: z.date().optional(),
});

// Notification Response Schema
export const NotificationResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  channel: z.string(),
  title: z.string(),
  message: z.string(),
  data: z.record(z.any()).nullable(),
  sentAt: z.date().nullable(),
  scheduledFor: z.date().nullable(),
  status: z.string(),
  tournamentId: z.string().nullable(),
  bookingId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
    person: z.object({
      name: z.string(),
    }).optional(),
  }).optional(),
  tournament: z.object({
    id: z.string(),
    name: z.string(),
    startDate: z.date(),
  }).optional(),
  booking: z.object({
    id: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    court: z.object({
      name: z.string(),
    }).optional(),
  }).optional(),
});

// Notification Preferences Schema
export const CreateNotificationPreferencesSchema = z.object({
  userId: z.string(),
  emailEnabled: z.boolean().default(true),
  whatsappEnabled: z.boolean().default(true),
  matchReminders: z.boolean().default(true),
  matchResults: z.boolean().default(true),
  tournamentUpdates: z.boolean().default(true),
  tournamentStarting: z.boolean().default(true),
  bookingConfirmations: z.boolean().default(true),
  bookingCancellations: z.boolean().default(true),
  reminderMinutesBefore: z.number().int().min(5).max(1440).default(60),
});

export const UpdateNotificationPreferencesSchema = z.object({
  emailEnabled: z.boolean().optional(),
  whatsappEnabled: z.boolean().optional(),
  matchReminders: z.boolean().optional(),
  matchResults: z.boolean().optional(),
  tournamentUpdates: z.boolean().optional(),
  tournamentStarting: z.boolean().optional(),
  bookingConfirmations: z.boolean().optional(),
  bookingCancellations: z.boolean().optional(),
  reminderMinutesBefore: z.number().int().min(5).max(1440).optional(),
});

export const NotificationPreferencesResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  emailEnabled: z.boolean(),
  whatsappEnabled: z.boolean(),
  matchReminders: z.boolean(),
  matchResults: z.boolean(),
  tournamentUpdates: z.boolean(),
  tournamentStarting: z.boolean(),
  bookingConfirmations: z.boolean(),
  bookingCancellations: z.boolean(),
  reminderMinutesBefore: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Types
export type CreateNotificationDto = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotificationDto = z.infer<typeof UpdateNotificationSchema>;
export type NotificationResponseDto = z.infer<typeof NotificationResponseSchema>;
export type CreateNotificationPreferencesDto = z.infer<typeof CreateNotificationPreferencesSchema>;
export type UpdateNotificationPreferencesDto = z.infer<typeof UpdateNotificationPreferencesSchema>;
export type NotificationPreferencesResponseDto = z.infer<typeof NotificationPreferencesResponseSchema>;

