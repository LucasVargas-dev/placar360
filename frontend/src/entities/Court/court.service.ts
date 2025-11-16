import { DefaultService } from '@utils/utils.js';
import { type CourtResponse } from './Court.js';
import { type CreateCourtDto, type UpdateCourtDto } from './courtSchema.js';

class CourtService extends DefaultService<
	CourtResponse,
	CreateCourtDto,
	UpdateCourtDto
> {
	constructor() {
		super('/courts');
	}
}

export const courtService = new CourtService();


