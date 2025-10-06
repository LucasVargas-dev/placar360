import { Module } from '@nestjs/common';
import { RolePermissionService } from './rolePermission.service';
import { RolePermissionController } from './rolePermission.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}
