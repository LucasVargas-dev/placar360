import { type CourtResponse } from '../Court/Court.js';

export interface ClubRequest {
	createdBy?: string;
	name: string;
	description?: string;
	phone?: string;
	email?: string;
	addressLine?: string;
	city?: string;
	state?: string;
	timezone?: string;
	openTime?: string;
	closeTime?: string;
	isActive?: boolean;
}

export interface ClubResponse {
	id: string;
	createdBy: string | null;
	name: string;
	description: string | null;
	phone: string | null;
	email: string | null;
	addressLine: string | null;
	city: string | null;
	state: string | null;
	timezone: string | null;
	openTime: string | null;
	closeTime: string | null;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	courts?: ClubCourt[];
}

export type ClubCourt = CourtResponse;

