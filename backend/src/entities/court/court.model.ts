import { z } from 'zod';

// Create Court Schema
export const CreateCourtSchema = z.object({
  clubId: z.string().min(1, 'Club ID is required'),
  name: z.string().min(1, 'Court name is required').max(120, 'Court name must be less than 120 characters'),
  sportType: z.string().max(50, 'Sport type must be less than 50 characters').optional(),
  surface: z.string().max(50, 'Surface must be less than 50 characters').optional(),
  defaultSlotMinutes: z.number().int().min(15, 'Default slot must be at least 15 minutes').max(480, 'Default slot must be less than 8 hours').optional(),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive').optional(),
  isActive: z.boolean().optional(),
});

export const UpdateCourtSchema = z.object({
  name: z.string().min(1, 'Court name is required').max(120, 'Court name must be less than 120 characters').optional(),
  sportType: z.string().max(50, 'Sport type must be less than 50 characters').optional(),
  surface: z.string().max(50, 'Surface must be less than 50 characters').optional(),
  defaultSlotMinutes: z.number().int().min(15, 'Default slot must be at least 15 minutes').max(480, 'Default slot must be less than 8 hours').optional(),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive').optional(),
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
export type CreateCourtDto = z.infer<typeof CreateCourtSchema>;
export type UpdateCourtDto = z.infer<typeof UpdateCourtSchema>;
export type CourtResponseDto = z.infer<typeof CourtResponseSchema>;
