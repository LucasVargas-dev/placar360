import { z } from 'zod';

export const CreateTournamentFormSchema = z
	.object({
		name: z.string().min(1, 'Informe o nome do torneio'),
		description: z
			.string()
			.max(1000, 'Descrição muito longa')
			.optional()
			.or(z.literal('')),
		organizerId: z.string().min(1, 'Informe o organizador responsável'),
		cityId: z
			.coerce
			.number({
				required_error: 'Informe a cidade',
				invalid_type_error: 'Informe a cidade',
			})
			.int('Informe uma cidade válida')
			.positive('Informe uma cidade válida'),
		sportType: z.string().min(1, 'Informe o esporte do torneio'),
		startDate: z.date({
			required_error: 'Informe a data de início',
			invalid_type_error: 'Informe a data de início',
		}),
		endDate: z.date({
			required_error: 'Informe a data de término',
			invalid_type_error: 'Informe a data de término',
		}),
		registrationStart: z.date({
			required_error: 'Informe o início das inscrições',
			invalid_type_error: 'Informe o início das inscrições',
		}),
		registrationEnd: z.date({
			required_error: 'Informe o fim das inscrições',
			invalid_type_error: 'Informe o fim das inscrições',
		}),
		maxParticipants: z
			.coerce
			.number({
				invalid_type_error: 'Informe um número válido',
			})
			.int('Informe um número válido')
			.positive('Informe um número válido')
			.optional()
			.or(z.literal(''))
			.transform(value => (typeof value === 'number' ? value : undefined)),
		status: z.string().min(1, 'Selecione o status'),
		prizes: z
			.string()
			.max(500, 'Descrição de premiação muito longa')
			.optional()
			.or(z.literal('')),
		isActive: z.boolean().default(true),
		clubIds: z
			.array(z.string())
			.min(1, 'Selecione pelo menos um clube relacionado'),
		selectedDates: z
			.array(z.string())
			.min(1, 'Selecione ao menos um dia de disputa'),
	})
	.superRefine((data, ctx) => {
		if (data.startDate && data.endDate && data.startDate > data.endDate) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['endDate'],
				message: 'A data de término deve ser após o início',
			});
		}

		if (
			data.registrationStart &&
			data.registrationEnd &&
			data.registrationStart > data.registrationEnd
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['registrationEnd'],
				message: 'O fim das inscrições deve ser após o início',
			});
		}

		if (
			data.registrationEnd &&
			data.startDate &&
			data.registrationEnd >= data.startDate
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['registrationEnd'],
				message:
					'As inscrições devem ser encerradas antes da data de início do torneio',
			});
		}
	});

export type CreateTournamentFormValues = z.infer<
	typeof CreateTournamentFormSchema
>;

