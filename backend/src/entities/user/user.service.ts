import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import DefaultService from '../../../packages/default.service.js';
import { UserEntity, UserORM } from './user.orm.js';
import { CreateUserDto, UpdateUserDto } from './user.model';
import { UserQueryService } from './user.query.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService extends DefaultService<
	UserEntity,
	CreateUserDto,
	UpdateUserDto
> {
	constructor(
		orm: UserORM,
		queryService: UserQueryService,
		@Inject(PrismaService) private readonly prisma: PrismaService
	) {
		super(orm, queryService);
	}

	/**
	 * Validate if email is unique
	 */
	private async validateEmailUnique(email: string, excludeId?: string): Promise<void> {
		const existingUser = await this.queryService.getByConditions({
			where: { email } as any,
		});

		if (existingUser && (!excludeId || existingUser.id !== excludeId)) {
			throw new ConflictException('Email already exists');
		}
	}

	/**
	 * Validates if the data is valid for the user
	 */
	protected async validateEntity(
		data: CreateUserDto | UpdateUserDto,
		id?: number | string
	): Promise<void> {
		if (data.email) {
			await this.validateEmailUnique(data.email, id as string | undefined);
		}
	}

	/**
	 * Validates if the id is valid for the user
	 */
	protected async validateId(id: number | string): Promise<void> {
		const userExists = await this.show(id);

		if (!userExists) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}
	}

	/**
	 * Override create to hash password
	 */
	async create(data: CreateUserDto, args?: any) {
		// Hash password
		const hashedPassword = await bcrypt.hash(data.password, 10);

		return await super.create({
			...data,
			password: hashedPassword,
		}, args);
	}

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
			include: {
				person: true,
				userHasRoles: {
					where: {
						deletedAt: null,
					},
					include: {
						role: {
							include: {
								permissions: {
									include: {
										permission: true,
									},
								},
							},
						},
					},
				},
			},
		});
	}

	async changePassword(id: string, newPassword: string) {
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		
		return this.prisma.user.update({
			where: { id },
			data: {
				password: hashedPassword,
				updatedAt: new Date(),
			},
		});
	}
}
