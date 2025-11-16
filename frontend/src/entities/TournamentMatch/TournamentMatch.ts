export type TournamentMatchFormat = 'knockout' | 'swiss' | 'round_robin' | 'groups';

export interface TournamentMatchParticipant {
	id: string;
	teamName?: string | null;
	players: Array<{
		id: string;
		name: string;
	}>;
	seed?: number | null;
}

export interface TournamentMatchCourt {
	id: string;
	name: string;
}

export interface TournamentMatch {
	id: string;
	tournamentId: string;
	round: string;
	roundOrder: number;
	stageType: string;
	groupName?: string | null;
	modality?: string | null;
	matchFormat?: string | null;
	scheduledAt: string;
	durationMinutes?: number | null;
	status: 'scheduled' | 'in_progress' | 'finished' | 'cancelled';
	court?: TournamentMatchCourt | null;
	participants: TournamentMatchParticipant[];
	winnerParticipantId?: string | null;
	scoreSummary?: string | null;
}

export interface TournamentScheduleResponse {
	matches: TournamentMatch[];
	format: TournamentMatchFormat;
}

