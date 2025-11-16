import { type UseFormReturn } from 'react-hook-form';
import { Input, Select } from '@packages/components';
import { type CreateClubDto } from '@/entities/Club/clubSchema.js';
import { ClubResponse } from '@/entities/Club/Club.js';

interface ClubFormTabProps {
	form: UseFormReturn<CreateClubDto>;
	club?: ClubResponse | null;
}

export function ClubFormTab({ form }: ClubFormTabProps) {
	const {
		register,
		setValue,
		watch,
		formState: { errors },
	} = form;

	const isActiveValue = watch('isActive');
	const selectValue =
		typeof isActiveValue === 'boolean'
			? String(isActiveValue)
			: isActiveValue === 'false'
				? 'false'
				: 'true';

	return (
		<div className='mt-2 flex flex-col p-1'>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
				<Input
					label='Nome do Clube *'
					name='name'
					register={register}
					errorInfo={errors.name?.message}
					isFullWidth
				/>

				<Input
					label='Descrição'
					type='text'
					name='description'
					register={register}
					errorInfo={errors.description?.message}
					isFullWidth
				/>

				<Input
					label='Telefone'
					type='text'
					name='phone'
					register={register}
					errorInfo={errors.phone?.message}
					isFullWidth
				/>
			</div>

			<div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
				<Input
					label='Email'
					type='text'
					name='email'
					register={register}
					errorInfo={errors.email?.message}
					isFullWidth
				/>

				<Input
					label='Endereço'
					type='text'
					name='addressLine'
					register={register}
					errorInfo={errors.addressLine?.message}
					isFullWidth
				/>
			</div>

			<div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
				<Input
					label='Cidade'
					type='text'
					name='city'
					register={register}
					errorInfo={errors.city?.message}
					isFullWidth
				/>

				<Input
					label='Estado'
					type='text'
					name='state'
					register={register}
					errorInfo={errors.state?.message}
					isFullWidth
				/>
			</div>

			<div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
				<Input
					label='Fuso Horário'
					type='text'
					name='timezone'
					register={register}
					errorInfo={errors.timezone?.message}
					isFullWidth
				/>

				<Input
					label='Horário de Abertura'
					type='text'
					name='openTime'
					register={register}
					errorInfo={errors.openTime?.message}
					placeholder='HH:MM'
					isFullWidth
				/>

				<Input
					label='Horário de Fechamento'
					type='text'
					name='closeTime'
					register={register}
					errorInfo={errors.closeTime?.message}
					placeholder='HH:MM'
					isFullWidth
				/>
			</div>

			<div className='mt-4'>
				<Select
					label='Status'
					isFullWidth
					value={selectValue}
					onChangeValue={selectedValue => {
						const isTrue = String(selectedValue) === 'true';
						setValue('isActive', isTrue, {
							shouldDirty: true,
							shouldTouch: true,
							shouldValidate: true,
						});
					}}
					options={[
						{ value: 'true', label: 'Ativo' },
						{ value: 'false', label: 'Inativo' },
					]}
				/>
				{errors.isActive && (
					<p className='text-sm text-red-500 mt-1'>
						{errors.isActive.message}
					</p>
				)}
			</div>
		</div>
	);
}

