import { X, Star, MapPin, DollarSign, Clock, Mail } from 'lucide-react';
import { Teacher } from '../types';

type ProfessorDetailsModalProps = {
	isOpen: boolean;
	onClose: () => void;
	teacher: Teacher | null;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2,
});

export function ProfessorDetailsModal({
	isOpen,
	onClose,
	teacher,
}: ProfessorDetailsModalProps) {
	if (!isOpen || !teacher) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
			<div className='relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl'>
				<div className='flex-shrink-0 flex justify-end p-4 border-b border-orange-200'>
					<button
						type='button'
						onClick={onClose}
						className='flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
					>
						<X className='h-5 w-5' />
					</button>
				</div>

				<div className='flex-1 overflow-y-auto p-6'>
					<div className='mb-6 space-y-3'>
						<div className='flex items-start justify-between gap-4'>
							<div>
								<h2 className='text-2xl font-bold text-gray-900'>{teacher.name}</h2>
								{teacher.rating && (
									<div className='mt-2 flex items-center gap-1'>
										<Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
										<span className='text-base font-semibold text-gray-700'>
											{teacher.rating.toFixed(1)}
										</span>
									</div>
								)}
							</div>
							<div className='rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700'>
								{teacher.specialty}
							</div>
						</div>

						{teacher.email && (
							<div className='flex items-center gap-2 text-sm text-gray-600'>
								<Mail className='h-4 w-4' />
								<span>{teacher.email}</span>
							</div>
						)}

						{teacher.bio && (
							<p className='text-sm leading-relaxed text-gray-600'>{teacher.bio}</p>
						)}
					</div>

					<div className='space-y-6'>
						<div>
							<h3 className='mb-4 text-lg font-semibold text-gray-900'>
								Locais de Atuação ({teacher.locations.length})
							</h3>

							<div className='space-y-4'>
								{teacher.locations.map((location, index) => (
									<div
										key={`${location.clubId}-${location.courtId}`}
										className='rounded-xl border-2 border-orange-200 bg-white p-5'
									>
										<div className='mb-4 space-y-2'>
											<div className='flex items-start justify-between gap-2'>
												<div>
													<h4 className='text-lg font-semibold text-gray-900'>
														{location.clubName}
													</h4>
													<div className='mt-1 flex items-center gap-2 text-sm text-gray-600'>
														<MapPin className='h-4 w-4 text-orange-500' />
														<span>{location.courtName}</span>
														<span className='text-gray-400'>•</span>
														<span>{location.sportType}</span>
													</div>
												</div>
												<div className='rounded-lg bg-orange-100 px-3 py-2'>
													<div className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>
														Valor
													</div>
													<div className='text-lg font-bold text-orange-700'>
														{currencyFormatter.format(location.price)}
													</div>
												</div>
											</div>
										</div>

										<div className='space-y-3'>
											<div>
												<p className='mb-2 text-xs font-semibold text-gray-600 uppercase tracking-wide'>
													Dias Disponíveis
												</p>
												<div className='flex flex-wrap gap-2'>
													{location.availableDays.map(day => (
														<span
															key={day}
															className='rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 border border-orange-200'
														>
															{day}
														</span>
													))}
												</div>
											</div>

											<div>
												<p className='mb-2 text-xs font-semibold text-gray-600 uppercase tracking-wide'>
													Horários Disponíveis
												</p>
												<div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
													{location.availableTimeSlots.map((slot, slotIndex) => (
														<div
															key={slotIndex}
															className='flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm'
														>
															<Clock className='h-3 w-3 text-orange-500' />
															<span className='font-medium text-gray-900'>
																{slot.startTime} - {slot.endTime}
															</span>
														</div>
													))}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className='flex-shrink-0 border-t border-orange-200 bg-gray-50 px-6 py-4'>
					<div className='flex gap-3'>
						<button
							type='button'
							onClick={onClose}
							className='flex-1 rounded-lg border-2 border-orange-300 bg-white px-4 py-2 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50'
						>
							Fechar
						</button>
						<button
							type='button'
							onClick={() => {
								// TODO: Implementar agendamento de aula
								onClose();
							}}
							className='flex-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600'
						>
							Agendar Aula
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

