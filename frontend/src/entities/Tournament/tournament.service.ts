import { DefaultService } from '@utils/utils.js';
import { TournamentResponse, TournamentRequest } from './Tournament.js';

export class TournamentService extends DefaultService<
	TournamentResponse,
	TournamentRequest,
	Partial<TournamentRequest>
> {
	constructor() {
		super('/tournaments');
	}
}

export const tournamentService = new TournamentService();
