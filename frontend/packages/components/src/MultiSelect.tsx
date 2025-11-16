import clsx from 'clsx';
import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Check } from 'phosphor-react';
import Information, { InformationSize } from './Information.js';

export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface Option {
	value: number | string;
	label: string;
}

interface MultiSelectProps {
	options: Option[];
	name: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>;
	placeholder?: string;
	className?: string;
	searchable?: boolean;
	label?: string;
	isFullWidth?: boolean;
	required?: boolean;
	size?: InputSize;
	showTooltipInformation?: boolean;
	tooltipInformationMessage?: string;
	tooltipInformationSize?: InformationSize;
	labelButton?: React.ReactNode;
}

const ITEM_HEIGHT = 40;
const MAX_DROPDOWN_HEIGHT = 320;
const OVERSCAN = 3;

/**
 * Componente de item individual virtualizado e memoizado para MultiSelect
 * @param {object} props - Propriedades do componente
 * @param {Option} props.option - Opção a ser renderizada
 * @param {boolean} props.isSelected - Indica se a opção está selecionada
 * @param {Function} props.onSelect - Callback chamado quando a opção é selecionada
 * @returns {JSX.Element} Item da lista renderizado
 */
const VirtualizedMultiSelectItem = memo<{
	option: Option;
	isSelected: boolean;
	onSelect: (value: number | string) => void;
}>(({ option, isSelected, onSelect }) => {
	return (
		<label
			className='flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-secondary-500 transition-all duration-200 border-b border-secondary-200'
			style={{
				height: `${ITEM_HEIGHT}px`,
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<input
				type='checkbox'
				checked={isSelected}
				onChange={() => onSelect(option.value)}
				className='hidden'
			/>
			<div
				className={clsx(
					'flex items-center justify-center w-5 h-5 border rounded transition-all duration-300',
					isSelected ? 'bg-primary-500' : 'bg-secondary-200'
				)}
			>
				{isSelected && (
					<Check
						size={14}
						weight='bold'
						className='text-white'
					/>
				)}
			</div>
			<span
				className={clsx(
					'font-semibold text-sm text-primary-500',
					isSelected ? 'font-bold' : ''
				)}
			>
				{option.label}
			</span>
		</label>
	);
});

VirtualizedMultiSelectItem.displayName = 'VirtualizedMultiSelectItem';

/**
 * Componente de lista virtualizada para MultiSelect
 * @param {object} props - Propriedades do componente
 * @param {Option[]} props.options - Opções a serem renderizadas
 * @param {(string | number)[]} props.selectedValues - Valores selecionados
 * @param {Function} props.onSelect - Callback chamado quando uma opção é selecionada
 * @returns {JSX.Element} Lista virtualizada renderizada
 */
const VirtualizedMultiSelectList = memo<{
	options: Option[];
	selectedValues: (string | number)[];
	onSelect: (value: number | string) => void;
}>(({ options, selectedValues, onSelect }) => {
	const [scrollTop, setScrollTop] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

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
	const totalHeight = options.length * ITEM_HEIGHT;

	const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
		setScrollTop(e.currentTarget.scrollTop);
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
						<VirtualizedMultiSelectItem
							key={option.value}
							option={option}
							isSelected={selectedValues.includes(option.value)}
							onSelect={onSelect}
						/>
					))}
				</div>
			</div>
		</div>
	);
});

VirtualizedMultiSelectList.displayName = 'VirtualizedMultiSelectList';

/**
 * MultiSelect Component
 * @param {MultiSelectProps} root0
 * @param {Option[]} root0.options
 * @param {string} root0.placeholder
 * @param {string} root0.className
 * @param {boolean} root0.searchable
 * @param {string} root0.name
 * @param {Control<any>} root0.control
 * @param {string} root0.label
 * @param {boolean} root0.isFullWidth
 * @param {boolean} root0.required
 * @param {string} root0.showTooltipInformation
 * @param {string} root0.tooltipInformationMessage
 * @param {string} root0.tooltipInformationSize
 * @param {InputSize} root0.size
 * @param {React.ReactNode} root0.labelButton
 *
 * @returns {any}
 */
export const MultiSelect: React.FC<MultiSelectProps> = ({
	options,
	name,
	control,
	placeholder,
	className,
	searchable = false,
	label,
	isFullWidth = false,
	required = false,
	size = 'md',
	showTooltipInformation = false,
	tooltipInformationMessage = '',
	tooltipInformationSize = 'md',
	labelButton,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [dropdownStyle, setDropdownStyle] = useState({});
	const selectRef = useRef<HTMLDivElement>(null);
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
			setDropdownStyle({
				width: `${rect.width}px`,
				left: `${rect.left}px`,
				top: `${rect.bottom + window.scrollY}px`,
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

	// Renderizar UI do multiselect
	const renderMultiSelectUI = useCallback(
		(
			fieldValue?: (number | string)[],
			fieldOnChange?: (value: (number | string)[]) => void,
			fieldState?: { error?: { message?: string } }
		) => {
			const currentValue = Array.isArray(fieldValue) ? fieldValue : [];
			const error = fieldState?.error;

			const handleSelect = useCallback(
				(val: string | number) => {
					if (fieldOnChange) {
						if (currentValue.includes(val)) {
							fieldOnChange(
								currentValue.filter((v: string | number) => v !== val)
							);
						} else {
							fieldOnChange([...currentValue, val]);
						}
					}
				},
				[fieldOnChange, currentValue]
			);

			const selectedOptions = useMemo(
				() => options.filter(opt => currentValue.includes(opt.value)),
				[options, currentValue]
			);

			return (
				<div
					className={clsx('relative', fullWidthStyle)}
					ref={selectRef}
				>
					<div
						onClick={toggleDropdown}
						className={clsx(
							'flex items-center justify-between border rounded-md cursor-pointer transition-all duration-300 dark:text-white bg-white',
							sizeStyles[size],
							error && !isOpen
								? 'border-danger-500'
								: isOpen
									? 'border-primary-400 ring-2 ring-primary-200'
									: 'border-primary-300 dark:bg-primary-800'
						)}
					>
						<span className='truncate'>
							{selectedOptions.length > 0
								? selectedOptions.map(opt => opt.label).join(', ')
								: defaultPlaceholder}
						</span>
						<span
							className={clsx(
								isOpen ? 'text-primary-400 rotate-180' : 'text-primary-300 rotate-0',
								'transition-transform duration-500'
							)}
						>
							▼
						</span>
					</div>

					{error && !isOpen && (
						<p className='text-danger-500 text-sm mt-1'>{error.message}</p>
					)}

					<div
						className={clsx(
							'fixed z-50 bg-white border rounded-md shadow-md overflow-hidden',
							isOpen
								? 'opacity-100 transition-opacity duration-300 mt-0.5'
								: 'opacity-0 max-h-0 pointer-events-none transition-opacity duration-200'
						)}
						style={dropdownStyle}
					>
						{searchable && (
							<input
								type='text'
								placeholder={translate('form.search') + '...'}
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								onClick={e => e.stopPropagation()}
								spellCheck={false}
								className='w-[90%] mx-auto my-2 px-4 py-2 border border-primary-200 bg-white placeholder:text-secondary-500 text-secondary-900 outline-none rounded-md block'
								autoFocus
							/>
						)}

						{filteredOptions.length === 0 ? (
							<div className='px-4 py-2 text-secondary-700'>
								{translate('noResultsFound')}
							</div>
						) : (
							<VirtualizedMultiSelectList
								options={filteredOptions}
								selectedValues={currentValue}
								onSelect={handleSelect}
							/>
						)}
					</div>
				</div>
			);
		},
		[
			options,
			fullWidthStyle,
			toggleDropdown,
			sizeStyles,
			size,
			isOpen,
			defaultPlaceholder,
			dropdownStyle,
			searchable,
			searchTerm,
			translate,
			filteredOptions,
		]
	);

	return (
		<div className={clsx('flex flex-col', className, fullWidthStyle)}>
			<div className='flex flex-row justify-between'>
				{label && (
					<label className='block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200'>
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

			<Controller
				name={name}
				control={control}
				rules={{
					required: required && `${label ?? 'Este campo'} é obrigatório`,
				}}
				render={({ field, fieldState }) =>
					renderMultiSelectUI(field.value, field.onChange, fieldState)
				}
			/>
		</div>
	);
};
