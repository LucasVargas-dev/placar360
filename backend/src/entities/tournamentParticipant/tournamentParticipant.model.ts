import { z } from 'zod';

// Create Tournament Participant Schema
export const CreateTournamentParticipantSchema = z.object({
  createdBy: z.string().optional(),
  tournamentId: z.string(),
  userId: z.string(),
  status: z.string(),
});

export const UpdateTournamentParticipantSchema = z.object({
  status: z.string().optional(),
});

export const TournamentParticipantResponseSchema = z.object({
  id: z.string(),
  tournamentId: z.string(),
  userId: z.string(),
  registeredAt: z.date(),
  status: z.string(),
  tournament: z.object({
    id: z.string(),
    name: z.string(),
    sportType: z.string(),
  }).optional(),
  user: z.object({
    id: z.string(),
    email: z.string(),
  }).optional(),
});

// Types
export type CreateTournamentParticipantDto = z.infer<typeof CreateTournamentParticipantSchema>;
export type UpdateTournamentParticipantDto = z.infer<typeof UpdateTournamentParticipantSchema>;
export type TournamentParticipantResponseDto = z.infer<typeof TournamentParticipantResponseSchema>;
