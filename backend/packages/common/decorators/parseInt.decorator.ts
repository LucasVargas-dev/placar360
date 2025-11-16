import {
	createParamDecorator,
	ExecutionContext,
	BadRequestException,
} from '@nestjs/common';

export const ParseInt = createParamDecorator(
	(data: string, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const id = parseInt(request.params[data], 10);
		if (isNaN(id)) {
			throw new BadRequestException(`${data} must be a valid number`);
		}
		return id;
	}
);
