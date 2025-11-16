import clsx from 'clsx';
import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import {
	Control,
	Controller,
	UseFormResetField,
	FieldValues,
	Path,
} from 'react-hook-form';
import Information, { InformationSize } from './Information.js';
import { useTranslation } from 'react-i18next';

export interface Option {
	value: number | string;
	label: string;
}

export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SelectProps<TFieldValues extends FieldValues = FieldValues> {
	options: Option[];
	placeholder?: string;
	className?: string;
	searchable?: boolean;
	isFullWidth?: boolean;
	label?: string;
	required?: boolean;
	size?: InputSize;
	name?: Path<TFieldValues>;
	isDisabled?: boolean;
	control?: Control<TFieldValues>;
	showTooltipInformation?: boolean;
	tooltipInformationMessage?: string;
	tooltipInformationSize?: InformationSize;
	onChangeValue?: (value: number | string) => void;
	value?: number | string;
	allowCustomInput?: boolean;
	onCustomInputChange?: (value: string, isExisting?: boolean) => void;
	resetField?: UseFormResetField<TFieldValues>;
	labelButton?: React.ReactNode;

	// Lazy loading props
	onLoadMore?: () => void;
	isLoading?: boolean;
	hasMore?: boolean;

	// Search callback props
	onSearchChange?: (searchValue: string) => void;
}

const ITEM_HEIGHT = 40;
const MAX_DROPDOWN_HEIGHT = 320;
const OVERSCAN = 3;

/**
 * Componente de item individual virtualizado e memoizado
 * @param {object} props - Propriedades do componente
 * @param {Option} props.option - Opção a ser renderizada
 * @param {boolean} props.isSelected - Indica se a opção está selecionada
 * @param {boolean} props.isDisabled - Indica se o componente está desabilitado
 * @param {Function} props.onSelect - Callback chamado quando a opção é selecionada
 * @returns {JSX.Element} Item da lista renderizado
 */
const VirtualizedOptionItem = memo<{
	option: Option;
	isSelected: boolean;
	isDisabled: boolean;
	onSelect: (value: number | string) => void;
}>(({ option, isSelected, isDisabled, onSelect }) => {
	return (
		<div
			onClick={() => !isDisabled && onSelect(option.value)}
			className={clsx(
				isSelected ? 'bg-primary-50' : 'bg-white',
				isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
				'px-4 hover:bg-primary-100 transition-all duration-200 border-b border-primary-200'
			)}
			style={{
				height: `${ITEM_HEIGHT}px`,
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<span
				className={clsx(
					'font-semibold text-sm text-secondary-900',
					isSelected ? 'text-primary-700' : ''
				)}
			>
				{option.label}
			</span>
		</div>
	);
});

VirtualizedOptionItem.displayName = 'VirtualizedOptionItem';

// Componente de lista virtualizada
const VirtualizedList = memo<{
	options: Option[];
	selectedValue: number | string | null | undefined;
	isDisabled: boolean;
	onSelect: (value: number | string) => void;
	onLoadMore?: () => void;
	isLoading?: boolean;
	hasMore?: boolean;
	translate: (key: string) => string;
}>(
	({
		options,
		selectedValue,
		isDisabled,
		onSelect,
		onLoadMore,
		isLoading = false,
		hasMore = false,
		translate,
	}) => {
		const [scrollTop, setScrollTop] = useState(0);
		const containerRef = useRef<HTMLDivElement>(null);
		const loadingRequestedRef = useRef(false);
		const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

		const visibleCount = Math.ceil(MAX_DROPDOWN_HEIGHT / ITEM_HEIGHT);
		const startIndex = Math.max(
			0,
			Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN
		);
		const endIndex = Math.min(
			startIndex + visibleCount + OVERSCAN * 2,
			options.length
		);

		const visibleOptions = useMemo(
			() => options.slice(startIndex, endIndex),
			[options, startIndex, endIndex]
		);

		const offsetY = startIndex * ITEM_HEIGHT;
		const totalHeight =
			options.length * ITEM_HEIGHT + (isLoading ? ITEM_HEIGHT : 0);

		const handleScroll = useCallback(
			(e: React.UIEvent<HTMLDivElement>) => {
				const target = e.currentTarget;
				setScrollTop(target.scrollTop);

				// Debounce para evitar múltiplas chamadas
				if (scrollTimeoutRef.current) {
					clearTimeout(scrollTimeoutRef.current);
				}

				scrollTimeoutRef.current = setTimeout(() => {
					// Detectar quando chega no final da lista (100%) e chamar onLoadMore
					// Só executa se houver pelo menos 10 itens
					if (
						onLoadMore &&
						hasMore &&
						!isLoading &&
						!loadingRequestedRef.current &&
						options.length >= 10
					) {
						const scrollPercentage =
							(target.scrollTop + target.clientHeight) / target.scrollHeight;
						// Mudou de 0.8 para >= 0.99 para ser mais preciso no final
						if (scrollPercentage >= 0.99) {
							loadingRequestedRef.current = true;
							onLoadMore();
						}
					}
				}, 100);
			},
			[onLoadMore, hasMore, isLoading]
		);

		// Reset da flag quando o loading termina
		useEffect(() => {
			if (!isLoading) {
				loadingRequestedRef.current = false;
			}
		}, [isLoading]);

		// Cleanup do timeout
		useEffect(() => {
			return () => {
				if (scrollTimeoutRef.current) {
					clearTimeout(scrollTimeoutRef.current);
				}
			};
		}, []);

		return (
			<div
				ref={containerRef}
				onScroll={handleScroll}
				className='overflow-y-auto custom-scroll'
				style={{ maxHeight: `${MAX_DROPDOWN_HEIGHT}px` }}
			>
				<div style={{ height: `${totalHeight}px`, position: 'relative' }}>
					<div
						style={{
							transform: `translateY(${offsetY}px)`,
							willChange: 'transform',
						}}
					>
						{visibleOptions.map(option => (
							<VirtualizedOptionItem
								key={option.value}
								option={option}
								isSelected={option.value === selectedValue}
								isDisabled={isDisabled}
								onSelect={onSelect}
							/>
						))}

						{/* Indicador de carregamento */}
						{isLoading && (
							<div
								className='px-4 py-2 text-center text-secondary-900 flex items-center justify-center'
								style={{ height: `${ITEM_HEIGHT}px` }}
							>
								<span>{translate('loadingMore')}</span>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
);

VirtualizedList.displayName = 'VirtualizedList';

/**
 * Select component otimizado com virtualização para grandes listas
 * @param {object} root0
 * @param {Option[]} root0.options
 * @param {string} root0.placeholder
 * @param {string} root0.className
 * @param {boolean} root0.searchable
 * @param {boolean} root0.isFullWidth
 * @param {string} root0.label
 * @param {string} root0.name
 * @param {Control} root0.control
 * @param {boolean} root0.required
 * @param {InputSize} root0.size
 * @param {Function} root0.onChangeValue
 * @param {boolean} root0.allowCustomInput
 * @param {Function} root0.onCustomInputChange
 * @param {Function} root0.resetField
 * @param {boolean} root0.isDisabled
 * @param {boolean} root0.showTooltipInformation
 * @param {string} root0.tooltipInformationMessage
 * @param {string} root0.tooltipInformationSize
 * @param {string | number} root0.value
 * @param {string} root0.labelButton
 * @param {Function} root0.onLoadMore
 * @param {boolean}  root0.isLoading
 * @param {boolean} root0.hasMore
 * @param {Function} root0.onSearchChange
 * @returns {JSX.Element}
 */
export const Select = <TFieldValues extends FieldValues = FieldValues>({
	options,
	placeholder,
	className,
	searchable = false,
	isFullWidth = false,
	label,
	name,
	control,
	required,
	size = 'md',
	onChangeValue,
	allowCustomInput = false,
	onCustomInputChange,
	resetField,
	isDisabled = false,
	showTooltipInformation = false,
	tooltipInformationMessage = '',
	tooltipInformationSize = 'md',
	value,
	labelButton,

	// Lazy loading props
	onLoadMore,
	isLoading = false,
	hasMore = false,
	onSearchChange,
}: SelectProps<TFieldValues>) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [dropdownStyle, setDropdownStyle] = useState({});
	const [isSearchWaiting, setIsSearchWaiting] = useState(false);
	const selectRef = useRef<HTMLDivElement>(null);
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const { t: translate } = useTranslation();

	const defaultPlaceholder = placeholder ?? translate('select') + '...';
	const fullWidthStyle = isFullWidth ? 'w-full' : 'w-64';

	const sizeStyles = {
		xs: 'px-2 py-1 text-xs',
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-5 py-2.5 text-lg',
		xl: 'px-6 py-3 text-xl',
	};

	// Função para lidar com busca com debounce
	const handleSearchChange = useCallback(
		(newValue: string) => {
			setSearchTerm(newValue);

			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}

			if (!newValue.trim()) {
				setIsSearchWaiting(false);
				if (onSearchChange) {
					onSearchChange(newValue);
				}
				return;
			}
			setIsSearchWaiting(true);

			searchTimeoutRef.current = setTimeout(() => {
				setIsSearchWaiting(false);
				if (onSearchChange) {
					onSearchChange(newValue);
				}
			}, 1000);
		},
		[onSearchChange]
	);

	const useHookForm = Boolean(control && name);

	useEffect(() => {
		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, []);

	// Memoizar opções filtradas
	const filteredOptions = useMemo(() => {
		if (!searchTerm) return options;
		const term = searchTerm.toLowerCase();
		return options.filter(option => option.label.toLowerCase().includes(term));
	}, [searchTerm, options]);

	// Toggle dropdown com useCallback
	const toggleDropdown = useCallback(() => {
		setIsOpen(v => !v);
	}, []);

	// Atualizar posição do dropdown
	const updateDropdownPosition = useCallback(() => {
		if (selectRef.current) {
			const rect = selectRef.current.getBoundingClientRect();
			// For absolute positioning, we use width and position relative to parent
			setDropdownStyle({
				width: `${rect.width}px`,
				left: '0',
				top: '100%',
			});
		}
	}, []);

	// Fechar dropdown ao clicar fora
	useEffect(() => {
		/**
		 * Handler para fechar dropdown ao clicar fora
		 * @param {MouseEvent} event
		 * @returns {void}
		 */
		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			return () =>
				document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [isOpen]);

	// Atualizar posição quando abrir
	useEffect(() => {
		if (isOpen) {
			updateDropdownPosition();
		}
	}, [isOpen, updateDropdownPosition]);

	// Atualizar posição no resize
	useEffect(() => {
		if (!isOpen) return;

		/**
		 * Handler para atualizar posição no resize
		 * @returns {void}
		 */
		const handleResize = () => {
			updateDropdownPosition();
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [isOpen, updateDropdownPosition]);

	// Handler de seleção para modo não-hook-form
	const handleSelectCommon = useCallback(
		(selectedValue: number | string) => {
			const currentValue = value;
			if (currentValue === selectedValue) {
				if (onChangeValue) onChangeValue('');
				if (onCustomInputChange) onCustomInputChange('', false);
				setSearchTerm('');
			} else {
				if (onChangeValue) onChangeValue(selectedValue);
				const selected = options.find(opt => opt.value === selectedValue);
				if (allowCustomInput && selected) {
					setSearchTerm(selected.label);
				} else {
					setSearchTerm('');
				}
			}
			setIsOpen(false);
		},
		[value, onChangeValue, onCustomInputChange, options, allowCustomInput]
	);

	// Obter valor atual
	const getCurrentValue = useCallback(() => {
		if (useHookForm) return null;
		return value;
	}, [useHookForm, value]);

	// Obter opção selecionada
	const getSelectedOption = useMemo(() => {
		const currentValue = getCurrentValue();
		if (currentValue === null) return null;
		return options.find(option => option.value === currentValue) || null;
	}, [getCurrentValue, options]);

	// Atualizar searchTerm quando value muda (modo não-hook-form)
	useEffect(() => {
		if (!useHookForm && value !== undefined && allowCustomInput) {
			if (value === '' || value === null || value === undefined) {
				setSearchTerm('');
				return;
			}
			const selected = options.find(option => option.value === value);
			if (selected) {
				setSearchTerm(selected.label);
			} else if (typeof value === 'string') {
				setSearchTerm(value);
			}
		}
	}, [value, allowCustomInput, options, useHookForm]);

	// Renderizar UI do select
	const renderSelectUI = useCallback(
		(
			fieldValue?: number | string | null,
			fieldOnChange?: (value: number | string | null) => void,
			fieldState?: { error?: { message?: string } }
		) => {
			const currentValue = useHookForm ? fieldValue : getCurrentValue();
			const selectedOption = useHookForm
				? options.find(option => option.value === fieldValue) || null
				: getSelectedOption;
			const error = useHookForm ? fieldState?.error : null;

			const handleSelect = useCallback(
				(selectedValue: number | string) => {
					if (useHookForm && fieldOnChange) {
						if (fieldValue === selectedValue) {
							fieldOnChange(null);
							setSearchTerm('');
							if (onChangeValue) onChangeValue('');
							if (onCustomInputChange) onCustomInputChange('', false);
						} else {
							fieldOnChange(selectedValue);
							const selected = options.find(opt => opt.value === selectedValue);
							if (onChangeValue) onChangeValue(selectedValue);
							if (allowCustomInput && selected) {
								setSearchTerm(selected.label);
							} else {
								setSearchTerm('');
							}
						}
					} else {
						handleSelectCommon(selectedValue);
					}
					setIsOpen(false);
				},
				[
					useHookForm,
					fieldOnChange,
					fieldValue,
					onChangeValue,
					onCustomInputChange,
					options,
					allowCustomInput,
					handleSelectCommon,
				]
			);

			// Atualizar searchTerm quando fieldValue muda (modo hook-form)
			useEffect(() => {
				if (useHookForm && fieldValue !== undefined && allowCustomInput) {
					if (
						fieldValue === '' ||
						fieldValue === null ||
						fieldValue === undefined
					) {
						setSearchTerm('');
						return;
					}
					const selected = options.find(option => option.value === fieldValue);
					if (selected && fieldValue !== undefined) {
						setSearchTerm(selected.label);
					} else if (typeof fieldValue === 'string') {
						setSearchTerm(fieldValue);
					}
				}
			}, [fieldValue, allowCustomInput, options, useHookForm]);

			return (
				<div
					className={clsx(
						'relative',
						isDisabled && 'cursor-not-allowed opacity-50',
						fullWidthStyle,
						isOpen && 'z-[10000]' // Increase z-index when open to ensure dropdown appears above other elements
					)}
					ref={selectRef}
				>
					{allowCustomInput ? (
						<>
							<input
								type='text'
								value={searchTerm}
								onChange={e => {
									const typed = e.target.value;
									setSearchTerm(typed);
									if (onCustomInputChange) {
										const isExisting = options.some(
											opt => opt.label.toLowerCase() === typed.toLowerCase()
										);
										onCustomInputChange(typed, isExisting);
									}
								}}
								onFocus={() => {
									setIsOpen(true);
									if (!currentValue) setSearchTerm('');
								}}
								placeholder={defaultPlaceholder}
								disabled={isDisabled}
								className={clsx(
									'w-full px-4 py-2 border rounded-md transition-all duration-300 text-secondary-900 bg-white',
									error ? 'border-danger-500' : 'border-primary-500'
								)}
							/>
							<div
								className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
								onClick={() => {
									if (isDisabled) return;
									toggleDropdown();
								}}
							>
								<span
									className={clsx(
										'transition-transform duration-300',
										isOpen ? 'rotate-180 text-primary-600' : 'rotate-0 text-primary-500'
									)}
								>
									▼
								</span>
							</div>
						</>
					) : (
						<div
							onClick={() => {
								if (isDisabled) return;
								setIsOpen(prev => !prev);
								setSearchTerm('');
							}}
							className={clsx(
								'flex items-center gap-2 justify-between border rounded-md transition-all duration-300 bg-white text-secondary-900',
								isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
								sizeStyles[size],
								error && !isOpen
									? 'border-danger-500'
									: isOpen
										? 'border-primary-600 ring-2 ring-primary-100'
										: 'border-primary-500'
							)}
						>
							<span className='truncate'>
								{selectedOption?.label || defaultPlaceholder}
							</span>
							<div className='flex gap-2'>
								{resetField && currentValue && (
									<button
										disabled={isDisabled}
										className={clsx(
											'ml-2 hover:text-danger-500',
											'text-primary-900'
										)}
										onClick={e => {
											if (isDisabled) return;
											e.stopPropagation();
											if (useHookForm) {
												resetField(name!);
											} else if (onChangeValue) {
												onChangeValue('');
												setSearchTerm('');
											}
										}}
										type='button'
										aria-label='Clear select'
									>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-4 w-4'
											viewBox='0 0 20 20'
											fill='currentColor'
										>
											<path
												fillRule='evenodd'
												d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
												clipRule='evenodd'
											/>
										</svg>
									</button>
								)}
								<span
									className={clsx(
										'transition-transform transition-colors duration-300',
										isOpen ? 'rotate-180' : 'rotate-0',
										error && !isOpen
											? 'text-danger-500'
											: 'text-secondary-900'
									)}
								>
									▼
								</span>
							</div>
						</div>
					)}

					{error && !isOpen && (
						<p className='text-danger-500 text-sm mt-1'>{error.message}</p>
					)}

					<div
						className={clsx(
							'absolute z-[9999] bg-white border border-primary-200 rounded-xl shadow-lg overflow-hidden',
							isOpen
								? 'opacity-100 transition-opacity duration-300 mt-0.5'
								: 'opacity-0 max-h-0 pointer-events-none transition-opacity duration-200'
						)}
						style={dropdownStyle}
					>
						{searchable && (
							<div className='relative w-[90%] mx-auto my-2'>
								<input
									disabled={isDisabled}
									type='text'
									placeholder={translate('form.search') + '...'}
									value={searchTerm}
									onChange={e => {
										handleSearchChange(e.target.value);
									}}
									onClick={e => {
										if (isDisabled) return;
										e.stopPropagation();
									}}
									spellCheck={false}
									className='w-full px-4 py-2 pr-10 border border-primary-200 bg-white placeholder:text-secondary-900 text-secondary-900 outline-none rounded-md block'
									autoFocus
								/>
								{isSearchWaiting && onSearchChange && (
									<div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
										<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500'></div>
									</div>
								)}
							</div>
						)}

						{filteredOptions.length === 0 ? (
							<div className='px-4 py-2 text-secondary-700'>
								{isSearchWaiting ? '' : translate('noResultsFound')}
							</div>
						) : (
							<VirtualizedList
								options={filteredOptions}
								selectedValue={currentValue}
								isDisabled={isDisabled}
								onSelect={handleSelect}
								onLoadMore={searchTerm ? undefined : onLoadMore}
								isLoading={searchTerm ? false : isLoading}
								hasMore={hasMore}
								translate={translate}
							/>
						)}
					</div>
				</div>
			);
		},
		[
			useHookForm,
			getCurrentValue,
			getSelectedOption,
			options,
			isDisabled,
			fullWidthStyle,
			allowCustomInput,
			searchTerm,
			defaultPlaceholder,
			onChangeValue,
			onCustomInputChange,
			toggleDropdown,
			isOpen,
			sizeStyles,
			size,
			resetField,
			name,
			searchable,
			filteredOptions,
			handleSelectCommon,
			onSearchChange,
			isSearchWaiting,
			handleSearchChange,
		]
	);

	return (
		<div
			className={clsx(
				'flex flex-col',
				className,
				fullWidthStyle,
				isDisabled && 'cursor-not-allowed opacity-50'
			)}
		>
			<div className='flex flex-row justify-between'>
				{label && (
					<label className='block text-sm font-semibold mb-1 text-black dark:text-secondary-900'>
						{label}
					</label>
				)}
				<div className='flex items-center gap-2'>
					{showTooltipInformation && (
						<Information
							message={tooltipInformationMessage}
							size={tooltipInformationSize}
						/>
					)}
					{labelButton}
				</div>
			</div>

			{useHookForm ? (
				<Controller
					name={name!}
					control={control!}
					rules={{
						required: required && `${label ?? 'Este campo'} é obrigatório`,
					}}
					render={({ field, fieldState }) =>
						renderSelectUI(field.value, field.onChange, fieldState)
					}
				/>
			) : (
				renderSelectUI()
			)}
		</div>
	);
};
