/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Body,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	Put,
	Query,
	Param,
} from '@nestjs/common';
import DefaultService from './default.service.js';
import DefaultEntity from './defaultEntity.js';
import {
	type AllQueryParams,
	allQuerySchema,
	type QueryParams,
	querySchema,
	UserId,
	ZodValidationPipe,
	PaginationReturn,
} from './utils/index.js';
import { ZodSchema } from 'zod';

/**
 *
 */
export default abstract class DefaultController<
	T extends DefaultEntity,
	C extends Partial<T>,
	U extends Partial<T>,
> {

	/**
	 * Default Constructor
	 * @param {DefaultService} service - The Service used by the controller
	 */
	constructor(protected readonly service: DefaultService<T, C, U>) {}

	/**
	 * Returns all entities that match the conditions with pagination.
	 * @param {AllQueryParams} query - The query parameters.
	 *
	 * @returns {Promise<DefaultEntity[]>} - The people that match the conditions.
	 */
	@Get()
	@HttpCode(HttpStatus.OK)
	async all(
		@Query(new ZodValidationPipe(allQuerySchema))
		query: AllQueryParams
	): Promise<PaginationReturn<T> | T[]> {
		const { page, limit, args } = query;

		if (page && limit) {
			return await this.service.all(page, limit, args);
		} else {
			return await this.service.getAllByConditions(args);
		}
	}

	/**
	 * Returns an enterprise by conditions.
	 * @param {number} id - The id of the enterprise to be retrieved.
	 * @param {QueryParams} query - The query parameters.
	 *
	 * @returns {Promise<DefaultEntity> | null} - The enterprise that matches the conditions.
	 */
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async show(
		@Param('id') idParam: string,
		@Query(new ZodValidationPipe(querySchema)) query: QueryParams
	): Promise<T | null> {
		const { args } = query;
		return await this.service.show(this.normalizeId(idParam), args);
	}

	/**
	 * Creates a new enterprise.
	 * @template C
	 * @param {C} data - The enterprise data to be created.
	 * @param {QueryParams} query - Optional query parameters for includes
	 * @param {number} userId
	 *
	 * @returns {Promise<void>} - The created enterprise.
	 */
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(
		@Body() data: C,
		@Query(new ZodValidationPipe(querySchema)) query: QueryParams,
	): Promise<string | T | void> {
		try {
			console.log('data c', data);
			data = new ZodValidationPipe(this.createSchema()).transform(data) as C;
			const { args } = query;
			return await this.service.create(data, args);
		} catch (error: any) {
			console.error('DEFAULT-CONTROLLER', (error as Error).message, error);
			throw error;
		}
	}

	/**
	 * Updates an enterprise.
	 * @template U
	 * @param {number} id - The id of the enterprise to be updated.
	 * @param {U} data - The enterprise data to be updated.
	 * @param {QueryParams} query - Optional query parameters for includes
	 * @param {number} userId
	 *
	 * @returns {Promise<void>} - The updated enterprise.
	 */
	@Put(':id')
	@HttpCode(HttpStatus.OK)
	async update(
		@Param('id') idParam: string,
		@Body()
		data: U,
		@Query(new ZodValidationPipe(querySchema)) query: QueryParams,
	): Promise<T> {
		try {
			console.log('data u', data);
			data = new ZodValidationPipe(this.updateSchema()).transform(data) as U;
			const { args } = query;
			return await this.service.update(this.normalizeId(idParam), data, args);
		} catch (error: any) {
			console.error('DEFAULT-CONTROLLER', (error as Error).message, error);
			throw error;
		}
	}

	/**
	 * Deletes an enterprise.
	 * @param {number} id - The id of the enterprise to be deleted.
	 * @param {number} userId
	 *
	 * @returns {Promise<void>} - The deleted enterprise.
	 */
	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(
		@Param('id') idParam: string,
	): Promise<T> {
		return await this.service.delete(this.normalizeId(idParam));
	}

	/**
	 * Soft deletes an enterprise by id.
	 * @param {number} id - The id of the enterprise to be soft deleted.
	 * @param {number} userId
	 *
	 * @returns {Promise<T>} - The soft deleted enterprise.
	 */
	@Patch('soft-delete/:id')
	@HttpCode(HttpStatus.OK)
	async softDelete(
		@Param('id') idParam: string,
		@UserId() userId: number
	): Promise<T> {
		return await this.service.softDelete(this.normalizeId(idParam));
	}

	protected abstract createSchema(): ZodSchema;
	protected abstract updateSchema(): ZodSchema;

	private normalizeId(id: string): number | string {
		const parsed = Number(id);
		return Number.isNaN(parsed) ? id : parsed;
	}
}
