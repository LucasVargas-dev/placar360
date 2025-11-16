import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserORM } from './user.orm';
import { UserQueryService } from './user.query.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserORM, UserQueryService, UserService],
  exports: [UserService],
})
export class UserModule {}
