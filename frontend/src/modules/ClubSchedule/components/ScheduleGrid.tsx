import { memo, useMemo } from 'react';
import {
	ClubScheduleCourt,
	ClubScheduleDay,
	ClubScheduleSlot,
} from '@/entities/ClubSchedule/ClubSchedule.js';

type ScheduleGridProps = {
	day: ClubScheduleDay | null;
	onSelectSlot: (params: {
		slot: ClubScheduleSlot;
		court: ClubScheduleCourt;
		date: string;
	}) => void;
	emptyMessage?: string;
};

const formatTime = (iso: string) =>
	new Date(iso).toLocaleTimeString('pt-BR', {
		hour: '2-digit',
		minute: '2-digit',
	});

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2,
});

const ScheduleGridComponent = ({
	day,
	onSelectSlot,
	emptyMessage = 'Nenhum horário disponível para o período selecionado.',
}: ScheduleGridProps) => {
	const sortedCourts = useMemo(() => {
		if (!day) return [];
		return [...day.courts].sort((a, b) =>
			a.courtName.localeCompare(b.courtName)
		);
	}, [day]);

	const timeSlots = useMemo(() => {
		if (!day) return [];
		const unique = new Map<string, { startTime: string; endTime: string }>();

		for (const court of day.courts) {
			for (const slot of court.slots) {
				if (!unique.has(slot.startTime)) {
					unique.set(slot.startTime, {
						startTime: slot.startTime,
						endTime: slot.endTime,
					});
				}
			}
		}

		return Array.from(unique.values()).sort(
			(a, b) =>
				new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
		);
	}, [day]);

	if (!day || sortedCourts.length === 0) {
		return (
			<div className='rounded-xl border border-orange-300 bg-white p-6 text-sm text-secondary-700'>
				{emptyMessage}
			</div>
		);
	}

	if (timeSlots.length === 0) {
		return (
			<div className='rounded-xl border border-orange-300 bg-white p-6 text-sm text-secondary-700'>
				Não há intervalos de horários cadastrados para as quadras deste clube.
			</div>
		);
	}

	return (
		<div className='overflow-x-auto rounded-xl border border-orange-300 bg-white shadow-sm'>
			<table className='min-w-full border-collapse text-secondary-900'>
				<thead>
					<tr className='bg-white'>
						<th className='px-4 py-3 text-left text-sm font-semibold text-secondary-900 border-b border-orange-300 min-w-[140px]'>
							Horário
						</th>
						{sortedCourts.map(court => (
							<th
								key={court.courtId}
								className='px-4 py-3 text-left text-sm font-semibold text-secondary-900 border-b border-l border-orange-300'
							>
								<div className='flex flex-col gap-1'>
									<span>{court.courtName}</span>
									<span className='text-xs font-normal text-secondary-600'>
										{court.sportType}
									</span>
									{court.hourlyRate != null && (
										<span className='text-xs font-medium text-secondary-500'>
											{currencyFormatter.format(court.hourlyRate)}/h
										</span>
									)}
								</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{timeSlots.map(slot => (
						<tr key={slot.startTime} className='even:bg-white odd:bg-white'>
							<td className='border-t border-orange-200 px-4 py-3 text-sm font-medium text-secondary-900 align-top'>
								<div className='flex flex-col'>
									<span>{formatTime(slot.startTime)}</span>
									<span className='text-xs font-normal text-secondary-600'>
										{formatTime(slot.endTime)}
									</span>
								</div>
							</td>
							{sortedCourts.map(court => {
								const courtSlot = court.slots.find(
									innerSlot => innerSlot.startTime === slot.startTime
								);

								if (!courtSlot) {
									return (
										<td
											key={`${court.courtId}-${slot.startTime}`}
											className='border-t border-l border-orange-200 px-4 py-3 text-sm text-secondary-500 align-top'
										>
											<span className='text-xs'>Sem horário configurado</span>
										</td>
									);
								}

								if (courtSlot.isAvailable) {
									const slotDurationMinutes = Math.max(
										0,
										Math.round(
											(new Date(courtSlot.endTime).getTime() -
												new Date(courtSlot.startTime).getTime()) /
												60000
										)
									);
									const slotPrice =
										court.hourlyRate != null && slotDurationMinutes > 0
											? currencyFormatter.format(
													(court.hourlyRate * slotDurationMinutes) / 60
												)
											: null;

									return (
										<td
											key={`${court.courtId}-${slot.startTime}`}
											className='border-t border-l border-orange-200 px-4 py-3 align-top'
										>
											<button
												type='button'
												onClick={() =>
													onSelectSlot({
														slot: courtSlot,
														court,
														date: day.date,
													})
												}
												className='w-full rounded-lg border border-orange-300 bg-white px-3 py-2 text-sm font-medium text-secondary-900 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-1 focus:ring-offset-white'
											>
												<div className='flex flex-col items-start'>
													<span>Disponível</span>
													{slotPrice && (
														<span className='mt-1 text-xs font-semibold text-secondary-600'>
															{slotPrice}
															{slotDurationMinutes
																? ` • ${slotDurationMinutes} min`
																: ''}
														</span>
													)}
												</div>
											</button>
										</td>
									);
								}

								if (courtSlot.booking) {
									return (
										<td
											key={`${court.courtId}-${slot.startTime}`}
											className='border-t border-l border-orange-200 px-4 py-3 align-top'
										>
											<div className='rounded-lg border border-orange-200 bg-white px-3 py-2'>
												<span className='text-sm font-semibold text-secondary-900'>
													{courtSlot.booking?.user?.name ?? 'Agendado'}
												</span>
												{courtSlot.booking?.user?.email && (
													<span className='mt-1 block text-xs text-secondary-600'>
														{courtSlot.booking.user.email}
													</span>
												)}
												<span className='mt-2 block text-xs font-medium text-secondary-700'>
													Status: {courtSlot.booking?.status ?? 'Indefinido'}
												</span>
											</div>
										</td>
									);
								}

								return (
									<td
										key={`${court.courtId}-${slot.startTime}`}
										className='border-t border-l border-orange-200 px-4 py-3 align-top'
									>
										<div className='rounded-lg border border-dashed border-orange-200 bg-white px-3 py-2 text-sm text-secondary-600'>
											{courtSlot.isPast ? 'Horário passado' : 'Indisponível'}
										</div>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export const ScheduleGrid = memo(ScheduleGridComponent);



