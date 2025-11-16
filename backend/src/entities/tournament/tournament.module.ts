import { Module, forwardRef } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { TournamentORM } from './tournament.orm';
import { TournamentQueryService } from './tournament.query.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => NotificationModule),
  ],
  controllers: [TournamentController],
  providers: [TournamentORM, TournamentQueryService, TournamentService],
  exports: [TournamentService],
})
export class TournamentModule {}
