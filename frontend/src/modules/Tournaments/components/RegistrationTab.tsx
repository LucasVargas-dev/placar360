import { useMemo, useState } from 'react';
import { Button, Toast } from '@packages/components';
import { CalendarClock, CreditCard, Users } from 'lucide-react';
import { TournamentResponse } from '@/entities/Tournament/Tournament.js';
import { TournamentParticipant } from '@/entities/TournamentParticipant/TournamentParticipant.js';
import { tournamentParticipantService } from '@/entities/TournamentParticipant/tournamentParticipant.service.js';
import { ParticipantStatus } from '@/entities/TournamentParticipant/participantStatus.js';
import { showApiErrorToast } from '@utils/errorHandling.js';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

type RegistrationTabProps = {
	tournament: TournamentResponse;
	participants: TournamentParticipant[];
	isRefreshing: boolean;
	onRefreshParticipants: () => Promise<void>;
};

const formatDate = (dateString?: string) => {
	if (!dateString) {
		return '-';
	}
	const parsed = new Date(dateString);
	if (Number.isNaN(parsed.getTime())) {
		return '-';
	}
	return parsed.toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	});
};

const formatCurrency = (value?: number | null) => {
	if (value === undefined || value === null) {
		return null;
	}
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(value);
};

export function RegistrationTab({
	tournament,
	participants,
	isRefreshing,
	onRefreshParticipants,
}: RegistrationTabProps) {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const today = new Date();
	const registrationStart = tournament.registrationStart
		? new Date(tournament.registrationStart)
		: null;
	const registrationEnd = tournament.registrationEnd
		? new Date(tournament.registrationEnd)
		: null;

	const isRegistrationWindowValid =
		registrationStart &&
		registrationEnd &&
		today >= registrationStart &&
		today <= registrationEnd;

	const entryFeeLabel = useMemo(() => {
		const price = formatCurrency(tournament.entryFee ?? null);
		return price ?? 'Definir valor na criação do torneio';
	}, [tournament.entryFee]);

	const userIsAlreadyRegistered = useMemo(() => {
		if (!user) {
			return false;
		}
		return participants.some(participant => participant.userId === user.id);
	}, [participants, user]);

	const availableVacancies = useMemo(() => {
		if (!tournament.maxParticipants) {
			return null;
		}
		return Math.max(tournament.maxParticipants - participants.length, 0);
	}, [participants.length, tournament.maxParticipants]);

	const canRegister =
		!isSubmitting &&
		!isRefreshing &&
		!!user &&
		isRegistrationWindowValid &&
		!userIsAlreadyRegistered &&
		(availableVacancies === null || availableVacancies > 0);

	const handleRegister = async () => {
		if (!user) {
			navigate('/login');
			return;
		}
		setIsSubmitting(true);
		try {
			await tournamentParticipantService.create({
				tournamentId: tournament.id,
				userId: user.id,
				status: ParticipantStatus.REGISTERED,
			});

			Toast.show({
				title: 'Inscrição realizada',
				description:
					'Você será notificado quando a organização confirmar sua participação.',
				status: 'success',
			});

			await onRefreshParticipants();
		} catch (error) {
			showApiErrorToast({
				error,
				title: 'Erro ao realizar inscrição',
				defaultMessage:
					'Não foi possível concluir sua inscrição. Verifique os dados e tente novamente.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!user) {
		return (
			<div className='flex flex-col items-center gap-4 rounded-xl border border-orange-200 bg-white p-8 text-center'>
				<p className='text-lg font-semibold text-gray-900'>
					Faça login para se inscrever
				</p>
				<p className='text-sm text-gray-600'>
					Entre com sua conta para participar deste torneio e acompanhar o status
					da inscrição.
				</p>
				<Button
					type='button'
					variant='secondary'
					className='border-orange-500 text-gray-900 hover:bg-orange-50'
					onClick={() => navigate('/login')}
				>
					Acessar minha conta
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-3'>
				<div className='rounded-xl border border-orange-200 bg-white p-4'>
					<div className='flex items-center gap-2 text-orange-600'>
						<CalendarClock className='h-4 w-4' />
						<p className='text-xs font-semibold uppercase tracking-wide'>
							Período de inscrição
						</p>
					</div>
					<p className='mt-2 text-sm text-gray-900'>
						{formatDate(tournament.registrationStart)} até{' '}
						{formatDate(tournament.registrationEnd)}
					</p>
					{!isRegistrationWindowValid && (
						<p className='mt-1 text-xs text-orange-600'>
							Inscrições disponíveis somente dentro do período informado.
						</p>
					)}
				</div>

				<div className='rounded-xl border border-orange-200 bg-white p-4'>
					<div className='flex items-center gap-2 text-orange-600'>
						<Users className='h-4 w-4' />
						<p className='text-xs font-semibold uppercase tracking-wide'>
							Vagas disponíveis
						</p>
					</div>
					<p className='mt-2 text-sm text-gray-900'>
						{tournament.maxParticipants
							? `${availableVacancies ?? 0} de ${tournament.maxParticipants} vagas`
							: 'Limite não definido'}
					</p>
					<p className='text-xs text-gray-600'>
						{participants.length} inscrito
						{participants.length === 1 ? '' : 's'} confirmados até agora.
					</p>
				</div>

				<div className='rounded-xl border border-orange-200 bg-white p-4'>
					<div className='flex items-center gap-2 text-orange-600'>
						<CreditCard className='h-4 w-4' />
						<p className='text-xs font-semibold uppercase tracking-wide'>
							Valor da inscrição
						</p>
					</div>
					<p className='mt-2 text-sm text-gray-900'>{entryFeeLabel}</p>
					{tournament.entryFee === undefined && (
						<p className='mt-1 text-xs text-gray-600'>
							<strong>Falta backend:</strong> adicionar campo de valor em
							torneios para mostrar o preço real e iniciar fluxo de pagamento.
						</p>
					)}
				</div>
			</div>

			<div className='space-y-4 rounded-2xl border border-orange-200 bg-white p-4'>
				<div className='flex flex-col gap-1'>
					<p className='text-sm font-semibold text-gray-900'>
						Clubes do torneio
					</p>
					<p className='text-sm text-gray-600'>
						Os jogos acontecerão nos clubes associados abaixo.
					</p>
				</div>
				{tournament.clubHasTournaments?.length ? (
					<div className='grid gap-3 md:grid-cols-2'>
						{tournament.clubHasTournaments.map(link => (
							<div
								key={`${link.tournamentId}-${link.clubId}`}
								className='rounded-xl border border-orange-200 bg-white p-3'
							>
								<p className='text-base font-semibold text-gray-900'>
									{link.club?.name ?? 'Clube não informado'}
								</p>
								<p className='text-sm text-gray-600'>
									{link.club?.city
										? `${link.club.city}${link.club?.state ? `/${link.club.state}` : ''}`
										: 'Cidade não informada'}
								</p>
							</div>
						))}
					</div>
				) : (
					<p className='text-sm text-gray-600'>
						Clubes ainda não vinculados. Ajuste o cadastro do torneio para
						exibir essa informação.
					</p>
				)}
			</div>

			<div className='rounded-2xl border border-orange-200 bg-white p-4'>
				<div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
					<div>
						<p className='text-base font-semibold text-gray-900'>
							Confirme sua participação
						</p>
						{userIsAlreadyRegistered ? (
							<p className='text-sm text-gray-600'>
								Você já está inscrito neste torneio. Acompanhe a confirmação em
								“Inscritos”.
							</p>
						) : (
							<p className='text-sm text-gray-600'>
								Após confirmar, sua inscrição ficará com status{' '}
								<strong>“Pré-inscrito”</strong> até a validação da organização.
							</p>
						)}
					</div>
					<Button
						type='button'
						variant='secondary'
						className='border-orange-500 text-gray-900 hover:bg-orange-50'
						onClick={handleRegister}
						isDisabled={!canRegister}
						isLoading={isSubmitting}
					>
						{userIsAlreadyRegistered ? 'Inscrição realizada' : 'Quero me inscrever'}
					</Button>
				</div>

				{!isRegistrationWindowValid && (
					<p className='mt-2 text-sm text-orange-600'>
						As inscrições estarão liberadas apenas durante o período informado.
					</p>
				)}
				{availableVacancies === 0 && (
					<p className='mt-2 text-sm text-orange-600'>
						Todas as vagas foram preenchidas. Entre em contato com a organização
						para verificar a lista de espera.
					</p>
				)}
			</div>
		</div>
	);
}

