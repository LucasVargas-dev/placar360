import ORM from '../../../packages/default.orm.js';
import { PrismaModel } from '../../../packages/utils/index.js';
import DefaultEntity from '../../../packages/defaultEntity.js';
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { TournamentParticipant } from '@prisma/client';

export type TournamentParticipantEntity = TournamentParticipant & DefaultEntity;

@Injectable()
export class TournamentParticipantORM extends ORM<TournamentParticipantEntity> {
	constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
		super();
		// Set the Prisma client as fallback
		this.setPrismaClient(prisma);
	}

	getModelName(): PrismaModel {
		return 'tournamentParticipant';
	}

	isGeneral(): boolean {
		return false;
	}
}

