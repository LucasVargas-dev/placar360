export interface ClubScheduleSlot {
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
}

export interface ClubScheduleCourt {
	courtId: string;
	courtName: string;
	sportType: string;
	defaultSlotMinutes: number | null;
	hourlyRate: number | null;
	slots: ClubScheduleSlot[];
}

export interface ClubScheduleDay {
	date: string;
	courts: ClubScheduleCourt[];
}

export interface ClubScheduleResponse {
	club: {
		id: string;
		name: string;
		openTime: string | null;
		closeTime: string | null;
	};
	dateRange: {
		startDate: string;
		endDate: string;
	};
	schedule: ClubScheduleDay[];
}

export interface ClubScheduleFilters {
	startDate?: string;
	endDate?: string;
	courtName?: string;
	sportType?: string;
}

export interface ClubSchedulePlayer {
	id: string;
	name: string | null;
	email: string | null;
	relationshipType: string | null;
}

export interface CreateScheduleBookingRequest {
	userId: string;
	startTime: string;
	endTime: string;
	type?: number;
	notes?: string;
}



