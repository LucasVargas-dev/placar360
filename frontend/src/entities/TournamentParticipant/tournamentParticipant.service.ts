import { DefaultService } from '@utils/utils.js';
import { api } from '@services/api.js';
import { TournamentParticipant } from './TournamentParticipant.js';

export class TournamentParticipantService extends DefaultService<
	TournamentParticipant,
	Partial<TournamentParticipant>,
	Partial<TournamentParticipant>
> {
	constructor() {
		super('/tournament-participants');
	}

	async getByTournament(tournamentId: string): Promise<TournamentParticipant[]> {
		return await api
			.get<TournamentParticipant[]>(`${this.url}/tournament/${tournamentId}`)
			.then(res => res.data);
	}
}

export const tournamentParticipantService = new TournamentParticipantService();

