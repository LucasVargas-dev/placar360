import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PersonModule } from './entities/person/person.module';
import { UserModule } from './entities/user/user.module';
import { RoleModule } from './entities/role/role.module';
import { PermissionModule } from './entities/permission/permission.module';
import { RolePermissionModule } from './entities/rolePermission/rolePermission.module';
import { ClubModule } from './entities/club/club.module';
import { CourtModule } from './entities/court/court.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    PersonModule,
    UserModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    ClubModule,
    CourtModule,
  ],
})
export class AppModule {}
