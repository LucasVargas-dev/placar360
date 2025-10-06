import { z } from 'zod';

// Create Role Schema
export const CreateRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(45, 'Role name must be less than 45 characters'),
});

export const UpdateRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(45, 'Role name must be less than 45 characters').optional(),
});

export const AssignPermissionsSchema = z.object({
  permissionIds: z.array(z.number().int().positive()).min(1, 'At least one permission must be assigned'),
});

export const RoleResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  users: z.array(z.object({
    id: z.string(),
    email: z.string(),
  })).optional(),
  permissions: z.array(z.object({
    permissionId: z.number(),
    permission: z.object({
      id: z.number(),
      resource: z.string(),
      action: z.string(),
      description: z.string().nullable(),
    }),
  })).optional(),
});

// Types
export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;
export type AssignPermissionsDto = z.infer<typeof AssignPermissionsSchema>;
export type RoleResponseDto = z.infer<typeof RoleResponseSchema>;
