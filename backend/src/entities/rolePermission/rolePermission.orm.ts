import ORM from '../../../packages/default.orm.js';
import { PrismaModel } from '../../../packages/utils/index.js';
import DefaultEntity from '../../../packages/defaultEntity.js';
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RolePermission } from '@prisma/client';

export type RolePermissionEntity = RolePermission & DefaultEntity;

@Injectable()
export class RolePermissionORM extends ORM<RolePermissionEntity> {
	constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
		super();
		// Set the Prisma client as fallback
		this.setPrismaClient(prisma);
	}

	getModelName(): PrismaModel {
		return 'rolePermission';
	}

	isGeneral(): boolean {
		return false;
	}
}

