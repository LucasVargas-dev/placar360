import { z } from 'zod';

// Create Court Schema
export const CreateCourtSchema = z.object({
  createdBy: z.string().optional(),
  clubId: z.string(),
  name: z.string(),
  sportType: z.string(),
  surface: z.string().optional(),
  defaultSlotMinutes: z.number().int().optional(),
  hourlyRate: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateCourtSchema = z.object({
  name: z.string().optional(),
  sportType: z.string().optional(),
  surface: z.string().optional(),
  defaultSlotMinutes: z.number().int().optional(),
  hourlyRate: z.number().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const CourtResponseSchema = z.object({
  id: z.string(),
  clubId: z.string(),
  name: z.string(),
  sportType: z.string(),
  surface: z.string().nullable(),
  defaultSlotMinutes: z.number(),
  hourlyRate: z.number().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  club: z.object({
    id: z.string(),
    name: z.string(),
  }).optional(),
});

// Types
export type CreateCourtDto = z.infer<typeof CreateCourtSchema> & Partial<{ hourlyRate: any }>;
export type UpdateCourtDto = z.infer<typeof UpdateCourtSchema> & Partial<{ hourlyRate: any }>;
export type CourtResponseDto = z.infer<typeof CourtResponseSchema>;
