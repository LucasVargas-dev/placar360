import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserSchema, UpdateUserSchema, CreateUserDto, UpdateUserDto } from './user.model';
import DefaultController from '../../../packages/default.controller.js';
import { UserEntity } from './user.orm.js';
import { ZodSchema } from 'zod';

@Controller('users')
export class UserController extends DefaultController<
	UserEntity,
	CreateUserDto,
	UpdateUserDto
> {
	constructor(private readonly userService: UserService) {
		super(userService);
	}

	/**
	 * Custom endpoint to get user by email
	 */
	@Get('email/:email')
	async findByEmail(@Param('email') email: string) {
		return await this.userService.findByEmail(email);
	}

	/**
	 * Custom endpoint to change user password
	 */
	@Patch(':id/password')
	async changePassword(
		@Param('id') id: string,
		@Body() body: { password: string },
	) {
		return await this.userService.changePassword(id, body.password);
	}

	/**
	 * The zod create schema
	 */
	protected createSchema(): ZodSchema {
		return CreateUserSchema;
	}

	/**
	 * The zod update schema
	 */
	protected updateSchema(): ZodSchema {
		return UpdateUserSchema;
	}
}
