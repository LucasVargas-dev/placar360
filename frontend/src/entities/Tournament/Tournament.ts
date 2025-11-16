export interface TournamentRequest {
	createdBy?: string;
	cityId?: number;
	organizerId: string;
	name: string;
	description?: string;
	sportType: string;
	startDate: string | Date;
	endDate: string | Date;
	registrationStart: string | Date;
	registrationEnd: string | Date;
	maxParticipants?: number;
	entryFee?: number;
	status: string;
	prizes?: string;
	format?: string;
	isActive?: boolean;
	clubIds?: string[];
	selectedDates?: string[];
}

export interface TournamentState {
	id: number;
	name: string;
	uf: string;
}

export interface TournamentCity {
	id: number;
	name: string;
	state?: TournamentState | null;
}

export interface TournamentClubSummary {
	id: string;
	name: string;
	city?: string | null;
	state?: string | null;
}

export interface TournamentClubLink {
	clubId: string;
	tournamentId: string;
	club?: TournamentClubSummary | null;
}

export interface TournamentResponse {
	id: string;
	cityId?: number | null;
	organizerId: string;
	name: string;
	description: string | null;
	sportType: string;
	startDate: string;
	endDate: string;
	registrationStart: string;
	registrationEnd: string;
	maxParticipants: number | null;
	entryFee?: number | null;
	status: string;
	prizes: string | null;
	format?: string | null;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	city?: TournamentCity | null;
	clubHasTournaments?: TournamentClubLink[];
}
