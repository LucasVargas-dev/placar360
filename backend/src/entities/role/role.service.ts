import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import DefaultService from '../../../packages/default.service.js';
import { RoleEntity, RoleORM } from './role.orm.js';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from './role.model';
import { RoleQueryService } from './role.query.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class RoleService extends DefaultService<
	RoleEntity,
	CreateRoleDto,
	UpdateRoleDto
> {
	constructor(
		orm: RoleORM,
		queryService: RoleQueryService,
		@Inject(PrismaService) private readonly prisma: PrismaService
	) {
		super(orm, queryService);
	}

	/**
	 * Validate if role name is unique
	 */
	private async validateRoleNameUnique(name: string, excludeId?: number): Promise<void> {
		const existingRole = await this.queryService.getByConditions({
			where: { name } as any,
		});

		if (existingRole && (!excludeId || existingRole.id !== excludeId)) {
			throw new ConflictException('Role name already exists');
		}
	}

	/**
	 * Validates if the data is valid for the role
	 */
	protected async validateEntity(
		data: CreateRoleDto | UpdateRoleDto,
		id?: number | string
	): Promise<void> {
		if (data.name) {
			await this.validateRoleNameUnique(data.name, id ? Number(id) : undefined);
		}
	}

	/**
	 * Validates if the id is valid for the role
	 */
	protected async validateId(id: number | string): Promise<void> {
		const roleExists = await this.show(id);

		if (!roleExists) {
			throw new NotFoundException(`Role with ID ${id} not found`);
		}
	}

	async findByName(name: string) {
		return this.prisma.role.findUnique({
			where: { name },
			include: {
				permissions: {
					include: {
						permission: true,
					},
				},
			},
		});
	}

	async assignPermissions(id: number, assignPermissionsDto: AssignPermissionsDto) {
		const role = await this.show(id);
		if (!role) {
			throw new NotFoundException(`Role with ID ${id} not found`);
		}
		
		// Remove existing permissions
		await this.prisma.rolePermission.deleteMany({
			where: { roleId: id },
		});

		// Add new permissions
		const rolePermissions = assignPermissionsDto.permissionIds.map(permissionId => ({
			roleId: id,
			permissionId,
		}));

		await this.prisma.rolePermission.createMany({
			data: rolePermissions,
		});

		return this.show(id);
	}

	async getPermissions(id: number) {
		const role = await this.show(id);
		if (!role) {
			throw new NotFoundException(`Role with ID ${id} not found`);
		}
		
		// Need to fetch with permissions included
		const roleWithPermissions = await this.prisma.role.findUnique({
			where: { id },
			include: {
				permissions: {
					include: {
						permission: true,
					},
				},
			},
		});
		
		return roleWithPermissions?.permissions.map(rolePermission => rolePermission.permission) || [];
	}
}
