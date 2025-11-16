import { z } from 'zod';

// Create Permission Schema
export const CreatePermissionSchema = z.object({
  resource: z.string(),
  action: z.string(),
  description: z.string().optional(),
});

export const UpdatePermissionSchema = z.object({
  resource: z.string().optional(),
  action: z.string().optional(),
  description: z.string().optional(),
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
