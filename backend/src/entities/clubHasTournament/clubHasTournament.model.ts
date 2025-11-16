import { z } from 'zod';

export const CreateClubHasTournamentSchema = z.object({
	clubId: z.string(),
	tournamentId: z.string(),
});

export const UpdateClubHasTournamentSchema = z.object({
	clubId: z.string().optional(),
	tournamentId: z.string().optional(),
});

export type CreateClubHasTournamentDto = z.infer<typeof CreateClubHasTournamentSchema>;
export type UpdateClubHasTournamentDto = z.infer<typeof UpdateClubHasTournamentSchema>;



