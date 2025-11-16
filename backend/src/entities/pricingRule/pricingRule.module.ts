import { Module } from '@nestjs/common';
import { PricingRuleService } from './pricingRule.service';
import { PricingRuleController } from './pricingRule.controller';
import { PricingRuleORM } from './pricingRule.orm';
import { PricingRuleQueryService } from './pricingRule.query.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PricingRuleController],
  providers: [PricingRuleORM, PricingRuleQueryService, PricingRuleService],
  exports: [PricingRuleService],
})
export class PricingRuleModule {}
