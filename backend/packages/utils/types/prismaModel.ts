import { Prisma } from '@prisma/client';

/**
 * Prisma Model Names Type
 * This should match the Prisma client model names
 */
export type PrismaModel =
  | 'person'
  | 'user'
  | 'role'
  | 'permission'
  | 'rolePermission'
  | 'club'
  | 'court'
  | 'booking'
  | 'pricingRule'
  | 'tournament'
  | 'tournamentMatch'
  | 'tournamentParticipant'
  | 'notification'
  | 'notificationPreferences'
  | 'userClub'
  | 'clubSchedule'
  | 'clubHasTournament';