import { Controller, Get, Param } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubSchema, UpdateClubSchema, CreateClubDto, UpdateClubDto } from './club.model';
import DefaultController from '../../../packages/default.controller.js';
import { ClubEntity } from './club.orm.js';
import { ZodSchema } from 'zod';

@Controller('clubs')
export class ClubController extends DefaultController<
	ClubEntity,
	CreateClubDto,
	UpdateClubDto
> {
	constructor(private readonly clubService: ClubService) {
		super(clubService);
	}

	/**
	 * Custom endpoint to get courts for a specific club
	 */
	@Get(':id/courts')
	async getCourts(@Param('id') id: string) {
		const club = await this.service.show(id);
		if (!club) {
			throw new Error('Club not found');
		}
		return club;
	}

	/**
	 * The zod create schema
	 */
	protected createSchema(): ZodSchema {
		return CreateClubSchema;
	}

	/**
	 * The zod update schema
	 */
	protected updateSchema(): ZodSchema {
		return UpdateClubSchema;
	}
}
