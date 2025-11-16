import { z } from 'zod';

// Create Club Schema
export const CreateClubSchema = z.object({
	createdBy: z.string().optional(),
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().email('Invalid email address').optional().or(z.literal('')),
	addressLine: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	timezone: z.string().optional(),
	openTime: z.string().optional(),
	closeTime: z.string().optional(),
	isActive: z.boolean().optional(),
});

// Update Club Schema
export const UpdateClubSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required').optional(),
	description: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().email('Invalid email address').optional().or(z.literal('')),
	addressLine: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	timezone: z.string().optional(),
	openTime: z.string().optional(),
	closeTime: z.string().optional(),
	isActive: z.boolean().optional(),
});

// Response Schema (for type inference)
export const ClubResponseSchema = z.object({
	id: z.string(),
	createdBy: z.string().nullable(),
	name: z.string(),
	description: z.string().nullable(),
	phone: z.string().nullable(),
	email: z.string().nullable(),
	addressLine: z.string().nullable(),
	city: z.string().nullable(),
	state: z.string().nullable(),
	timezone: z.string().nullable(),
	openTime: z.string().nullable(),
	closeTime: z.string().nullable(),
	isActive: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().nullable(),
	courts: z
		.array(
			z.object({
				id: z.string(),
				clubId: z.string(),
				name: z.string(),
				sportType: z.string(),
				surface: z.string().nullable().optional(),
				defaultSlotMinutes: z.number().nullable().optional(),
				hourlyRate: z
					.union([z.number(), z.string()])
					.nullable()
					.optional(),
				isActive: z.boolean(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				deletedAt: z.string().nullable().optional(),
			})
		)
		.optional(),
});

// Type exports for convenience
export type CreateClubDto = z.infer<typeof CreateClubSchema>;
export type UpdateClubDto = z.infer<typeof UpdateClubSchema>;
export type ClubResponseDto = z.infer<typeof ClubResponseSchema>;

