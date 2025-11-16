import { Injectable, NotFoundException } from '@nestjs/common';
import DefaultService from '../../../packages/default.service.js';
import { PersonEntity, PersonORM } from './person.orm.js';
import { CreatePersonDto, UpdatePersonDto } from './person.model';
import { PersonQueryService } from './person.query.service.js';

@Injectable()
export class PersonService extends DefaultService<
	PersonEntity,
	CreatePersonDto,
	UpdatePersonDto
> {
	constructor(
		orm: PersonORM,
		queryService: PersonQueryService
	) {
		super(orm, queryService);
	}

	/**
	 * Validates if the data is valid for the person
	 */
	protected async validateEntity(
		data: CreatePersonDto | UpdatePersonDto,
		id?: number | string
	): Promise<void> {
		// No specific validation needed for person
	}

	/**
	 * Validates if the id is valid for the person
	 */
	protected async validateId(id: number | string): Promise<void> {
		const personExists = await this.show(id);

		if (!personExists) {
			throw new NotFoundException(`Person with ID ${id} not found`);
		}
	}
}
