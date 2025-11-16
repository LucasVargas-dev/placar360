import { Injectable } from '@nestjs/common';
import DefaultQueryService from '../../../packages/defaultQuery.service.js';
import { BookingEntity, BookingORM } from './booking.orm.js';

@Injectable()
export class BookingQueryService extends DefaultQueryService<BookingEntity> {
	constructor(orm: BookingORM) {
		super(orm);
	}
}

