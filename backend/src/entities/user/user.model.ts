import { z } from 'zod';

// Create User Schema
export const CreateUserSchema = z.object({
  createdBy: z.string().optional(),
  code: z.string().optional(),
  email: z.string().email('Invalid email format'),
  cpf: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  avatarUrl: z.string().url('Invalid URL format').optional(),
  personId: z.number().int().positive('Person ID must be a positive integer'),
  roleIds: z.array(z.number().int().positive('Role ID must be a positive integer')).optional(),
});

export const UpdateUserSchema = z.object({
  code: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url('Invalid URL format').optional(),
  roleIds: z.array(z.number().int().positive('Role ID must be a positive integer')).optional(),
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
  person: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  roles: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })).optional(),
});

// Types
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type UserResponseDto = z.infer<typeof UserResponseSchema>;
