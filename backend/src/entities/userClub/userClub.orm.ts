import ORM from '../../../packages/default.orm.js';
import { PrismaModel } from '../../../packages/utils/index.js';
import DefaultEntity from '../../../packages/defaultEntity.js';
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserClub } from '@prisma/client';

export type UserClubEntity = UserClub & DefaultEntity;

@Injectable()
export class UserClubORM extends ORM<UserClubEntity> {
	constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
		super();
		// Set the Prisma client as fallback
		this.setPrismaClient(prisma);
	}

	getModelName(): PrismaModel {
		return 'userClub';
	}

	isGeneral(): boolean {
		return false;
	}
}

