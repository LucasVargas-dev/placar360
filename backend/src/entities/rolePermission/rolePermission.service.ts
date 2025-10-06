import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRolePermissionDto } from './rolePermission.model';

@Injectable()
export class RolePermissionService {
  constructor(private prisma: PrismaService) {}

  async create(createRolePermissionDto: CreateRolePermissionDto) {
    // Check if role exists
    const role = await this.prisma.role.findUnique({
      where: { id: createRolePermissionDto.roleId },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${createRolePermissionDto.roleId} not found`);
    }

    // Check if permission exists
    const permission = await this.prisma.permission.findUnique({
      where: { id: createRolePermissionDto.permissionId },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${createRolePermissionDto.permissionId} not found`);
    }

    // Check if role-permission already exists
    const existingRolePermission = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: createRolePermissionDto.roleId,
          permissionId: createRolePermissionDto.permissionId,
        },
      },
    });

    if (existingRolePermission) {
      throw new ConflictException('Role-permission assignment already exists');
    }

    return this.prisma.rolePermission.create({
      data: {
        roleId: createRolePermissionDto.roleId,
        permissionId: createRolePermissionDto.permissionId,
      },
      include: {
        role: true,
        permission: true,
      },
    });
  }

  async findAll() {
    return this.prisma.rolePermission.findMany({
      include: {
        role: true,
        permission: true,
      },
      orderBy: [
        { role: { name: 'asc' } },
        { permission: { resource: 'asc' } },
        { permission: { action: 'asc' } },
      ],
    });
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
