import { Injectable } from '@nestjs/common';
import DefaultQueryService from '../../../packages/defaultQuery.service.js';
import { PersonEntity, PersonORM } from './person.orm.js';

@Injectable()
export class PersonQueryService extends DefaultQueryService<PersonEntity> {
	constructor(orm: PersonORM) {
		super(orm);
	}
}

