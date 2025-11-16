import { Button } from '@packages/components';

interface ClubHeaderProps {
	onAddClick: () => void;
}

export function ClubHeader({ onAddClick }: ClubHeaderProps) {
	return (
		<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
			<div className='space-y-1'>
				<h1 className='text-2xl font-bold text-secondary-900'>Clubes</h1>
				<p className='text-sm text-secondary-600'>
					Gerencie os clubes cadastrados no sistema
				</p>
			</div>
			<Button
				onClick={onAddClick}
				variant='primary'
				size='md'
				className='w-full md:w-auto'
			>
				+ Novo Clube
			</Button>
		</div>
	);
}

