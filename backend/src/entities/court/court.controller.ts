import { Controller, Get, Param } from '@nestjs/common';
import { CourtService } from './court.service';
import { CreateCourtSchema, UpdateCourtSchema, CreateCourtDto, UpdateCourtDto } from './court.model';
import DefaultController from '../../../packages/default.controller.js';
import { CourtEntity } from './court.orm.js';
import { ZodSchema } from 'zod';

@Controller('courts')
export class CourtController extends DefaultController<
	CourtEntity,
	CreateCourtDto,
	UpdateCourtDto
> {
	constructor(private readonly courtService: CourtService) {
		super(courtService);
	}

	/**
	 * Custom endpoint to get courts for a specific club
	 */
	@Get('club/:clubId')
	async getCourtsByClub(@Param('clubId') clubId: string) {
		return await this.service.getAllByConditions({
			where: { clubId } as any,
		});
	}

	/**
	 * The zod create schema
	 */
	protected createSchema(): ZodSchema {
		return CreateCourtSchema;
	}

	/**
	 * The zod update schema
	 */
	protected updateSchema(): ZodSchema {
		return UpdateCourtSchema;
	}
}
