import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';

export const UserId = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): number => {
		const request = ctx.switchToHttp().getRequest();

		if (!request.user?.id) {
			throw new UnauthorizedException('User ID not found in request');
		}

		return request.user.id;
	}
);
