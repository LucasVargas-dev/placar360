import { Injectable } from '@nestjs/common';
import DefaultQueryService from '../../../packages/defaultQuery.service.js';
import { TournamentMatchEntity, TournamentMatchORM } from './tournamentMatch.orm.js';

@Injectable()
export class TournamentMatchQueryService extends DefaultQueryService<TournamentMatchEntity> {
	constructor(orm: TournamentMatchORM) {
		super(orm);
	}
}

