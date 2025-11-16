import { DefaultService } from '@utils/utils.js';
import { api } from '@services/api.js';
import {
	ClubScheduleResponse,
	ClubScheduleFilters,
	ClubSchedulePlayer,
	CreateScheduleBookingRequest,
} from './ClubSchedule.js';

export class ClubScheduleService extends DefaultService<
	ClubScheduleResponse,
	unknown,
	unknown
> {
	constructor() {
		super('/club-schedules');
	}

	async getClubSchedule(
		clubId: string,
		filters: ClubScheduleFilters = {}
	): Promise<ClubScheduleResponse> {
		const params = new URLSearchParams();

		if (filters.startDate) params.set('startDate', filters.startDate);
		if (filters.endDate) params.set('endDate', filters.endDate);
		if (filters.courtName) params.set('courtName', filters.courtName);
		if (filters.sportType) params.set('sportType', filters.sportType);

		const query = params.toString();
		const url = `${this.url}/club/${clubId}${query ? `?${query}` : ''}`;

		return await api
			.get(url)
			.then((response: { data: ClubScheduleResponse }) => response.data);
	}

	async getClubPlayers(clubId: string): Promise<ClubSchedulePlayer[]> {
		return await api
			.get(`${this.url}/club/${clubId}/players`)
			.then((response: { data: ClubSchedulePlayer[] }) => response.data);
	}

	async createBooking(
		clubId: string,
		courtId: string,
		payload: CreateScheduleBookingRequest
	) {
		return await api
			.post(`${this.url}/club/${clubId}/courts/${courtId}/bookings`, payload)
			.then(response => response.data);
	}
}

export const clubScheduleService = new ClubScheduleService();



