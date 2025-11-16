import { useMemo, useState } from 'react';
import { Button, Loading } from '@packages/components';
import { Search, RefreshCw } from 'lucide-react';
import {
	TournamentMatch,
	TournamentMatchFormat,
} from '@/entities/TournamentMatch/TournamentMatch.js';
import { format } from 'date-fns';

type MatchesTabProps = {
	matches: TournamentMatch[];
	formatType: TournamentMatchFormat;
	isLoading: boolean;
	onRefresh: () => void;
};

const formatHour = (isoDate?: string | Date | null) => {
	if (!isoDate) {
		return null;
	}
	const parsed = new Date(isoDate);
	if (Number.isNaN(parsed.getTime())) {
		return null;
	}
	return parsed.toLocaleTimeString('pt-BR', {
		hour: '2-digit',
		minute: '2-digit',
	});
};

const formatDate = (isoDate: string) => {
	const parsed = new Date(isoDate);
	if (Number.isNaN(parsed.getTime())) {
		return '--/--/----';
	}
	return format(parsed, 'dd/MM/yyyy');
};

const formatDateShort = (isoDate: string) => {
	const parsed = new Date(isoDate);
	if (Number.isNaN(parsed.getTime())) {
		return '--/--';
	}
	return format(parsed, 'dd/MM');
};

export function MatchesTab({
	matches,
	formatType,
	isLoading,
	onRefresh,
}: MatchesTabProps) {
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCourt, setSelectedCourt] = useState<string | null>(null);

	// Extrai datas únicas dos jogos
	const uniqueDates = useMemo(() => {
		const dates = matches
			.filter(match => match.scheduledAt)
			.map(match => {
				const date = new Date(match.scheduledAt);
				return date.toDateString();
			});
		return Array.from(new Set(dates)).sort(
			(a, b) => new Date(a).getTime() - new Date(b).getTime()
		);
	}, [matches]);

	// Extrai quadras únicas
	const uniqueCourts = useMemo(() => {
		const courts = matches
			.map(match => match.court?.name)
			.filter((value): value is string => Boolean(value));
		return Array.from(new Set(courts)).sort();
	}, [matches]);

	// Filtra jogos por data, busca e quadra
	const filteredMatches = useMemo(() => {
		return matches.filter(match => {
			// Filtro por data
			if (selectedDate) {
				const matchDate = match.scheduledAt
					? new Date(match.scheduledAt).toDateString()
					: null;
				if (matchDate !== selectedDate) {
					return false;
				}
			}

			// Filtro por quadra
			if (selectedCourt && match.court?.name !== selectedCourt) {
				return false;
			}

			// Filtro por busca (nome dos participantes)
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				const hasMatch = match.participants.some(participant => {
					if (participant.teamName) {
						return participant.teamName.toLowerCase().includes(query);
					}
					return participant.players.some(player =>
						player.name?.toLowerCase().includes(query)
					);
				});
				if (!hasMatch) {
					return false;
				}
			}

			return true;
		});
	}, [matches, selectedDate, searchQuery, selectedCourt]);

	// Agrupa jogos por horário e ordena
	const matchesByTime = useMemo(() => {
		const grouped: Record<string, TournamentMatch[]> = {};
		
		filteredMatches.forEach(match => {
			const hour = formatHour(match.scheduledAt);
			if (hour) {
				if (!grouped[hour]) {
					grouped[hour] = [];
				}
				grouped[hour].push(match);
			}
		});

		// Ordena os horários
		const sortedHours = Object.keys(grouped).sort((a, b) => {
			const [h1, m1] = a.split(':').map(Number);
			const [h2, m2] = b.split(':').map(Number);
			return h1 * 60 + m1 - (h2 * 60 + m2);
		});

		return sortedHours.map(hour => ({
			hour,
			matches: grouped[hour].sort((a, b) => a.roundOrder - b.roundOrder),
		}));
	}, [filteredMatches]);

	// Agrupa por quadra para exibição em colunas
	const matchesByCourt = useMemo(() => {
		if (selectedCourt) {
			return { [selectedCourt]: filteredMatches };
		}

		const grouped: Record<string, TournamentMatch[]> = {};
		filteredMatches.forEach(match => {
			const courtName = match.court?.name || 'Sem quadra';
			if (!grouped[courtName]) {
				grouped[courtName] = [];
			}
			grouped[courtName].push(match);
		});

		return grouped;
	}, [filteredMatches, selectedCourt]);

	const courtNames = useMemo(() => {
		return Object.keys(matchesByCourt).sort();
	}, [matchesByCourt]);

	// Seleciona a primeira data disponível se nenhuma estiver selecionada
	useMemo(() => {
		if (!selectedDate && uniqueDates.length > 0) {
			setSelectedDate(uniqueDates[0]);
		}
	}, [selectedDate, uniqueDates]);

	return (
		<div className='space-y-6'>
			{/* Header com filtros */}
			<div className='space-y-4 rounded-xl border border-orange-200 bg-white p-4'>
				<div className='flex flex-wrap items-center justify-between gap-4'>
					<div>
						<p className='text-lg font-semibold text-gray-900'>Jogos</p>
						<p className='text-sm text-gray-600'>
							Visualize os jogos agendados do torneio
						</p>
					</div>
					<Button
						type='button'
						variant='secondary'
						className='border-orange-500 text-gray-900 hover:bg-orange-50'
						onClick={onRefresh}
						isDisabled={isLoading}
					>
						<RefreshCw className='h-4 w-4' />
						Atualizar
					</Button>
				</div>

				{/* Botões de data */}
				{uniqueDates.length > 0 && (
					<div className='flex flex-wrap gap-2'>
						{uniqueDates.map(dateStr => {
							const isSelected = selectedDate === dateStr;
							return (
								<button
									key={dateStr}
									type='button'
									onClick={() => setSelectedDate(dateStr)}
									className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
										isSelected
											? 'border-orange-500 bg-orange-500 text-white'
											: 'border-orange-200 bg-white text-gray-700 hover:bg-orange-50'
									}`}
								>
									{formatDateShort(dateStr)}
								</button>
							);
						})}
					</div>
				)}

				{/* Barra de busca */}
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
					<input
						type='text'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						placeholder='Buscar por atleta...'
						className='w-full rounded-lg border border-orange-200 bg-white pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none'
					/>
				</div>

				{/* Filtro de quadra */}
				{uniqueCourts.length > 0 && (
					<div className='flex flex-wrap gap-2'>
						<button
							type='button'
							onClick={() => setSelectedCourt(null)}
							className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-all ${
								!selectedCourt
									? 'border-orange-500 bg-orange-50 text-orange-700'
									: 'border-orange-200 bg-white text-gray-700 hover:bg-orange-50'
							}`}
						>
							Todas as quadras
						</button>
						{uniqueCourts.map(court => (
							<button
								key={court}
								type='button'
								onClick={() => setSelectedCourt(court)}
								className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-all ${
									selectedCourt === court
										? 'border-orange-500 bg-orange-50 text-orange-700'
										: 'border-orange-200 bg-white text-gray-700 hover:bg-orange-50'
								}`}
							>
								{court}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Lista de jogos */}
			{isLoading ? (
				<Loading
					message='Carregando jogos...'
					className='rounded-xl border border-orange-100 bg-white'
				/>
			) : matchesByTime.length === 0 ? (
				<div className='rounded-xl border border-dashed border-orange-200 bg-orange-50 p-6 text-center text-sm text-gray-600'>
					{selectedDate
						? 'Não há jogos agendados para a data selecionada.'
						: 'Não há jogos cadastrados.'}
				</div>
			) : (
				<div className='space-y-6'>
					{/* Cabeçalho das colunas (quadras) */}
					{courtNames.length > 1 && (
						<div className='flex gap-4 border-b-2 border-orange-200 pb-2'>
							{courtNames.map((courtName, index) => (
								<div
									key={courtName}
									className={`flex-1 text-center text-sm font-semibold ${
										index === 0
											? 'text-green-600 underline decoration-green-600'
											: 'text-gray-600'
									}`}
								>
									{courtName}
								</div>
							))}
						</div>
					)}

					{/* Lista de jogos organizados por horário */}
					<div className='space-y-3'>
						{matchesByTime.map(({ hour, matches: hourMatches }) =>
							hourMatches.map(match => {
								const participant1 = match.participants[0];
								const participant2 = match.participants[1];
								const participant1Name =
									participant1?.teamName ??
									participant1?.players.map(p => p.name).join(' / ') ??
									'Aguardando';
								const participant2Name =
									participant2?.teamName ??
									participant2?.players.map(p => p.name).join(' / ') ??
									'Aguardando';
								const participant1Seed = participant1?.seed;
								const participant2Seed = participant2?.seed;

								// Determina a chave/fase
								const bracketInfo = match.groupName
									? `Chave ${match.groupName}`
									: match.round;

								// Informação adicional da fase (ex: "Quartas - J1")
								const roundInfo =
									match.roundOrder && match.round
										? `${match.round} - J${match.roundOrder}`
										: null;

								return (
									<div
										key={match.id}
										className='flex items-start gap-3 rounded-lg border border-orange-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow'
									>
										{/* Horário */}
										<div className='flex-shrink-0'>
											<div className='rounded-lg bg-green-500 px-3 py-1.5 text-sm font-semibold text-white'>
												{hour}
											</div>
										</div>

										{/* Conteúdo do jogo */}
										<div className='flex-1 space-y-2'>
											{/* Time 1 */}
											<div className='flex items-start gap-2'>
												<div className='flex-1 space-y-0.5'>
													{participant1Name.split(' / ').map((name, idx) => (
														<div key={idx} className='text-sm text-gray-900'>
															{name}
														</div>
													))}
												</div>
												{participant1Seed !== null && participant1Seed !== undefined && (
													<div className='rounded bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700'>
														{participant1Seed}
													</div>
												)}
											</div>

											{/* Informações do jogo (categoria e chave) */}
											<div className='flex flex-wrap items-center gap-2'>
														{match.modality && (
															<div className='rounded-lg bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700'>
																{match.modality}
															</div>
														)}
														<div className='rounded-lg bg-purple-600 px-2.5 py-1 text-xs font-semibold text-white'>
															{bracketInfo}
														</div>
														{roundInfo && (
															<div className='text-xs text-gray-600'>
																{roundInfo}
															</div>
														)}
													</div>

											{/* VS */}
											<div className='text-center text-xs font-semibold text-gray-400'>
												VS
											</div>

											{/* Time 2 */}
											<div className='flex items-start gap-2'>
												{participant2Seed !== null && participant2Seed !== undefined && (
													<div className='rounded bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700'>
														{participant2Seed}
													</div>
												)}
												<div className='flex-1 space-y-0.5 text-right'>
													{participant2Name.split(' / ').map((name, idx) => (
														<div key={idx} className='text-sm text-gray-900'>
															{name}
														</div>
													))}
												</div>
											</div>

											{/* Placar se disponível */}
											{match.scoreSummary && (
												<div className='border-t border-orange-100 pt-2 text-xs font-semibold text-gray-700'>
													Placar: {match.scoreSummary}
												</div>
											)}
										</div>
									</div>
								);
							})
						)}
					</div>
				</div>
			)}
		</div>
	);
}
