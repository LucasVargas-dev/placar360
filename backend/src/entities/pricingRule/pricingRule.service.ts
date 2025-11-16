import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import DefaultService from '../../../packages/default.service.js';
import { PricingRuleEntity, PricingRuleORM } from './pricingRule.orm.js';
import { CreatePricingRuleDto, UpdatePricingRuleDto } from './pricingRule.model';
import { PricingRuleQueryService } from './pricingRule.query.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class PricingRuleService extends DefaultService<
	PricingRuleEntity,
	CreatePricingRuleDto,
	UpdatePricingRuleDto
> {
	constructor(
		orm: PricingRuleORM,
		queryService: PricingRuleQueryService,
		@Inject(PrismaService) private readonly prisma: PrismaService
	) {
		super(orm, queryService);
	}

  private async validateClubExists(clubId: string): Promise<void> {
    const club = await this.prisma.club.findUnique({
      where: { id: clubId, deletedAt: null, isActive: true },
    });

    if (!club) {
      throw new NotFoundException(`Club with ID ${clubId} not found or inactive`);
    }
  }

  private async validateCourtExists(courtId: string, clubId: string): Promise<void> {
    const court = await this.prisma.court.findUnique({
      where: { id: courtId, deletedAt: null, isActive: true },
    });

    if (!court || court.clubId !== clubId) {
      throw new NotFoundException(`Court with ID ${courtId} not found, inactive, or does not belong to club ${clubId}`);
    }
  }

  private validateTimeRange(startTime: number, endTime: number): void {
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    if (startTime < 0 || startTime > 1439 || endTime < 0 || endTime > 1439) {
      throw new BadRequestException('Time values must be between 0 and 1439 minutes (0-23:59)');
    }
  }

  private async checkPricingRuleOverlap(
    clubId: string,
    courtId: string | null,
    dayOfWeek: number,
    startTime: number,
    endTime: number,
    excludeId?: string
  ): Promise<void> {
    const overlappingRule = await this.prisma.pricingRule.findFirst({
      where: {
        clubId,
        courtId,
        dayOfWeek,
        deletedAt: null,
        isActive: true,
        ...(excludeId && { NOT: { id: excludeId } }),
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    if (overlappingRule) {
      throw new ConflictException('Pricing rule conflicts with existing rule for the same time period');
    }
  }

	/**
	 * Validates if the data is valid for the pricing rule
	 */
	protected async validateEntity(
		data: CreatePricingRuleDto | UpdatePricingRuleDto,
		id?: string
	): Promise<void> {
		// Validate club exists if clubId is provided
		if ('clubId' in data && data.clubId) {
			await this.validateClubExists(data.clubId);
		}

		// Validate court if provided
		if ('courtId' in data && data.courtId) {
			const clubId = 'clubId' in data && data.clubId 
				? data.clubId 
				: id ? (await this.show(id))?.clubId : undefined;
			
			if (clubId) {
				await this.validateCourtExists(data.courtId, clubId);
			}
		}

		// Validate time range
		let startTime: number | undefined;
		let endTime: number | undefined;
		let dayOfWeek: number | undefined;
		let clubId: string | undefined;
		let courtId: string | null | undefined;

		if ('startTime' in data && data.startTime !== undefined && 'endTime' in data && data.endTime !== undefined) {
			startTime = data.startTime;
			endTime = data.endTime;
			dayOfWeek = 'dayOfWeek' in data && data.dayOfWeek !== undefined ? data.dayOfWeek : undefined;
			clubId = 'clubId' in data && data.clubId ? data.clubId : undefined;
			courtId = 'courtId' in data && data.courtId !== undefined ? data.courtId : undefined;
		} else if (id && ('startTime' in data || 'endTime' in data || 'dayOfWeek' in data)) {
			const existing = await this.show(id);
			if (existing) {
				startTime = 'startTime' in data && data.startTime !== undefined ? data.startTime : existing.startTime;
				endTime = 'endTime' in data && data.endTime !== undefined ? data.endTime : existing.endTime;
				dayOfWeek = 'dayOfWeek' in data && data.dayOfWeek !== undefined ? data.dayOfWeek : existing.dayOfWeek;
				clubId = existing.clubId;
				courtId = 'courtId' in data && data.courtId !== undefined ? data.courtId : existing.courtId;
			}
		}

		if (startTime !== undefined && endTime !== undefined) {
			this.validateTimeRange(startTime, endTime);
		}

		// Check for overlaps if we have all required data
		if (startTime !== undefined && endTime !== undefined && dayOfWeek !== undefined && clubId) {
			await this.checkPricingRuleOverlap(
				clubId,
				courtId || null,
				dayOfWeek,
				startTime,
				endTime,
				id
			);
		}
	}

	/**
	 * Validates if the id is valid for the pricing rule
	 */
	protected async validateId(id: number | string): Promise<void> {
		const pricingRuleExists = await this.show(id);

		if (!pricingRuleExists) {
			throw new NotFoundException(`Pricing rule with ID ${id} not found`);
		}
	}

  async getPricingRulesByClub(clubId: string) {
    await this.validateClubExists(clubId);

    return this.prisma.pricingRule.findMany({
      where: {
        clubId,
        deletedAt: null,
      },
      include: {
        court: {
          select: {
            id: true,
            name: true,
            sportType: true,
          },
        },
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });
  }

  async getPricingRulesByCourt(courtId: string) {
    const court = await this.prisma.court.findUnique({
      where: { id: courtId, deletedAt: null },
    });

    if (!court) {
      throw new NotFoundException(`Court with ID ${courtId} not found`);
    }

    return this.prisma.pricingRule.findMany({
      where: {
        courtId,
        deletedAt: null,
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });
  }

  async getApplicablePricingRules(clubId: string, courtId: string, dayOfWeek: number, timeInMinutes: number) {
    // First try to find court-specific rules
    let pricingRule = await this.prisma.pricingRule.findFirst({
      where: {
        clubId,
        courtId,
        dayOfWeek,
        startTime: { lte: timeInMinutes },
        endTime: { gt: timeInMinutes },
        deletedAt: null,
        isActive: true,
      },
      orderBy: {
        price: 'asc', // Get the cheapest applicable rule
      },
    });

    // If no court-specific rule found, look for club-wide rules
    if (!pricingRule) {
      pricingRule = await this.prisma.pricingRule.findFirst({
        where: {
          clubId,
          courtId: null,
          dayOfWeek,
          startTime: { lte: timeInMinutes },
          endTime: { gt: timeInMinutes },
          deletedAt: null,
          isActive: true,
        },
        orderBy: {
          price: 'asc',
        },
      });
    }

    return pricingRule;
  }

  // Additional utility methods for better integration

  async getPricingMatrix(clubId: string, courtId?: string) {
    await this.validateClubExists(clubId);

    if (courtId) {
      await this.validateCourtExists(courtId, clubId);
    }

    const whereClause: any = {
      clubId,
      deletedAt: null,
      isActive: true,
    };

    if (courtId) {
      whereClause.OR = [
        { courtId },
        { courtId: null }, // Include club-wide rules
      ];
    } else {
      whereClause.courtId = null; // Only club-wide rules
    }

    return this.prisma.pricingRule.findMany({
      where: whereClause,
      include: {
        court: {
          select: {
            id: true,
            name: true,
            sportType: true,
          },
        },
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });
  }

  async calculateBookingPrice(
    clubId: string,
    courtId: string,
    startTime: Date,
    endTime: Date
  ): Promise<{ price: number; rule: any }> {
    const dayOfWeek = startTime.getDay();
    const startTimeMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    const pricingRule = await this.getApplicablePricingRules(
      clubId,
      courtId,
      dayOfWeek,
      startTimeMinutes
    );

    if (!pricingRule) {
      // Fallback to court's default hourly rate
      const court = await this.prisma.court.findUnique({
        where: { id: courtId },
        select: { hourlyRate: true },
      });

      const hourlyRate = court?.hourlyRate ? Number(court.hourlyRate) : 0;
      const price = (hourlyRate * durationMinutes) / 60;

      return { price, rule: null };
    }

    const price = (Number(pricingRule.price) * durationMinutes) / 60;
    return { price, rule: pricingRule };
  }
}