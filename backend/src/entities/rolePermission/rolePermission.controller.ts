import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RolePermissionService } from './rolePermission.service';
import { CreateRolePermissionSchema, CreateRolePermissionDto } from './rolePermission.model';
import DefaultController from '../../../packages/default.controller.js';
import { RolePermissionEntity } from './rolePermission.orm.js';
import { ZodSchema } from 'zod';
import { ZodValidationPipe } from '../../../packages/common/pipes/zod-validation.pipe';

@Controller('role-permissions')
export class RolePermissionController extends DefaultController<
	RolePermissionEntity,
	CreateRolePermissionDto,
	CreateRolePermissionDto
> {
	constructor(private readonly rolePermissionService: RolePermissionService) {
		super(rolePermissionService);
	}

	/**
	 * Custom endpoint to get role permissions by role
	 */
	@Get('role/:roleId')
	async findByRole(@Param('roleId') roleId: string) {
		return await this.rolePermissionService.findByRole(Number(roleId));
	}

	/**
	 * Custom endpoint to get role permissions by permission
	 */
	@Get('permission/:permissionId')
	async findByPermission(@Param('permissionId') permissionId: string) {
		return await this.rolePermissionService.findByPermission(Number(permissionId));
	}

	/**
	 * Custom endpoint to get a specific role permission
	 */
	@Get('role/:roleId/permission/:permissionId')
	async findOne(
		@Param('roleId') roleId: string,
		@Param('permissionId') permissionId: string,
	) {
		return await this.rolePermissionService.findOne(Number(roleId), Number(permissionId));
	}

	/**
	 * Custom endpoint to delete a role permission
	 */
	@Delete('role/:roleId/permission/:permissionId')
	async remove(
		@Param('roleId') roleId: string,
		@Param('permissionId') permissionId: string,
	) {
		return await this.rolePermissionService.remove(Number(roleId), Number(permissionId));
	}

	/**
	 * Custom endpoint to delete all role permissions for a role
	 */
	@Delete('role/:roleId')
	async removeByRole(@Param('roleId') roleId: string) {
		return await this.rolePermissionService.removeByRole(Number(roleId));
	}

	/**
	 * Custom endpoint to delete all role permissions for a permission
	 */
	@Delete('permission/:permissionId')
	async removeByPermission(@Param('permissionId') permissionId: string) {
		return await this.rolePermissionService.removeByPermission(Number(permissionId));
	}

	/**
	 * The zod create schema
	 */
	protected createSchema(): ZodSchema {
		return CreateRolePermissionSchema;
	}

	/**
	 * The zod update schema (same as create for rolePermission)
	 */
	protected updateSchema(): ZodSchema {
		return CreateRolePermissionSchema;
	}
}
