export interface CourtRequest {
	clubId: string;
	name: string;
	sportType: string;
	surface?: string;
	defaultSlotMinutes?: number;
	hourlyRate?: number | null;
	isActive?: boolean;
}

export interface CourtResponse {
	id: string;
	clubId: string;
	name: string;
	sportType: string;
	surface: string | null;
	defaultSlotMinutes: number;
	hourlyRate: number | null;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}



