import { z } from 'zod';

// Create User Club Schema
export const CreateUserClubSchema = z.object({
  createdBy: z.string().optional(),
  userId: z.string(),
  clubId: z.string(),
  relationshipType: z.string(),
  specialties: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().optional(),
  bio: z.string().optional(),
  experience: z.string().optional(),
  certifications: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateUserClubSchema = z.object({
  relationshipType: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().optional(),
  bio: z.string().optional(),
  experience: z.string().optional(),
  certifications: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const UserClubResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  clubId: z.string(),
  relationshipType: z.string(),
  specialties: z.array(z.string()),
  hourlyRate: z.number().nullable(),
  bio: z.string().nullable(),
  experience: z.string().nullable(),
  certifications: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  user: z.object({
    id: z.string(),
    email: z.string(),
  }).optional(),
  club: z.object({
    id: z.string(),
    name: z.string(),
  }).optional(),
});

// Types
export type CreateUserClubDto = z.infer<typeof CreateUserClubSchema> & Partial<{ hourlyRate: any }>;
export type UpdateUserClubDto = z.infer<typeof UpdateUserClubSchema> & Partial<{ hourlyRate: any }>;
export type UserClubResponseDto = z.infer<typeof UserClubResponseSchema>;
