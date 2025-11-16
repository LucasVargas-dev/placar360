import { type UseFormReturn } from 'react-hook-form';
import { Input, Select } from '@packages/components';
import { type CreateCourtDto } from '@/entities/Court/courtSchema.js';

type CourtFormFieldsProps = {
	form: UseFormReturn<CreateCourtDto>;
};

export function CourtFormFields({ form }: CourtFormFieldsProps) {
	const {
		register,
		setValue,
		watch,
		formState: { errors },
	} = form;

	const isActiveValue = watch('isActive');
	const statusValue =
		typeof isActiveValue === 'boolean'
			? String(isActiveValue)
			: isActiveValue === 'false'
				? 'false'
				: 'true';

	return (
		<div className='space-y-5 p-1'>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<Input
					label='Nome da Quadra *'
					name='name'
					register={register}
					errorInfo={errors.name?.message}
					isFullWidth
				/>

				<Input
					label='Modalidade *'
					name='sportType'
					register={register}
					errorInfo={errors.sportType?.message}
					placeholder='Ex: Padel, Tênis'
					isFullWidth
				/>
			</div>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<Input
					label='Superfície'
					name='surface'
					register={register}
					errorInfo={errors.surface?.message}
					placeholder='Ex: Sintética, Areia'
					isFullWidth
				/>

				<Input
					label='Tempo padrão (min)'
					name='defaultSlotMinutes'
					register={register}
					errorInfo={
						errors.defaultSlotMinutes?.message as string | undefined
					}
					placeholder='Ex: 60'
					isFullWidth
				/>
			</div>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<Input
					label='Valor por hora (R$)'
					name='hourlyRate'
					register={register}
					errorInfo={errors.hourlyRate?.message as string | undefined}
					placeholder='Ex: 120'
					isFullWidth
				/>

				<Select
					label='Status'
					isFullWidth
					value={statusValue}
					onChangeValue={value => {
						const isActive = String(value) === 'true';
						setValue('isActive', isActive, {
							shouldDirty: true,
							shouldTouch: true,
							shouldValidate: true,
						});
					}}
					options={[
						{ value: 'true', label: 'Ativa' },
						{ value: 'false', label: 'Inativa' },
					]}
				/>
			</div>
		</div>
	);
}



