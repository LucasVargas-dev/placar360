import ORM from '../../../packages/default.orm.js';
import { PrismaModel } from '../../../packages/utils/index.js';
import DefaultEntity from '../../../packages/defaultEntity.js';
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { TournamentMatch } from '@prisma/client';

export type TournamentMatchEntity = TournamentMatch & DefaultEntity;

@Injectable()
export class TournamentMatchORM extends ORM<TournamentMatchEntity> {
	constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
		super();
		this.setPrismaClient(prisma);
	}

	getModelName(): PrismaModel {
		return 'tournamentMatch';
	}

	isGeneral(): boolean {
		return false;
	}
}

