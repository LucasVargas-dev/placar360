import { Injectable } from '@nestjs/common';
import DefaultQueryService from '../../../packages/defaultQuery.service.js';
import { NotificationEntity, NotificationORM } from './notification.orm.js';

@Injectable()
export class NotificationQueryService extends DefaultQueryService<NotificationEntity> {
	constructor(orm: NotificationORM) {
		super(orm);
	}
}

