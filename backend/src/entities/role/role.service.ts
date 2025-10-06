import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from './role.model';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    // Check if role name already exists
    const existingRole = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('Role name already exists');
    }

    return this.prisma.role.create({
      data: {
        name: createRoleDto.name,
      },
    });
  }

  async findAll() {
    return this.prisma.role.findMany({
      include: {
        users: {
          select: {
            id: true,
            email: true,
          },
        },
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
          },
        },
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
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

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    
    // Check if name is being updated and if it already exists
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.prisma.role.findUnique({
        where: { name: updateRoleDto.name },
      });

      if (existingRole) {
        throw new ConflictException('Role name already exists');
      }
    }
    
    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
      include: {
        users: {
          select: {
            id: true,
            email: true,
          },
        },
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    
    // Check if role is being used by any users
    const usersWithRole = await this.prisma.user.count({
      where: { roleId: id },
    });

    if (usersWithRole > 0) {
      throw new ConflictException('Cannot delete role that is assigned to users');
    }
    
    return this.prisma.role.delete({
      where: { id },
    });
  }

  async assignPermissions(id: number, assignPermissionsDto: AssignPermissionsDto) {
    const role = await this.findOne(id);
    
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

    return this.findOne(id);
  }

  async getPermissions(id: number) {
    const role = await this.findOne(id);
    return role.permissions.map(rp => rp.permission);
  }
}
