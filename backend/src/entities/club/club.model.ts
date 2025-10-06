import { z } from 'zod';

// Create Club Schema
export const CreateClubSchema = z.object({
  createdBy: z.string().optional(),
  name: z.string().min(1, 'Club name is required').max(255, 'Club name must be less than 255 characters'),
  slug: z.string().max(255, 'Slug must be less than 255 characters').optional(),
  description: z.string().optional(),
  phone: z.string().max(32, 'Phone must be less than 32 characters').optional(),
  email: z.string().email('Invalid email format').max(120, 'Email must be less than 120 characters').optional(),
  addressLine: z.string().max(255, 'Address line must be less than 255 characters').optional(),
  city: z.string().max(100, 'City must be less than 100 characters').optional(),
  state: z.string().max(100, 'State must be less than 100 characters').optional(),
  timezone: z.string().max(64, 'Timezone must be less than 64 characters').optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateClubSchema = z.object({
  name: z.string().min(1, 'Club name is required').max(255, 'Club name must be less than 255 characters').optional(),
  slug: z.string().max(255, 'Slug must be less than 255 characters').optional(),
  description: z.string().optional(),
  phone: z.string().max(32, 'Phone must be less than 32 characters').optional(),
  email: z.string().email('Invalid email format').max(120, 'Email must be less than 120 characters').optional(),
  addressLine: z.string().max(255, 'Address line must be less than 255 characters').optional(),
  city: z.string().max(100, 'City must be less than 100 characters').optional(),
  state: z.string().max(100, 'State must be less than 100 characters').optional(),
  timezone: z.string().max(64, 'Timezone must be less than 64 characters').optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const ClubResponseSchema = z.object({
  id: z.string(),
  createdBy: z.string().nullable(),
  name: z.string(),
  slug: z.string().nullable(),
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
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  courts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    sportType: z.string(),
    isActive: z.boolean(),
  })).optional(),
});

// Types
export type CreateClubDto = z.infer<typeof CreateClubSchema>;
export type UpdateClubDto = z.infer<typeof UpdateClubSchema>;
export type ClubResponseDto = z.infer<typeof ClubResponseSchema>;
