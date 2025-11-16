import { Controller, Get, Param } from '@nestjs/common';
import DefaultController from '../../../packages/default.controller.js';
import { TournamentMatchEntity } from './tournamentMatch.orm.js';
import {
	CreateTournamentMatchDto,
	CreateTournamentMatchSchema,
	UpdateTournamentMatchDto,
	UpdateTournamentMatchSchema,
} from './tournamentMatch.model';
import { TournamentMatchService } from './tournamentMatch.service.js';
import { ZodSchema } from 'zod';

@Controller('tournament-matches')
export class TournamentMatchController extends DefaultController<
	TournamentMatchEntity,
	CreateTournamentMatchDto,
	UpdateTournamentMatchDto
> {
	constructor(private readonly tournamentMatchService: TournamentMatchService) {
		super(tournamentMatchService);
	}

	@Get('tournament/:tournamentId/schedule')
	async getSchedule(@Param('tournamentId') tournamentId: string) {
		return await this.tournamentMatchService.getScheduleByTournament(tournamentId);
	}

	protected createSchema(): ZodSchema {
		return CreateTournamentMatchSchema;
	}

	protected updateSchema(): ZodSchema {
		return UpdateTournamentMatchSchema;
	}
}

