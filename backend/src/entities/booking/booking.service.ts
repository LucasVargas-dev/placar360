import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import DefaultService from '../../../packages/default.service.js';
import { BookingEntity, BookingORM } from './booking.orm.js';
import { CreateBookingDto, UpdateBookingDto } from './booking.model';
import { BookingQueryService } from './booking.query.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class BookingService extends DefaultService<
	BookingEntity,
	CreateBookingDto,
	UpdateBookingDto
> {
	constructor(
		orm: BookingORM,
		queryService: BookingQueryService,
		@Inject(PrismaService) private readonly prisma: PrismaService
	) {
		super(orm, queryService);
	}

  private async validateCourtExists(courtId: string): Promise<void> {
    const court = await this.prisma.court.findUnique({
      where: { id: courtId, deletedAt: null, isActive: true },
    });

    if (!court) {
      throw new NotFoundException(`Court with ID ${courtId} not found or inactive`);
    }
  }

  private async validateUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  private validateTimeSlot(startTime: Date, endTime: Date): void {
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    if (startTime < new Date()) {
      throw new BadRequestException('Cannot create booking in the past');
    }

    // Validate slot duration (minimum 15 minutes, maximum 8 hours)
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    if (durationMinutes < 15) {
      throw new BadRequestException('Booking duration must be at least 15 minutes');
    }
    if (durationMinutes > 480) {
      throw new BadRequestException('Booking duration cannot exceed 8 hours');
    }
  }

  private async checkSlotAvailability(courtId: string, startTime: Date, endTime: Date, excludeBookingId?: string): Promise<void> {
    const overlappingBooking = await this.prisma.booking.findFirst({
      where: {
        courtId,
        deletedAt: null,
        ...(excludeBookingId && { NOT: { id: excludeBookingId } }),
        OR: [
          // New booking starts during existing booking
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          // New booking ends during existing booking
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          // New booking completely contains existing booking
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    if (overlappingBooking) {
      throw new ConflictException('Time slot is already booked');
    }
  }

	/**
	 * Validates if the data is valid for the booking
	 */
	protected async validateEntity(
		data: CreateBookingDto | UpdateBookingDto,
		id?: string
	): Promise<void> {
		// For create operations, validate all required fields
		if ('courtId' in data && data.courtId && 'userId' in data && data.userId) {
			await this.validateCourtExists(data.courtId);
			await this.validateUserExists(data.userId);
		}

		// Validate time slot if times are provided
		if ('startTime' in data && data.startTime && 'endTime' in data && data.endTime) {
			const startTime = new Date(data.startTime);
			const endTime = new Date(data.endTime);
			this.validateTimeSlot(startTime, endTime);

			// Check slot availability
			const courtId = 'courtId' in data && data.courtId 
				? data.courtId 
				: id ? (await this.show(id))?.courtId : undefined;

			if (courtId) {
				await this.checkSlotAvailability(courtId, startTime, endTime, id);
			}
		} else if (id && ('startTime' in data || 'endTime' in data)) {
			// Update operation with partial time updates
			const booking = await this.show(id);
			if (booking) {
				const startTime = data.startTime ? new Date(data.startTime) : booking.startTime;
				const endTime = data.endTime ? new Date(data.endTime) : booking.endTime;
				this.validateTimeSlot(startTime, endTime);
				await this.checkSlotAvailability(booking.courtId, startTime, endTime, id);
			}
		}
	}

	/**
	 * Validates if the id is valid for the booking
	 */
	protected async validateId(id: number | string): Promise<void> {
		const bookingExists = await this.show(id);

		if (!bookingExists) {
			throw new NotFoundException(`Booking with ID ${id} not found`);
		}
	}

  // Grid-specific methods for Excel-like interface

  async getCourtAvailabilityGrid(courtId: string, date: string, slotDurationMinutes: number = 60) {
    await this.validateCourtExists(courtId);

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Get court's operating hours
    const court = await this.prisma.court.findUnique({
      where: { id: courtId },
      include: { club: true },
    });

    // Get all bookings for the day
    const bookings = await this.prisma.booking.findMany({
      where: {
        courtId,
        deletedAt: null,
        startTime: { gte: startOfDay },
        endTime: { lte: endOfDay },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            person: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    // Generate time slots based on court's operating hours and slot duration
    const slots = this.generateTimeSlots(
      startOfDay,
      endOfDay,
      slotDurationMinutes,
      court?.club?.openTime,
      court?.club?.closeTime
    );

    // Mark slots as available/booked
    const now = new Date();

    return slots.map(slot => {
      const booking = this.getSlotBooking(slot, bookings);
      const isAlreadyBooked = Boolean(booking);
      const isPastSlot = slot.endTime <= now;

      return {
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: !isAlreadyBooked && !isPastSlot,
        booking,
        isPast: isPastSlot,
      };
    });
  }

  async getMultiCourtAvailabilityGrid(courtIds: string[], date: string, slotDurationMinutes: number = 60) {
    const results = await Promise.all(
      courtIds.map(courtId => this.getCourtAvailabilityGrid(courtId, date, slotDurationMinutes))
    );

    return results.reduce((acc, courtSlots, index) => {
      acc[courtIds[index]] = courtSlots;
      return acc;
    }, {} as Record<string, any[]>);
  }

  async createBookingFromSlot(courtId: string, userId: string, startTime: Date, endTime: Date, type: number = 1, notes?: string) {
    const createBookingDto: CreateBookingDto = {
      courtId,
      userId,
      type: type.toString(),
      startTime,
      endTime,
      status: "2", // CONFIRMED
      notes,
    };

    return this.create(createBookingDto);
  }

  async getBookingsByCourt(courtId: string, startDate?: string, endDate?: string) {
    await this.validateCourtExists(courtId);

    const whereClause: any = {
      courtId,
      deletedAt: null,
    };

    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    return this.prisma.booking.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async getBookingsByUser(userId: string) {
    await this.validateUserExists(userId);

    return this.prisma.booking.findMany({
      where: {
        userId,
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
      orderBy: {
        startTime: 'desc',
      },
    });
  }

  async getBookingsByDateRange(startDate: string, endDate: string) {
    return this.prisma.booking.findMany({
      where: {
        deletedAt: null,
        startTime: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        court: {
          select: {
            id: true,
            name: true,
            sportType: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  // Private helper methods for grid functionality

  private generateTimeSlots(
    startOfDay: Date,
    endOfDay: Date,
    slotDurationMinutes: number,
    clubOpenTime?: string,
    clubCloseTime?: string
  ): Array<{ startTime: Date; endTime: Date }> {
    const slots = [];
    const current = new Date(startOfDay);

    // Parse club operating hours if available
    let openHour = 6; // Default 6 AM
    let closeHour = 22; // Default 10 PM

    if (clubOpenTime) {
      const [hours] = clubOpenTime.split(':').map(Number);
      openHour = hours;
    }

    if (clubCloseTime) {
      const [hours] = clubCloseTime.split(':').map(Number);
      closeHour = hours;
    }

    // Set start time to club open time
    current.setHours(openHour, 0, 0, 0);

    while (current.getHours() < closeHour) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + slotDurationMinutes * 60000);

      if (slotEnd.getHours() <= closeHour) {
        slots.push({
          startTime: slotStart,
          endTime: slotEnd,
        });
      }

      current.setMinutes(current.getMinutes() + slotDurationMinutes);
    }

    return slots;
  }

  private isSlotBooked(slot: { startTime: Date; endTime: Date }, bookings: any[]): boolean {
    return bookings.some(booking => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);

      return (
        (slot.startTime < bookingEnd && slot.endTime > bookingStart) ||
        (slot.startTime >= bookingStart && slot.endTime <= bookingEnd) ||
        (slot.startTime < bookingStart && slot.endTime > bookingEnd)
      );
    });
  }

  private getSlotBooking(slot: { startTime: Date; endTime: Date }, bookings: any[]): any | null {
    return bookings.find(booking => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);

      return slot.startTime >= bookingStart && slot.endTime <= bookingEnd;
    }) || null;
  }
}