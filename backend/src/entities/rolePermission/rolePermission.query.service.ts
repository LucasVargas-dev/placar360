import { Injectable } from '@nestjs/common';
import DefaultQueryService from '../../../packages/defaultQuery.service.js';
import { RolePermissionEntity, RolePermissionORM } from './rolePermission.orm.js';

@Injectable()
export class RolePermissionQueryService extends DefaultQueryService<RolePermissionEntity> {
	constructor(orm: RolePermissionORM) {
		super(orm);
	}
}

