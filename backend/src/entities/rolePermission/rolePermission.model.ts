import { z } from 'zod';

// Create RolePermission Schema
export const CreateRolePermissionSchema = z.object({
  roleId: z.number().int().positive('Role ID must be a positive integer'),
  permissionId: z.number().int().positive('Permission ID must be a positive integer'),
});

export const RolePermissionResponseSchema = z.object({
  roleId: z.number(),
  permissionId: z.number(),
  role: z.object({
    id: z.number(),
    name: z.string(),
  }),
  permission: z.object({
    id: z.number(),
    resource: z.string(),
    action: z.string(),
    description: z.string().nullable(),
  }),
});

// Types
export type CreateRolePermissionDto = z.infer<typeof CreateRolePermissionSchema>;
export type RolePermissionResponseDto = z.infer<typeof RolePermissionResponseSchema>;
