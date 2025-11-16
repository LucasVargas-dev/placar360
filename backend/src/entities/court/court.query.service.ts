import { Injectable } from '@nestjs/common';
import DefaultQueryService from '../../../packages/defaultQuery.service.js';
import { CourtEntity, CourtORM } from './court.orm.js';

@Injectable()
export class CourtQueryService extends DefaultQueryService<CourtEntity> {
	constructor(orm: CourtORM) {
		super(orm);
	}
}

