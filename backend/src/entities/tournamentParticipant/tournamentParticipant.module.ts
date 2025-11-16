import { Module } from '@nestjs/common';
import { TournamentParticipantService } from './tournamentParticipant.service';
import { TournamentParticipantController } from './tournamentParticipant.controller';
import { TournamentParticipantORM } from './tournamentParticipant.orm';
import { TournamentParticipantQueryService } from './tournamentParticipant.query.service';

@Module({
  controllers: [TournamentParticipantController],
  providers: [TournamentParticipantORM, TournamentParticipantQueryService, TournamentParticipantService],
  exports: [TournamentParticipantService],
})
export class TournamentParticipantModule {}
