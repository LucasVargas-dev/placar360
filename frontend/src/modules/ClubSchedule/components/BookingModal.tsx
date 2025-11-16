import { useEffect, useMemo, useState } from 'react';
import { Button, Modal, Select } from '@packages/components';
import {
	ClubScheduleCourt,
	ClubSchedulePlayer,
	ClubScheduleSlot,
} from '@/entities/ClubSchedule/ClubSchedule.js';

type BookingModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (payload: { userId: string; notes: string }) => void;
	isSubmitting: boolean;
	slotInfo: null | {
		slot: ClubScheduleSlot;
		court: ClubScheduleCourt;
		date: string;
	};
	players: ClubSchedulePlayer[];
};

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});

const formatTime = (iso: string) =>
	new Date(iso).toLocaleTimeString('pt-BR', {
		hour: '2-digit',
		minute: '2-digit',
	});

export function BookingModal({
	isOpen,
	onClose,
	onConfirm,
	isSubmitting,
	slotInfo,
	players,
}: BookingModalProps) {
	const [selectedPlayer, setSelectedPlayer] = useState<string>('');
	const [notes, setNotes] = useState('');

	useEffect(() => {
		if (slotInfo && players.length > 0) {
			setSelectedPlayer(prev =>
				prev || players[0]?.id ? players[0].id : ''
			);
		} else if (!isOpen) {
			setSelectedPlayer('');
			setNotes('');
		}
	}, [isOpen, slotInfo, players]);

	const playerOptions = useMemo(
		() =>
			players.map(player => ({
				value: player.id,
				label: player.name ?? player.email ?? 'Jogador sem nome',
			})),
		[players]
	);

	if (!slotInfo) return null;

	const handleConfirm = () => {
		if (!selectedPlayer) return;
		onConfirm({ userId: selectedPlayer, notes });
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Confirmar Agendamento'
			size='md'
			className='bg-white text-secondary-900'
			footerButtons={
				<>
					<Button
						variant='ghost'
						onClick={onClose}
						disabled={isSubmitting}
					>
						Cancelar
					</Button>
					<Button
						onClick={handleConfirm}
						isLoading={isSubmitting}
						disabled={!selectedPlayer || players.length === 0}
					>
						Confirmar
					</Button>
				</>
			}
		>
			<div className='space-y-3 text-secondary-900'>
				<div>
					<p className='text-sm font-semibold'>Quadra</p>
					<p className='text-sm'>
						{slotInfo.court.courtName} • {slotInfo.court.sportType}
					</p>
				</div>
				<div className='grid grid-cols-2 gap-4 text-sm'>
					<div>
						<p className='font-semibold'>Data</p>
						<p>{formatDate(slotInfo.date)}</p>
					</div>
					<div>
						<p className='font-semibold'>Horário</p>
						<p>
							{formatTime(slotInfo.slot.startTime)} -{' '}
							{formatTime(slotInfo.slot.endTime)}
						</p>
					</div>
				</div>

				<div className='space-y-2'>
					<label className='block text-sm font-semibold text-secondary-900'>
						Jogador responsável
					</label>
					{players.length === 0 ? (
						<div className='rounded-lg border border-orange-300 bg-white p-3 text-sm text-secondary-600'>
							Nenhum jogador associado ao clube. Cadastre jogadores para permitir
							agendamentos.
						</div>
					) : (
						<Select
							options={playerOptions}
							value={selectedPlayer}
							onChangeValue={value => setSelectedPlayer(String(value))}
							placeholder='Selecione um jogador'
							isFullWidth
						/>
					)}
				</div>

				<div className='space-y-2'>
					<label className='block text-sm font-semibold text-secondary-900'>
						Observações
					</label>
					<textarea
						value={notes}
						onChange={event => setNotes(event.target.value)}
						className='w-full rounded-lg border border-orange-300 bg-white p-3 text-sm text-secondary-900 outline-none focus:ring-2 focus:ring-orange-300'
						rows={3}
						placeholder='Adicione observações opcionais'
					/>
				</div>
			</div>
		</Modal>
	);
}


