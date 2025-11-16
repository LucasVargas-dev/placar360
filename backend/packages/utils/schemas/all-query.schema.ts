import { z } from 'zod';

const orderDirection = z.enum(['asc', 'desc']);

const orderBySchema: z.ZodType = z.lazy(() =>
	z.record(z.union([orderDirection, orderBySchema]))
);

export const allQuerySchema = z.object({
	page: z.coerce.number().int().positive().optional(),
	limit: z.coerce.number().int().positive().optional(),
	args: z
		.object({
			where: z.record(z.string(), z.unknown()).optional(),
			orderBy: orderBySchema.array().optional(),
			take: z.number().int().optional(),
			include: z.record(z.string(), z.unknown()).optional(),
			select: z.record(z.string(), z.unknown()).optional(),
		})
		.strict()
		.optional()
		.default(() => ({}))
		.refine(
			args =>
				(args.include && !args.select) ||
				(args.select && !args.include) ||
				(!args.include && !args.select),
			{ message: "Must have either 'include' or 'select', but not both" }
		),
});
