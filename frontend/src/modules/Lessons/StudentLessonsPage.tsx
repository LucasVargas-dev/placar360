import { useCallback, useEffect, useMemo, useState } from 'react';
import { Select, Loading } from '@packages/components';
import { Teacher, TeacherLocation } from './types';
import { ProfessorCard } from './components/ProfessorCard';
import { ProfessorDetailsModal } from './components/ProfessorDetailsModal';

// Mock data - será substituído por chamadas de API no futuro
const mockTeachers: Teacher[] = [
	{
		id: 'teacher-1',
		name: 'Prof. João Silva',
		email: 'joao.silva@example.com',
		specialty: 'Técnica de Saque e Voleio',
		bio: 'Professor com mais de 10 anos de experiência em padel. Especialista em técnicas avançadas de saque e voleio.',
		rating: 4.8,
		locations: [
			{
				clubId: '1',
				clubName: 'Clube Padel Pro',
				courtId: '1',
				courtName: 'Quadra 1',
				sportType: 'Padel',
				price: 150.0,
				availableDays: ['Segunda', 'Quarta', 'Sexta'],
				availableTimeSlots: [
					{ startTime: '14:00', endTime: '15:30' },
					{ startTime: '16:00', endTime: '17:30' },
				],
			},
			{
				clubId: '2',
				clubName: 'Arena Beach Padel',
				courtId: '3',
				courtName: 'Quadra Central',
				sportType: 'Padel',
				price: 180.0,
				availableDays: ['Terça', 'Quinta'],
				availableTimeSlots: [
					{ startTime: '10:00', endTime: '11:30' },
					{ startTime: '18:00', endTime: '19:30' },
				],
			},
		],
	},
	{
		id: 'teacher-2',
		name: 'Prof. Maria Santos',
		email: 'maria.santos@example.com',
		specialty: 'Estratégia e Posicionamento',
		bio: 'Ex-jogadora profissional, agora dedicada ao ensino. Foco em estratégia de jogo e posicionamento em quadra.',
		rating: 4.9,
		locations: [
			{
				clubId: '1',
				clubName: 'Clube Padel Pro',
				courtId: '2',
				courtName: 'Quadra 2',
				sportType: 'Padel',
				price: 160.0,
				availableDays: ['Segunda', 'Quarta', 'Sexta'],
				availableTimeSlots: [
					{ startTime: '09:00', endTime: '10:30' },
					{ startTime: '19:00', endTime: '20:30' },
				],
			},
			{
				clubId: '3',
				clubName: 'Center Court',
				courtId: '4',
				courtName: 'Quadra Premium',
				sportType: 'Padel',
				price: 200.0,
				availableDays: ['Sábado', 'Domingo'],
				availableTimeSlots: [
					{ startTime: '14:00', endTime: '15:30' },
					{ startTime: '16:00', endTime: '17:30' },
				],
			},
		],
	},
	{
		id: 'teacher-3',
		name: 'Prof. Carlos Mendes',
		email: 'carlos.mendes@example.com',
		specialty: 'Iniciantes e Fundamentos',
		bio: 'Especialista em ensino para iniciantes. Paciente e didático, ajuda jogadores a desenvolverem os fundamentos básicos.',
		rating: 4.7,
		locations: [
			{
				clubId: '2',
				clubName: 'Arena Beach Padel',
				courtId: '5',
				courtName: 'Quadra 1',
				sportType: 'Padel',
				price: 120.0,
				availableDays: ['Terça', 'Quinta', 'Sábado'],
				availableTimeSlots: [
					{ startTime: '08:00', endTime: '09:30' },
					{ startTime: '10:00', endTime: '11:30' },
					{ startTime: '15:00', endTime: '16:30' },
				],
			},
		],
	},
];

const mockClubs = [
	{ id: '1', name: 'Clube Padel Pro' },
	{ id: '2', name: 'Arena Beach Padel' },
	{ id: '3', name: 'Center Court' },
];

export function StudentLessonsPage() {
	const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedClubId, setSelectedClubId] = useState<string>('');
	const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
	const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

	useEffect(() => {
		const loadTeachers = async () => {
			setIsLoading(true);
			try {
				// Simular delay de API
				await new Promise(resolve => setTimeout(resolve, 500));
				setTeachers(mockTeachers);
			} catch (error) {
				setTeachers([]);
			} finally {
				setIsLoading(false);
			}
		};

		void loadTeachers();
	}, []);

	const clubOptions = useMemo(
		() =>
			mockClubs.map(club => ({
				value: club.id,
				label: club.name,
			})),
		[]
	);

	const specialtyOptions = useMemo(() => {
		const specialties = new Set(teachers.flatMap(teacher => [teacher.specialty]));
		return Array.from(specialties).map(specialty => ({
			value: specialty,
			label: specialty,
		}));
	}, [teachers]);

	const filteredTeachers = useMemo(() => {
		let filtered = [...teachers];

		if (selectedClubId) {
			filtered = filtered.filter(teacher =>
				teacher.locations.some(loc => loc.clubId === selectedClubId)
			);
		}

		if (selectedSpecialty) {
			filtered = filtered.filter(teacher => teacher.specialty === selectedSpecialty);
		}

		return filtered;
	}, [teachers, selectedClubId, selectedSpecialty]);

	const handleTeacherClick = useCallback((teacher: Teacher) => {
		setSelectedTeacher(teacher);
	}, []);

	return (
		<div className='space-y-6 bg-white p-6 rounded-2xl shadow-sm text-secondary-900'>
			<header className='space-y-2'>
				<h1 className='text-2xl font-semibold text-secondary-900'>
					Encontre seu Professor
				</h1>
				<p className='text-sm text-secondary-600'>
					Explore professores disponíveis, suas especialidades, locais de atuação e valores.
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
							value={selectedClubId}
							onChangeValue={value =>
								setSelectedClubId(value == null ? '' : String(value))
							}
							placeholder='Filtrar por clube'
							isFullWidth
						/>
					</div>

					<div className='w-full md:w-1/3 space-y-2'>
						<label className='text-sm font-semibold text-secondary-900'>
							Especialidade
						</label>
						<Select
							options={[
								{ value: '', label: 'Todas especialidades' },
								...specialtyOptions,
							]}
							value={selectedSpecialty}
							onChangeValue={value =>
								setSelectedSpecialty(value == null ? '' : String(value))
							}
							placeholder='Filtrar por especialidade'
							isFullWidth
						/>
					</div>
				</div>
			</section>

			<section className='space-y-4'>
				{isLoading ? (
					<div className='flex h-64 items-center justify-center rounded-xl border border-orange-300 bg-white'>
						<Loading />
					</div>
				) : filteredTeachers.length === 0 ? (
					<div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-orange-200 bg-orange-50 py-16 text-center'>
						<p className='text-lg font-semibold text-gray-800'>
							Nenhum professor encontrado.
						</p>
						<p className='max-w-md text-sm text-gray-600'>
							Tente ajustar os filtros para encontrar professores disponíveis.
						</p>
					</div>
				) : (
					<div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
						{filteredTeachers.map(teacher => (
							<ProfessorCard
								key={teacher.id}
								teacher={teacher}
								onClick={() => handleTeacherClick(teacher)}
							/>
						))}
					</div>
				)}
			</section>

			<ProfessorDetailsModal
				isOpen={Boolean(selectedTeacher)}
				onClose={() => setSelectedTeacher(null)}
				teacher={selectedTeacher}
			/>
		</div>
	);
}

