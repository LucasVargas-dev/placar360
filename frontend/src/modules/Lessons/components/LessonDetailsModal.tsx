import { X, Clock, MapPin, Users, DollarSign, Mail, Calendar } from 'lucide-react';
import { Lesson } from '../types';

type LessonDetailsModalProps = {
	isOpen: boolean;
	onClose: () => void;
	lesson: Lesson | null;
};

const formatTime = (iso: string) =>
	new Date(iso).toLocaleTimeString('pt-BR', {
		hour: '2-digit',
		minute: '2-digit',
	});

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('pt-BR', {
		weekday: 'long',
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	});

const formatDateTime = (iso: string) =>
	new Date(iso).toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2,
});

const statusLabels: Record<string, string> = {
	confirmed: 'Confirmado',
	pending: 'Pendente',
	cancelled: 'Cancelado',
};

const statusStyles: Record<string, string> = {
	confirmed: 'bg-green-100 text-green-700 border-green-200',
	pending: 'bg-orange-100 text-orange-700 border-orange-200',
	cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export function LessonDetailsModal({
	isOpen,
	onClose,
	lesson,
}: LessonDetailsModalProps) {
	if (!isOpen || !lesson) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
			<div className='relative w-full max-w-2xl rounded-2xl bg-white shadow-xl'>
				<button
					type='button'
					onClick={onClose}
					className='absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
				>
					<X className='h-5 w-5' />
				</button>

				<div className='p-6'>
					<div className='mb-6 space-y-2'>
						<h2 className='text-2xl font-bold text-gray-900'>{lesson.specialty}</h2>
						<p className='text-sm text-gray-600'>{lesson.sportType}</p>
					</div>

					<div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<div className='flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4'>
							<Calendar className='h-5 w-5 text-orange-500 mt-0.5' />
							<div>
								<p className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>
									Data e Horário
								</p>
								<p className='mt-1 text-sm font-medium text-gray-900'>
									{formatDate(lesson.date)}
								</p>
								<p className='text-sm text-gray-600'>
									{formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
								</p>
							</div>
						</div>

						<div className='flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4'>
							<MapPin className='h-5 w-5 text-orange-500 mt-0.5' />
							<div>
								<p className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>
									Local
								</p>
								<p className='mt-1 text-sm font-medium text-gray-900'>
									{lesson.clubName}
								</p>
								<p className='text-sm text-gray-600'>{lesson.courtName}</p>
							</div>
						</div>

						<div className='flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4'>
							<Users className='h-5 w-5 text-orange-500 mt-0.5' />
							<div>
								<p className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>
									Alunos
								</p>
								<p className='mt-1 text-sm font-medium text-gray-900'>
									{lesson.students.length} / {lesson.maxStudents}
								</p>
								<p className='text-sm text-gray-600'>Vagas disponíveis</p>
							</div>
						</div>

						<div className='flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4'>
							<DollarSign className='h-5 w-5 text-orange-500 mt-0.5' />
							<div>
								<p className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>
									Valor
								</p>
								<p className='mt-1 text-lg font-bold text-gray-900'>
									{currencyFormatter.format(lesson.price)}
								</p>
							</div>
						</div>
					</div>

					<div className='space-y-4'>
						<h3 className='text-lg font-semibold text-gray-900'>
							Alunos Inscritos ({lesson.students.length})
						</h3>

						{lesson.students.length === 0 ? (
							<div className='rounded-lg border border-dashed border-orange-200 bg-orange-50 p-4 text-center text-sm text-gray-600'>
								Nenhum aluno inscrito ainda.
							</div>
						) : (
							<div className='space-y-2'>
								{lesson.students.map(student => (
									<div
										key={student.id}
										className='flex items-center justify-between rounded-lg border border-orange-200 bg-white p-4'
									>
										<div className='flex-1'>
											<div className='flex items-center gap-3'>
												<div>
													<p className='font-semibold text-gray-900'>{student.name}</p>
													<div className='mt-1 flex items-center gap-2 text-sm text-gray-600'>
														<Mail className='h-3 w-3' />
														<span>{student.email}</span>
													</div>
												</div>
											</div>
											<p className='mt-2 text-xs text-gray-500'>
												Inscrito em {formatDateTime(student.registeredAt)}
											</p>
										</div>
										<span
											className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[student.status] || statusStyles.pending}`}
										>
											{statusLabels[student.status] || student.status}
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				<div className='border-t border-orange-200 bg-gray-50 px-6 py-4'>
					<button
						type='button'
						onClick={onClose}
						className='w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600'
					>
						Fechar
					</button>
				</div>
			</div>
		</div>
	);
}

