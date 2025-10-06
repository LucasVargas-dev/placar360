import { z } from 'zod';

// Create Person Schema
export const CreatePersonSchema = z.object({
  name: z.string().min(1, 'Name is required').max(45, 'Name must be less than 45 characters'),
});

export const UpdatePersonSchema = z.object({
  name: z.string().min(1, 'Name is required').max(45, 'Name must be less than 45 characters').optional(),
});

export const PersonResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

// Types
export type CreatePersonDto = z.infer<typeof CreatePersonSchema>;
export type UpdatePersonDto = z.infer<typeof UpdatePersonSchema>;
export type PersonResponseDto = z.infer<typeof PersonResponseSchema>;
