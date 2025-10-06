import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto, UpdatePermissionDto } from './permission.model';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    // Check if permission already exists (resource + action combination)
    const existingPermission = await this.prisma.permission.findFirst({
      where: {
        resource: createPermissionDto.resource,
        action: createPermissionDto.action,
        deletedAt: null,
      },
    });

    if (existingPermission) {
      throw new ConflictException('Permission with this resource and action already exists');
    }

    return this.prisma.permission.create({
      data: {
        resource: createPermissionDto.resource,
        action: createPermissionDto.action,
        description: createPermissionDto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.permission.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        { resource: 'asc' },
        { action: 'asc' },
      ],
    });
  }

  async findOne(id: number) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!permission || permission.deletedAt) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  async findByResourceAndAction(resource: string, action: string) {
    return this.prisma.permission.findFirst({
      where: {
        resource,
        action,
        deletedAt: null,
      },
      include: {
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findByResource(resource: string) {
    return this.prisma.permission.findMany({
      where: {
        resource,
        deletedAt: null,
      },
      include: {
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        action: 'asc',
      },
    });
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.findOne(id);
    
    // Check if resource + action combination is being updated and if it already exists
    if (updatePermissionDto.resource || updatePermissionDto.action) {
      const newResource = updatePermissionDto.resource || permission.resource;
      const newAction = updatePermissionDto.action || permission.action;
      
      if (newResource !== permission.resource || newAction !== permission.action) {
        const existingPermission = await this.prisma.permission.findFirst({
          where: {
            resource: newResource,
            action: newAction,
            deletedAt: null,
            NOT: { id },
          },
        });

        if (existingPermission) {
          throw new ConflictException('Permission with this resource and action already exists');
        }
      }
    }
    
    return this.prisma.permission.update({
      where: { id },
      data: {
        ...updatePermissionDto,
        updatedAt: new Date(),
      },
      include: {
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: number) {
    const permission = await this.findOne(id);
    
    return this.prisma.permission.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async getRoles(id: number) {
    const permission = await this.findOne(id);
    return permission.roles.map(rp => rp.role);
  }
}
