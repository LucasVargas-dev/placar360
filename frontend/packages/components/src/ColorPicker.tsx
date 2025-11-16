import clsx from 'clsx';
import React, { useState, useRef, useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';

interface Color {
	value: string;
	label: string;
}
interface ColorPickerProps {
	name: string;
	label?: string;
	required?: boolean;
	isFullWidth?: boolean;
	control?: Control<any>;
	options?: Color[];
	type?: 'bg' | 'text';
	onChangeValue?: (value: string) => void;
}

const defaultColors = [
	{
		value: 'bg-red-500',
		label: 'Vermelho',
	},
	{
		value: 'bg-green-500',
		label: 'Verde',
	},
	{
		value: 'bg-blue-500',
		label: 'Azul',
	},
	{
		value: 'bg-yellow-400',
		label: 'Amarelo',
	},
	{
		value: 'bg-purple-500',
		label: 'Roxo',
	},
	{
		value: 'bg-pink-500',
		label: 'Rosa',
	},
];

/**
 * ColorPicker component
 * @param {object} root0
 * @param {string} root0.name
 * @param {string} root0.label
 * @param {boolean} root0.required
 * @param {Control<any>} root0.control
 * @param {Color[]} root0.options
 * @param {boolean} root0.isFullWidth
 * @param {Function} root0.onChangeValue
 *
 * @returns {JSX.Element}
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
	name,
	label,
	required,
	control,
	options,
	isFullWidth,
	onChangeValue,
}) => {
	const colorOptions = options || defaultColors;
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const fullWidthStyle = isFullWidth ? 'w-full' : 'w-64';
	const [dropdownStyle, setDropdownStyle] = useState({});

	// Fechar dropdown ao clicar fora
	useEffect(() => {
		/**
		 * Handles click outside
		 * @param {MouseEvent} event
		 */
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	/**
	 * Updates dropdown position
	 */
	const updateDropdownPosition = () => {
		if (dropdownRef.current) {
			const rect = dropdownRef.current.getBoundingClientRect();
			setDropdownStyle({
				width: `${rect.width}px`,
				left: `${rect.left}px`,
				top: `${rect.bottom + window.scrollY}px`,
			});
		}
	};

	useEffect(() => {
		/**
		 *	Handles window resize
		 */
		const handleResize = () => {
			if (isOpen) {
				updateDropdownPosition();
			}
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) {
			updateDropdownPosition();
		}
	}, [isOpen]);

	/**
	 * Toggle dropdown
	 * @returns {void}
	 */
	const toggleDropdown = () => {
		if (!isOpen) {
			// Se estiver abrindo, primeiro atualize a posição e só depois abra
			updateDropdownPosition();
		}
		setIsOpen(prev => !prev);
	};

	return (
		<div className={clsx('flex flex-col', fullWidthStyle)}>
			{label && (
				<label className='block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200'>
					{label}
				</label>
			)}

			<Controller
				name={name}
				control={control}
				rules={{
					required: required && `${label ?? 'Este campo'} é obrigatório`,
				}}
				render={({ field, fieldState }) => {
					const selected = field.value;

					return (
						<>
							<div
								className={clsx('relative', fullWidthStyle)}
								ref={dropdownRef}
							>
								<div
									className={clsx(
										'flex items-center justify-between px-4 py-2 border rounded-md cursor-pointer transition-all duration-300 dark:text-white',
										fieldState.error && !isOpen
											? 'border-danger-500'
											: isOpen
												? 'border border-primary-300 bg-primary-300 dark:bg-primary-300 text-white'
												: 'border-primary-300 dark:bg-primary-800 bg-white'
									)}
									onClick={toggleDropdown}
								>
									<div className='flex items-center gap-2'>
										<div
											className={clsx(
												'w-5 h-5 rounded-full border border-white',
												selected || 'bg-gray-200',
												selected
											)}
										/>
										<span className='truncate'>{selected || 'Selecionar'}</span>
									</div>
									<span
										className={clsx(
											'transition-transform transition-colors duration-300',
											isOpen ? 'rotate-180' : 'rotate-0',
											fieldState.error && !isOpen
												? 'text-danger-500'
												: isOpen
													? 'text-white'
													: 'text-primary-300'
										)}
									>
										▼
									</span>
								</div>

								{fieldState.error && !isOpen && (
									<p className='text-danger-500 text-sm mt-1'>
										{fieldState.error.message}
									</p>
								)}

								{/* Dropdown */}
								<div
									className={clsx(
										'fixed z-50 bg-white border rounded-md shadow-md overflow-hidden',
										isOpen
											? 'opacity-100 max-h-60 transition-[max-height,opacity] duration-300 mt-0.5'
											: 'opacity-0 max-h-0 pointer-events-none transition-[max-height,opacity] duration-200'
									)}
									style={dropdownStyle}
								>
									<div className='grid grid-cols-4 gap-2 p-2 justify-items-center'>
										{colorOptions.map(color => {
											const isSelected = selected === color.value;
											return (
												<button
													type='button'
													key={color.value}
													className={clsx(
														'w-7 h-7 rounded-full border-2 transition-all duration-200',
														color.value,
														isSelected
															? 'ring-2 ring-offset-1 ring-primary-500 border-white'
															: 'border-gray-300'
													)}
													onClick={() => {
														field.onChange(color.value);
														if (onChangeValue) onChangeValue(color.value);
														setIsOpen(false);
													}}
													aria-label={color.label}
												/>
											);
										})}
									</div>
								</div>
							</div>
						</>
					);
				}}
			/>
		</div>
	);
};
