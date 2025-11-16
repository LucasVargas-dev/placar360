import { QueryArguments, PrismaModel } from './utils/index.js';
import DefaultEntity from './defaultEntity.js';
import { Inject, Optional, forwardRef } from '@nestjs/common';
import {
	Propagation,
	Transactional,
	TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

/**
 *
 */
export default abstract class ORM<T extends DefaultEntity> {
	private model: PrismaModel;

	@Inject(TransactionHost)
	@Optional()
	private readonly txHost?: TransactionHost<TransactionalAdapterPrisma>;

	// Note: PrismaService will be injected by subclasses
	protected prismaClient: any;

	/**
	 * Set the Prisma client (should be called by subclasses)
	 */
	protected setPrismaClient(prisma: any): void {
		this.prismaClient = prisma;
	}

	/**
	 * Initializes the ORM instance
	 */
	constructor() {
		this.model = this.getModelName();
	}

	/**
	 * Gets a single entity by its unique identifiers
	 * @param {QueryArguments} args - The conditions to be used in the query
	 *
	 * @returns {Promise | null} - The entity that matches the conditions
	 */
	@Transactional<TransactionalAdapterPrisma>(Propagation.Required)
	async findUnique(args: QueryArguments): Promise<T | null> {
		return await this.getClient().findUnique(args);
	}

	/**
	 * Gets the first entity that matches the conditions
	 * @param {QueryArguments} args - The conditions to be used in the query
	 *
	 * @returns {Promise | null} - The entity that matches the conditions
	 */
	@Transactional<TransactionalAdapterPrisma>(Propagation.Required)
	async findFirst(args: QueryArguments): Promise<T | null> {
		return await this.getClient().findFirst(args);
	}

	/**
	 * Returns all entities that match the conditions
	 * @param {QueryArguments} args - The conditions to be used in the query
	 *
	 * @returns {Promise} - The entities that match the conditions
	 */
	@Transactional<TransactionalAdapterPrisma>(Propagation.Required)
	async findMany(
		args: QueryArguments & { skip?: number; take?: number }
	): Promise<T[]> {
		return await this.getClient().findMany(args);
	}

	/**
	 * Counts the number of entities that match the conditions
	 * @param {QueryArguments} args - The conditions to be used in the query
	 *
	 * @returns {Promise} - The number of entities that match the conditions
	 */
	@Transactional<TransactionalAdapterPrisma>(Propagation.Required)
	async count(args: QueryArguments): Promise<number> {
		return await this.getClient().count({ where: args.where });
	}

	/**
	 * Creates a new entity
	 * @param {object} data - The data to be used in the creation of the entity
	 *
	 * @returns {Promise} - The newly created entity
	 */
	async create(data: Partial<T>): Promise<T> {
		return await this.getClient().create({ data });
	}

	/**
	 * Updates an entity
	 * @param {number} id - The unique identifier of the entity to be updated
	 * @param {object} data - The data to be used in the update of the entity
	 *
	 * @returns {Promise} - The updated entity
	 */
	@Transactional<TransactionalAdapterPrisma>(Propagation.Required)
	async update(id: number | string, data: Partial<T>): Promise<T> {
		return await this.getClient().update({ where: { id }, data });
	}

	/**
	 * Deletes an entity
	 * @param {number} id - The unique identifier of the entity to be deleted
	 *
	 * @returns {Promise} - The deleted entity
	 */
	@Transactional<TransactionalAdapterPrisma>(Propagation.Required)
	async delete(id: number | string): Promise<T> {
		return await this.getClient().delete({ where: { id } });
	}

	/**
	 * Deletes many entities accordingly to the args
	 * @param {QueryArguments} args - The query to search for the entities to delete
	 * @returns {Promise<number>} - The amount of entities deleted
	 */
	@Transactional<TransactionalAdapterPrisma>(Propagation.Required)
	async deleteMany(args: Pick<QueryArguments, 'where'>): Promise<number> {
		return (await this.getClient().deleteMany(args)).count;
	}

	/**
	 * Creates multiple entities in the database
	 * @param {object[]} data - The array of entities to be created
	 *
	 * @returns {Promise<number>} - The count of records created
	 */
	@Transactional<TransactionalAdapterPrisma>(Propagation.Required)
	async createMany(data: Partial<T>[]): Promise<T[]> {
		const result = await this.getClient().createMany({
			data,
			skipDuplicates: true,
		});
		return result;
	}

	/**
	 * Creates multiple entities in the database using the create function for each entity
	 * @param {object[]} data - The array of entities to be created
	 * @returns {Promise<T[]>} - The entities created
	 */
	@Transactional<TransactionalAdapterPrisma>(Propagation.Required)
	async createManySlow(data: Partial<T>[]): Promise<T[]> {
		return await Promise.all(data.map(entity => this.create(entity)));
	}

	/**
	 * Soft deletes an entity by setting deletedAt timestamp
	 * @param {number} id - The unique identifier of the entity to be soft deleted
	 * @returns {Promise<T>} - The soft deleted entity
	 */
	@Transactional<TransactionalAdapterPrisma>(Propagation.Required)
	async softDelete(id: number | string): Promise<T> {
		return await this.getClient().update({
			where: { id },
			data: { deletedAt: new Date() },
		});
	}

	/**
	 * Gets the entity client for the current transaction
	 * @returns {any} - The entity client for the current transaction
	 */
	getClient(): any {
		let client: any;
		
		// Try to use TransactionHost first (works with or without active transaction)
		if (this.txHost) {
			// TransactionHost should provide the client via tx property
			// When no transaction is active, tx should still point to the base client
			const tx = (this.txHost as any).tx;
			if (tx && tx[this.model]) {
				client = tx[this.model];
			} else {
				// If tx is not available, try to get the base client from the adapter
				const adapter = (this.txHost as any).adapter;
				if (adapter && adapter.prisma && adapter.prisma[this.model]) {
					client = adapter.prisma[this.model];
				}
			}
		}
		
		// Fallback to directly injected Prisma client
		if (!client && this.prismaClient && this.prismaClient[this.model]) {
			client = this.prismaClient[this.model];
		}
		
		if (!client) {
			throw new Error(
				`Cannot access Prisma client for model: ${this.model}. ` +
				`txHost: ${!!this.txHost}, prismaClient: ${!!this.prismaClient}, model: ${this.model}`
			);
		}
		
		return client;
	}

	/**
	 * Returns the prisma model name
	 * @returns {PrismaModel} - the prisma model name
	 */
	public abstract getModelName(): PrismaModel;

	/**
	 * Checks if the entity is general
	 * @returns {boolean}
	 */
	public abstract isGeneral(): boolean;
}
