import ORM from '../../../packages/default.orm.js';
import { PrismaModel } from '../../../packages/utils/index.js';
import DefaultEntity from '../../../packages/defaultEntity.js';
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Person } from '@prisma/client';

export type PersonEntity = Person & DefaultEntity;

@Injectable()
export class PersonORM extends ORM<PersonEntity> {
	constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
		super();
		// Set the Prisma client as fallback
		this.setPrismaClient(prisma);
	}

	getModelName(): PrismaModel {
		return 'person';
	}

	isGeneral(): boolean {
		return false;
	}
}

