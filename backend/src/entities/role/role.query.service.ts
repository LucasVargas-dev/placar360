import { Injectable } from '@nestjs/common';
import DefaultQueryService from '../../../packages/defaultQuery.service.js';
import { RoleEntity, RoleORM } from './role.orm.js';

@Injectable()
export class RoleQueryService extends DefaultQueryService<RoleEntity> {
	constructor(orm: RoleORM) {
		super(orm);
	}
}

