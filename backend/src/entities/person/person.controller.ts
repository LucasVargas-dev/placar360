import { Controller } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonSchema, UpdatePersonSchema, CreatePersonDto, UpdatePersonDto } from './person.model';
import DefaultController from '../../../packages/default.controller.js';
import { PersonEntity } from './person.orm.js';
import { ZodSchema } from 'zod';

@Controller('people')
export class PersonController extends DefaultController<
	PersonEntity,
	CreatePersonDto,
	UpdatePersonDto
> {
	constructor(private readonly personService: PersonService) {
		super(personService);
	}

	/**
	 * The zod create schema
	 */
	protected createSchema(): ZodSchema {
		return CreatePersonSchema;
	}

	/**
	 * The zod update schema
	 */
	protected updateSchema(): ZodSchema {
		return UpdatePersonSchema;
	}
}
