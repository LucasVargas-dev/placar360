import { Injectable } from '@nestjs/common';
import DefaultQueryService from '../../../packages/defaultQuery.service.js';
import { ClubEntity, ClubORM } from './club.orm.js';

@Injectable()
export class ClubQueryService extends DefaultQueryService<ClubEntity> {
	constructor(orm: ClubORM) {
		super(orm);
	}
}

