import { z } from 'zod';

// Create Permission Schema
export const CreatePermissionSchema = z.object({
  resource: z.string().min(1, 'Resource is required').max(50, 'Resource must be less than 50 characters'),
  action: z.string().min(1, 'Action is required').max(50, 'Action must be less than 50 characters'),
  description: z.string().max(255, 'Description must be less than 255 characters').optional(),
});

export const UpdatePermissionSchema = z.object({
  resource: z.string().min(1, 'Resource is required').max(50, 'Resource must be less than 50 characters').optional(),
  action: z.string().min(1, 'Action is required').max(50, 'Action must be less than 50 characters').optional(),
  description: z.string().max(255, 'Description must be less than 255 characters').optional(),
});

export const PermissionResponseSchema = z.object({
  id: z.number(),
  resource: z.string(),
  action: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  roles: z.array(z.object({
    roleId: z.number(),
    role: z.object({
      id: z.number(),
      name: z.string(),
    }),
  })).optional(),
});

// Types
export type CreatePermissionDto = z.infer<typeof CreatePermissionSchema>;
export type UpdatePermissionDto = z.infer<typeof UpdatePermissionSchema>;
export type PermissionResponseDto = z.infer<typeof PermissionResponseSchema>;
