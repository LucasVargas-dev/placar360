import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import {
	CreateClubHasTournamentSchema,
	UpdateClubHasTournamentSchema,
	CreateClubHasTournamentDto,
	UpdateClubHasTournamentDto,
} from './clubHasTournament.model.js';
import { ZodValidationPipe } from '../../../packages/common/pipes/zod-validation.pipe.js';
import { ClubHasTournamentService } from './clubHasTournament.service.js';

@Controller('club-has-tournaments')
export class ClubHasTournamentController {
	constructor(private readonly clubHasTournamentService: ClubHasTournamentService) {}

	@Post()
	async create(
		@Body(new ZodValidationPipe(CreateClubHasTournamentSchema))
		payload: CreateClubHasTournamentDto
	) {
		return await this.clubHasTournamentService.create(payload);
	}

	@Get()
	async findAll(
		@Query('clubId') clubId?: string,
		@Query('tournamentId') tournamentId?: string
	) {
		return await this.clubHasTournamentService.findAll({ clubId, tournamentId });
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.clubHasTournamentService.findOne(id);
	}

	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body(new ZodValidationPipe(UpdateClubHasTournamentSchema))
		payload: UpdateClubHasTournamentDto
	) {
		return await this.clubHasTournamentService.update(id, payload);
	}

	@Patch(':id')
	async patch(
		@Param('id') id: string,
		@Body(new ZodValidationPipe(UpdateClubHasTournamentSchema))
		payload: UpdateClubHasTournamentDto
	) {
		return await this.clubHasTournamentService.update(id, payload);
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		return await this.clubHasTournamentService.remove(id);
	}
}


