import { Prisma } from '@prisma/client';
import { z } from 'zod';

// Create Tournament Schema
export const CreateTournamentSchema = z.object({
	createdBy: z.string().optional(),
	cityId: z.number().int().positive().optional(),
	organizerId: z.string(),
	name: z.string(),
	description: z.string().optional(),
	sportType: z.string(),
	startDate: z.date(),
	endDate: z.date(),
	registrationStart: z.date(),
	registrationEnd: z.date(),
	maxParticipants: z.number().int().positive().optional(),
	entryFee: z.number().nonnegative().optional(),
	status: z.string(),
	prizes: z.string().optional(),
	format: z.string().optional(),
	isActive: z.boolean().optional(),
	clubIds: z.array(z.string()).min(1, 'Selecione pelo menos um clube'),
	selectedDates: z.array(z.string()).min(1, 'Selecione os dias de disputa').optional(),
});

export const UpdateTournamentSchema = z.object({
	cityId: z.number().int().positive().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	sportType: z.string().optional(),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
	registrationStart: z.date().optional(),
	registrationEnd: z.date().optional(),
	maxParticipants: z.number().int().positive().optional(),
	entryFee: z.number().nonnegative().optional(),
	status: z.string().optional(),
	prizes: z.string().optional(),
	format: z.string().optional(),
	isActive: z.boolean().optional(),
});

export const TournamentResponseSchema = z.object({
	id: z.string(),
	cityId: z.number().nullable().optional(),
	organizerId: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	sportType: z.string(),
	startDate: z.date(),
	endDate: z.date(),
	registrationStart: z.date(),
	registrationEnd: z.date(),
	maxParticipants: z.number().nullable(),
	entryFee: z.number().nullable(),
	status: z.string(),
	prizes: z.string().nullable(),
	format: z.string().optional(),
	isActive: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.date().nullable(),
	city: z
		.object({
			id: z.number(),
			name: z.string(),
			state: z
				.object({
					id: z.number(),
					name: z.string(),
					uf: z.string(),
				})
				.optional(),
		})
		.nullable()
		.optional(),
	organizer: z.object({
		id: z.string(),
		email: z.string(),
	}).optional(),
	clubHasTournaments: z
		.array(
			z.object({
				clubId: z.string(),
				tournamentId: z.string(),
				club: z
					.object({
						id: z.string(),
						name: z.string(),
						city: z.string().nullable(),
						state: z.string().nullable(),
					})
					.nullable()
					.optional(),
			})
		)
		.optional(),
});

// Types
type BaseCreateTournamentDto = z.infer<typeof CreateTournamentSchema>;
type BaseUpdateTournamentDto = z.infer<typeof UpdateTournamentSchema>;

export type CreateTournamentDto = Omit<BaseCreateTournamentDto, 'entryFee'> & {
	entryFee?: Prisma.Decimal | number | null;
};

export type UpdateTournamentDto = Omit<BaseUpdateTournamentDto, 'entryFee'> & {
	entryFee?: Prisma.Decimal | number | null;
};
export type TournamentResponseDto = z.infer<typeof TournamentResponseSchema>;
