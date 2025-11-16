import { Module } from '@nestjs/common';
import { RolePermissionService } from './rolePermission.service';
import { RolePermissionController } from './rolePermission.controller';
import { RolePermissionORM } from './rolePermission.orm';
import { RolePermissionQueryService } from './rolePermission.query.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RolePermissionController],
  providers: [RolePermissionORM, RolePermissionQueryService, RolePermissionService],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}
