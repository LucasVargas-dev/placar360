import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import DefaultService from '../../../packages/default.service.js';
import { RolePermissionEntity, RolePermissionORM } from './rolePermission.orm.js';
import { CreateRolePermissionDto } from './rolePermission.model';
import { RolePermissionQueryService } from './rolePermission.query.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class RolePermissionService extends DefaultService<
	RolePermissionEntity,
	CreateRolePermissionDto,
	CreateRolePermissionDto
> {
	constructor(
		orm: RolePermissionORM,
		queryService: RolePermissionQueryService,
		@Inject(PrismaService) private readonly prisma: PrismaService
	) {
		super(orm, queryService);
	}

	/**
	 * Validates if the data is valid for the role permission
	 */
	protected async validateEntity(
		data: CreateRolePermissionDto,
		id?: number | string
	): Promise<void> {
		// Check if role exists
		const role = await this.prisma.role.findUnique({
			where: { id: data.roleId },
		});

		if (!role) {
			throw new NotFoundException(`Role with ID ${data.roleId} not found`);
		}

		// Check if permission exists
		const permission = await this.prisma.permission.findUnique({
			where: { id: data.permissionId },
		});

		if (!permission) {
			throw new NotFoundException(`Permission with ID ${data.permissionId} not found`);
		}

		// Check if role-permission already exists
		const existingRolePermission = await this.prisma.rolePermission.findUnique({
			where: {
				roleId_permissionId: {
					roleId: data.roleId,
					permissionId: data.permissionId,
				},
			},
		});

		if (existingRolePermission) {
			throw new ConflictException('Role-permission assignment already exists');
		}
	}

	/**
	 * Validates if the id is valid for the role permission
	 * Note: RolePermission uses composite key, so this method may not be called directly
	 */
	protected async validateId(id: number | string): Promise<void> {
		// Not applicable for composite key entities
	}

  async findByRole(roleId: number) {
    return this.prisma.rolePermission.findMany({
      where: { roleId },
      include: {
        role: true,
        permission: true,
      },
      orderBy: {
        permission: {
          resource: 'asc',
        },
      },
    });
  }

  async findByPermission(permissionId: number) {
    return this.prisma.rolePermission.findMany({
      where: { permissionId },
      include: {
        role: true,
        permission: true,
      },
      orderBy: {
        role: {
          name: 'asc',
        },
      },
    });
  }

  async findOne(roleId: number, permissionId: number) {
    const rolePermission = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
      include: {
        role: true,
        permission: true,
      },
    });

    if (!rolePermission) {
      throw new NotFoundException(`Role-permission assignment not found`);
    }

    return rolePermission;
  }

  async remove(roleId: number, permissionId: number) {
    const rolePermission = await this.findOne(roleId, permissionId);
    
    return this.prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });
  }

  async removeByRole(roleId: number) {
    return this.prisma.rolePermission.deleteMany({
      where: { roleId },
    });
  }

  async removeByPermission(permissionId: number) {
    return this.prisma.rolePermission.deleteMany({
      where: { permissionId },
    });
  }
}
