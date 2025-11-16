import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import DefaultService from '../../../packages/default.service.js';
import { CourtEntity, CourtORM } from './court.orm.js';
import { CreateCourtDto, UpdateCourtDto } from './court.model';
import { CourtQueryService } from './court.query.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class CourtService extends DefaultService<
	CourtEntity,
	CreateCourtDto,
	UpdateCourtDto
> {
	constructor(
		orm: CourtORM,
		queryService: CourtQueryService,
		@Inject(PrismaService) private readonly prisma: PrismaService
	) {
		super(orm, queryService);
	}

	/**
	 * Validate if club exists
	 */
	private async validateClubExists(clubId: string): Promise<void> {
		const club = await this.prisma.club.findUnique({
			where: { id: clubId, deletedAt: null },
		});

		if (!club) {
			throw new NotFoundException(`Club with ID ${clubId} not found`);
		}
	}

	/**
	 * Validate if court name is unique within a club
	 */
	private async validateCourtNameUnique(clubId: string, name: string, excludeId?: string): Promise<void> {
		const existingCourt = await this.queryService.getByConditions({
			where: {
				clubId,
				name,
				...(excludeId && { NOT: { id: excludeId } } as any),
			} as any,
		});

		if (existingCourt) {
			throw new ConflictException('Court name already exists in this club');
		}
	}

	/**
	 * Validates if the data is valid for the court
	 */
	protected async validateEntity(
		data: CreateCourtDto | UpdateCourtDto,
		id?: string
	): Promise<void> {
		// Validate club exists if clubId is provided
		if ('clubId' in data && data.clubId) {
			await this.validateClubExists(data.clubId);
		}

		// If creating or updating name, validate uniqueness
		if (data.name) {
			const clubId = 'clubId' in data && data.clubId 
				? data.clubId 
				: id ? (await this.show(id))?.clubId : undefined;

			if (clubId) {
				await this.validateCourtNameUnique(clubId, data.name, id);
			}
		}
	}

	/**
	 * Validates if the id is valid for the court
	 */
	protected async validateId(id: string): Promise<void> {
		const courtExists = await this.show(id);

		if (!courtExists) {
			throw new NotFoundException(`Court with ID ${id} not found`);
		}
	}
}