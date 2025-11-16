import { Button, Loading } from '@packages/components';
import { Users } from 'lucide-react';
import { TournamentParticipant } from '@/entities/TournamentParticipant/TournamentParticipant.js';

type ParticipantsTabProps = {
	participants: TournamentParticipant[];
	isLoading: boolean;
	onRetry: () => void;
};

const formatDateTime = (isoDate?: string) => {
	if (!isoDate) {
		return '-';
	}

	const parsed = new Date(isoDate);
	if (Number.isNaN(parsed.getTime())) {
		return '-';
	}

	return parsed.toLocaleString('pt-BR', {
		day: '2-digit',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export function ParticipantsTab({ participants, isLoading, onRetry }: ParticipantsTabProps) {
	if (isLoading) {
		return (
			<Loading
				message='Carregando inscritos...'
				className='rounded-xl border border-orange-100 bg-white'
			/>
		);
	}

	if (!participants.length) {
		return (
			<div className='flex flex-col items-center gap-4 rounded-xl border border-orange-200 bg-white p-8 text-center'>
				<div className='rounded-full border border-orange-200 bg-white p-3 text-orange-500'>
					<Users className='h-5 w-5' />
				</div>
				<div className='space-y-2'>
					<p className='text-lg font-semibold text-gray-900'>
						Ainda não há inscritos
					</p>
					<p className='text-sm text-gray-600'>
						Quando jogadores, times ou duplas confirmarem presença, eles aparecerão aqui.
					</p>
				</div>
				<Button
					type='button'
					variant='secondary'
					className='border-orange-500 text-gray-900 hover:bg-orange-50'
					onClick={onRetry}
				>
					Tentar novamente
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			{participants.map(participant => (
				<div
					key={participant.id}
					className='space-y-4 rounded-xl border border-orange-200 bg-white p-4 shadow-sm'
				>
					<div className='flex flex-wrap items-center justify-between gap-3'>
						<div>
							<p className='text-sm text-gray-600'>Participante</p>
							<p className='text-lg font-semibold text-gray-900'>
								{participant.user?.name ?? participant.user?.email ?? 'Não informado'}
							</p>
							{participant.user?.email && (
								<p className='text-sm text-gray-600'>{participant.user.email}</p>
							)}
						</div>
						<span className='rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-900'>
							{participant.status}
						</span>
					</div>

					<div className='grid gap-4 md:grid-cols-3'>
						<div className='rounded-lg border border-orange-100 bg-white p-3'>
							<p className='text-xs font-semibold uppercase text-orange-500'>
								Inscrição em
							</p>
							<p className='text-sm text-gray-900'>
								{formatDateTime(participant.registeredAt)}
							</p>
						</div>
						<div className='rounded-lg border border-orange-100 bg-white p-3'>
							<p className='text-xs font-semibold uppercase text-orange-500'>
								Status
							</p>
							<p className='text-sm text-gray-900'>{participant.status}</p>
						</div>
						<div className='rounded-lg border border-orange-100 bg-white p-3'>
							<p className='text-xs font-semibold uppercase text-orange-500'>
								Identificador
							</p>
							<p className='text-sm text-gray-900'>{participant.id}</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

