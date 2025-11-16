import { z } from 'zod';

export const TournamentMatchParticipantInputSchema = z.object({
	participantId: z.string(),
	position: z.number().int().min(1).max(4).optional(),
	seed: z.number().int().optional(),
	teamName: z.string().optional(),
});

export const CreateTournamentMatchSchema = z.object({
	tournamentId: z.string(),
	bookingId: z.string().optional(),
	round: z.string(),
	roundOrder: z.number().int().nonnegative().default(0),
	stageType: z.string(),
	groupName: z.string().optional(),
	modality: z.string().optional(),
	matchFormat: z.string().optional(),
	status: z.string().optional(),
	scheduledAt: z.coerce.date().optional(),
	format: z.string().optional(),
	winnerParticipantId: z.string().optional(),
	scoreSummary: z.string().optional(),
	participants: z
		.array(TournamentMatchParticipantInputSchema)
		.max(4)
		.optional(),
});

export const UpdateTournamentMatchSchema = CreateTournamentMatchSchema.partial();

export type CreateTournamentMatchDto = z.infer<typeof CreateTournamentMatchSchema>;
export type UpdateTournamentMatchDto = z.infer<typeof UpdateTournamentMatchSchema>;
export type TournamentMatchParticipantInputDto = z.infer<
	typeof TournamentMatchParticipantInputSchema
>;

