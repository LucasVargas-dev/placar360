import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PersonModule } from './entities/person/person.module';
import { UserModule } from './entities/user/user.module';
import { RoleModule } from './entities/role/role.module';
import { PermissionModule } from './entities/permission/permission.module';
import { RolePermissionModule } from './entities/rolePermission/rolePermission.module';
import { ClubModule } from './entities/club/club.module';
import { CourtModule } from './entities/court/court.module';
import { BookingModule } from './entities/booking/booking.module';
import { ClubScheduleModule } from './entities/clubSchedule/clubSchedule.module';
import { PricingRuleModule } from './entities/pricingRule/pricingRule.module';
import { TournamentModule } from './entities/tournament/tournament.module';
import { TournamentParticipantModule } from './entities/tournamentParticipant/tournamentParticipant.module';
import { TournamentMatchModule } from './entities/tournamentMatch/tournamentMatch.module';
import { UserClubModule } from './entities/userClub/userClub.module';
import { NotificationModule } from './entities/notification/notification.module';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
      global: true,
      middleware: { mount: true },
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    PersonModule,
    UserModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    ClubModule,
    CourtModule,
    ClubScheduleModule,
    BookingModule,
    PricingRuleModule,
    TournamentModule,
    TournamentParticipantModule,
    TournamentMatchModule,
    UserClubModule,
    NotificationModule,
  ],
})
export class AppModule {}
