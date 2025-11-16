import { Injectable } from '@nestjs/common';
import DefaultQueryService from '../../../packages/defaultQuery.service.js';
import { TournamentParticipantEntity, TournamentParticipantORM } from './tournamentParticipant.orm.js';

@Injectable()
export class TournamentParticipantQueryService extends DefaultQueryService<TournamentParticipantEntity> {
	constructor(orm: TournamentParticipantORM) {
		super(orm);
	}
}

