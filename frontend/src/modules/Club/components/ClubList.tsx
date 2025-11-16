import { Fragment } from 'react';
import {
	ActionsOptionsTable,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@packages/components';
import { ClubResponse } from '@/entities/Club/Club.js';
import { type CourtResponse } from '@/entities/Court/Court.js';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CalendarBlank, PlusCircle } from 'phosphor-react';

interface ClubListProps {
	itemsPerPage: number;
	isLoading: boolean;
	clubs: ClubResponse[] | null;
	onEditClick: (club: ClubResponse) => void;
	onDeleteClick: (club: ClubResponse) => void;
	onAddCourt: (club: ClubResponse) => void;
	onEditCourt: (court: CourtResponse, club: ClubResponse) => void;
	onDeleteCourt: (court: CourtResponse, club: ClubResponse) => void;
	expandedClubIds: string[];
	onToggleExpand: (clubId: string) => void;
	onOpenSchedule: (club: ClubResponse) => void;
}

export function ClubList({
	itemsPerPage,
	isLoading,
	clubs,
	onEditClick,
	onDeleteClick,
	onAddCourt,
	onEditCourt,
	onDeleteCourt,
	expandedClubIds,
	onToggleExpand,
	onOpenSchedule,
}: ClubListProps) {
	const columnsCount = 6;

	const renderCourts = (club: ClubResponse) => {
		const courts = (club.courts ?? []) as CourtResponse[];

		if (courts.length === 0) {
			return (
				<div className='rounded-lg border border-dashed border-secondary-300 bg-secondary-50 p-4 text-sm text-secondary-600'>
					Nenhuma quadra cadastrada para este clube.
				</div>
			);
		}

		return (
			<div className='overflow-hidden rounded-lg border border-secondary-200 bg-white shadow-sm'>
				<Table className='w-full'>
					<TableHeader>
						<TableRow className='bg-secondary-50'>
							<TableHead className='text-xs font-semibold uppercase text-secondary-600'>
								Nome
							</TableHead>
							<TableHead className='text-xs font-semibold uppercase text-secondary-600'>
								Modalidade
							</TableHead>
							<TableHead className='text-xs font-semibold uppercase text-secondary-600'>
								Superfície
							</TableHead>
							<TableHead className='text-xs font-semibold uppercase text-secondary-600'>
								Duração padrão
							</TableHead>
							<TableHead className='text-xs font-semibold uppercase text-secondary-600'>
								Valor/Hora
							</TableHead>
							<TableHead className='text-xs font-semibold uppercase text-secondary-600'>
								Status
							</TableHead>
							<TableHead className='text-right text-xs font-semibold uppercase text-secondary-600'>
								Ações
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{courts.map(court => {
							const parsedHourlyRate =
								court.hourlyRate == null
									? null
									: typeof court.hourlyRate === 'number'
									? court.hourlyRate
									: Number.parseFloat(String(court.hourlyRate));

							return (
								<TableRow key={court.id}>
									<TableCell className='text-sm font-medium text-secondary-900'>
										{court.name}
									</TableCell>
									<TableCell className='text-sm text-secondary-700'>
										{court.sportType}
									</TableCell>
									<TableCell className='text-sm text-secondary-700'>
										{court.surface || '-'}
									</TableCell>
									<TableCell className='text-sm text-secondary-700'>
										{court.defaultSlotMinutes != null
											? `${court.defaultSlotMinutes} min`
											: '-'}
									</TableCell>
									<TableCell className='text-sm text-secondary-700'>
										{parsedHourlyRate != null && !Number.isNaN(parsedHourlyRate)
											? `R$ ${parsedHourlyRate.toFixed(2)}`
											: '-'}
									</TableCell>
									<TableCell className='text-sm'>
										<span
											className={
												court.isActive
													? 'text-emerald-600'
													: 'text-secondary-400'
											}
										>
											{court.isActive ? 'Ativa' : 'Inativa'}
										</span>
									</TableCell>
									<TableCell className='text-right'>
										<ActionsOptionsTable
											onEdit={() => onEditCourt(court, club)}
											onDelete={() => onDeleteCourt(court, club)}
											additionalActions={[]}
											className='justify-end'
										/>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		);
	};

	return (
		<Table className='min-w-full'>
			<TableHeader>
				<TableRow>
					<TableHead className='w-12' />
					<TableHead>Nome</TableHead>
					<TableHead>Cidade</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className='w-36 text-right'>Ações</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{isLoading ? (
					<TableRow>
						<TableCell colSpan={columnsCount}>
							<div className='space-y-3 py-4'>
								{Array.from({ length: Math.min(itemsPerPage, 3) }).map(
									(_, index) => (
										<Skeleton
											// eslint-disable-next-line react/no-array-index-key
											key={index}
											className='h-10 w-full'
										/>
									)
								)}
							</div>
						</TableCell>
					</TableRow>
				) : !clubs || clubs.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={columnsCount}
							className='py-6 text-center text-sm text-secondary-600'
						>
							Nenhum clube cadastrado.
						</TableCell>
					</TableRow>
				) : (
					clubs.map(club => {
						const isExpanded = expandedClubIds.includes(club.id);
						return (
							<Fragment key={club.id}>
								<TableRow className='hover:bg-orange-50'>
									<TableCell className='align-middle'>
										<button
											type='button'
											onClick={() => onToggleExpand(club.id)}
											className='flex items-center justify-center rounded-md border border-secondary-300 p-1 transition-colors hover:bg-secondary-100'
											aria-label={
												isExpanded
													? 'Recolher quadras do clube'
													: 'Exibir quadras do clube'
											}
										>
											{isExpanded ? (
												<ChevronDown className='h-4 w-4 text-secondary-700' />
											) : (
												<ChevronRight className='h-4 w-4 text-secondary-700' />
											)}
										</button>
									</TableCell>
									<TableCell className='font-medium text-secondary-900'>
										{club.name}
									</TableCell>
									<TableCell>{club.city || '-'}</TableCell>
									<TableCell>{club.email || '-'}</TableCell>
									<TableCell>
										<span
											className={
												club.isActive ? 'text-emerald-600' : 'text-secondary-400'
											}
										>
											{club.isActive ? 'Ativo' : 'Inativo'}
										</span>
									</TableCell>
									<TableCell className='text-right'>
										<ActionsOptionsTable
											onEdit={() => onEditClick(club)}
											onDelete={() => onDeleteClick(club)}
											additionalActions={[
												{
													Icon: CalendarBlank,
													action: () => onOpenSchedule(club),
												},
												{
													Icon: PlusCircle,
													action: () => onAddCourt(club),
												},
											]}
										/>
									</TableCell>
								</TableRow>
								{isExpanded && (
									<TableRow className='bg-secondary-50'>
										<TableCell colSpan={columnsCount}>
											<div className='space-y-3 border-t border-secondary-200 pt-4'>
												<div className='flex items-center justify-between'>
													<h4 className='text-sm font-semibold text-secondary-800'>
														Quadras do clube
													</h4>
													<button
														type='button'
														onClick={() => onAddCourt(club)}
														className='text-sm font-medium text-orange-600 transition-colors hover:text-orange-700'
													>
														Adicionar quadra
													</button>
												</div>
												{renderCourts(club)}
											</div>
										</TableCell>
									</TableRow>
								)}
							</Fragment>
						);
					})
				)}
			</TableBody>
		</Table>
	);
}

