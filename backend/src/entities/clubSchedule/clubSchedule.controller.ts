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
	CreateClubScheduleSchema,
	UpdateClubScheduleSchema,
	ClubScheduleFiltersSchema,
	CreateScheduleBookingSchema,
	CreateClubScheduleDto,
	UpdateClubScheduleDto,
	CreateScheduleBookingDto,
	ClubScheduleFiltersDto,
} from './clubSchedule.model.js';
import { ClubScheduleService } from './clubSchedule.service.js';
import { ZodValidationPipe } from '../../../packages/common/pipes/zod-validation.pipe.js';

@Controller('club-schedules')
export class ClubScheduleController {
	constructor(private readonly clubScheduleService: ClubScheduleService) {}

	@Post()
	async create(
		@Body(new ZodValidationPipe(CreateClubScheduleSchema))
		payload: CreateClubScheduleDto
	) {
		return await this.clubScheduleService.create(payload);
	}

	@Get()
	async findAll(
		@Query('clubId') clubId?: string,
		@Query('courtName') courtName?: string,
		@Query('sportType') sportType?: string,
		@Query('includeInactive') includeInactive?: string
	) {
		return await this.clubScheduleService.findAll({
			clubId,
			courtName,
			sportType,
			includeInactive:
				includeInactive === 'true' ||
				includeInactive === '1' ||
				includeInactive === 'yes',
		});
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.clubScheduleService.findOne(id);
	}

	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body(new ZodValidationPipe(UpdateClubScheduleSchema))
		payload: UpdateClubScheduleDto
	) {
		return await this.clubScheduleService.update(id, payload);
	}

	@Patch(':id')
	async patch(
		@Param('id') id: string,
		@Body(new ZodValidationPipe(UpdateClubScheduleSchema))
		payload: UpdateClubScheduleDto
	) {
		return await this.clubScheduleService.update(id, payload);
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		return await this.clubScheduleService.remove(id);
	}

	@Patch('soft-delete/:id')
	async softDelete(@Param('id') id: string) {
		return await this.clubScheduleService.softDelete(id);
	}

	@Get('club/:clubId')
	async getClubSchedule(
		@Param('clubId') clubId: string,
		@Query(new ZodValidationPipe(ClubScheduleFiltersSchema))
		filters: ClubScheduleFiltersDto
	) {
		return this.clubScheduleService.getClubSchedule(clubId, filters);
	}

	@Get('club/:clubId/players')
	async getClubPlayers(@Param('clubId') clubId: string) {
		return this.clubScheduleService.getClubPlayers(clubId);
	}

	@Post('club/:clubId/courts/:courtId/bookings')
	async createBooking(
		@Param('clubId') clubId: string,
		@Param('courtId') courtId: string,
		@Body(new ZodValidationPipe(CreateScheduleBookingSchema))
		data: CreateScheduleBookingDto
	) {
		return this.clubScheduleService.createBookingForCourt(
			clubId,
			courtId,
			data
		);
	}
}


