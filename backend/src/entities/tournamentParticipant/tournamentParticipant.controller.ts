import { Controller, Get, Patch, Param, Delete, Body } from '@nestjs/common';
import { TournamentParticipantService } from './tournamentParticipant.service';
import { CreateTournamentParticipantSchema, UpdateTournamentParticipantSchema, CreateTournamentParticipantDto, UpdateTournamentParticipantDto } from './tournamentParticipant.model';
import DefaultController from '../../../packages/default.controller.js';
import { TournamentParticipantEntity } from './tournamentParticipant.orm.js';
import { ZodSchema } from 'zod';

@Controller('tournament-participants')
export class TournamentParticipantController extends DefaultController<
	TournamentParticipantEntity,
	CreateTournamentParticipantDto,
	UpdateTournamentParticipantDto
> {
	constructor(private readonly tournamentParticipantService: TournamentParticipantService) {
		super(tournamentParticipantService);
	}

	/**
	 * Custom endpoint to get participants by tournament
	 */
	@Get('tournament/:tournamentId')
	async getParticipantsByTournament(@Param('tournamentId') tournamentId: string) {
		return await this.tournamentParticipantService.getParticipantsByTournament(tournamentId);
	}

	/**
	 * Custom endpoint to get participant stats for a tournament
	 */
	@Get('tournament/:tournamentId/stats')
	async getParticipantStats(@Param('tournamentId') tournamentId: string) {
		return await this.tournamentParticipantService.getParticipantStats(tournamentId);
	}

	/**
	 * Custom endpoint to get participations by user
	 */
	@Get('user/:userId')
	async getParticipationsByUser(@Param('userId') userId: string) {
		return await this.tournamentParticipantService.getParticipationsByUser(userId);
	}

	/**
	 * Custom endpoint to get a specific participant
	 */
	@Get(':tournamentId/:userId')
	async findOne(@Param('tournamentId') tournamentId: string, @Param('userId') userId: string) {
		return await this.tournamentParticipantService.findOne(tournamentId, userId);
	}

	/**
	 * Custom endpoint to update a participant
	 */
	@Patch(':tournamentId/:userId')
	async updateParticipant(
		@Param('tournamentId') tournamentId: string,
		@Param('userId') userId: string,
		@Body() updateTournamentParticipantDto: UpdateTournamentParticipantDto
	) {
		return await this.tournamentParticipantService.updateParticipant(tournamentId, userId, updateTournamentParticipantDto);
	}

	/**
	 * Custom endpoint to remove a participant
	 */
	@Delete(':tournamentId/:userId')
	async removeParticipant(@Param('tournamentId') tournamentId: string, @Param('userId') userId: string) {
		return await this.tournamentParticipantService.removeParticipant(tournamentId, userId);
	}

	/**
	 * The zod create schema
	 */
	protected createSchema(): ZodSchema {
		return CreateTournamentParticipantSchema;
	}

	/**
	 * The zod update schema
	 */
	protected updateSchema(): ZodSchema {
		return UpdateTournamentParticipantSchema;
	}
}
