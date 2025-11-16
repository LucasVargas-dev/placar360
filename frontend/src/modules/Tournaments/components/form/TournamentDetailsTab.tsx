import { useEffect, useMemo } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import {
	Input,
	MultiSelect,
	DatePicker,
	Checkbox,
	Select,
} from '@packages/components';
import { eachDayOfInterval, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CreateTournamentFormValues } from '../../schemas/createTournamentFormSchema.js';

type Option = {
	value: string;
	label: string;
};

interface TournamentDetailsTabProps {
	form: UseFormReturn<CreateTournamentFormValues>;
	clubOptions: Option[];
	isLoadingClubs: boolean;
}

const statusOptions: Option[] = [
	{ value: '1', label: 'Em planejamento' },
	{ value: '2', label: 'Inscrições abertas' },
	{ value: '3', label: 'Inscrições encerradas' },
	{ value: '4', label: 'Em andamento' },
	{ value: '5', label: 'Concluído' },
	{ value: '6', label: 'Cancelado' },
];

const sportTypeOptions: Option[] = [
	{ value: 'PADEL', label: 'Padel' },
	{ value: 'TENNIS', label: 'Tênis' },
	{ value: 'BEACH_TENNIS', label: 'Beach Tennis' },
	{ value: 'SQUASH', label: 'Squash' },
];

export function TournamentDetailsTab({
	form,
	clubOptions,
	isLoadingClubs,
}: TournamentDetailsTabProps) {
	const {
		register,
		control,
		watch,
		formState: { errors },
		setValue,
	} = form;

	useEffect(() => {
		register('sportType', { required: true });
		register('status', { required: true });
	}, [register]);

	const watchStartDate = watch('startDate');
	const watchEndDate = watch('endDate');
	const watchSportType = watch('sportType') ?? '';
	const watchStatus = watch('status') ?? '';

	const availableDateOptions = useMemo(() => {
		if (!watchStartDate || !watchEndDate) return [];
		try {
			const parsedStart =
				watchStartDate instanceof Date
					? watchStartDate
					: new Date(watchStartDate);
			const parsedEnd =
				watchEndDate instanceof Date ? watchEndDate : new Date(watchEndDate);

			if (Number.isNaN(parsedStart.getTime()) || Number.isNaN(parsedEnd.getTime())) {
				return [];
			}

			if (parsedStart > parsedEnd) return [];

			const days = eachDayOfInterval({
				start: parsedStart,
				end: parsedEnd,
			});

			return days.map(date => ({
				value: date.toISOString(),
				label: format(date, "dd 'de' MMMM (EEEE)", { locale: ptBR }),
			}));
		} catch (error) {
			console.error('Erro ao gerar dias do torneio', error);
			return [];
		}
	}, [watchStartDate, watchEndDate]);

	useEffect(() => {
		const currentSelected = form.getValues('selectedDates') ?? [];
		if (availableDateOptions.length === 0) {
			if (currentSelected.length > 0) {
				setValue('selectedDates', [], {
					shouldDirty: true,
					shouldTouch: true,
				});
			}
			return;
		}

		const validValues = new Set(availableDateOptions.map(option => option.value));
		const filtered = currentSelected.filter(value => validValues.has(value));

		if (filtered.length !== currentSelected.length) {
			setValue('selectedDates', filtered, {
				shouldDirty: true,
				shouldTouch: true,
			});
		}
	}, [availableDateOptions, form, setValue]);

	return (
		<div className='space-y-8'>
			<section className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<Input
					label='Nome do torneio *'
					name='name'
					register={register}
					errorInfo={errors.name?.message}
					isFullWidth
				/>

				<Select
					label='Esporte *'
					options={sportTypeOptions}
					name='sportType'
					control={control}
					placeholder='Selecione a modalidade'
					onChangeValue={value => {
						setValue('sportType', String(value), {
							shouldDirty: true,
							shouldTouch: true,
							shouldValidate: true,
						});
					}}
					value={watchSportType}
					isFullWidth
				/>
				{errors.sportType && (
					<p className='text-sm text-danger-500'>{errors.sportType.message}</p>
				)}

				<Input
					label='Organizador (ID) *'
					name='organizerId'
					register={register}
					errorInfo={errors.organizerId?.message}
					isFullWidth
					placeholder='Informe o ID do usuário organizador'
				/>

				<Input
					label='Cidade (ID) *'
					name='cityId'
					type='number'
					register={register}
					errorInfo={errors.cityId?.message}
					isFullWidth
					placeholder='Ex: 4314902'
				/>
			</section>

			<section className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<Select
					label='Status *'
					options={statusOptions}
					name='status'
					control={control}
					onChangeValue={value => {
						setValue('status', String(value), {
							shouldDirty: true,
							shouldTouch: true,
							shouldValidate: true,
						});
					}}
					value={watchStatus}
					isFullWidth
				/>
				{errors.status && (
					<p className='text-sm text-danger-500'>{errors.status.message}</p>
				)}

				<Input
					label='Máx. participantes'
					name='maxParticipants'
					type='number'
					register={register}
					errorInfo={errors.maxParticipants?.message}
					isFullWidth
					placeholder='Ex: 32'
				/>

				<Input
					label='Premiações'
					name='prizes'
					isFullWidth
					isTextarea
					register={register}
					errorInfo={errors.prizes?.message}
					placeholder='Detalhe a premiação do torneio'
				/>

				<Input
					label='Descrição'
					name='description'
					isFullWidth
					isTextarea
					register={register}
					errorInfo={errors.description?.message}
					placeholder='Descreva o torneio para participantes'
				/>
			</section>

			<section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
				<div>
					<DatePicker
						label='Início do torneio *'
						name='startDate'
						control={control}
						isFullWidth
					/>
					{errors.startDate && (
						<p className='mt-2 text-sm text-danger-500'>
							{errors.startDate.message}
						</p>
					)}
				</div>

				<div>
					<DatePicker
						label='Fim do torneio *'
						name='endDate'
						control={control}
						isFullWidth
					/>
					{errors.endDate && (
						<p className='mt-2 text-sm text-danger-500'>
							{errors.endDate.message}
						</p>
					)}
				</div>

				<div>
					<DatePicker
						label='Início das inscrições *'
						name='registrationStart'
						control={control}
						isFullWidth
					/>
					{errors.registrationStart && (
						<p className='mt-2 text-sm text-danger-500'>
							{errors.registrationStart.message}
						</p>
					)}
				</div>

				<div>
					<DatePicker
						label='Fim das inscrições *'
						name='registrationEnd'
						control={control}
						isFullWidth
					/>
					{errors.registrationEnd && (
						<p className='mt-2 text-sm text-danger-500'>
							{errors.registrationEnd.message}
						</p>
					)}
				</div>
			</section>

			<section className='space-y-4'>
				<div>
					<label className='block text-sm font-semibold text-secondary-900'>
						Selecione os dias de disputa *
					</label>
					<p className='text-xs text-secondary-600'>
						Escolha os dias específicos em que haverá partidas. Eles precisam
						estar dentro do intervalo informado acima.
					</p>
				</div>

				<MultiSelect
					name='selectedDates'
					control={control}
					isFullWidth
					options={availableDateOptions}
					placeholder={
						availableDateOptions.length === 0
							? 'Informe o período para liberar os dias disponíveis'
							: 'Selecione os dias do torneio'
					}
				/>
				{errors.selectedDates && (
					<p className='text-sm text-danger-500'>{errors.selectedDates.message}</p>
				)}
			</section>

			<section className='space-y-4'>
				<div className='flex flex-col gap-2'>
					<label className='text-sm font-semibold text-secondary-900'>
						Clubes relacionados *
					</label>
					<p className='text-xs text-secondary-600'>
						Selecione os clubes responsáveis ou anfitriões deste torneio.
					</p>
				</div>

				<MultiSelect
					name='clubIds'
					control={control}
					isFullWidth
					options={clubOptions}
					placeholder={
						isLoadingClubs
							? 'Carregando clubes...'
							: 'Selecione os clubes que participam do torneio'
					}
				/>
				{errors.clubIds && (
					<p className='text-sm text-danger-500'>{errors.clubIds.message}</p>
				)}
			</section>

			<section className='flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-4'>
				<div>
					<p className='text-sm font-semibold text-secondary-900'>
						Torneio ativo?
					</p>
					<p className='text-xs text-secondary-600'>
						Mantenha ativo para que apareça nas listagens públicas.
					</p>
				</div>
				<Checkbox name='isActive' control={control} />
				{errors.isActive && (
					<p className='text-sm text-danger-500'>{errors.isActive.message}</p>
				)}
			</section>
		</div>
	);
}

