import { ClubResponse, ClubRequest } from './Club.js';
import { DefaultService } from '@utils/utils.js';
import { UpdateClubDto } from './clubSchema.js';

export class ClubService extends DefaultService<
	ClubResponse,
	ClubRequest,
	UpdateClubDto
> {
	constructor() {
		super('/clubs');
	}
}

export const clubService = new ClubService();

