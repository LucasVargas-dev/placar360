import { ZodObject, ZodRawShape } from 'zod';

// Types
export * from './types/all-query-params.js';
export * from './types/query-params.js';
export * from './types/query-arguments.js';
export * from './types/paginationReturn.js';
export * from './types/prismaModel.js';

// Schemas
export * from './schemas/all-query.schema.js';
export * from './schemas/query.schema.js';

// Re-export common utilities
export { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
export { UserId } from '../common/decorators/userId.decorator.js';
export { ParseInt } from '../common/decorators/parseInt.decorator.js';

/**
 * Strip transient properties from an object based on a Zod schema
 */
export function stripTransient<T extends ZodRawShape, S extends ZodObject<T>>(
	schema: S | null,
	data: any
): any {
	if (!schema) return data;
	const shape = schema.shape;
	const result: any = {};

	// Only include properties that exist in the schema shape
	Object.keys(data).forEach(key => {
		if (shape[key as keyof typeof shape]) {
			result[key] = data[key];
		}
	});

	return result;
}
