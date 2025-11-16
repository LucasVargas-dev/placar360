import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Court, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
	CreateClubScheduleDto,
	UpdateClubScheduleDto,
	ClubScheduleFiltersDto,
	CreateScheduleBookingDto,
} from './clubSchedule.model.js';
import { BookingService } from '../booking/booking.service.js';

type ScheduleSlot = {
	startTime: string;
	endTime: string;
	isAvailable: boolean;
	isPast: boolean;
	booking: null | {
		id: string;
		userId: string;
		status: string;
		type: string;
		notes?: string | null;
		user?: {
			id: string;
			name: string | null;
			email: string | null;
		} | null;
	};
};

type CourtSchedule = {
	courtId: string;
	courtName: string;
	sportType: string;
	defaultSlotMinutes: number | null;
	hourlyRate: number | null;
	slots: ScheduleSlot[];
};

type ScheduleDay = {
	date: string;
	courts: CourtSchedule[];
};

type ClubScheduleListFilters = {
	clubId?: string;
	courtName?: string;
	sportType?: string;
	includeInactive?: boolean;
};

/**
 * ClubScheduleService is a façade over court and booking data to expose a
 * schedule-oriented view required by the frontend. It reuses the underlying
 * court entity as storage and never persists a separate "club schedule" model.
 * Bookings continue to be created and managed exclusively through
 * `BookingService`.
 */
@Injectable()
export class ClubScheduleService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly bookingService: BookingService
	) {}

	async create(payload: CreateClubScheduleDto) {
		await this.ensureClubExists(payload.clubId);
		await this.validateCourtNameUnique(payload.clubId, payload.name);

		const created = await this.prisma.court.create({
			data: {
				clubId: payload.clubId,
				name: payload.name,
				sportType: payload.sportType,
				surface: payload.surface ?? null,
				defaultSlotMinutes: payload.defaultSlotMinutes ?? 60,
				hourlyRate: payload.hourlyRate ?? null,
				isActive: payload.isActive ?? true,
			},
		});

		return this.mapCourt(created);
	}

	async findAll(filters: ClubScheduleListFilters = {}) {
		const where: Prisma.CourtWhereInput = {
			deletedAt: null,
			...(filters.includeInactive ? {} : { isActive: true }),
			...(filters.clubId ? { clubId: filters.clubId } : {}),
		};

		if (filters.courtName) {
			where.name = {
				contains: filters.courtName,
				mode: 'insensitive',
			};
		}

		if (filters.sportType) {
			where.sportType = {
				equals: filters.sportType,
				mode: 'insensitive',
			};
		}

		const courts = await this.prisma.court.findMany({
			where,
			orderBy: { name: 'asc' },
		});

		return courts.map(court => this.mapCourt(court));
	}

	async findOne(id: string) {
		const court = await this.ensureCourtExists(id);
		return this.mapCourt(court);
	}

	async update(id: string, payload: UpdateClubScheduleDto) {
		const existing = await this.ensureCourtExists(id);

		const targetClubId = payload.clubId ?? existing.clubId;

		if (payload.clubId && payload.clubId !== existing.clubId) {
			await this.ensureClubExists(payload.clubId);
		}

		if (payload.name) {
			await this.validateCourtNameUnique(targetClubId, payload.name, id);
		}

		const updated = await this.prisma.court.update({
			where: { id },
			data: {
				clubId: payload.clubId ?? existing.clubId,
				name: payload.name ?? existing.name,
				sportType: payload.sportType ?? existing.sportType,
				surface:
					payload.surface !== undefined ? payload.surface ?? null : existing.surface,
				defaultSlotMinutes:
					payload.defaultSlotMinutes ?? existing.defaultSlotMinutes,
				hourlyRate:
					payload.hourlyRate !== undefined
						? payload.hourlyRate ?? null
						: existing.hourlyRate,
				isActive: payload.isActive ?? existing.isActive,
			},
		});

		return this.mapCourt(updated);
	}

	async softDelete(id: string) {
		await this.ensureCourtExists(id);

		const updated = await this.prisma.court.update({
			where: { id },
			data: { deletedAt: new Date() },
		});

		return this.mapCourt(updated);
	}

	async remove(id: string) {
		await this.ensureCourtExists(id, { includeDeleted: true });

		const deleted = await this.prisma.court.delete({
			where: { id },
		});

		return this.mapCourt(deleted);
	}

	async getClubSchedule(
		clubId: string,
		filters: ClubScheduleFiltersDto
	): Promise<{
		club: {
			id: string;
			name: string;
			openTime: string | null;
			closeTime: string | null;
		};
		dateRange: { startDate: string; endDate: string };
		schedule: ScheduleDay[];
	}> {
		await this.ensureClubExists(clubId);

		const startDate = filters.startDate
			? new Date(filters.startDate)
			: new Date();
		const endDate = filters.endDate
			? new Date(filters.endDate)
			: new Date(startDate);

		if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
			throw new BadRequestException('Invalid date filters');
		}

		if (endDate.getTime() < startDate.getTime()) {
			throw new BadRequestException(
				'End date must be greater than or equal to start date'
			);
		}

		const club = await this.prisma.club.findUnique({
			where: { id: clubId },
			select: {
				id: true,
				name: true,
				openTime: true,
				closeTime: true,
			},
		});

		if (!club) {
			throw new NotFoundException(`Club with ID ${clubId} not found`);
		}

		const courtWhere: Prisma.CourtWhereInput = {
			clubId,
			deletedAt: null,
			isActive: true,
		};

		if (filters.courtName) {
			courtWhere.name = {
				contains: filters.courtName,
				mode: 'insensitive',
			};
		}

		if (filters.sportType) {
			courtWhere.sportType = {
				equals: filters.sportType,
				mode: 'insensitive',
			};
		}

		const rangeStart = new Date(startDate);
		rangeStart.setHours(0, 0, 0, 0);

		const rangeEnd = new Date(endDate);
		rangeEnd.setHours(0, 0, 0, 0);

		const courts = await this.prisma.court.findMany({
			where: courtWhere,
			orderBy: { name: 'asc' },
		});

		const schedule: ScheduleDay[] = [];

		for (
			let cursor = new Date(rangeStart);
			cursor.getTime() <= rangeEnd.getTime();
			cursor.setDate(cursor.getDate() + 1)
		) {
			const day = new Date(cursor);
			const isoDate = day.toISOString();

			const courtSchedules: CourtSchedule[] = await Promise.all(
				courts.map(async court => {
					const slots = await this.bookingService.getCourtAvailabilityGrid(
						court.id,
						isoDate,
						court.defaultSlotMinutes ?? 60
					);

					return {
						courtId: court.id,
						courtName: court.name,
						sportType: court.sportType,
						defaultSlotMinutes: court.defaultSlotMinutes ?? null,
						hourlyRate:
							court.hourlyRate != null ? Number(court.hourlyRate) : null,
						slots: slots.map<ScheduleSlot>(slot => ({
							startTime: slot.startTime.toISOString(),
							endTime: slot.endTime.toISOString(),
							isAvailable: slot.isAvailable,
							isPast: slot.isPast,
							booking: slot.booking
								? {
										id: slot.booking.id,
										userId: slot.booking.userId,
										status: slot.booking.status,
										type: slot.booking.type,
										notes: slot.booking.notes ?? null,
										user: slot.booking.user
											? {
													id: slot.booking.user.id,
													name:
														slot.booking.user.person?.name ?? null,
													email: slot.booking.user.email ?? null,
												}
											: null,
									}
								: null,
						})),
					};
				})
			);

			schedule.push({
				date: isoDate,
				courts: courtSchedules,
			});
		}

		return {
			club,
			dateRange: {
				startDate: rangeStart.toISOString(),
				endDate: rangeEnd.toISOString(),
			},
			schedule,
		};
	}

	async getClubPlayers(clubId: string): Promise<
		Array<{
			id: string;
			name: string | null;
			email: string | null;
			relationshipType: string | null;
		}>
	> {
		await this.ensureClubExists(clubId);

		const memberships = await this.prisma.userClub.findMany({
			where: {
				clubId,
				deletedAt: null,
				isActive: true,
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
		});

		const playersMap = new Map<
			string,
			{
				id: string;
				name: string | null;
				email: string | null;
				relationshipType: string | null;
			}
		>();

		for (const membership of memberships) {
			if (!membership.user) continue;

			playersMap.set(membership.user.id, {
				id: membership.user.id,
				name: membership.user.person?.name ?? null,
				email: membership.user.email ?? null,
				relationshipType: membership.relationshipType ?? null,
			});
		}

		return Array.from(playersMap.values()).sort((a, b) =>
			(a.name ?? '').localeCompare(b.name ?? '')
		);
	}

	async createBookingForCourt(
		clubId: string,
		courtId: string,
		payload: CreateScheduleBookingDto
	) {
		await this.ensureClubExists(clubId);

		const court = await this.prisma.court.findFirst({
			where: { id: courtId, clubId, deletedAt: null, isActive: true },
		});

		if (!court) {
			throw new NotFoundException(
				`Court with ID ${courtId} not found for club ${clubId}`
			);
		}

		const startTime = new Date(payload.startTime);
		const endTime = new Date(payload.endTime);

		if (
			Number.isNaN(startTime.getTime()) ||
			Number.isNaN(endTime.getTime())
		) {
			throw new BadRequestException('Invalid start or end time');
		}

		const booking = await this.bookingService.createBookingFromSlot(
			courtId,
			payload.userId,
			startTime,
			endTime,
			payload.type ?? 1,
			payload.notes
		);

		const enriched = await this.bookingService.show(booking.id, {
			include: {
				user: {
					select: {
						id: true,
						email: true,
						person: { select: { name: true } },
					},
				},
				court: {
					select: {
						id: true,
						name: true,
						sportType: true,
					},
				},
			},
		});

		return enriched ?? booking;
	}

	private async ensureClubExists(clubId: string): Promise<void> {
		const club = await this.prisma.club.findUnique({
			where: { id: clubId, deletedAt: null },
		});

		if (!club) {
			throw new NotFoundException(`Club with ID ${clubId} not found`);
		}
	}

	private async ensureCourtExists(
		courtId: string,
		options: { includeDeleted?: boolean } = {}
	): Promise<Court> {
		const court = await this.prisma.court.findFirst({
			where: {
				id: courtId,
				...(options.includeDeleted ? {} : { deletedAt: null }),
			},
		});

		if (!court) {
			throw new NotFoundException(`Court with ID ${courtId} not found`);
		}

		return court;
	}

	private async validateCourtNameUnique(
		clubId: string,
		name: string,
		excludeId?: string
	): Promise<void> {
		const where: Prisma.CourtWhereInput = {
			clubId,
			name,
			deletedAt: null,
		};

		if (excludeId) {
			where.NOT = { id: excludeId };
		}

		const existing = await this.prisma.court.findFirst({ where });

		if (existing) {
			throw new BadRequestException('Court name already exists for this club');
		}
	}

	private mapCourt(court: Court) {
		return {
			...court,
			hourlyRate: court.hourlyRate != null ? Number(court.hourlyRate) : null,
		};
	}
}