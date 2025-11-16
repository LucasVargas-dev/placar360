import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import DefaultService from '../../../packages/default.service.js';
import { TournamentMatchEntity, TournamentMatchORM } from './tournamentMatch.orm.js';
import {
	CreateTournamentMatchDto,
	UpdateTournamentMatchDto,
	TournamentMatchParticipantInputDto,
} from './tournamentMatch.model';
import { TournamentMatchQueryService } from './tournamentMatch.query.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

type ScheduleParticipant = {
	id: string;
	teamName?: string | null;
	seed?: number | null;
	players: Array<{
		id: string;
		name: string;
	}>;
};

type ScheduleCourt = {
	id: string;
	name: string;
} | null;

type ScheduleMatch = {
	id: string;
	tournamentId: string;
	round: string;
	roundOrder: number;
	stageType: string;
	groupName?: string | null;
	modality?: string | null;
	matchFormat?: string | null;
	status: string;
	scheduledAt: Date | null;
	court: ScheduleCourt;
	participants: ScheduleParticipant[];
	winnerParticipantId?: string | null;
	scoreSummary?: string | null;
};

@Injectable()
export class TournamentMatchService extends DefaultService<
	TournamentMatchEntity,
	CreateTournamentMatchDto,
	UpdateTournamentMatchDto
> {
	constructor(
		orm: TournamentMatchORM,
		queryService: TournamentMatchQueryService,
		@Inject(PrismaService) private readonly prisma: PrismaService
	) {
		super(orm, queryService);
	}

	private async validateTournament(tournamentId: string): Promise<void> {
		const tournament = await this.prisma.tournament.findUnique({
			where: { id: tournamentId, deletedAt: null },
		});

		if (!tournament) {
			throw new NotFoundException(`Tournament with ID ${tournamentId} not found`);
		}
	}

	private async validateBooking(
		bookingId: string,
		tournamentId?: string
	): Promise<void> {
		const booking = await this.prisma.booking.findUnique({
			where: { id: bookingId, deletedAt: null },
		});

		if (!booking) {
			throw new NotFoundException(`Booking with ID ${bookingId} not found`);
		}

		if (tournamentId && booking.tournamentId && booking.tournamentId !== tournamentId) {
			throw new BadRequestException(
				`Booking ${bookingId} belongs to another tournament`
			);
		}
	}

	private async validateParticipants(
		tournamentId: string,
		participants?: TournamentMatchParticipantInputDto[]
	): Promise<void> {
		if (!participants?.length) {
			return;
		}

		const participantIds = participants.map(participant => participant.participantId);
		const existingParticipants = await this.prisma.tournamentParticipant.findMany({
			where: {
				tournamentId,
				id: { in: participantIds },
			},
			select: { id: true },
		});

		if (existingParticipants.length !== participantIds.length) {
			throw new NotFoundException(
				'One or more participants do not belong to this tournament'
			);
		}
	}

	private async getMatchById(id: string) {
		return await this.prisma.tournamentMatch.findUnique({
			where: { id, deletedAt: null },
		});
	}

	protected async validateEntity(
		data: CreateTournamentMatchDto | UpdateTournamentMatchDto,
		id?: string
	): Promise<void> {
		const tournamentId =
			'tournamentId' in data && data.tournamentId
				? data.tournamentId
				: id
					? (await this.getMatchById(id))?.tournamentId
					: undefined;

		if (!tournamentId) {
			throw new BadRequestException('Tournament ID is required');
		}

		await this.validateTournament(tournamentId);

		if ('bookingId' in data && data.bookingId) {
			await this.validateBooking(data.bookingId, tournamentId);
		}

		if ('participants' in data) {
			await this.validateParticipants(tournamentId, data.participants);
		}
	}

	protected async validateId(id: number | string): Promise<void> {
		if (typeof id !== 'string') {
			throw new BadRequestException('TournamentMatch id must be a string');
		}
		const match = await this.getMatchById(id);
		if (!match) {
			throw new NotFoundException(`Tournament match ${id} not found`);
		}
	}

	protected async parseData(
		data: Partial<TournamentMatchEntity & { participants?: TournamentMatchParticipantInputDto[] }>
	): Promise<Partial<TournamentMatchEntity>> {
		const { participants: _participants, ...rest } = data;
		if (rest.scheduledAt && typeof rest.scheduledAt === 'string') {
			rest.scheduledAt = new Date(rest.scheduledAt);
		}
		return rest;
	}

	private async syncParticipants(
		matchId: string,
		participants?: TournamentMatchParticipantInputDto[]
	): Promise<void> {
		if (typeof participants === 'undefined') {
			return;
		}

		await this.prisma.tournamentMatchParticipant.deleteMany({
			where: { matchId },
		});

		if (!participants.length) {
			return;
		}

		await this.prisma.tournamentMatchParticipant.createMany({
			data: participants.map((participant, index) => ({
				matchId,
				tournamentParticipantId: participant.participantId,
				position: participant.position ?? index + 1,
				seed: participant.seed ?? null,
				teamName: participant.teamName ?? null,
			})),
		});
	}

	protected async afterCreate(
		data: CreateTournamentMatchDto,
		entity: TournamentMatchEntity
	): Promise<void> {
		await this.syncParticipants(entity.id, data.participants);
	}

	protected async afterUpdate(
		data: UpdateTournamentMatchDto,
		entity: TournamentMatchEntity
	): Promise<void> {
		await this.syncParticipants(entity.id, data.participants);
	}

	async getScheduleByTournament(tournamentId: string) {
		await this.validateTournament(tournamentId);

		const tournament = await this.prisma.tournament.findUnique({
			where: { id: tournamentId },
			select: { format: true },
		});

		const matches = await this.prisma.tournamentMatch.findMany({
			where: { tournamentId, deletedAt: null },
			include: {
				booking: {
					include: {
						court: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				participants: {
					include: {
						participant: {
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
						},
					},
				},
			},
			orderBy: [
				{ roundOrder: 'asc' },
				{ scheduledAt: 'asc' },
				{ createdAt: 'asc' },
			],
		});

		const formattedMatches: ScheduleMatch[] = matches.map(match => {
			const scheduledAt =
				match.scheduledAt ??
				match.booking?.startTime ??
				(match.booking ? match.booking.startTime : null);

			const court: ScheduleCourt = match.booking?.court
				? {
						id: match.booking.court.id,
						name: match.booking.court.name,
					}
				: null;

			const participants: ScheduleParticipant[] = match.participants.map(entry => {
				const playerName =
					entry.participant?.user.person?.name ??
					entry.participant?.user.email ??
					'Participante';
				return {
					id: entry.tournamentParticipantId,
					teamName: entry.teamName ?? playerName,
					seed: entry.seed ?? null,
					players: entry.participant
						? [
								{
									id: entry.participant.user.id,
									name: playerName,
								},
							]
						: [],
				};
			});

			return {
				id: match.id,
				tournamentId: match.tournamentId,
				round: match.round,
				roundOrder: match.roundOrder,
				stageType: match.stageType,
				groupName: match.groupName,
				modality: match.modality,
				matchFormat: match.matchFormat,
				status: match.status,
				scheduledAt,
				court,
				participants,
				winnerParticipantId: match.winnerParticipantId,
				scoreSummary: match.scoreSummary,
			};
		});

		return {
			format: tournament?.format ?? 'knockout',
			matches: formattedMatches,
		};
	}
}

