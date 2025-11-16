import { z } from 'zod';

// Create Role Schema
export const CreateRoleSchema = z.object({
  name: z.string(),
});

export const UpdateRoleSchema = z.object({
  name: z.string().optional(),
});

export const AssignPermissionsSchema = z.object({
  permissionIds: z.array(z.number().int().positive()),
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
