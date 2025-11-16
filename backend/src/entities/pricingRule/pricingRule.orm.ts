import ORM from '../../../packages/default.orm.js';
import { PrismaModel } from '../../../packages/utils/index.js';
import DefaultEntity from '../../../packages/defaultEntity.js';
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PricingRule } from '@prisma/client';

export type PricingRuleEntity = PricingRule & DefaultEntity;

@Injectable()
export class PricingRuleORM extends ORM<PricingRuleEntity> {
	constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
		super();
		// Set the Prisma client as fallback
		this.setPrismaClient(prisma);
	}

	getModelName(): PrismaModel {
		return 'pricingRule';
	}

	isGeneral(): boolean {
		return false;
	}
}

