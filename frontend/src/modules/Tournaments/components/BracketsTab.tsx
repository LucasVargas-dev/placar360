import { useMemo, useState, useEffect, useCallback } from 'react';
import { Button, Loading, Modal } from '@packages/components';
import { Settings, Trophy, Shuffle, Edit2, Save, X } from 'lucide-react';
import { TournamentParticipant } from '@/entities/TournamentParticipant/TournamentParticipant.js';
import { ParticipantStatus } from '@/entities/TournamentParticipant/participantStatus.js';
import { TournamentResponse } from '@/entities/Tournament/Tournament.js';
import { CourtResponse } from '@/entities/Court/Court.js';
import { courtService } from '@/entities/Court/court.service.js';
import { showApiErrorToast } from '@utils/errorHandling.js';

type BracketsTabProps = {
	tournament: TournamentResponse;
	participants: TournamentParticipant[];
	isLoading: boolean;
	onRetry: () => void;
};

type MatchFormat = 'best_of_1' | 'best_of_3' | 'best_of_5';
type TournamentType = 'knockout' | 'groups';

type BracketMatch = {
	id: string;
	round: string;
	roundOrder: number;
	participant1: TournamentParticipant | null;
	participant2: TournamentParticipant | null;
	winnerId: string | null;
	score?: string;
	courtId?: string | null;
	scheduledAt?: string | null;
};

type BracketRound = {
	name: string;
	order: number;
	matches: BracketMatch[];
};

const MATCH_FORMAT_OPTIONS: { value: MatchFormat; label: string }[] = [
	{ value: 'best_of_1', label: 'Melhor de 1' },
	{ value: 'best_of_3', label: 'Melhor de 3' },
	{ value: 'best_of_5', label: 'Melhor de 5' },
];

const TOURNAMENT_TYPE_OPTIONS: { value: TournamentType; label: string }[] = [
	{ value: 'knockout', label: 'Eliminatória' },
	{ value: 'groups', label: 'Chave de grupos' },
];

const getRoundName = (matchesInRound: number, roundIndex: number, totalRounds: number): string => {
	// Calcula o número da rodada (0 = primeira, totalRounds-1 = final)
	// roundIndex 0 = primeira rodada (mais jogos), roundIndex totalRounds-1 = final
	const roundNumber = totalRounds - 1 - roundIndex;
	
	const roundNames: Record<number, string> = {
		0: 'Final',
		1: 'Semifinal',
		2: 'Quartas de Final',
		3: 'Oitavas de Final',
		4: '16 avos de Final',
		5: '32 avos de Final',
	};

	return roundNames[roundNumber] ?? `Rodada ${roundNumber + 1}`;
};

const getNextPowerOfTwo = (n: number): number => {
	if (n <= 0) return 2;
	return Math.pow(2, Math.ceil(Math.log2(n)));
};

const generateBracket = (
	participants: TournamentParticipant[],
	matchFormat: MatchFormat
): BracketRound[] => {
	if (participants.length < 2) {
		return [];
	}

	// Ajusta para a próxima potência de 2
	const bracketSize = getNextPowerOfTwo(participants.length);
	const rounds: BracketRound[] = [];
	const totalRounds = Math.log2(bracketSize);

	// Cria os participantes iniciais (preenche com null se necessário)
	const initialParticipants: (TournamentParticipant | null)[] = [
		...participants,
		...Array(bracketSize - participants.length).fill(null),
	];

	// Embaralha os participantes para distribuição aleatória
	const shuffled = [...initialParticipants].sort(() => Math.random() - 0.5);

	// Gera a primeira rodada (mais avançada)
	let currentRoundParticipants: (TournamentParticipant | null)[] = shuffled;
	let matchIdCounter = 1;

	for (let roundIndex = 0; roundIndex < totalRounds; roundIndex++) {
		const matches: BracketMatch[] = [];
		const nextRoundParticipants: (TournamentParticipant | null)[] = [];

		// Cria os confrontos desta rodada
		for (let i = 0; i < currentRoundParticipants.length; i += 2) {
			const participant1 = currentRoundParticipants[i];
			const participant2 = currentRoundParticipants[i + 1] ?? null;

			matches.push({
				id: `match-${matchIdCounter++}`,
				round: '', // Será definido depois
				roundOrder: matches.length + 1,
				participant1,
				participant2,
				winnerId: null,
			});

			// Para a próxima rodada, avança o vencedor (por enquanto null)
			nextRoundParticipants.push(null);
		}

		// Define o nome da rodada baseado no número de matches
		const roundName = getRoundName(matches.length, roundIndex, totalRounds);
		
		// Atualiza o nome da rodada em todos os matches
		matches.forEach(match => {
			match.round = roundName;
		});

		rounds.push({
			name: roundName,
			order: roundIndex,
			matches,
		});

		currentRoundParticipants = nextRoundParticipants;
	}

	return rounds;
};

export function BracketsTab({
	tournament,
	participants,
	isLoading,
	onRetry,
}: BracketsTabProps) {
	const [matchFormat, setMatchFormat] = useState<MatchFormat>('best_of_3');
	const [tournamentType, setTournamentType] = useState<TournamentType>('knockout');
	const [showSettings, setShowSettings] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [courts, setCourts] = useState<CourtResponse[]>([]);
	const [isLoadingCourts, setIsLoadingCourts] = useState(false);
	const [bracketRounds, setBracketRounds] = useState<BracketRound[]>([]);
	const [editingMatch, setEditingMatch] = useState<{
		roundIndex: number;
		matchIndex: number;
		match: BracketMatch;
	} | null>(null);

	const confirmedParticipants = useMemo(() => {
		return participants.filter(
			p =>
				p.status === ParticipantStatus.CONFIRMED ||
				p.status === ParticipantStatus.REGISTERED ||
				p.status === ParticipantStatus.PAID
		);
	}, [participants]);

	// Carrega quadras dos clubes do torneio
	useEffect(() => {
		const loadCourts = async () => {
			if (!tournament.clubHasTournaments?.length) {
				return;
			}

			setIsLoadingCourts(true);
			try {
				const allCourts: CourtResponse[] = [];
				for (const clubLink of tournament.clubHasTournaments) {
					if (clubLink.club?.id) {
						try {
							const response = await courtService.all(1, 100, {
								where: {
									clubId: clubLink.club.id,
									isActive: true,
									deletedAt: null,
								},
							});
							allCourts.push(...response.data);
						} catch (error) {
							// Ignora erros de clubes individuais
							console.error(`Erro ao carregar quadras do clube ${clubLink.club.id}:`, error);
						}
					}
				}
				setCourts(allCourts);
			} catch (error) {
				showApiErrorToast({
					error,
					title: 'Erro ao carregar quadras',
					defaultMessage: 'Não foi possível carregar as quadras disponíveis.',
				});
			} finally {
				setIsLoadingCourts(false);
			}
		};

		void loadCourts();
	}, [tournament.clubHasTournaments]);

	// Gera o bracket inicial
	useEffect(() => {
		if (confirmedParticipants.length >= 2) {
			const generated = generateBracket(confirmedParticipants, matchFormat);
			setBracketRounds(generated);
		} else {
			setBracketRounds([]);
		}
	}, [confirmedParticipants, matchFormat]);

	const matchFormatLabel = useMemo(() => {
		return MATCH_FORMAT_OPTIONS.find(opt => opt.value === matchFormat)?.label ?? 'Melhor de 3';
	}, [matchFormat]);

	const handleRandomize = useCallback(() => {
		if (confirmedParticipants.length < 2) return;
		const generated = generateBracket(confirmedParticipants, matchFormat);
		setBracketRounds(generated);
	}, [confirmedParticipants, matchFormat]);


	const handleOpenEditModal = useCallback((roundIndex: number, matchIndex: number) => {
		const match = bracketRounds[roundIndex]?.matches[matchIndex];
		if (match) {
			setEditingMatch({
				roundIndex,
				matchIndex,
				match: { ...match },
			});
		}
	}, [bracketRounds]);

	const handleCloseEditModal = useCallback(() => {
		setEditingMatch(null);
	}, []);

	const handleSaveMatch = useCallback(() => {
		if (!editingMatch) return;

		setBracketRounds(prev => {
			const updated = [...prev];
			updated[editingMatch.roundIndex].matches[editingMatch.matchIndex] = {
				...editingMatch.match,
			};
			return updated;
		});

		setEditingMatch(null);
	}, [editingMatch]);

	const formatDateTime = (dateTime: string | null | undefined): string => {
		if (!dateTime) return 'Não agendado';
		try {
			const date = new Date(dateTime);
			if (Number.isNaN(date.getTime())) return 'Não agendado';
			return date.toLocaleString('pt-BR', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
		} catch {
			return 'Não agendado';
		}
	};

	if (isLoading) {
		return (
			<Loading
				message='Carregando participantes...'
				className='rounded-xl border border-orange-100 bg-white'
			/>
		);
	}

	if (confirmedParticipants.length < 2) {
		return (
			<div className='flex flex-col items-center gap-4 rounded-xl border border-orange-200 bg-white p-8 text-center'>
				<div className='rounded-full border border-orange-200 bg-white p-3 text-orange-500'>
					<Trophy className='h-5 w-5' />
				</div>
				<div className='space-y-2'>
					<p className='text-lg font-semibold text-gray-900'>
						Participantes insuficientes
					</p>
					<p className='text-sm text-gray-600'>
						É necessário pelo menos 2 participantes confirmados para gerar o
						chaveamento.
					</p>
					<p className='text-sm text-gray-600'>
						Atualmente há {confirmedParticipants.length} participante
						{confirmedParticipants.length === 1 ? '' : 's'} confirmado
						{confirmedParticipants.length === 1 ? '' : 's'}.
					</p>
				</div>
				<Button
					type='button'
					variant='secondary'
					className='border-orange-500 text-gray-900 hover:bg-orange-50'
					onClick={onRetry}
				>
					Atualizar lista
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header com configurações */}
			<div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-orange-200 bg-white p-4'>
				<div>
					<p className='text-lg font-semibold text-gray-900'>Chaveamento</p>
					<p className='text-sm text-gray-600'>
						{confirmedParticipants.length} participante
						{confirmedParticipants.length === 1 ? '' : 's'} • {matchFormatLabel}
					</p>
				</div>
				<div className='flex items-center gap-2'>
					{!isEditMode && (
						<Button
							type='button'
							variant='secondary'
							className='border-orange-500 text-gray-900 hover:bg-orange-50'
							onClick={() => setIsEditMode(true)}
						>
							<Edit2 className='h-4 w-4' />
							Editar chaveamento
						</Button>
					)}
					{isEditMode && (
						<Button
							type='button'
							variant='secondary'
							className='border-green-500 text-gray-900 hover:bg-green-50'
							onClick={() => setIsEditMode(false)}
						>
							<Save className='h-4 w-4' />
							Sair do modo de edição
						</Button>
					)}
					<Button
						type='button'
						variant='secondary'
						className='border-orange-500 text-gray-900 hover:bg-orange-50'
						onClick={() => setShowSettings(!showSettings)}
					>
						<Settings className='h-4 w-4' />
						Configurações
					</Button>
					<Button
						type='button'
						variant='secondary'
						className='border-orange-300 text-gray-900 hover:bg-orange-50'
						onClick={onRetry}
					>
						Atualizar
					</Button>
				</div>
			</div>

			{/* Painel de configurações */}
			{showSettings && (
				<div className='rounded-xl border border-orange-200 bg-white p-4'>
					<div className='space-y-6'>
						<div>
							<p className='mb-2 text-sm font-semibold text-gray-900'>
								Tipo de torneio
							</p>
							<p className='mb-3 text-xs text-gray-600'>
								Selecione o formato do torneio.
							</p>
							<div className='flex flex-wrap gap-2'>
								{TOURNAMENT_TYPE_OPTIONS.map(option => (
									<button
										key={option.value}
										type='button'
										onClick={() => setTournamentType(option.value)}
										className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
											tournamentType === option.value
												? 'border-orange-500 bg-orange-50 text-orange-700'
												: 'border-orange-200 bg-white text-gray-700 hover:bg-orange-50'
										}`}
									>
										{option.label}
									</button>
								))}
							</div>
						</div>

						<div>
							<p className='mb-2 text-sm font-semibold text-gray-900'>
								Formato do jogo
							</p>
							<p className='mb-3 text-xs text-gray-600'>
								Selecione quantos sets/jogos são necessários para definir o
								vencedor de cada confronto.
							</p>
							<div className='flex flex-wrap gap-2'>
								{MATCH_FORMAT_OPTIONS.map(option => (
									<button
										key={option.value}
										type='button'
										onClick={() => setMatchFormat(option.value)}
										className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
											matchFormat === option.value
												? 'border-orange-500 bg-orange-50 text-orange-700'
												: 'border-orange-200 bg-white text-gray-700 hover:bg-orange-50'
										}`}
									>
										{option.label}
									</button>
								))}
							</div>
						</div>

						{isEditMode && (
							<div>
								<p className='mb-2 text-sm font-semibold text-gray-900'>
									Ações rápidas
								</p>
								<Button
									type='button'
									variant='secondary'
									className='border-orange-500 text-gray-900 hover:bg-orange-50'
									onClick={handleRandomize}
								>
									<Shuffle className='h-4 w-4' />
									Gerar confrontos aleatoriamente
								</Button>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Visualização do bracket */}
			{bracketRounds.length === 0 ? (
				<div className='rounded-xl border border-dashed border-orange-200 bg-orange-50 p-6 text-center text-sm text-gray-600'>
					Não foi possível gerar o chaveamento. Verifique se há participantes
					suficientes.
				</div>
			) : (
				<div className='overflow-x-auto rounded-xl border border-orange-200 bg-white p-4'>
					<div className='flex gap-6 min-w-max pb-4'>
						{bracketRounds.map((round, roundIndex) => (
							<div
								key={round.name}
								className='flex flex-col min-w-[320px]'
							>
								{/* Header da rodada */}
								<div className='mb-4 text-center'>
									<p className='text-base font-semibold text-gray-900'>
										{round.name}
									</p>
									<p className='text-xs text-gray-600'>
										{round.matches.length} jogo{round.matches.length === 1 ? '' : 's'}
									</p>
								</div>

								{/* Matches da rodada */}
								<div className='flex flex-col gap-4 flex-1 justify-center'>
									{round.matches.map((match, matchIndex) => (
										<div
											key={match.id}
											className='space-y-3 rounded-lg border border-orange-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow'
										>
											<div className='flex items-center justify-between'>
												<div className='flex items-center gap-2 text-xs uppercase text-orange-500'>
													<span>Jogo {match.roundOrder}</span>
													<span className='text-gray-600'>•</span>
													<span className='text-gray-600'>{matchFormatLabel}</span>
												</div>
												{isEditMode && (
													<button
														type='button'
														onClick={() => handleOpenEditModal(roundIndex, matchIndex)}
														className='flex items-center gap-1 rounded-lg border border-orange-200 bg-white px-2 py-1 text-xs text-orange-500 transition-colors hover:bg-orange-50 hover:text-orange-700'
														title='Editar jogo'
													>
														<Edit2 className='h-3 w-3' />
														<span>Editar</span>
													</button>
												)}
											</div>

											<div className='space-y-2'>
												{/* Participante 1 */}
												<div
													className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
														match.winnerId === match.participant1?.id
															? 'border-orange-500 bg-orange-50 font-semibold text-gray-900'
															: match.participant1
																? 'border-orange-100 bg-white text-gray-700 hover:bg-orange-50'
																: 'border-orange-100 bg-orange-50 text-gray-400'
													}`}
												>
													{match.participant1
														? match.participant1.user?.name ??
															match.participant1.user?.email ??
															'Participante'
														: 'Aguardando'}
												</div>

												{/* VS */}
												<div className='text-center text-xs font-semibold text-gray-400'>
													VS
												</div>

												{/* Participante 2 */}
												<div
													className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
														match.winnerId === match.participant2?.id
															? 'border-orange-500 bg-orange-50 font-semibold text-gray-900'
															: match.participant2
																? 'border-orange-100 bg-white text-gray-700 hover:bg-orange-50'
																: 'border-orange-100 bg-orange-50 text-gray-400'
													}`}
												>
													{match.participant2
														? match.participant2.user?.name ??
															match.participant2.user?.email ??
															'Participante'
														: 'Aguardando'}
												</div>
											</div>

											{/* Informações do jogo: Placar, Quadra e Horário */}
											<div className='space-y-1 border-t border-orange-100 pt-2 text-xs text-gray-600'>
												<div>
													<span className='font-semibold text-gray-700'>Placar:</span>{' '}
													{match.score || 'Não informado'}
												</div>
												<div>
													<span className='font-semibold text-gray-700'>Quadra:</span>{' '}
													{match.courtId
														? courts.find(c => c.id === match.courtId)?.name ?? 'N/A'
														: 'Não informado'}
												</div>
												<div>
													<span className='font-semibold text-gray-700'>Horário:</span>{' '}
													{formatDateTime(match.scheduledAt)}
												</div>
											</div>

											{match.winnerId && (
												<div className='mt-2 rounded-lg bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700'>
													Vencedor definido
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Informações adicionais */}
			<div className='rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm text-gray-700'>
				<p className='mb-2 font-semibold text-gray-900'>Como funciona</p>
				<ul className='list-inside list-disc space-y-1 text-left'>
					<li>
						O chaveamento é gerado automaticamente baseado na quantidade de
						participantes confirmados.
					</li>
					<li>
						O sistema ajusta para a próxima potência de 2 (2, 4, 8, 16, 32,
						etc.) para criar um bracket completo.
					</li>
					<li>
						No modo de edição, você pode selecionar participantes manualmente
						para cada confronto ou usar o botão "Gerar aleatoriamente".
					</li>
					<li>
						Você pode configurar o formato do jogo (melhor de 1, 3 ou 5 sets) e
						o tipo de torneio nas configurações.
					</li>
					<li>
						<strong>Próximos passos:</strong> Integrar com o backend para salvar
						os confrontos e atualizar os vencedores automaticamente.
					</li>
				</ul>
			</div>

			{/* Modal de edição do match */}
			<Modal
				isOpen={editingMatch !== null}
				onClose={handleCloseEditModal}
				title={`Editar Jogo ${editingMatch?.match.roundOrder} - ${editingMatch?.match.round}`}
				size='md'
				className='bg-white'
				footerButtons={
					<>
						<Button
							type='button'
							variant='secondary'
							onClick={handleCloseEditModal}
							className='border-orange-200 text-gray-900 hover:bg-orange-50'
						>
							Cancelar
						</Button>
						<Button
							type='button'
							variant='primary'
							onClick={handleSaveMatch}
							className='bg-orange-500 text-white hover:bg-orange-600'
						>
							Salvar
						</Button>
					</>
				}
			>
				{editingMatch && (
					<div className='space-y-4'>
						{/* Participante 1 */}
						<div>
							<label className='mb-2 block text-sm font-semibold text-gray-900'>
								Participante 1
							</label>
							<select
								value={editingMatch.match.participant1?.id ?? ''}
								onChange={e => {
									const participant = e.target.value
										? confirmedParticipants.find(p => p.id === e.target.value) ?? null
										: null;
									setEditingMatch(prev =>
										prev
											? {
													...prev,
													match: {
														...prev.match,
														participant1: participant,
													},
												}
											: null
									);
								}}
								className='w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none'
							>
								<option value=''>Selecione um participante</option>
								{confirmedParticipants.map(p => (
									<option key={p.id} value={p.id}>
										{p.user?.name ?? p.user?.email ?? 'Participante'}
									</option>
								))}
							</select>
						</div>

						{/* Participante 2 */}
						<div>
							<label className='mb-2 block text-sm font-semibold text-gray-900'>
								Participante 2
							</label>
							<select
								value={editingMatch.match.participant2?.id ?? ''}
								onChange={e => {
									const participant = e.target.value
										? confirmedParticipants.find(p => p.id === e.target.value) ?? null
										: null;
									setEditingMatch(prev =>
										prev
											? {
													...prev,
													match: {
														...prev.match,
														participant2: participant,
													},
												}
											: null
									);
								}}
								className='w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none'
							>
								<option value=''>Selecione um participante</option>
								{confirmedParticipants.map(p => (
									<option key={p.id} value={p.id}>
										{p.user?.name ?? p.user?.email ?? 'Participante'}
									</option>
								))}
							</select>
						</div>

						{/* Placar */}
						<div>
							<label className='mb-2 block text-sm font-semibold text-gray-900'>
								Placar
							</label>
							<input
								type='text'
								value={editingMatch.match.score ?? ''}
								onChange={e =>
									setEditingMatch(prev =>
										prev
											? {
													...prev,
													match: {
														...prev.match,
														score: e.target.value,
													},
												}
											: null
									)
								}
								placeholder='Ex: 6-4, 6-3'
								className='w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none'
							/>
						</div>

						{/* Quadra */}
						<div>
							<label className='mb-2 block text-sm font-semibold text-gray-900'>
								Quadra
							</label>
							<select
								value={editingMatch.match.courtId ?? ''}
								onChange={e =>
									setEditingMatch(prev =>
										prev
											? {
													...prev,
													match: {
														...prev.match,
														courtId: e.target.value || null,
													},
												}
											: null
									)
								}
								className='w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none'
								disabled={isLoadingCourts}
							>
								<option value=''>Selecione uma quadra</option>
								{courts.map(court => (
									<option key={court.id} value={court.id}>
										{court.name}
									</option>
								))}
							</select>
						</div>

						{/* Horário */}
						<div>
							<label className='mb-2 block text-sm font-semibold text-gray-900'>
								Data e Horário
							</label>
							<input
								type='datetime-local'
								value={
									editingMatch.match.scheduledAt
										? new Date(editingMatch.match.scheduledAt).toISOString().slice(0, 16)
										: ''
								}
								onChange={e => {
									const value = e.target.value
										? new Date(e.target.value).toISOString()
										: null;
									setEditingMatch(prev =>
										prev
											? {
													...prev,
													match: {
														...prev.match,
														scheduledAt: value,
													},
												}
											: null
									);
								}}
								className='w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none'
							/>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
