import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Select, Loading, Toast } from '@packages/components';
import { clubService } from '@/entities/Club/club.service.js';
import { ClubResponse } from '@/entities/Club/Club.js';
import {
	ClubScheduleCourt,
	ClubScheduleFilters,
	ClubSchedulePlayer,
	ClubScheduleResponse,
	ClubScheduleSlot,
} from '@/entities/ClubSchedule/ClubSchedule.js';
import { clubScheduleService } from '@/entities/ClubSchedule/clubSchedule.service.js';
import { ScheduleGrid } from './components/ScheduleGrid.js';
import { BookingModal } from './components/BookingModal.js';
import { showApiErrorToast } from '@utils/errorHandling.js';
import { useSearchParams } from 'react-router-dom';

const formatDateInput = (date: Date) => {
	const cloned = new Date(date);
	const offset = cloned.getTimezoneOffset();
	cloned.setMinutes(cloned.getMinutes() - offset);
	return cloned.toISOString().split('T')[0];
};

const formatDateLabel = (iso: string) =>
	new Date(iso).toLocaleDateString('pt-BR', {
		weekday: 'short',
		day: '2-digit',
		month: '2-digit',
	});

export function ClubSchedulePage() {
	const todayInput = formatDateInput(new Date());
	const [searchParams, setSearchParams] = useSearchParams();
	const [clubs, setClubs] = useState<ClubResponse[]>([]);
	const [isLoadingClubs, setIsLoadingClubs] = useState(true);
	const [selectedClubId, setSelectedClubId] = useState<string>('');
	const [filters, setFilters] = useState<Required<ClubScheduleFilters>>({
		startDate: todayInput,
		endDate: todayInput,
		courtName: '',
		sportType: '',
	});
	const [scheduleData, setScheduleData] = useState<ClubScheduleResponse | null>(
		null
	);
	const [players, setPlayers] = useState<ClubSchedulePlayer[]>([]);
	const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
	const [activeDayIndex, setActiveDayIndex] = useState(0);
	const [isCreatingBooking, setIsCreatingBooking] = useState(false);
	type SelectedSlotPayload = {
		slot: ClubScheduleSlot;
		court: ClubScheduleCourt;
		date: string;
	};

	const [selectedSlot, setSelectedSlot] = useState<SelectedSlotPayload | null>(
		null
	);

	useEffect(() => {
		const loadClubs = async () => {
			try {
				const data = await clubService.getAllByConditions({
					where: {
						deletedAt: null,
						isActive: true,
					},
					include: {
						courts: {
							select: {
								id: true,
								name: true,
								sportType: true,
								defaultSlotMinutes: true,
							},
						},
					},
					orderBy: [{ name: 'asc' }],
				});

				setClubs(data);
				if (data.length > 0) {
					const requestedClubId = searchParams.get('clubId');
					const fallbackId = data[0].id;
					if (requestedClubId) {
						const exists = data.find(club => club.id === requestedClubId);
						setSelectedClubId(exists ? exists.id : fallbackId);
					} else {
						setSelectedClubId(fallbackId);
					}
				}
			} catch (error) {
				showApiErrorToast({
					error,
					title: 'Erro ao carregar clubes',
					defaultMessage: 'Não foi possível carregar a lista de clubes.',
				});
			} finally {
				setIsLoadingClubs(false);
			}
		};

		void loadClubs();
	}, []);

	const clubOptions = useMemo(
		() =>
			clubs.map(club => ({
				value: club.id,
				label: club.name,
			})),
		[clubs]
	);

	const selectedClub = useMemo(
		() => clubs.find(club => club.id === selectedClubId) ?? null,
		[clubs, selectedClubId]
	);

	const sportTypeOptions = useMemo(() => {
		if (!selectedClub?.courts) return [];
		const typeSet = new Set<string>();
		for (const court of selectedClub.courts) {
			if (court?.sportType) {
				typeSet.add(court.sportType);
			}
		}
		return Array.from(typeSet.values()).map(type => ({
			value: type,
			label: type,
		}));
	}, [selectedClub]);

	const loadSchedule = useCallback(
		async (clubId: string, currentFilters: ClubScheduleFilters) => {
			setIsLoadingSchedule(true);
			try {
				const result = await clubScheduleService.getClubSchedule(
					clubId,
					currentFilters
				);
				setScheduleData(result);
				setActiveDayIndex(0);
			} catch (error) {
				setScheduleData(null);
				showApiErrorToast({
					error,
					title: 'Erro ao carregar agenda',
					defaultMessage: 'Não foi possível carregar a agenda do clube.',
				});
			} finally {
				setIsLoadingSchedule(false);
			}
		},
		[]
	);

	const loadPlayers = useCallback(async (clubId: string) => {
		try {
			const result = await clubScheduleService.getClubPlayers(clubId);
			setPlayers(result);
		} catch (error) {
			setPlayers([]);
			showApiErrorToast({
				error,
				title: 'Erro ao carregar jogadores',
				defaultMessage:
					'Não foi possível carregar os jogadores associados ao clube.',
			});
		}
	}, []);

	useEffect(() => {
		if (!selectedClubId) {
			setScheduleData(null);
			return;
		}

		const debounce = setTimeout(() => {
			void loadSchedule(selectedClubId, {
				startDate: filters.startDate,
				endDate: filters.endDate || filters.startDate,
				courtName: filters.courtName || undefined,
				sportType: filters.sportType || undefined,
			});
		}, 350);

		return () => clearTimeout(debounce);
	}, [
		selectedClubId,
		filters.startDate,
		filters.endDate,
		filters.courtName,
		filters.sportType,
		loadSchedule,
	]);

	useEffect(() => {
		if (!selectedClubId) {
			setPlayers([]);
			return;
		}
		void loadPlayers(selectedClubId);
	}, [selectedClubId, loadPlayers]);

	const handleClubChange = useCallback((value: string | number) => {
		if (value == null) return;
		setSelectedClubId(String(value));
	}, []);

	useEffect(() => {
		if (!selectedClubId) return;
		setSearchParams(params => {
			const next = new URLSearchParams(params);
			next.set('clubId', selectedClubId);
			return next;
		});
	}, [selectedClubId, setSearchParams]);

	const activeDay = useMemo(() => {
		if (!scheduleData) return null;
		return scheduleData.schedule[activeDayIndex] ?? null;
	}, [scheduleData, activeDayIndex]);

	const hasDifferentSlotDurations = useMemo(() => {
		if (!activeDay) return false;
		const durations = new Set(
			activeDay.courts.map(court => court.defaultSlotMinutes ?? 60)
		);
		return durations.size > 1;
	}, [activeDay]);

	const handleSlotSelection = useCallback((slotPayload: SelectedSlotPayload) => {
		setSelectedSlot(slotPayload);
	}, []);

	const handleBookingConfirm = useCallback(
		async ({ userId, notes }: { userId: string; notes: string }) => {
			if (!selectedClubId || !selectedSlot) return;
			setIsCreatingBooking(true);

			try {
				await clubScheduleService.createBooking(
					selectedClubId,
					selectedSlot.court.courtId,
					{
						userId,
						startTime: selectedSlot.slot.startTime,
						endTime: selectedSlot.slot.endTime,
						notes: notes || undefined,
					}
				);

				Toast.show({
					title: 'Agendamento confirmado',
					description: 'O horário foi reservado com sucesso.',
					status: 'success',
				});

				setSelectedSlot(null);

				await loadSchedule(selectedClubId, {
					startDate: filters.startDate,
					endDate: filters.endDate || filters.startDate,
					courtName: filters.courtName || undefined,
					sportType: filters.sportType || undefined,
				});
			} catch (error) {
				showApiErrorToast({
					error,
					title: 'Erro ao criar agendamento',
					defaultMessage: 'Não foi possível criar o agendamento.',
				});
			} finally {
				setIsCreatingBooking(false);
			}
		},
		[filters, loadSchedule, selectedClubId, selectedSlot]
	);

	return (
		<div className='space-y-6 bg-white p-6 rounded-2xl shadow-sm text-secondary-900'>
			<header className='space-y-2'>
				<h1 className='text-2xl font-semibold text-secondary-900'>
					Agenda de Quadras
				</h1>
				<p className='text-sm text-secondary-600'>
					Gerencie os horários disponíveis das quadras e realize agendamentos de
					maneira rápida.
				</p>
			</header>

			<section className='space-y-4'>
				<div className='flex flex-wrap items-end gap-4'>
					<div className='w-full md:w-1/3 space-y-2'>
						<label className='text-sm font-semibold text-secondary-900'>
							Clube
						</label>
						{isLoadingClubs ? (
							<div className='flex h-10 w-full items-center justify-center rounded-lg border border-orange-300 bg-white'>
								<Loading />
							</div>
						) : (
							<Select
								options={clubOptions}
								value={selectedClubId}
								onChangeValue={handleClubChange}
								placeholder='Selecione um clube'
								isFullWidth
								isDisabled={clubOptions.length === 0}
							/>
						)}
					</div>

					<div className='w-full sm:w-40 space-y-2'>
						<label className='text-sm font-semibold text-secondary-900'>
							Data inicial
						</label>
						<input
							type='date'
							value={filters.startDate}
							onChange={event =>
								setFilters(prev => ({
									...prev,
									startDate: event.target.value,
									endDate:
										prev.endDate && prev.endDate < event.target.value
											? event.target.value
											: prev.endDate,
								}))
							}
							className='w-full rounded-lg border border-orange-300 bg-white px-3 py-2 text-sm text-secondary-900 outline-none transition-colors focus:ring-2 focus:ring-orange-300'
						/>
					</div>

					<div className='w-full sm:w-40 space-y-2'>
						<label className='text-sm font-semibold text-secondary-900'>
							Data final
						</label>
						<input
							type='date'
							value={filters.endDate}
							min={filters.startDate}
							onChange={event =>
								setFilters(prev => ({
									...prev,
									endDate: event.target.value,
								}))
							}
							className='w-full rounded-lg border border-orange-300 bg-white px-3 py-2 text-sm text-secondary-900 outline-none transition-colors focus:ring-2 focus:ring-orange-300'
						/>
					</div>

					<div className='w-full md:w-1/5 space-y-2'>
						<label className='text-sm font-semibold text-secondary-900'>
							Nome da quadra
						</label>
						<input
							type='text'
							placeholder='Buscar por nome'
							value={filters.courtName}
							onChange={event =>
								setFilters(prev => ({
									...prev,
									courtName: event.target.value,
								}))
							}
							className='w-full rounded-lg border border-orange-300 bg-white px-3 py-2 text-sm text-secondary-900 outline-none transition-colors focus:ring-2 focus:ring-orange-300'
						/>
					</div>

					<div className='w-full md:w-1/5 space-y-2'>
						<label className='text-sm font-semibold text-secondary-900'>
							Modalidade
						</label>
						<Select
							options={[
								{ value: '', label: 'Todas' },
								...sportTypeOptions,
							]}
							value={filters.sportType}
							onChangeValue={value =>
								setFilters(prev => ({
									...prev,
									sportType: value == null ? '' : String(value),
								}))
							}
							isFullWidth
							placeholder='Todas modalidades'
						/>
					</div>
				</div>

				{selectedClub && (
					<div className='rounded-xl border border-orange-300 bg-white p-4 text-sm text-secondary-700'>
						<div className='flex flex-wrap gap-4'>
							<span>
								<strong>Horário de funcionamento:</strong>{' '}
								{selectedClub.openTime ?? 'Não definido'} -{' '}
								{selectedClub.closeTime ?? 'Não definido'}
							</span>
							<span>
								<strong>Quadras cadastradas:</strong>{' '}
								{selectedClub.courts?.length ?? 0}
							</span>
						</div>
					</div>
				)}
			</section>

			<section className='space-y-4'>
				{scheduleData && scheduleData.schedule.length > 1 && (
					<div className='flex flex-wrap gap-2'>
						{scheduleData.schedule.map((day, index) => (
							<button
								key={day.date}
								type='button'
								onClick={() => setActiveDayIndex(index)}
								className={clsx(
									'rounded-lg border px-4 py-2 text-sm transition-colors',
									index === activeDayIndex
										? 'border-orange-400 font-semibold text-secondary-900'
										: 'border-orange-200 text-secondary-600 hover:text-secondary-900'
								)}
							>
								{formatDateLabel(day.date)}
							</button>
						))}
					</div>
				)}

				{isLoadingSchedule ? (
					<div className='flex h-64 items-center justify-center rounded-xl border border-orange-300 bg-white'>
						<Loading />
					</div>
				) : (
					<>
						{activeDay && (
							<div className='rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-xs text-secondary-700'>
								{hasDifferentSlotDurations ? (
									<span>
										Horários variam por quadra com base em suas configurações e
										valor/hora.
									</span>
								) : (
									<span>
										Todas as quadras compartilham o mesmo intervalo de agenda.
									</span>
								)}
							</div>
						)}

						<ScheduleGrid
							day={activeDay}
							onSelectSlot={handleSlotSelection}
						/>
					</>
				)}
			</section>

			<BookingModal
				isOpen={Boolean(selectedSlot)}
				onClose={() => setSelectedSlot(null)}
				onConfirm={handleBookingConfirm}
				isSubmitting={isCreatingBooking}
				slotInfo={selectedSlot}
				players={players}
			/>
		</div>
	);
}


