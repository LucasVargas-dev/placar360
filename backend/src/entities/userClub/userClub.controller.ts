import { Controller, Get, Param, Patch, Body, Delete } from '@nestjs/common';
import { UserClubService } from './userClub.service';
import { CreateUserClubSchema, UpdateUserClubSchema, CreateUserClubDto, UpdateUserClubDto } from './userClub.model';
import DefaultController from '../../../packages/default.controller.js';
import { UserClubEntity } from './userClub.orm.js';
import { ZodSchema } from 'zod';

@Controller('user-clubs')
export class UserClubController extends DefaultController<
	UserClubEntity,
	CreateUserClubDto,
	UpdateUserClubDto
> {
	constructor(private readonly userClubService: UserClubService) {
		super(userClubService);
	}

	/**
	 * Custom endpoint to get user clubs by user
	 */
	@Get('user/:userId')
	async getUserClubs(@Param('userId') userId: string) {
		return await this.userClubService.getUserClubs(userId);
	}

	/**
	 * Custom endpoint to get club users
	 */
	@Get('club/:clubId')
	async getClubUsers(@Param('clubId') clubId: string) {
		return await this.userClubService.getClubUsers(clubId);
	}

	/**
	 * Custom endpoint to get club teachers
	 */
	@Get('club/:clubId/teachers')
	async getClubTeachers(@Param('clubId') clubId: string) {
		return await this.userClubService.getClubTeachers(clubId);
	}

	/**
	 * Custom endpoint to get club staff
	 */
	@Get('club/:clubId/staff')
	async getClubStaff(@Param('clubId') clubId: string) {
		return await this.userClubService.getClubStaff(clubId);
	}

	/**
	 * Custom endpoint to get club members
	 */
	@Get('club/:clubId/members')
	async getClubMembers(@Param('clubId') clubId: string) {
		return await this.userClubService.getClubMembers(clubId);
	}

	/**
	 * Custom endpoint to get relationship stats
	 */
	@Get('club/:clubId/stats')
	async getRelationshipStats(@Param('clubId') clubId: string) {
		return await this.userClubService.getRelationshipStats(clubId);
	}

	/**
	 * Custom endpoint to get a specific user club relationship
	 */
	@Get(':userId/:clubId')
	async findOne(@Param('userId') userId: string, @Param('clubId') clubId: string) {
		return await this.userClubService.findOne(userId, clubId);
	}

	/**
	 * Custom endpoint to update a user club relationship
	 */
	@Patch(':userId/:clubId')
	async updateRelationship(
		@Param('userId') userId: string,
		@Param('clubId') clubId: string,
		@Body() updateUserClubDto: UpdateUserClubDto
	) {
		return await this.userClubService.updateRelationship(userId, clubId, updateUserClubDto);
	}

	/**
	 * Custom endpoint to remove a user club relationship
	 */
	@Delete(':userId/:clubId')
	async removeRelationship(@Param('userId') userId: string, @Param('clubId') clubId: string) {
		return await this.userClubService.removeRelationship(userId, clubId);
	}

	/**
	 * The zod create schema
	 */
	protected createSchema(): ZodSchema {
		return CreateUserClubSchema;
	}

	/**
	 * The zod update schema
	 */
	protected updateSchema(): ZodSchema {
		return UpdateUserClubSchema;
	}
}
