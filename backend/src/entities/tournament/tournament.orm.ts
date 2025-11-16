import ORM from '../../../packages/default.orm.js';
import { PrismaModel } from '../../../packages/utils/index.js';
import DefaultEntity from '../../../packages/defaultEntity.js';
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Tournament } from '@prisma/client';

export type TournamentEntity = Tournament & DefaultEntity;

@Injectable()
export class TournamentORM extends ORM<TournamentEntity> {
	constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
		super();
		// Set the Prisma client as fallback
		this.setPrismaClient(prisma);
	}

	getModelName(): PrismaModel {
		return 'tournament';
	}

	isGeneral(): boolean {
		return false;
	}
}

