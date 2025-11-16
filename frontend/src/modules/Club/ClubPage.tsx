import { useEffect, useMemo, useState } from 'react';
import {
	FilterHeader,
	FormModal,
	Pagination,
	Toast,
	type FilterSearchOption,
} from '@packages/components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
	CreateClubSchema,
	type CreateClubDto,
	type UpdateClubDto,
} from '@/entities/Club/clubSchema.js';
import { clubService } from '@/entities/Club/club.service.js';
import { type ClubResponse, type ClubRequest } from '@/entities/Club/Club.js';
import { PaginationReturn } from '@interfaces/PaginationReturn.js';
import { ClubHeader } from './components/ClubHeader.js';
import { ClubList } from './components/ClubList.js';
import { ClubFormTab } from './components/form/ClubFormTab.js';
import { useDisclosure, useZodForm } from '@/hooks';
import { showApiErrorToast } from '@utils/errorHandling.js';
import { CourtFormFields } from './components/form/CourtFormFields.js';
import { courtService } from '@/entities/Court/court.service.js';
import {
	CreateCourtSchema,
	type CreateCourtDto,
	type UpdateCourtDto,
} from '@/entities/Court/courtSchema.js';
import { type CourtResponse } from '@/entities/Court/Court.js';

type SearchState = {
	field: string;
	value?: string;
};

const searchOptions: FilterSearchOption[] = [
	{ value: 'name', label: 'Nome' },
	{ value: 'city', label: 'Cidade' },
	{ value: 'email', label: 'Email' },
	{
		value: 'status',
		label: 'Status',
		type: 'select',
		selectOptions: [
			{ value: 'active', label: 'Ativo' },
			{ value: 'inactive', label: 'Inativo' },
		],
	},
];

export function ClubPage(): JSX.Element {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [clubs, setClubs] = useState<ClubResponse[] | null>(null);
	const [selectedClub, setSelectedClub] = useState<ClubResponse | null>(null);
	const [formAction, setFormAction] = useState<'add' | 'edit' | 'delete'>('add');
	const formModal = useDisclosure(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [paginationData, setPaginationData] = useState<PaginationReturn<ClubResponse> | null>(null);
	const [searchState, setSearchState] = useState<SearchState>({
		field: searchOptions[0].value,
	});
	const [expandedClubIds, setExpandedClubIds] = useState<string[]>([]);
	const courtModal = useDisclosure(false);
	const [courtAction, setCourtAction] = useState<'add' | 'edit' | 'delete'>('add');
	const [selectedCourt, setSelectedCourt] = useState<CourtResponse | null>(null);
	const [selectedClubForCourt, setSelectedClubForCourt] = useState<ClubResponse | null>(null);
	const [isCourtSubmitting, setIsCourtSubmitting] = useState(false);

	const currentPage = Number(searchParams.get('page')) || 1;
	const limit = Number(searchParams.get('limit')) || 15;

	const isEdit = formAction === 'edit';
	const form = useZodForm({
		schema: CreateClubSchema,
		defaultValues: {
			name: '',
			description: '',
			phone: '',
			email: '',
			addressLine: '',
			city: '',
			state: '',
			timezone: 'America/Sao_Paulo',
			openTime: '',
			closeTime: '',
			isActive: true,
		},
	});
	const courtForm = useZodForm({
		schema: CreateCourtSchema,
		defaultValues: {
			clubId: '',
			name: '',
			sportType: '',
			surface: '',
			defaultSlotMinutes: undefined,
			hourlyRate: undefined,
			isActive: true,
		},
	});

	const fetchClubs = async (page: number, pageLimit: number) => {
		setIsLoading(true);
		try {
			const data = await clubService.all(page, pageLimit, {
				include: {
					courts: true,
				},
			});
			setClubs(data.data);
			setPaginationData(data);
		} catch (error: unknown) {
			showApiErrorToast({
				error,
				title: 'Erro ao carregar clubes',
				defaultMessage: 'Não foi possível carregar a lista de clubes.',
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		void fetchClubs(currentPage, limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, limit]);

	useEffect(() => {
		if (!formModal.isOpen) {
			form.reset();
			setSelectedClub(null);
			setFormAction('add');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formModal.isOpen]);

useEffect(() => {
	if (!courtModal.isOpen) {
		courtForm.reset({
			clubId: '',
			name: '',
			sportType: '',
			surface: '',
			defaultSlotMinutes: undefined,
			hourlyRate: undefined,
			isActive: true,
		});
		setCourtAction('add');
		setSelectedCourt(null);
		setSelectedClubForCourt(null);
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
}, [courtModal.isOpen]);

	const handlePageChange = (page: number) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set('page', String(page));
		setSearchParams(newSearchParams);
	};

	const filteredClubs = useMemo<ClubResponse[]>(() => {
		if (!clubs) return [];

		if (!searchState.value?.trim()) {
			return clubs;
		}

		const normalizedTerm = searchState.value.trim().toLowerCase();

		switch (searchState.field) {
			case 'city':
				return clubs.filter(
					club => club.city?.toLowerCase().includes(normalizedTerm)
				);
			case 'email':
				return clubs.filter(
					club => club.email?.toLowerCase().includes(normalizedTerm)
				);
			case 'status':
				if (normalizedTerm === 'active') {
					return clubs.filter(club => club.isActive);
				}
				if (normalizedTerm === 'inactive') {
					return clubs.filter(club => !club.isActive);
				}
				return clubs;
			case 'name':
			default:
				return clubs.filter(club =>
					club.name?.toLowerCase().includes(normalizedTerm)
				);
		}
	}, [clubs, searchState]);

	const handleSearchFilterSubmit = (field?: string, value?: string) => {
		if (!field || !value?.trim()) {
			setSearchState(prev => ({ ...prev, value: undefined }));
			return;
		}

		setSearchState({
			field,
			value,
		});
	};

	const handleItemsPerPageChange = (value: number) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set('limit', String(value));
		newSearchParams.set('page', '1');
		setSearchParams(newSearchParams);
	};

	const handleToggleClubExpand = (clubId: string) => {
		setExpandedClubIds(prev =>
			prev.includes(clubId)
				? prev.filter(id => id !== clubId)
				: [...prev, clubId]
		);
	};

	const handleAddCourtClick = (club: ClubResponse) => {
		setCourtAction('add');
		setSelectedClubForCourt(club);
		setSelectedCourt(null);
		courtForm.reset({
			clubId: club.id,
			name: '',
			sportType: '',
			surface: '',
			defaultSlotMinutes: undefined,
			hourlyRate: undefined,
			isActive: true,
		});
		courtModal.onOpen();
	};

	const handleEditCourtClick = (court: CourtResponse, club: ClubResponse) => {
		setCourtAction('edit');
		setSelectedCourt(court);
		setSelectedClubForCourt(club);
		courtForm.reset({
			clubId: court.clubId,
			name: court.name,
			sportType: court.sportType,
			surface: court.surface ?? '',
			defaultSlotMinutes: court.defaultSlotMinutes,
			hourlyRate: court.hourlyRate ?? undefined,
			isActive: court.isActive,
		});
		courtModal.onOpen();
	};

	const handleDeleteCourtClick = (court: CourtResponse, club: ClubResponse) => {
		setCourtAction('delete');
		setSelectedCourt(court);
		setSelectedClubForCourt(club);
		courtModal.onOpen();
	};

const handleOpenSchedule = (club: ClubResponse) => {
	navigate(`/club-schedule?clubId=${club.id}`);
};

	const formTitle = () => {
		switch (formAction) {
			case 'add':
				return 'Novo Clube';
			case 'edit':
				return 'Editar Clube';
			case 'delete':
				return 'Excluir Clube';
			default:
				return 'Novo Clube';
		}
	};

	const formSubmitLabel = () => {
		switch (formAction) {
			case 'add':
				return 'Criar';
			case 'edit':
				return 'Salvar';
			case 'delete':
				return 'Excluir';
			default:
				return 'Criar';
		}
	};

	const courtFormTitle = () => {
		switch (courtAction) {
			case 'add':
				return 'Nova Quadra';
			case 'edit':
				return 'Editar Quadra';
			case 'delete':
				return 'Excluir Quadra';
			default:
				return 'Nova Quadra';
		}
	};

	const courtSubmitLabel = () => {
		switch (courtAction) {
			case 'add':
				return 'Adicionar';
			case 'edit':
				return 'Salvar';
			case 'delete':
				return 'Excluir';
			default:
				return 'Adicionar';
		}
	};

	const handleAddClick = () => {
		setFormAction('add');
		setSelectedClub(null);
		form.reset({
			name: '',
			description: '',
			phone: '',
			email: '',
			addressLine: '',
			city: '',
			state: '',
			timezone: 'America/Sao_Paulo',
			openTime: '',
			closeTime: '',
			isActive: true,
		});
		formModal.onOpen();
	};

	const handleEditClick = async (club: ClubResponse) => {
		setFormAction('edit');
		setSelectedClub(club);
		form.reset({
			name: club.name || '',
			description: club.description || '',
			phone: club.phone || '',
			email: club.email || '',
			addressLine: club.addressLine || '',
			city: club.city || '',
			state: club.state || '',
			timezone: club.timezone || 'America/Sao_Paulo',
			openTime: club.openTime || '',
			closeTime: club.closeTime || '',
			isActive: club.isActive ?? true,
		});
		formModal.onOpen();
	};

	const handleDeleteClick = (club: ClubResponse) => {
		setFormAction('delete');
		setSelectedClub(club);
		formModal.onOpen();
	};

	const onFormSubmit = async (data: CreateClubDto) => {
		if (formAction === 'add') {
			await handleAddClub(data);
			return;
		}

		if (!selectedClub) return;

		if (formAction === 'edit') {
			await handleEditClub({ ...data, id: selectedClub.id });
			return;
		}

		await handleDeleteClub(selectedClub.id);
	};

	const handleAddClub = async (data: CreateClubDto) => {
		setIsSubmitting(true);
		try {
			const createData: ClubRequest = {
				...data,
				isActive: data.isActive ?? true,
			};
			await clubService.create(createData);

			Toast.show({
				title: 'Clube criado com sucesso',
				status: 'success',
			});

			formModal.onClose();
			const newSearchParams = new URLSearchParams(searchParams);
			newSearchParams.set('page', '1');
			setSearchParams(newSearchParams);
			await fetchClubs(1, limit);
		} catch (error: unknown) {
			showApiErrorToast({
				error,
				title: 'Erro ao criar clube',
				defaultMessage: 'Não foi possível criar o clube.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEditClub = async (data: UpdateClubDto) => {
		setIsSubmitting(true);
		try {
			await clubService.update(data.id, data);

			Toast.show({
				title: 'Clube atualizado com sucesso',
				status: 'success',
			});

			formModal.onClose();
			await fetchClubs(currentPage, limit);
		} catch (error: unknown) {
			showApiErrorToast({
				error,
				title: 'Erro ao atualizar clube',
				defaultMessage: 'Não foi possível atualizar o clube.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteClub = async (clubId: string) => {
		setIsSubmitting(true);
		try {
			await clubService.delete(clubId);

			Toast.show({
				title: 'Clube excluído com sucesso',
				status: 'success',
			});

			formModal.onClose();
			const newSearchParams = new URLSearchParams(searchParams);
			newSearchParams.set('page', '1');
			setSearchParams(newSearchParams);
			await fetchClubs(1, limit);
		} catch (error: unknown) {
			showApiErrorToast({
				error,
				title: 'Erro ao excluir clube',
				defaultMessage: 'Não foi possível excluir o clube.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const onCourtSubmit = async (data: CreateCourtDto) => {
		if (courtAction === 'delete') {
			if (!selectedCourt) return;
			await handleDeleteCourt(selectedCourt.id);
			return;
		}

		const clubId = data.clubId || selectedClubForCourt?.id;
		if (!clubId) {
			Toast.show({
				title: 'Selecione um clube válido',
				status: 'error',
			});
			return;
		}

		const payload: CreateCourtDto = {
			...data,
			clubId,
		};

		if (courtAction === 'add') {
			await handleCreateCourt(payload);
			return;
		}

		if (!selectedCourt) return;

		await handleUpdateCourt(payload, selectedCourt.id);
	};

	const handleCreateCourt = async (data: CreateCourtDto) => {
		setIsCourtSubmitting(true);
		try {
			await courtService.create(data);
			Toast.show({
				title: 'Quadra adicionada com sucesso',
				status: 'success',
			});
			courtModal.onClose();
			setExpandedClubIds(prev =>
				prev.includes(data.clubId) ? prev : [...prev, data.clubId]
			);
			await fetchClubs(currentPage, limit);
		} catch (error: unknown) {
			showApiErrorToast({
				error,
				title: 'Erro ao adicionar quadra',
				defaultMessage: 'Não foi possível adicionar a quadra.',
			});
		} finally {
			setIsCourtSubmitting(false);
		}
	};

	const handleUpdateCourt = async (
		data: CreateCourtDto,
		courtId: string
	) => {
		setIsCourtSubmitting(true);
		try {
			const { clubId, ...rest } = data;
			await courtService.update(courtId, rest as UpdateCourtDto);
			Toast.show({
				title: 'Quadra atualizada com sucesso',
				status: 'success',
			});
			courtModal.onClose();
			setExpandedClubIds(prev =>
				clubId && !prev.includes(clubId) ? [...prev, clubId] : prev
			);
			await fetchClubs(currentPage, limit);
		} catch (error: unknown) {
			showApiErrorToast({
				error,
				title: 'Erro ao atualizar quadra',
				defaultMessage: 'Não foi possível atualizar a quadra.',
			});
		} finally {
			setIsCourtSubmitting(false);
		}
	};

	const handleDeleteCourt = async (courtId: string) => {
		if (!selectedClubForCourt) return;
		setIsCourtSubmitting(true);
		try {
			await courtService.delete(courtId);
			Toast.show({
				title: 'Quadra removida com sucesso',
				status: 'success',
			});
			courtModal.onClose();
			setExpandedClubIds(prev =>
				prev.includes(selectedClubForCourt.id)
					? prev
					: [...prev, selectedClubForCourt.id]
			);
			await fetchClubs(currentPage, limit);
		} catch (error: unknown) {
			showApiErrorToast({
				error,
				title: 'Erro ao remover quadra',
				defaultMessage: 'Não foi possível remover a quadra.',
			});
		} finally {
			setIsCourtSubmitting(false);
		}
	};

	return (
		<div className='space-y-6'>
			<section className='bg-white border border-secondary-200 rounded-2xl shadow-sm p-6 space-y-6'>
				<ClubHeader onAddClick={handleAddClick} />

				<div className='flex flex-col gap-4'>
					<FilterHeader
						searchOptions={searchOptions}
						onSearchOptionChange={field => {
							if (!field) return;
							setSearchState({ field, value: undefined });
						}}
						onSearchFilterSubmit={handleSearchFilterSubmit}
						onTableItemsPerPageChange={handleItemsPerPageChange}
						itemsPerPageOptions={[10, 15, 25, 50]}
						itemsPerPageLabel='por página'
						placeholder='Buscar por clube...'
						searchButtonText='Buscar'
						filterOpened
						className='h-auto'
					/>

					<div className='border border-secondary-200 rounded-xl overflow-hidden'>
						<ClubList
							itemsPerPage={limit}
							isLoading={isLoading}
							clubs={filteredClubs}
							expandedClubIds={expandedClubIds}
							onToggleExpand={handleToggleClubExpand}
							onEditClick={handleEditClick}
							onDeleteClick={handleDeleteClick}
							onAddCourt={handleAddCourtClick}
							onEditCourt={handleEditCourtClick}
							onDeleteCourt={handleDeleteCourtClick}
							onOpenSchedule={handleOpenSchedule}
						/>
					</div>
				</div>

				{paginationData && paginationData.pageOptions.totalPages > 1 && (
					<div className='flex justify-end pt-4 border-t border-secondary-200'>
						<Pagination
							currentPage={currentPage}
							totalPages={paginationData.pageOptions.totalPages}
							onPageChange={handlePageChange}
							size='md'
						/>
					</div>
				)}
			</section>

			<FormModal<CreateClubDto>
				title={formTitle()}
				isOpen={formModal.isOpen}
				onClose={() => {
					formModal.onClose();
					form.reset();
					setSelectedClub(null);
					setFormAction('add');
				}}
				onFormSubmit={onFormSubmit}
				form={form}
				defaultValues={form.getValues()}
				submitLabel={formSubmitLabel()}
				cancelLabel='Cancelar'
				isDisabled={isSubmitting && formAction !== 'delete'}
				bypassFormSubmit={formAction === 'delete'}
				size='lg'
			>
				{formAction === 'delete' ? (
					<p className='text-center'>
						Tem certeza que deseja excluir o clube{' '}
						<strong>{selectedClub?.name}</strong>? Essa ação não pode ser
						desfeita.
					</p>
				) : (
					<ClubFormTab form={form} club={selectedClub} />
				)}
			</FormModal>

			<FormModal<CreateCourtDto>
				title={courtFormTitle()}
				isOpen={courtModal.isOpen}
				onClose={() => {
					courtModal.onClose();
					courtForm.reset();
					setSelectedCourt(null);
					setSelectedClubForCourt(null);
					setCourtAction('add');
				}}
				onFormSubmit={onCourtSubmit}
				form={courtForm}
				defaultValues={courtForm.getValues()}
				submitLabel={courtSubmitLabel()}
				cancelLabel='Cancelar'
				isDisabled={isCourtSubmitting && courtAction !== 'delete'}
				bypassFormSubmit={courtAction === 'delete'}
				size='md'
			>
				{courtAction === 'delete' ? (
					<p className='text-center'>
						Confirmar exclusão da quadra{' '}
						<strong>{selectedCourt?.name}</strong> do clube{' '}
						<strong>{selectedClubForCourt?.name}</strong>?
					</p>
				) : (
					<CourtFormFields form={courtForm} />
				)}
			</FormModal>
		</div>
	);
}

