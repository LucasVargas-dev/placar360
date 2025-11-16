import { z } from 'zod';

const optionalNumberField = (options?: { min?: number }) =>
	z
		.preprocess(value => {
			if (value === '' || value === null || value === undefined) return undefined;
			const parsed = Number(value);
			return Number.isNaN(parsed) ? value : parsed;
		}, z.number({ invalid_type_error: 'Informe um número válido' }).min(options?.min ?? Number.MIN_SAFE_INTEGER))
		.optional();

export const CreateCourtSchema = z.object({
	clubId: z.string().min(1, 'Clube é obrigatório'),
	name: z.string().min(1, 'Nome é obrigatório'),
	sportType: z.string().min(1, 'Modalidade é obrigatória'),
	surface: z.string().optional(),
	defaultSlotMinutes: optionalNumberField({ min: 0 }),
	hourlyRate: optionalNumberField({ min: 0 }).nullable(),
	isActive: z.boolean().optional(),
});

export const UpdateCourtSchema = CreateCourtSchema.partial({
	clubId: true,
	name: false,
	sportType: false,
});

export type CreateCourtDto = z.infer<typeof CreateCourtSchema>;
export type UpdateCourtDto = z.infer<typeof UpdateCourtSchema>;



