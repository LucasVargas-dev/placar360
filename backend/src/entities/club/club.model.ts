import { z } from 'zod';

// Create Club Schema
export const CreateClubSchema = z.object({
  createdBy: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  addressLine: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  timezone: z.string().optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateClubSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  addressLine: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  timezone: z.string().optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  isActive: z.boolean().optional(),
});

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
