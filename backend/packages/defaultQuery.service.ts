import { QueryArguments, PaginationReturn } from './utils/index.js';
import ORM from './default.orm.js';
import DefaultEntity from './defaultEntity.js';
/**
 *
 */
export default abstract class DefaultQueryService<T extends DefaultEntity> {
	protected orm: ORM<T>;

	/**
	 * Initializes the DefaultService instance
	 * @param {ORM} orm - The ORM of T
	 */
	constructor(orm: ORM<T>) {
		this.orm = orm;
	}

	/**
	 * Returns all entities that match the conditions with pagination
	 * @param {number} page - The page number
	 * @param {number} limit - The number of entities per page
	 * @param {QueryArguments} args - The conditions to be used in the query
	 *
	 * @returns {Promise} - The entities that match the conditions
	 */
	all = async (
		page: number,
		limit: number,
		args?: QueryArguments
	): Promise<PaginationReturn<T>> => {
		const skip = (page - 1) * limit;
		const take = limit;

		await this.beforeAll(args);

		let data = await this.orm.findMany({ ...args, skip, take });

		data = await this.afterAll(data, args);

		const total = await this.orm.count(args ?? {});
		limit = limit > 0 ? limit : 1;
		return {
			data,
			meta: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		};
	};
	/**
	 * Returns all entities that match the conditions
	 * @param {QueryArguments} args - The conditions to be used in the query
	 *
	 * @returns {Promise} - The entities that match the conditions
	 */
	getAllByConditions = async (args?: QueryArguments): Promise<T[]> => {
		let data = await this.orm.findMany(args ?? {});
		return await this.afterAll(data, args);
	};
	/**
	 * Gets the entity with the id provided
	 * @param {number} id - The id of the entity to be retrieved
	 *
	 * @param {QueryArguments} args - The conditions to be used in the query
	 * @returns {Promise} - The entity that matches the id
	 */
	show = async (id: number | string, args?: QueryArguments): Promise<T | null> => {
		const formattedArgs = {
			...args,
			where: { ...(args?.where ?? {}), id: id } as any,
		};
		let data = await this.orm.findUnique(formattedArgs);
		if (data) {
			data = await this.afterShow(data, args);
		}
		return data;
	};
	/**
	 * Returns the entity that matches the conditions
	 * @param {QueryArguments} args - The conditions to be used in the query
	 *
	 * @returns {Promise} - The entity that matches the conditions
	 */
	getByConditions = async (args?: QueryArguments): Promise<T | null> => {
		let data = await this.orm.findFirst(args ?? {});
		if (data) {
			data = await this.afterShow(data, args);
		}
		return data;
	};

	/**
	 * Returns the entity by its UUID
	 * @param {string} uuid - The entitie's UUID
	 * @returns {Promise<object | null>} - The entity or null
	 */
	getByUUID = async (uuid: string): Promise<T | null> => {
		return await this.getByConditions({ where: { uuid } as any });
	};

	/**
	 * Before find many
	 * @param {object} _args
	 */
	protected async beforeAll(_args: QueryArguments | undefined) {}

	/**
	 * After find many
	 * @param {object[]} data - The array of entities retrived by the default function
	 * @param {object} _args
	 * @returns {Promise} - The array of entities
	 */
	protected async afterAll(
		data: T[],
		_args: QueryArguments | undefined
	): Promise<T[]> {
		return data;
	}

	/**
	 * After find one
	 * @param {object} data - The single entity retrived by the default function
	 * @param {object} _args
	 * @returns {Promise} - The entity
	 */
	protected async afterShow(
		data: T,
		_args: QueryArguments | undefined
	): Promise<T> {
		return data;
	}
}
