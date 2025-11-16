// Notification Types
export const NotificationType = {
  MATCH_REMINDER: 'MATCH_REMINDER',
  MATCH_RESULT: 'MATCH_RESULT',
  TOURNAMENT_UPDATE: 'TOURNAMENT_UPDATE',
  BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION',
  BOOKING_CANCELLATION: 'BOOKING_CANCELLATION',
  TOURNAMENT_STARTING: 'TOURNAMENT_STARTING',
} as const;

// Notification Channels
export const NotificationChannel = {
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
  BOTH: 'BOTH',
} as const;

// Notification Status
export const NotificationStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
} as const;

// Type definitions
export type NotificationTypeValue = typeof NotificationType[keyof typeof NotificationType];
export type NotificationChannelValue = typeof NotificationChannel[keyof typeof NotificationChannel];
export type NotificationStatusValue = typeof NotificationStatus[keyof typeof NotificationStatus];

// Notification template data interfaces
export interface MatchReminderData {
  bookingId: string;
  courtName: string;
  startTime: Date;
  endTime: Date;
  opponentName?: string;
  tournamentName?: string;
}

export interface MatchResultData {
  bookingId: string;
  courtName: string;
  startTime: Date;
  endTime: Date;
  result?: string;
  score?: string;
  tournamentName?: string;
}

export interface TournamentUpdateData {
  tournamentId: string;
  tournamentName: string;
  updateType: 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'SCHEDULE_UPDATED' | 'CANCELLED';
  message: string;
}

export interface BookingConfirmationData {
  bookingId: string;
  courtName: string;
  startTime: Date;
  endTime: Date;
  totalAmount?: number;
}

export interface TournamentStartingData {
  tournamentId: string;
  tournamentName: string;
  startDate: Date;
  location: string;
}
