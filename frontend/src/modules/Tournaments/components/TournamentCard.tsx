import { Button } from '@packages/components';
import {
	CalendarDays,
	CalendarRange,
	ClipboardPen,
	GitBranch,
	Users,
} from 'lucide-react';
import { TournamentSummary } from '../types.js';

type TournamentCardProps = {
	tournament: TournamentSummary;
	onViewParticipants: (tournamentId: string) => void;
	onViewBrackets: (tournamentId: string) => void;
	onRegister: (tournamentId: string) => void;
	onViewMatches: (tournamentId: string) => void;
};

const formatDate = (isoDate: string) => {
	if (!isoDate) return '-';
	const parsedDate = new Date(isoDate);
	if (Number.isNaN(parsedDate.getTime())) {
		return '-';
	}

	return parsedDate
		.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: 'short',
		})
		.replace('.', '')
		.toLowerCase();
};

export function TournamentCard({
	tournament,
	onViewParticipants,
	onViewBrackets,
	onRegister,
	onViewMatches,
}: TournamentCardProps) {
	const periodLabel = `De ${formatDate(tournament.startDate)} até ${formatDate(
		tournament.endDate
	)}`;

	const locationLabel = tournament.state
		? `${tournament.city}/${tournament.state}`
		: tournament.city || 'Local não informado';

	return (
		<div className='flex h-full flex-col gap-5 rounded-2xl border border-orange-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md'>
			<div className='space-y-2'>
				<span className='text-xs font-semibold uppercase tracking-wide text-orange-500'>
					{locationLabel}
				</span>
				<h3 className='text-xl font-semibold text-gray-900'>
					{tournament.title}
				</h3>
			</div>

			<div className='inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-gray-800'>
				<CalendarRange className='h-4 w-4 text-orange-500' />
				<span>{periodLabel}</span>
			</div>

			<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
				<Button
					type='button'
					variant='secondary'
					isFullWidth
					className='flex items-center justify-center gap-2 border-orange-500 text-gray-900 hover:bg-orange-50'
					onClick={() => onViewParticipants(tournament.id)}
				>
					<Users className='h-4 w-4' />
					Inscritos
				</Button>
				<Button
					type='button'
					variant='secondary'
					isFullWidth
					className='flex items-center justify-center gap-2 border-orange-500 text-gray-900 hover:bg-orange-50'
					onClick={() => onViewBrackets(tournament.id)}
				>
					<GitBranch className='h-4 w-4' />
					Chaves
				</Button>
				<Button
					type='button'
					variant='secondary'
					isFullWidth
					className='flex items-center justify-center gap-2 border-orange-500 text-gray-900 hover:bg-orange-50'
					onClick={() => onRegister(tournament.id)}
				>
					<ClipboardPen className='h-4 w-4' />
					Inscrição
				</Button>
				<Button
					type='button'
					variant='secondary'
					isFullWidth
					className='flex items-center justify-center gap-2 border-orange-500 text-gray-900 hover:bg-orange-50'
					onClick={() => onViewMatches(tournament.id)}
				>
					<CalendarDays className='h-4 w-4' />
					Jogos
				</Button>
			</div>
		</div>
	);
}

