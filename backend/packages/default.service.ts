import ORM from './default.orm.js';
import { PrismaModel, type QueryArguments, PaginationReturn, stripTransient } from './utils/index.js';
import DefaultEntity from './defaultEntity.js';
import DefaultQueryService from './defaultQuery.service.js';
import { Propagation, Transactional } from '@nestjs-cls/transactional';
import { ZodObject, ZodRawShape } from 'zod';
/**
 *
 */
export default abstract class DefaultService<
	T extends DefaultEntity,
	C extends Partial<T>,
	U extends Partial<T>,
> {
	public queryService: DefaultQueryService<T>;
	protected model: PrismaModel;
	protected orm: ORM<T>;

	/**
	 * Initializes the DefaultService instance
	 * @param {ORM} orm - The ORM
	 * @param {DefaultQueryService} queryService - The default query service to be used in order to execute select queries
	 */
	constructor(orm: ORM<T>, queryService: DefaultQueryService<T>) {
		this.orm = orm;
		this.model = this.orm.getModelName();
		this.queryService = queryService;
	}


	/**
	 * Returns all entities that match the conditions with pagination
	 * @param {number} page - The page number
	 * @param {number} limit - The number of entities per page
	 * @param {QueryArguments} args - The conditions to be used in the query
	 *
	 * @returns {Promise} - The entities that match the conditions
	 */
	@Transactional(Propagation.Required)
	async all(
		page: number,
		limit: number,
		args?: QueryArguments
	): Promise<PaginationReturn<T>> {
		return this.queryService.all(page, limit, args);
	}
	/**
	 * Returns all entities that match the conditions
	 * @param {QueryArguments} args - The conditions to be used in the query
	 *
	 * @returns {Promise} - The entities that match the conditions
	 */
	@Transactional(Propagation.Required)
	async getAllByConditions(args?: QueryArguments): Promise<T[]> {
		return await this.queryService.getAllByConditions(args);
	}
	/**
	 * Gets the entity with the id provided
	 * @param {number} id - The id of the entity to be retrieved
	 * @param {QueryArguments} args - The conditions to be used in the query
	 *
	 * @returns {Promise} - The entity that matches the id
	 */
	@Transactional(Propagation.Required)
	async show(id: number | string, args?: QueryArguments): Promise<T | null> {
		return await this.queryService.show(id, args);
	}
	/**
	 * Returns the entity that matches the conditions
	 * @param {QueryArguments} args - The conditions to be used in the query
	 *
	 * @returns {Promise} - The entity that matches the conditions
	 */
	@Transactional(Propagation.Required)
	async getByConditions(args?: QueryArguments): Promise<T | null> {
		return await this.queryService.getByConditions(args);
	}

	/**
	 * Creates a new entity.
	 * @param {object} data - The entity data to be created.
	 * @param {QueryArguments} args - The conditions to be used in the query
	 *
	 * @returns {Promise<object>} - The created entity.
	 */
	@Transactional(Propagation.Required)
	async create(data: C, args?: QueryArguments): Promise<T> {
		await this.validateEntity(data);

		const parsedData = await this.parseData(data);

		await this.beforeCreate(data);

		const schema = this.createSchema();

		const entity = await this.orm.create({
			...(schema
				? (stripTransient(schema, parsedData) as Partial<T>)
				: parsedData),
		});

		await this.afterCreate(data, entity);

		if (args && entity.id) {
			return (await this.queryService.show(entity.id, args)) ?? entity;
		}

		return entity;
	}

	/**
	 * Creates many entities.
	 * @param {object[]} dataList - The entities data to be created.
	 * @returns {Promise<object[]>} - The created entities.
	 */
	@Transactional(Propagation.Required)
	async createMany(dataList: C[]): Promise<T[]> {
		for (const data of dataList) {
			await this.validateEntity(data);
		}

		const parsedDataList = await Promise.all(
			dataList.map(data => this.parseData(data))
		);

		for (const [_i, data] of dataList.entries()) {
			await this.beforeCreate(data);
		}

		const entities = await this.orm.createMany(
			dataList.map((data, i) => ({
				...parsedDataList[i],
			}))
		);

		for (const [i, entity] of entities.entries()) {
			await this.afterCreate(dataList[i], entity);
		}

		return entities;
	}

	/**
	 * Updates an enterprise.
	 * @param {number} id - The id of the enterprise to be updated.
	 * @param {object} data - The enterprise data to be updated.
	 * @param {QueryArguments} args - The conditions to be used in the query
	 *
	 * @returns {Promise<object>} - The updated enterprise.
	 */
	@Transactional(Propagation.Required)
	async update(id: number | string, data: U, args?: QueryArguments): Promise<T> {
		await this.validateId(id);
		await this.validateEntity(data, id);

		const parsedData = await this.parseData(data);

		await this.beforeUpdate(data);

		const schema = this.updateSchema();

		const entity = await this.orm.update(
			id,
			schema ? (stripTransient(schema, parsedData) as Partial<T>) : parsedData
		);

		await this.afterUpdate(data, entity);

		if (args && entity.id) {
			return (await this.queryService.show(entity.id, args)) ?? entity;
		}

		return entity;
	}

	/**
	 * Deletes an entity (permanently removes from database).
	 * @param {number} id - The id of the entity to be deleted.
	 *
	 * @returns {Promise} - The deleted entity
	 */
	@Transactional(Propagation.Required)
	async delete(id: number | string): Promise<T> {
		await this.validateId(id);

		await this.beforeDelete(id);

		const entity = await this.orm.delete(id);

		await this.afterDelete(id);

		return entity;
	}

	/**
	 * Soft deletes an entity by setting deletedAt timestamp.
	 * @param {number} id - The id of the entity to be soft deleted.
	 *
	 * @returns {Promise} - The soft deleted entity
	 */
	@Transactional(Propagation.Required)
	async softDelete(id: number | string): Promise<T> {
		await this.validateId(id);

		await this.beforeSoftDelete(id);

		const entity = await this.orm.softDelete(id);

		await this.afterSoftDelete(id);

		return entity;
	}

	/**
	 * Deletes many entities.
	 * @param {QueryArguments} args - Query arguments to search for the entities to be deleted
	 * @returns {Promise<number>} - The count of entities deleted
	 */
	@Transactional(Propagation.Required)
	async deleteMany(args: Pick<QueryArguments, 'where'>): Promise<number> {
		const idsToDelete = (
			await this.getAllByConditions({
				...args,
				select: { id: true },
				distinct: ['id'],
			})
		).map(entity => entity.id);

		await this.beforeDeleteMany(idsToDelete, args);

		const count = await this.orm.deleteMany({
			...args,
		});

		await this.afterDeleteMany(idsToDelete, args);

		return count;
	}

	/**
	 *	Returns the model used by the service
	 *
	 * @returns {string} - The model
	 */
	getModel(): string {
		return this.model;
	}

	/**
	 * Checks if the orm is general
	 * @returns {boolean}
	 */
	isGeneral(): boolean {
		return this.orm.isGeneral();
	}

	/**
	 * Abstract method to validate if an entity exists.
	 * Classes extending DefaultService must implement this method.
	 * @param {number} id - The ID of the entity to validate.
	 * @returns {Promise<boolean>} - Whether the entity exists.
	 */
	protected abstract validateEntity(data: C | U, id?: number | string): Promise<void>;

	/**
	 * Abstract method to validate if an entity exists.
	 * @param {number} id - The ID of the entity to validate.
	 * @returns {Promise<void>} - Whether the entity exists.
	 */
	protected abstract validateId(id: number | string): Promise<void>;

	/**
	 * Before create
	 * @param {object} _data
	 */
	protected async beforeCreate(_data: C): Promise<void> {}

	/**
	 * Before update
	 * @param {object} _data
	 * @param {number} _id
	 */
	protected async beforeUpdate(_data: U, _id?: number | string): Promise<void> {}

	/**
	 * Before delete
	 * @param {number} _id
	 */
	protected async beforeDelete(_id: number | string): Promise<void> {}

	/**
	 * Before soft delete
	 * @param {number} _id
	 */
	protected async beforeSoftDelete(_id: number | string): Promise<void> {}

	/**
	 * Before delete many
	 * @param {number} _idsToDelete
	 * @param {QueryArguments} _args
	 */
	protected async beforeDeleteMany(
		_idsToDelete: (number | string)[],
		_args: QueryArguments
	): Promise<void> {}

	/**
	 * After create
	 * @param {object} _data - the entity requested to be created
	 * @param {object} _newData - the entity returned by the orm after create
	 */
	protected async afterCreate(_data: C, _newData: T): Promise<void> {}

	/**
	 * After update
	 * @param {object} _data - the entity requested to be updated
	 * @param {object} _newData - the entity returned by the orm after update
	 */
	protected async afterUpdate(_data: U, _newData: T): Promise<void> {}

	/**
	 * After delete
	 * @param {number} _id - of the deleted entity
	 */
	protected async afterDelete(_id: number | string): Promise<void> {}

	/**
	 * After soft delete
	 * @param {number} _id - of the deleted entity
	 */
	protected async afterSoftDelete(_id: number | string): Promise<void> {}

	/**
	 * Used to parse the data before passing it to orm create
	 * @returns {S | null}
	 */
	protected createSchema<
		T extends ZodRawShape,
		S extends ZodObject<T>,
	>(): S | null {
		return null;
	}
	/**
	 * Used to parse the data before passing it to orm update
	 * @returns {S | null}
	 */
	protected updateSchema<
		T extends ZodRawShape,
		S extends ZodObject<T>,
	>(): S | null {
		return null;
	}

	/**
	 * After delete many
	 * @param {number} _idsToDelete
	 * @param {QueryArguments} _args
	 */
	protected async afterDeleteMany(
		_idsToDelete: (number | string)[],
		_args: QueryArguments
	): Promise<void> {}

	/**
	 * Parse data
	 * @param {object}_data
	 * @returns {Promise<object>}
	 */
	protected async parseData(
		_data: Partial<T & Record<string, unknown>>
	): Promise<Partial<T & Record<string, unknown>>> {
		return Promise.resolve(_data);
	}
}
