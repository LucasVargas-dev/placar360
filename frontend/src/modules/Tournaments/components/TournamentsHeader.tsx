import { Button } from '@packages/components';
import { Plus } from 'lucide-react';

interface TournamentsHeaderProps {
	onAddClick: () => void;
}

export function TournamentsHeader({ onAddClick }: TournamentsHeaderProps) {
	return (
		<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
			<div className='space-y-1'>
				<p className='text-sm font-semibold uppercase tracking-wide text-orange-500'>
					Agenda competitiva
				</p>
				<h1 className='text-2xl font-bold text-gray-900'>Torneios</h1>
				<p className='text-sm text-gray-600'>
					Acompanhe os próximos torneios e gerencie inscrições, chaves e jogos.
				</p>
			</div>
			<Button
				type='button'
				onClick={onAddClick}
				variant='secondary'
				size='md'
				className='flex items-center justify-center gap-2 border-orange-500 text-gray-900 hover:bg-orange-50 md:w-auto'
			>
				<Plus className='h-4 w-4' />
				Novo torneio
			</Button>
		</div>
	);
}

