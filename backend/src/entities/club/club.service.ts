import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import DefaultService from '../../../packages/default.service.js';
import { ClubEntity, ClubORM } from './club.orm.js';
import { CreateClubDto, UpdateClubDto } from './club.model';
import { ClubQueryService } from './club.query.service.js';

@Injectable()
export class ClubService extends DefaultService<
	ClubEntity,
	CreateClubDto,
	UpdateClubDto
> {
	constructor(
		orm: ClubORM,
		queryService: ClubQueryService
	) {
		super(orm, queryService);
	}

	/**
	 * Validate if club name is unique
	 */
	private async validateClubNameUnique(name: string, excludeId?: string): Promise<void> {
		const existingClub = await this.queryService.getByConditions({
			where: {
				name,
				...(excludeId && { NOT: { id: excludeId } } as any),
			} as any,
		});

		if (existingClub) {
			throw new ConflictException('Club name already exists');
		}
	}

	/**
	 * Validates if the data is valid for the club
	 */
	protected async validateEntity(
		data: CreateClubDto | UpdateClubDto,
		id?: string
	): Promise<void> {
		if (data.name) {
			await this.validateClubNameUnique(data.name, id);
		}
	}

	/**
	 * Validates if the id is valid for the club
	 */
	protected async validateId(id: string): Promise<void> {
		const clubExists = await this.show(id);

		if (!clubExists) {
			throw new NotFoundException(`Club with ID ${id} not found`);
		}
	}
}
