export interface TournamentParticipantUser {
	id: string;
	email: string;
	name?: string | null;
}

export interface TournamentParticipant {
	id: string;
	tournamentId: string;
	userId: string;
	status: string;
	registeredAt: string;
	user?: TournamentParticipantUser | null;
}

