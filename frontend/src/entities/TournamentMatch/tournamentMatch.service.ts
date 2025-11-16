import { DefaultService } from '@utils/utils.js';
import {
	TournamentMatch,
	TournamentScheduleResponse,
} from './TournamentMatch.js';
import { api } from '@services/api.js';

class TournamentMatchService extends DefaultService<
	TournamentMatch,
	Partial<TournamentMatch>,
	Partial<TournamentMatch>
> {
	constructor() {
		super('/tournament-matches');
	}

	async getScheduleByTournament(
		tournamentId: string
	): Promise<TournamentScheduleResponse> {
		return await api
			.get<TournamentScheduleResponse>(
				`${this.url}/tournament/${tournamentId}/schedule`
			)
			.then(res => res.data);
	}
}

export const tournamentMatchService = new TournamentMatchService();

