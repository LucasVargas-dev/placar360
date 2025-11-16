import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleORM } from './role.orm';
import { RoleQueryService } from './role.query.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RoleController],
  providers: [RoleORM, RoleQueryService, RoleService],
  exports: [RoleService],
})
export class RoleModule {}
