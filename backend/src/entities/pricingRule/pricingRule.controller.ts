import { Controller, Get, Param, Query } from '@nestjs/common';
import { PricingRuleService } from './pricingRule.service';
import { CreatePricingRuleSchema, UpdatePricingRuleSchema, CreatePricingRuleDto, UpdatePricingRuleDto } from './pricingRule.model';
import DefaultController from '../../../packages/default.controller.js';
import { PricingRuleEntity } from './pricingRule.orm.js';
import { ZodSchema } from 'zod';

@Controller('pricing-rules')
export class PricingRuleController extends DefaultController<
	PricingRuleEntity,
	CreatePricingRuleDto,
	UpdatePricingRuleDto
> {
	constructor(private readonly pricingRuleService: PricingRuleService) {
		super(pricingRuleService);
	}

	/**
	 * Custom endpoint to get pricing rules for a specific club
	 */
	@Get('club/:clubId')
	async getPricingRulesByClub(@Param('clubId') clubId: string) {
		return await this.pricingRuleService.getPricingRulesByClub(clubId);
	}

	/**
	 * Custom endpoint to get pricing rules for a specific court
	 */
	@Get('court/:courtId')
	async getPricingRulesByCourt(@Param('courtId') courtId: string) {
		return await this.pricingRuleService.getPricingRulesByCourt(courtId);
	}

	/**
	 * Custom endpoint to get applicable pricing rules
	 */
	@Get('applicable/:clubId/:courtId')
	async getApplicablePricingRules(
		@Param('clubId') clubId: string,
		@Param('courtId') courtId: string,
		@Query('dayOfWeek') dayOfWeek: string,
		@Query('timeInMinutes') timeInMinutes: string,
	) {
		const day = parseInt(dayOfWeek);
		const time = parseInt(timeInMinutes);

		if (isNaN(day) || day < 1 || day > 7) {
			throw new Error('Invalid day of week. Must be between 1 and 7');
		}

		if (isNaN(time) || time < 0 || time > 1439) {
			throw new Error('Invalid time. Must be between 0 and 1439 minutes');
		}

		return await this.pricingRuleService.getApplicablePricingRules(clubId, courtId, day, time);
	}

	/**
	 * The zod create schema
	 */
	protected createSchema(): ZodSchema {
		return CreatePricingRuleSchema;
	}

	/**
	 * The zod update schema
	 */
	protected updateSchema(): ZodSchema {
		return UpdatePricingRuleSchema;
	}
}
