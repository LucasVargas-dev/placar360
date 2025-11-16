import { z } from 'zod';

// Create RolePermission Schema
export const CreateRolePermissionSchema = z.object({
  roleId: z.number().int(),
  permissionId: z.number().int(),
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
