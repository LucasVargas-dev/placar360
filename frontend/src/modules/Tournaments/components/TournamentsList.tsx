import { TournamentSummary } from '../types.js';
import { TournamentCard } from './TournamentCard.js';

type TournamentsListProps = {
	tournaments: TournamentSummary[];
	onViewParticipants: (tournamentId: string) => void;
	onViewBrackets: (tournamentId: string) => void;
	onRegister: (tournamentId: string) => void;
	onViewMatches: (tournamentId: string) => void;
};

export function TournamentsList({
	tournaments,
	onViewParticipants,
	onViewBrackets,
	onRegister,
	onViewMatches,
}: TournamentsListProps) {
	if (!tournaments.length) {
		return (
			<div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-orange-200 bg-orange-50 py-16 text-center'>
				<p className='text-lg font-semibold text-gray-800'>
					Não encontramos torneios cadastrados.
				</p>
				<p className='max-w-md text-sm text-gray-600'>
					Assim que um torneio for criado, ele aparecerá aqui com todas as
					informações de inscrições, chaves e jogos.
				</p>
			</div>
		);
	}

	return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
			{tournaments.map(tournament => (
				<TournamentCard
					key={tournament.id}
					tournament={tournament}
					onViewParticipants={onViewParticipants}
					onViewBrackets={onViewBrackets}
					onRegister={onRegister}
					onViewMatches={onViewMatches}
				/>
			))}
		</div>
	);
}

