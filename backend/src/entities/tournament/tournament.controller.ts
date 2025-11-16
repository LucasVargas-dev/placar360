import { Controller, Get, Param } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreateTournamentSchema, UpdateTournamentSchema, CreateTournamentDto, UpdateTournamentDto } from './tournament.model';
import DefaultController from '../../../packages/default.controller.js';
import { TournamentEntity } from './tournament.orm.js';
import { ZodSchema } from 'zod';

@Controller('tournaments')
export class TournamentController extends DefaultController<
	TournamentEntity,
	Partial<Omit<CreateTournamentDto, 'entryFee'>> & { entryFee: TournamentEntity['entryFee'] },
	Partial<Omit<UpdateTournamentDto, 'entryFee'>> & { entryFee?: TournamentEntity['entryFee'] }
> {
	constructor(private readonly tournamentService: TournamentService) {
		super(tournamentService);
	}

	/**
	 * Custom endpoint to get active tournaments
	 */
	@Get('active')
	async getActiveTournaments() {
		return await this.tournamentService.getActiveTournaments();
	}

	/**
	 * Custom endpoint to get tournaments for a specific club
	 */
	@Get('club/:clubId')
	async getTournamentsByClub(@Param('clubId') clubId: string) {
		return await this.tournamentService.getTournamentsByClub(clubId);
	}

	/**
	 * Custom endpoint to get tournaments for a specific organizer
	 */
	@Get('organizer/:organizerId')
	async getTournamentsByOrganizer(@Param('organizerId') organizerId: string) {
		return await this.tournamentService.getTournamentsByOrganizer(organizerId);
	}

	/**
	 * The zod create schema
	 */
	protected createSchema(): ZodSchema {
		return CreateTournamentSchema;
	}

	/**
	 * The zod update schema
	 */
	protected updateSchema(): ZodSchema {
		return UpdateTournamentSchema;
	}
}
