import { Injectable } from '@nestjs/common';
import DefaultQueryService from '../../../packages/defaultQuery.service.js';
import { UserClubEntity, UserClubORM } from './userClub.orm.js';

@Injectable()
export class UserClubQueryService extends DefaultQueryService<UserClubEntity> {
	constructor(orm: UserClubORM) {
		super(orm);
	}
}

