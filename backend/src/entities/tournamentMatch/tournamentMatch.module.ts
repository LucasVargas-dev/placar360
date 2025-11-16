import { Module } from '@nestjs/common';
import { TournamentMatchController } from './tournamentMatch.controller.js';
import { TournamentMatchService } from './tournamentMatch.service.js';
import { TournamentMatchORM } from './tournamentMatch.orm.js';
import { TournamentMatchQueryService } from './tournamentMatch.query.service.js';

@Module({
	controllers: [TournamentMatchController],
	providers: [TournamentMatchService, TournamentMatchORM, TournamentMatchQueryService],
	exports: [TournamentMatchService],
})
export class TournamentMatchModule {}

