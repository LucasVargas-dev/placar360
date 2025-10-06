import { z } from 'zod';

// Create User Schema
export const CreateUserSchema = z.object({
  code: z.string().max(45).optional(),
  email: z.string().email('Invalid email format').max(255),
  cpf: z.string().max(20).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(255),
  phone: z.string().max(32).optional(),
  avatarUrl: z.string().url('Invalid URL format').optional(),
  personId: z.number().int().positive('Person ID must be a positive integer'),
  roleId: z.number().int().positive('Role ID must be a positive integer'),
});

export const UpdateUserSchema = z.object({
  code: z.string().max(45).optional(),
  email: z.string().email('Invalid email format').max(255).optional(),
  cpf: z.string().max(20).optional(),
  phone: z.string().max(32).optional(),
  avatarUrl: z.string().url('Invalid URL format').optional(),
  roleId: z.number().int().positive('Role ID must be a positive integer').optional(),
});

export const UserResponseSchema = z.object({
  id: z.string(),
  code: z.string().nullable(),
  email: z.string(),
  cpf: z.string().nullable(),
  phone: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  personId: z.number(),
  roleId: z.number(),
  person: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  role: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
});

// Types
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type UserResponseDto = z.infer<typeof UserResponseSchema>;
