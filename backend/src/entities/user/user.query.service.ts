import { Injectable } from '@nestjs/common';
import DefaultQueryService from '../../../packages/defaultQuery.service.js';
import { UserEntity, UserORM } from './user.orm.js';

@Injectable()
export class UserQueryService extends DefaultQueryService<UserEntity> {
	constructor(orm: UserORM) {
		super(orm);
	}
}

