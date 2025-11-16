import { useCallback, useEffect, useState } from 'react';
import { Loading, Toast } from '@packages/components';
import { useNavigate } from 'react-router-dom';
import { TournamentsHeader } from './components/TournamentsHeader.js';
import { TournamentsList } from './components/TournamentsList.js';
import { TournamentSummary } from './types.js';
import { tournamentService } from '@/entities/Tournament/tournament.service.js';
import { TournamentResponse } from '@/entities/Tournament/Tournament.js';
import { showApiErrorToast } from '@utils/errorHandling.js';

export function TournamentsPage() {
	const [tournaments, setTournaments] = useState<TournamentSummary[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const mapTournamentToSummary = useCallback(
		(tournament: TournamentResponse): TournamentSummary => {
			const primaryClub = tournament.clubHasTournaments?.[0]?.club;
			const cityName =
				tournament.city?.name ?? primaryClub?.city ?? 'Cidade não informada';
			const stateUf =
				tournament.city?.state?.uf ?? primaryClub?.state ?? undefined;

			return {
				id: tournament.id,
				title: tournament.name,
				city: cityName,
				state: stateUf,
				startDate: tournament.startDate,
				endDate: tournament.endDate,
			};
		},
		[]
	);

	const fetchTournaments = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await tournamentService.all(1, 30, {
				where: {
					deletedAt: null,
					isActive: true,
				},
				orderBy: [{ startDate: 'asc' }],
				include: {
					city: {
						include: {
							state: {
								select: {
									id: true,
									name: true,
									uf: true,
								},
							},
						},
					},
					clubHasTournaments: {
						where: {
							deletedAt: null,
						},
						select: {
							clubId: true,
							tournamentId: true,
							club: {
								select: {
									id: true,
									name: true,
									city: true,
									state: true,
								},
							},
						},
					},
				},
			});

			setTournaments(response.data.map(mapTournamentToSummary));
		} catch (error: unknown) {
			showApiErrorToast({
				error,
				title: 'Erro ao carregar torneios',
				defaultMessage: 'Não foi possível carregar a lista de torneios.',
			});
		} finally {
			setIsLoading(false);
		}
	}, [mapTournamentToSummary]);

	useEffect(() => {
		void fetchTournaments();
	}, [fetchTournaments]);

	const showNotImplementedToast = useCallback((message: string) => {
		Toast.show({
			title: 'Funcionalidade em desenvolvimento',
			description: message,
			status: 'info',
		});
	}, []);

	const handleAddTournament = useCallback(() => {
		navigate('/tournaments/new');
	}, [navigate]);

	const handleViewParticipants = useCallback(
		(tournamentId: string) => {
			navigate(`/tournaments/${tournamentId}?tab=participants`);
		},
		[navigate]
	);

	const handleViewBrackets = useCallback(
		(tournamentId: string) => {
			navigate(`/tournaments/${tournamentId}?tab=brackets`);
		},
		[navigate]
	);

	const handleRegister = useCallback(
		(tournamentId: string) => {
			showNotImplementedToast(
				`O fluxo de inscrição para o torneio ${tournamentId} ainda está em desenvolvimento.`
			);
		},
		[showNotImplementedToast]
	);

	const handleViewMatches = useCallback(
		(tournamentId: string) => {
			showNotImplementedToast(
				`A visualização de jogos do torneio ${tournamentId} será liberada em breve.`
			);
		},
		[showNotImplementedToast]
	);

	return (
		<div className='min-h-full bg-gray-50 pb-10'>
			<div className='mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8'>
				<section className='space-y-6 rounded-2xl border border-orange-200 bg-white p-6 shadow-sm'>
					<TournamentsHeader onAddClick={handleAddTournament} />
					{isLoading ? (
						<Loading
							message='Carregando torneios...'
							className='rounded-xl border border-orange-100 bg-white'
						/>
					) : (
						<TournamentsList
							tournaments={tournaments}
							onViewParticipants={handleViewParticipants}
							onViewBrackets={handleViewBrackets}
							onRegister={handleRegister}
							onViewMatches={handleViewMatches}
						/>
					)}
				</section>
			</div>
		</div>
	);
}

