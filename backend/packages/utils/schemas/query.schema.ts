import { z } from 'zod';

const orderBySchema = z.array(
	z
		.object({
			orderBy: z.enum(['asc', 'desc']),
		})
		.transform(obj => ({ [Object.keys(obj)[0]]: obj.orderBy }))
);

export const querySchema = z.object({
	args: z
		.object({
			where: z.record(z.string(), z.unknown()).optional(),
			orderBy: orderBySchema.optional(),
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
