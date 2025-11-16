import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Toast } from '@packages/components';
import { useNavigate } from 'react-router-dom';
import { useZodForm } from '@/hooks';
import { clubService } from '@/entities/Club/club.service.js';
import { ClubResponse } from '@/entities/Club/Club.js';
import {
	CreateTournamentFormSchema,
	type CreateTournamentFormValues,
} from './schemas/createTournamentFormSchema.js';
import { TournamentDetailsTab } from './components/form/TournamentDetailsTab.js';
import { showApiErrorToast } from '@utils/errorHandling.js';
import { tournamentService } from '@/entities/Tournament/tournament.service.js';

type Option = {
	value: string;
	label: string;
};

export function TournamentCreatePage() {
	const navigate = useNavigate();
	const [clubs, setClubs] = useState<ClubResponse[]>([]);
	const [isLoadingClubs, setIsLoadingClubs] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useZodForm({
		schema: CreateTournamentFormSchema,
		defaultValues: {
			name: '',
			description: '',
			organizerId: '',
			cityId: undefined,
			sportType: '',
			startDate: undefined,
			endDate: undefined,
			registrationStart: undefined,
			registrationEnd: undefined,
			maxParticipants: undefined,
			status: '1',
			prizes: '',
			isActive: true,
			clubIds: [],
			selectedDates: [],
		},
	});

	const fetchClubs = useCallback(async () => {
		setIsLoadingClubs(true);
		try {
			const data = await clubService.getAllByConditions({
				where: {
					deletedAt: null,
					isActive: true,
				},
				orderBy: [{ name: 'asc' }],
				select: {
					id: true,
					name: true,
					city: true,
					state: true,
				},
			});
			setClubs(data);
		} catch (error: unknown) {
			showApiErrorToast({
				error,
				title: 'Erro ao carregar clubes',
				defaultMessage:
					'Não foi possível carregar a lista de clubes disponíveis.',
			});
		} finally {
			setIsLoadingClubs(false);
		}
	}, []);

	useEffect(() => {
		void fetchClubs();
	}, [fetchClubs]);

	const clubOptions: Option[] = useMemo(
		() =>
			clubs.map(club => ({
				value: club.id,
				label: `${club.name} • ${club.city ?? 'Cidade não informada'}`,
			})),
		[clubs]
	);

	const handleCancel = useCallback(() => {
		navigate('/tournaments');
	}, [navigate]);

	const handleSubmit = useCallback(
		async (values: CreateTournamentFormValues) => {
			setIsSubmitting(true);
			try {
				const payload = {
					name: values.name.trim(),
					description: values.description?.trim() || undefined,
					organizerId: values.organizerId.trim(),
					cityId: values.cityId,
					sportType: values.sportType,
					startDate: values.startDate?.toISOString() ?? '',
					endDate: values.endDate?.toISOString() ?? '',
					registrationStart: values.registrationStart?.toISOString() ?? '',
					registrationEnd: values.registrationEnd?.toISOString() ?? '',
					maxParticipants: values.maxParticipants,
					status: values.status,
					prizes: values.prizes?.trim() || undefined,
					isActive: values.isActive,
					clubIds: values.clubIds,
					selectedDates: values.selectedDates,
				};

				await tournamentService.create(payload);

				Toast.show({
					title: 'Torneio criado com sucesso',
					description: 'Os detalhes completos estarão disponíveis na listagem.',
					status: 'success',
				});
				navigate('/tournaments');
			} catch (error: unknown) {
				showApiErrorToast({
					error,
					title: 'Erro ao criar torneio',
					defaultMessage: 'Não foi possível criar o torneio. Tente novamente.',
				});
			} finally {
				setIsSubmitting(false);
			}
		},
		[navigate]
	);

	return (
		<div className='mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 text-secondary-900'>
			<header className='flex flex-col gap-2'>
				<h1 className='text-3xl font-bold'>Novo torneio</h1>
				<p className='text-sm text-secondary-600'>
					Preencha as informações principais para registrar o torneio no
					sistema.
				</p>
			</header>

			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className='flex flex-col gap-8 rounded-2xl border border-orange-300 bg-white p-6 shadow-sm'
			>
				<TournamentDetailsTab
					form={form}
					clubOptions={clubOptions}
					isLoadingClubs={isLoadingClubs}
				/>

				<div className='flex flex-col gap-4 rounded-xl border border-orange-200 bg-white p-4 text-sm text-secondary-700'>
					<p>
						As demais configurações (categorias, inscrições e chaves) estarão
						disponíveis nas próximas etapas do desenvolvimento.
					</p>
					<p className='font-semibold text-secondary-900'>
						Salve o rascunho para continuar o cadastro posteriormente.
					</p>
				</div>

				<div className='flex flex-wrap justify-end gap-3 border-t border-orange-200 pt-4'>
					<Button
						type='button'
						variant='secondary'
						className='border-orange-300 text-secondary-700 hover:bg-orange-50'
						onClick={handleCancel}
						isDisabled={isSubmitting}
					>
						Cancelar
					</Button>
					<Button
						type='submit'
						variant='secondary'
						className='border-orange-500 text-secondary-900 hover:bg-orange-50'
						isDisabled={isSubmitting}
					>
						Salvar rascunho
					</Button>
				</div>
			</form>
		</div>
	);
}

