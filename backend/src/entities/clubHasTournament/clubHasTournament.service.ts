import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
	CreateClubHasTournamentDto,
	UpdateClubHasTournamentDto,
} from './clubHasTournament.model.js';

type ClubHasTournamentCompositeId = {
	clubId: string;
	tournamentId: string;
};

@Injectable()
export class ClubHasTournamentService {
	constructor(private readonly prisma: PrismaService) {}

	async create(payload: CreateClubHasTournamentDto) {
		await this.ensureClubExists(payload.clubId);
		await this.ensureTournamentExists(payload.tournamentId);

		const record = await this.prisma.clubHasTournament.create({
			data: {
				club: { connect: { id: payload.clubId } },
				tournament: { connect: { id: payload.tournamentId } },
			},
		});

		return this.withCompositeId(record);
	}

	async findAll(filters?: Partial<ClubHasTournamentCompositeId>) {
		const records = await this.prisma.clubHasTournament.findMany({
			where: {
				clubId: filters?.clubId,
				tournamentId: filters?.tournamentId,
				deletedAt: null,
			},
		});

		return records.map(record => this.withCompositeId(record));
	}

	async findOne(id: string) {
		const compositeId = this.parseCompositeId(id);

		const record = await this.prisma.clubHasTournament.findFirst({
			where: {
				clubId: compositeId.clubId,
				tournamentId: compositeId.tournamentId,
				deletedAt: null,
			},
		});

		if (!record) {
			throw new NotFoundException(
				`Association not found for club ${compositeId.clubId} and tournament ${compositeId.tournamentId}`
			);
		}

		return this.withCompositeId(record);
	}

	async update(id: string, payload: UpdateClubHasTournamentDto) {
		const compositeId = this.parseCompositeId(id);

		if (payload.clubId || payload.tournamentId) {
			throw new BadRequestException('clubId and tournamentId cannot be updated');
		}

		const record = await this.prisma.clubHasTournament.update({
			where: { clubId_tournamentId: compositeId },
			data: payload,
		});

		return this.withCompositeId(record);
	}

	async remove(id: string) {
		const compositeId = this.parseCompositeId(id);

		const record = await this.prisma.clubHasTournament.delete({
			where: { clubId_tournamentId: compositeId },
		});

		return this.withCompositeId(record);
	}

	private parseCompositeId(id: string): ClubHasTournamentCompositeId {
		const [clubId, tournamentId] = id.split(':');

		if (!clubId || !tournamentId) {
			throw new BadRequestException(
				'Invalid identifier. Use "clubId:tournamentId" format.'
			);
		}

		return { clubId, tournamentId };
	}

	private composeCompositeId(data: ClubHasTournamentCompositeId): string {
		return `${data.clubId}:${data.tournamentId}`;
	}

	private withCompositeId<T extends ClubHasTournamentCompositeId>(
		record: T
	): T & { id: string } {
		return {
			...record,
			id: this.composeCompositeId(record),
		};
	}

	private async ensureClubExists(clubId: string) {
		const club = await this.prisma.club.findUnique({
			where: { id: clubId, deletedAt: null },
		});

		if (!club) {
			throw new NotFoundException(`Club with ID ${clubId} not found`);
		}
	}

	private async ensureTournamentExists(tournamentId: string) {
		const tournament = await this.prisma.tournament.findUnique({
			where: { id: tournamentId, deletedAt: null },
		});

		if (!tournament) {
			throw new NotFoundException(`Tournament with ID ${tournamentId} not found`);
		}
	}
}
