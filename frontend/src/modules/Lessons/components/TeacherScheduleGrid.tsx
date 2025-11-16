import { memo, useMemo } from 'react';
import { Lesson, LessonScheduleDay } from '../types';
import { MapPin, Clock, Users, DollarSign } from 'lucide-react';

type TeacherScheduleGridProps = {
	day: LessonScheduleDay | null;
	onLessonClick: (lesson: Lesson) => void;
};

const formatTime = (iso: string) =>
	new Date(iso).toLocaleTimeString('pt-BR', {
		hour: '2-digit',
		minute: '2-digit',
	});

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	});

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2,
});

const TeacherScheduleGridComponent = ({
	day,
	onLessonClick,
}: TeacherScheduleGridProps) => {
	if (!day || day.lessons.length === 0) {
		return (
			<div className='rounded-xl border border-orange-300 bg-white p-6 text-sm text-secondary-700'>
				Nenhuma aula agendada para este período.
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-secondary-700'>
				<strong>{formatDate(day.date)}</strong> - {day.lessons.length} aula(s) agendada(s)
			</div>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
				{day.lessons.map(lesson => (
					<button
						key={lesson.id}
						type='button'
						onClick={() => onLessonClick(lesson)}
						className='group rounded-xl border-2 border-orange-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300'
					>
						<div className='space-y-3'>
							<div className='flex items-start justify-between gap-2'>
								<div className='flex-1'>
									<h3 className='text-lg font-semibold text-gray-900'>
										{lesson.specialty}
									</h3>
									<p className='mt-1 text-sm text-gray-600'>
										{lesson.sportType}
									</p>
								</div>
								<span className='inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700'>
									{currencyFormatter.format(lesson.price)}
								</span>
							</div>

							<div className='space-y-2 text-sm text-gray-600'>
								<div className='flex items-center gap-2'>
									<Clock className='h-4 w-4 text-orange-500' />
									<span>
										{formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
									</span>
								</div>

								<div className='flex items-center gap-2'>
									<MapPin className='h-4 w-4 text-orange-500' />
									<span>
										{lesson.clubName} • {lesson.courtName}
									</span>
								</div>

								<div className='flex items-center gap-2'>
									<Users className='h-4 w-4 text-orange-500' />
									<span>
										{lesson.students.length} / {lesson.maxStudents} alunos
									</span>
								</div>
							</div>

							<div className='pt-2 border-t border-orange-100'>
								<div className='flex items-center justify-between'>
									<span className='text-xs text-gray-500'>
										{lesson.students.filter(s => s.status === 'confirmed').length} confirmado(s)
									</span>
									{lesson.students.some(s => s.status === 'pending') && (
										<span className='text-xs font-medium text-orange-600'>
											{lesson.students.filter(s => s.status === 'pending').length} pendente(s)
										</span>
									)}
								</div>
							</div>
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export const TeacherScheduleGrid = memo(TeacherScheduleGridComponent);

