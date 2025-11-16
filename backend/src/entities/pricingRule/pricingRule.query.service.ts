import { Injectable } from '@nestjs/common';
import DefaultQueryService from '../../../packages/defaultQuery.service.js';
import { PricingRuleEntity, PricingRuleORM } from './pricingRule.orm.js';

@Injectable()
export class PricingRuleQueryService extends DefaultQueryService<PricingRuleEntity> {
	constructor(orm: PricingRuleORM) {
		super(orm);
	}
}

