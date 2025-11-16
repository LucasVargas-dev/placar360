import { Controller, Get, Param, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingSchema, UpdateBookingSchema, CreateBookingDto, UpdateBookingDto } from './booking.model';
import DefaultController from '../../../packages/default.controller.js';
import { BookingEntity } from './booking.orm.js';
import { ZodSchema } from 'zod';

@Controller('bookings')
export class BookingController extends DefaultController<
	BookingEntity,
	CreateBookingDto,
	UpdateBookingDto
> {
	constructor(private readonly bookingService: BookingService) {
		super(bookingService);
	}

	/**
	 * Custom endpoint to get bookings by date range
	 */
	@Get('date-range')
	async getBookingsByDateRange(
		@Query('startDate') startDate?: string,
		@Query('endDate') endDate?: string
	) {
		if (startDate && endDate) {
			return await this.bookingService.getBookingsByDateRange(startDate, endDate);
		}
		return await this.bookingService.getAllByConditions({});
	}

	/**
	 * Custom endpoint to get bookings for a specific court
	 */
	@Get('court/:courtId')
	async getBookingsByCourt(@Param('courtId') courtId: string) {
		return await this.bookingService.getBookingsByCourt(courtId);
	}

	/**
	 * Custom endpoint to get bookings for a specific user
	 */
	@Get('user/:userId')
	async getBookingsByUser(@Param('userId') userId: string) {
		return await this.bookingService.getBookingsByUser(userId);
	}

	/**
	 * The zod create schema
	 */
	protected createSchema(): ZodSchema {
		return CreateBookingSchema;
	}

	/**
	 * The zod update schema
	 */
	protected updateSchema(): ZodSchema {
		return UpdateBookingSchema;
	}
}
