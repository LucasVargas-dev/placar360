import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Select, Loading } from '@packages/components';
import { Lesson, LessonFilters, LessonScheduleDay, LessonStudent } from './types';
import { TeacherScheduleGrid } from './components/TeacherScheduleGrid';
import { LessonDetailsModal } from './components/LessonDetailsModal';

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

// Mock data - será substituído por chamadas de API no futuro
const mockClubs = [
	{ id: '1', name: 'Clube Padel Pro' },
	{ id: '2', name: 'Arena Beach Padel' },
	{ id: '3', name: 'Center Court' },
];

const mockLessons: Lesson[] = [
	{
		id: '1',
		startTime: '2025-02-10T14:00:00',
		endTime: '2025-02-10T15:30:00',
		date: '2025-02-10',
		clubId: '1',
		clubName: 'Clube Padel Pro',
		courtId: '1',
		courtName: 'Quadra 1',
		sportType: 'Padel',
		teacherId: 'teacher-1',
		teacherName: 'Prof. João Silva',
		specialty: 'Técnica de Saque e Voleio',
		maxStudents: 4,
		price: 150.0,
		students: [
			{
				id: 's1',
				name: 'Maria Santos',
				email: 'maria@example.com',
				registeredAt: '2025-01-15T10:00:00',
				status: 'confirmed',
			},
			{
				id: 's2',
				name: 'Pedro Costa',
				email: 'pedro@example.com',
				registeredAt: '2025-01-16T14:00:00',
				status: 'confirmed',
			},
		],
	},
	{
		id: '2',
		startTime: '2025-02-10T16:00:00',
		endTime: '2025-02-10T17:30:00',
		date: '2025-02-10',
		clubId: '1',
		clubName: 'Clube Padel Pro',
		courtId: '2',
		courtName: 'Quadra 2',
		sportType: 'Padel',
		teacherId: 'teacher-1',
		teacherName: 'Prof. João Silva',
		specialty: 'Técnica de Saque e Voleio',
		maxStudents: 4,
		price: 150.0,
		students: [
			{
				id: 's3',
				name: 'Ana Oliveira',
				email: 'ana@example.com',
				registeredAt: '2025-01-17T09:00:00',
				status: 'pending',
			},
		],
	},
	{
		id: '3',
		startTime: '2025-02-11T10:00:00',
		endTime: '2025-02-11T11:30:00',
		date: '2025-02-11',
		clubId: '2',
		clubName: 'Arena Beach Padel',
		courtId: '3',
		courtName: 'Quadra Central',
		sportType: 'Padel',
		teacherId: 'teacher-1',
		teacherName: 'Prof. João Silva',
		specialty: 'Técnica de Saque e Voleio',
		maxStudents: 6,
		price: 180.0,
		students: [
			{
				id: 's4',
				name: 'Carlos Mendes',
				email: 'carlos@example.com',
				registeredAt: '2025-01-18T11:00:00',
				status: 'confirmed',
			},
			{
				id: 's5',
				name: 'Julia Ferreira',
				email: 'julia@example.com',
				registeredAt: '2025-01-18T11:30:00',
				status: 'confirmed',
			},
			{
				id: 's6',
				name: 'Roberto Alves',
				email: 'roberto@example.com',
				registeredAt: '2025-01-19T08:00:00',
				status: 'confirmed',
			},
		],
	},
];

export function TeacherSchedulePage() {
	const todayInput = formatDateInput(new Date());
	const [selectedClubId, setSelectedClubId] = useState<string>('');
	const [filters, setFilters] = useState<Required<LessonFilters>>({
		startDate: todayInput,
		endDate: todayInput,
		clubId: '',
		courtName: '',
		sportType: '',
	});
	const [scheduleData, setScheduleData] = useState<LessonScheduleDay[]>([]);
	const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
	const [activeDayIndex, setActiveDayIndex] = useState(0);
	const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

	useEffect(() => {
		if (mockClubs.length > 0) {
			setSelectedClubId(mockClubs[0].id);
		}
	}, []);

	const clubOptions = useMemo(
		() =>
			mockClubs.map(club => ({
				value: club.id,
				label: club.name,
			})),
		[]
	);

	const loadSchedule = useCallback(async (currentFilters: LessonFilters) => {
		setIsLoadingSchedule(true);
		try {
			// Simular delay de API
			await new Promise(resolve => setTimeout(resolve, 500));

			// Filtrar aulas mockadas
			let filtered = [...mockLessons];

			if (currentFilters.clubId) {
				filtered = filtered.filter(lesson => lesson.clubId === currentFilters.clubId);
			}

			if (currentFilters.courtName) {
				filtered = filtered.filter(lesson =>
					lesson.courtName.toLowerCase().includes(currentFilters.courtName!.toLowerCase())
				);
			}

			if (currentFilters.sportType) {
				filtered = filtered.filter(lesson => lesson.sportType === currentFilters.sportType);
			}

			// Filtrar por data
			const startDate = new Date(currentFilters.startDate);
			const endDate = new Date(currentFilters.endDate || currentFilters.startDate);
			filtered = filtered.filter(lesson => {
				const lessonDate = new Date(lesson.date);
				return lessonDate >= startDate && lessonDate <= endDate;
			});

			// Agrupar por data
			const groupedByDate = filtered.reduce((acc, lesson) => {
				if (!acc[lesson.date]) {
					acc[lesson.date] = [];
				}
				acc[lesson.date].push(lesson);
				return acc;
			}, {} as Record<string, Lesson[]>);

			const schedule: LessonScheduleDay[] = Object.entries(groupedByDate)
				.map(([date, lessons]) => ({
					date,
					lessons: lessons.sort(
						(a, b) =>
							new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
					),
				}))
				.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

			setScheduleData(schedule);
			setActiveDayIndex(0);
		} catch (error) {
			setScheduleData([]);
		} finally {
			setIsLoadingSchedule(false);
		}
	}, []);

	useEffect(() => {
		const debounce = setTimeout(() => {
			void loadSchedule({
				startDate: filters.startDate,
				endDate: filters.endDate || filters.startDate,
				clubId: filters.clubId || undefined,
				courtName: filters.courtName || undefined,
				sportType: filters.sportType || undefined,
			});
		}, 350);

		return () => clearTimeout(debounce);
	}, [filters, loadSchedule]);

	const activeDay = useMemo(() => {
		return scheduleData[activeDayIndex] ?? null;
	}, [scheduleData, activeDayIndex]);

	const sportTypeOptions = useMemo(() => {
		const types = new Set(mockLessons.map(lesson => lesson.sportType));
		return Array.from(types).map(type => ({
			value: type,
			label: type,
		}));
	}, []);

	const handleLessonClick = useCallback((lesson: Lesson) => {
		setSelectedLesson(lesson);
	}, []);

	return (
		<div className='space-y-6 bg-white p-6 rounded-2xl shadow-sm text-secondary-900'>
			<header className='space-y-2'>
				<h1 className='text-2xl font-semibold text-secondary-900'>
					Minha Agenda de Aulas
				</h1>
				<p className='text-sm text-secondary-600'>
					Visualize suas aulas agendadas, alunos inscritos e gerencie seus horários.
				</p>
			</header>

			<section className='space-y-4'>
				<div className='flex flex-wrap items-end gap-4'>
					<div className='w-full md:w-1/3 space-y-2'>
						<label className='text-sm font-semibold text-secondary-900'>
							Clube
						</label>
						<Select
							options={[
								{ value: '', label: 'Todos os clubes' },
								...clubOptions,
							]}
							value={filters.clubId}
							onChangeValue={value => {
								setFilters(prev => ({
									...prev,
									clubId: value == null ? '' : String(value),
								}));
								setSelectedClubId(value == null ? '' : String(value));
							}}
							placeholder='Selecione um clube'
							isFullWidth
						/>
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
			</section>

			<section className='space-y-4'>
				{scheduleData.length > 1 && (
					<div className='flex flex-wrap gap-2'>
						{scheduleData.map((day, index) => (
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
					<TeacherScheduleGrid
						day={activeDay}
						onLessonClick={handleLessonClick}
					/>
				)}
			</section>

			<LessonDetailsModal
				isOpen={Boolean(selectedLesson)}
				onClose={() => setSelectedLesson(null)}
				lesson={selectedLesson}
			/>
		</div>
	);
}

