import { Injectable } from '@nestjs/common';
import DefaultQueryService from '../../../packages/defaultQuery.service.js';
import { TournamentEntity, TournamentORM } from './tournament.orm.js';

@Injectable()
export class TournamentQueryService extends DefaultQueryService<TournamentEntity> {
	constructor(orm: TournamentORM) {
		super(orm);
	}
}

