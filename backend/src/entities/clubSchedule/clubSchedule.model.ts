import { z } from 'zod';

export const CreateClubScheduleSchema = z.object({
	clubId: z.string(),
	name: z.string().trim(),
	sportType: z.string().trim(),
	surface: z.string().trim().optional(),
	defaultSlotMinutes: z.number().int().positive().optional(),
	hourlyRate: z.number().nonnegative().nullable().optional(),
	isActive: z.boolean().optional(),
});

export const UpdateClubScheduleSchema = CreateClubScheduleSchema.partial();

export const ClubScheduleFiltersSchema = z.object({
	courtName: z.string().trim().optional(),
	sportType: z.string().trim().optional(),
	startDate: z.string().trim().optional(),
	endDate: z.string().trim().optional(),
});

export const CreateScheduleBookingSchema = z.object({
	userId: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	type: z.number().int().optional(),
	notes: z.string().optional(),
});

export type CreateClubScheduleDto = z.infer<typeof CreateClubScheduleSchema>;
export type UpdateClubScheduleDto = z.infer<typeof UpdateClubScheduleSchema>;
export type ClubScheduleFiltersDto = z.infer<typeof ClubScheduleFiltersSchema>;
export type CreateScheduleBookingDto = z.infer<typeof CreateScheduleBookingSchema>;
