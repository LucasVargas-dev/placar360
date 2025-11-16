import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleSchema, UpdateRoleSchema, AssignPermissionsSchema, CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from './role.model';
import DefaultController from '../../../packages/default.controller.js';
import { RoleEntity } from './role.orm.js';
import { ZodSchema } from 'zod';
import { ZodValidationPipe } from '../../../packages/common/pipes/zod-validation.pipe';

@Controller('roles')
export class RoleController extends DefaultController<
	RoleEntity,
	CreateRoleDto,
	UpdateRoleDto
> {
	constructor(private readonly roleService: RoleService) {
		super(roleService);
	}

	/**
	 * Custom endpoint to get role by name
	 */
	@Get('name/:name')
	async findByName(@Param('name') name: string) {
		return await this.roleService.findByName(name);
	}

	/**
	 * Custom endpoint to get permissions for a role
	 */
	@Get(':id/permissions')
	async getPermissions(@Param('id') id: string) {
		return await this.roleService.getPermissions(Number(id));
	}

	/**
	 * Custom endpoint to assign permissions to a role
	 */
	@Patch(':id/permissions')
	async assignPermissions(
		@Param('id') id: string,
		@Body(new ZodValidationPipe(AssignPermissionsSchema)) assignPermissionsDto: AssignPermissionsDto,
	) {
		return await this.roleService.assignPermissions(Number(id), assignPermissionsDto);
	}

	/**
	 * The zod create schema
	 */
	protected createSchema(): ZodSchema {
		return CreateRoleSchema;
	}

	/**
	 * The zod update schema
	 */
	protected updateSchema(): ZodSchema {
		return UpdateRoleSchema;
	}
}
