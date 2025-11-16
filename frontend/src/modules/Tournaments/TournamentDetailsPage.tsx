import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Loading } from '@packages/components';
import { ArrowLeft, CalendarDays, ClipboardPen, GitBranch, Users } from 'lucide-react';
import { TournamentResponse } from '@/entities/Tournament/Tournament.js';
import { tournamentService } from '@/entities/Tournament/tournament.service.js';
import { TournamentParticipant } from '@/entities/TournamentParticipant/TournamentParticipant.js';
import { tournamentParticipantService } from '@/entities/TournamentParticipant/tournamentParticipant.service.js';
import {
	TournamentMatch,
	TournamentMatchFormat,
} from '@/entities/TournamentMatch/TournamentMatch.js';
import { tournamentMatchService } from '@/entities/TournamentMatch/tournamentMatch.service.js';
import { showApiErrorToast } from '@utils/errorHandling.js';
import { TournamentTabs, TournamentTabKey, TournamentTab } from './components/TournamentTabs.js';
import { ParticipantsTab } from './components/ParticipantsTab.js';
import { RegistrationTab } from './components/RegistrationTab.js';
import { MatchesTab } from './components/MatchesTab.js';
import { BracketsTab } from './components/BracketsTab.js';

type FetchState<T> = {
	data: T;
	isLoading: boolean;
};

const DEFAULT_TABS: TournamentTab[] = [
	{ key: 'participants', label: 'Inscritos', icon: Users },
	{ key: 'brackets', label: 'Chaves', icon: GitBranch },
	{ key: 'registration', label: 'Inscrição', icon: ClipboardPen },
	{ key: 'matches', label: 'Jogos', icon: CalendarDays },
] as const;

export function TournamentDetailsPage() {
	const { tournamentId = '' } = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const initialTab = (searchParams.get('tab') as TournamentTabKey) ?? 'participants';

	const [activeTab, setActiveTab] = useState<TournamentTabKey>(initialTab);
	const [tournamentState, setTournamentState] = useState<FetchState<TournamentResponse | null>>({
		data: null,
		isLoading: true,
	});
	const [participantsState, setParticipantsState] = useState<FetchState<TournamentParticipant[]>>({
		data: [],
		isLoading: true,
	});
	const [matchesState, setMatchesState] = useState<
		FetchState<{
			format: TournamentMatchFormat;
			data: TournamentMatch[];
		}>
	>({
		data: {
			format: 'knockout',
			data: [],
		},
		isLoading: true,
	});

	useEffect(() => {
		setActiveTab(initialTab);
	}, [initialTab]);

	const loadTournament = useCallback(async () => {
		if (!tournamentId) {
			return;
		}

		setTournamentState(current => ({ ...current, isLoading: true }));
		try {
			const tournament = await tournamentService.show(tournamentId, {
				include: {
					city: {
						include: {
							state: {
								select: { id: true, name: true, uf: true },
							},
						},
					},
					clubHasTournaments: {
						where: { deletedAt: null },
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
			setTournamentState({ data: tournament, isLoading: false });
		} catch (error) {
			setTournamentState({ data: null, isLoading: false });
			showApiErrorToast({
				error,
				title: 'Erro ao carregar torneio',
				defaultMessage: 'Não foi possível carregar as informações do torneio.',
			});
		}
	}, [tournamentId]);

	const loadParticipants = useCallback(async () => {
		if (!tournamentId) {
			return;
		}

		setParticipantsState(current => ({ ...current, isLoading: true }));
		try {
			const participants = await tournamentParticipantService.getByTournament(
				tournamentId
			);
			setParticipantsState({ data: participants, isLoading: false });
		} catch (error) {
			setParticipantsState({ data: [], isLoading: false });
			showApiErrorToast({
				error,
				title: 'Erro ao carregar inscritos',
				defaultMessage:
					'Não foi possível buscar os jogadores inscritos neste torneio.',
			});
		}
	}, [tournamentId]);

	const loadMatches = useCallback(async () => {
		if (!tournamentId) {
			return;
		}
		setMatchesState(current => ({ ...current, isLoading: true }));
		try {
			const schedule = await tournamentMatchService.getScheduleByTournament(tournamentId);
			setMatchesState({
				data: {
					format: schedule.format ?? 'knockout',
					data: schedule.matches,
				},
				isLoading: false,
			});
		} catch (error) {
			setMatchesState({
				data: {
					format: 'knockout',
					data: [],
				},
				isLoading: false,
			});
			showApiErrorToast({
				error,
				title: 'Erro ao carregar agenda de jogos',
				defaultMessage:
					'Não foi possível carregar os confrontos deste torneio. Verifique se já existem partidas cadastradas.',
			});
		}
	}, [tournamentId]);

	useEffect(() => {
		void loadTournament();
	}, [loadTournament]);

	useEffect(() => {
		void loadParticipants();
	}, [loadParticipants]);

	useEffect(() => {
		void loadMatches();
	}, [loadMatches]);

	const handleTabChange = useCallback(
		(tab: TournamentTabKey) => {
			setActiveTab(tab);
			const nextSearchParams = new URLSearchParams(searchParams);
			nextSearchParams.set('tab', tab);
			setSearchParams(nextSearchParams, { replace: true });
		},
		[searchParams, setSearchParams]
	);

	const locationLabel = useMemo(() => {
		const primaryClub = tournamentState.data?.clubHasTournaments?.[0]?.club;
		const cityName = tournamentState.data?.city?.name ?? primaryClub?.city;
		const stateUf =
			tournamentState.data?.city?.state?.uf ?? primaryClub?.state ?? undefined;
		return cityName && stateUf
			? `${cityName}/${stateUf}`
			: cityName ?? 'Local não informado';
	}, [tournamentState.data]);

	const tournamentPeriod = useMemo(() => {
		if (!tournamentState.data?.startDate || !tournamentState.data?.endDate) {
			return null;
		}
		const formatter = (date: string) => {
			const parsed = new Date(date);
			if (Number.isNaN(parsed.getTime())) {
				return '-';
			}
			return parsed
				.toLocaleDateString('pt-BR', {
					day: '2-digit',
					month: 'short',
				})
				.replace('.', '')
				.toLowerCase();
		};
		return `De ${formatter(tournamentState.data.startDate)} até ${formatter(
			tournamentState.data.endDate
		)}`;
	}, [tournamentState.data]);

	const isLoadingPage =
		tournamentState.isLoading && !tournamentState.data;

	if (!tournamentId) {
		return (
			<div className='min-h-full bg-gray-50 pb-10'>
				<div className='mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
					<section className='rounded-2xl border border-orange-200 bg-white p-6 shadow-sm'>
						<p className='text-gray-900'>
							Não foi possível identificar o torneio solicitado.
						</p>
					</section>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-full bg-gray-50 pb-10'>
			<div className='mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
				<Button
					type='button'
					variant='secondary'
					className='mb-6 flex items-center gap-2 border-orange-500 bg-white text-gray-900 hover:bg-orange-50'
					onClick={() => navigate('/tournaments')}
				>
					<ArrowLeft className='h-4 w-4' />
					Voltar para torneios
				</Button>

				<section className='space-y-6 rounded-2xl border border-orange-200 bg-white p-6 shadow-sm'>
					{isLoadingPage ? (
						<Loading
							message='Carregando informações do torneio...'
							className='rounded-xl border border-orange-100 bg-white'
						/>
					) : tournamentState.data ? (
						<>
							<header className='space-y-4'>
								<div className='space-y-1'>
									<p className='text-xs font-semibold uppercase tracking-wide text-orange-500'>
										{locationLabel}
									</p>
									<h1 className='text-2xl font-semibold text-gray-900'>
										{tournamentState.data.name}
									</h1>
									<p className='text-sm text-gray-600'>
										{tournamentState.data.description ??
											'Acompanhe as etapas do torneio em tempo real.'}
									</p>
								</div>
								<div className='flex flex-wrap items-center gap-3'>
									<div className='inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-1 text-sm font-medium text-gray-900'>
										<CalendarDays className='h-4 w-4 text-orange-500' />
										<span>{tournamentPeriod}</span>
									</div>
									<div className='inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-1 text-sm font-medium text-gray-900'>
										<Users className='h-4 w-4 text-orange-500' />
										<span>
											{participantsState.data.length} participante
											{participantsState.data.length === 1 ? '' : 's'}
										</span>
									</div>
								</div>
							</header>

							<TournamentTabs
								tabs={DEFAULT_TABS}
								activeTab={activeTab}
								onTabChange={handleTabChange}
							/>

							<div className='rounded-2xl border border-orange-200 bg-white p-4'>
								{activeTab === 'participants' && (
									<ParticipantsTab
										participants={participantsState.data}
										isLoading={participantsState.isLoading}
										onRetry={loadParticipants}
									/>
								)}
								{activeTab === 'brackets' && tournamentState.data && (
									<BracketsTab
										tournament={tournamentState.data}
										participants={participantsState.data}
										isLoading={participantsState.isLoading}
										onRetry={loadParticipants}
									/>
								)}
								{activeTab === 'registration' && tournamentState.data && (
									<RegistrationTab
										tournament={tournamentState.data}
										participants={participantsState.data}
										isRefreshing={participantsState.isLoading}
										onRefreshParticipants={loadParticipants}
									/>
								)}
								{activeTab === 'matches' && (
									<MatchesTab
										matches={matchesState.data.data}
										formatType={matchesState.data.format}
										isLoading={matchesState.isLoading}
										onRefresh={loadMatches}
									/>
								)}
							</div>
						</>
					) : (
						<div className='rounded-xl border border-orange-200 bg-white p-6 text-center text-gray-900'>
							Não encontramos este torneio. Tente novamente mais tarde.
						</div>
					)}
				</section>
			</div>
		</div>
	);
}

