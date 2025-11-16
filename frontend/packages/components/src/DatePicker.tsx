import React, { useState, useEffect, useRef } from 'react';
import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addMonths,
	subMonths,
	addDays,
	isBefore,
	isAfter,
	isSameMonth,
} from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import clsx from 'clsx';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { usePicker } from './hooks/usePicker.js';

interface DatePickerProps {
	variant?: 'default' | 'inline' | 'range';
	size?: 'sm' | 'md' | 'lg';
	format?: string;
	minDate?: Date;
	maxDate?: Date;
	placeholder?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isRequired?: boolean;
	label?: string;
	helperText?: string;
	errorText?: string;
	showClearButton?: boolean;
	locale?: 'pt-BR' | 'en-US';
	firstDayOfWeek?: number;
	className?: string;
	isFullWidth?: boolean;
	name: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>;
}

const locales = { 'pt-BR': ptBR, 'en-US': enUS };

/**
 * DatePicker component
 * @param {object} root0
 * @param {string} root0.format
 * @param {Date} root0.minDate
 * @param {Date} root0.maxDate
 * @param {string} root0.placeholder
 * @param {boolean} root0.isDisabled
 * @param {boolean} root0.isReadOnly
 * @param {string} root0.label
 * @param {string} root0.helperText
 * @param {string} root0.errorText
 * @param {boolean} root0.showClearButton
 * @param {string} root0.locale
 * @param {number} root0.firstDayOfWeek
 * @param {string} root0.className
 * @param {boolean} root0.isFullWidth
 *
 * @param {string} root0.name
 * @param {Control<any>} root0.control
 *
 * @returns {JSX.Element}
 */
export const DatePicker: React.FC<DatePickerProps> = ({
	format: dateFormat = 'dd/MM/yyyy',
	minDate,
	maxDate,
	placeholder,
	isDisabled = false,
	isReadOnly = false,
	label,
	helperText,
	errorText,
	showClearButton = true,
	locale = 'pt-BR',
	firstDayOfWeek = 0,
	className,
	isFullWidth = false,
	name,
	control,
}) => {
	const { t: translate } = useTranslation();
	const defaultPlaceholder = placeholder ?? translate('date');
	const pickerId = `date-${name}`;
	const { isOpen, open, close } = usePicker(pickerId);
	const [selectedDate, _setSelectedDate] = useState<Date | null>(
		control._defaultValues[name]
	);
	/**
	 * Sets the selected date and triggers the on change event on the input
	 * @param {Date} value
	 */
	const setSelectedDate = (value: Date | null) => {
		_setSelectedDate(value);
		if (fieldRef.current?.onChange) {
			fieldRef.current.onChange(value);
		}
	};
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
	const calendarRef = useRef<HTMLDivElement>(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const fieldRef = useRef<any>(null);
	const buttonRef = useRef<HTMLDivElement>(null);
	const [coords, setCoords] = useState<{ top: number; left: number }>({
		top: 0,
		left: 0,
	});

	// Fechar o calendário quando clicar fora dele
	useEffect(() => {
		/**
		 * Handle click outside the calendar
		 * @param {MouseEvent} event
		 */
		const handleClickOutside = (event: MouseEvent) => {
			if (
				calendarRef.current &&
				!calendarRef.current.contains(event.target as Node)
			) {
				close();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, close]);

	useEffect(() => {
		if (isOpen && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			setCoords({
				top: rect.bottom + window.scrollY,
				left: rect.left + rect.width / 2 + window.scrollX,
			});
		}
	}, [isOpen]);

	/**
	 * Handles date selection
	 * @param {Date} date
	 */
	const handleDateSelect = (date: Date) => {
		if (minDate && isBefore(date, minDate)) return;
		if (maxDate && isAfter(date, maxDate)) return;

		// Crie uma nova data usando UTC para evitar problemas de fuso horário
		const year = date.getFullYear();
		const month = date.getMonth();
		const day = date.getDate();

		// Definimos a hora como meio-dia para evitar problemas de mudança de dia devido a fusos horários
		const exactDate = new Date(Date.UTC(year, month, day, 12, 0, 0));

		setSelectedDate(exactDate);
		setCurrentMonth(exactDate);
	};

	/**
	 * Cleans date
	 * @param {any} e
	 */
	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isDisabled) return;
		setSelectedDate(null);
	};

	/**
	 * Renders the week days
	 * @returns {any}
	 */
	const renderWeekDays = () => {
		const validFirstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 = [
			0, 1, 2, 3, 4, 5, 6,
		].includes(firstDayOfWeek)
			? (firstDayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6)
			: 0;

		const weekStart = startOfWeek(new Date(), {
			weekStartsOn: validFirstDayOfWeek,
		});
		const weekDays = [];

		for (let i = 0; i < 7; i++) {
			const day = addDays(weekStart, i);
			weekDays.push(
				<div
					key={`weekday-${i}`}
					className='w-10 h-8 flex items-center justify-center text-sm font-medium text-secondary-700'
				>
					{format(day, 'EEEEE', { locale: locales[locale] })}
				</div>
			);
		}

		return weekDays;
	};

	/**
	 * Renders the days
	 * @returns {any}
	 */
	const renderDays = () => {
		const monthStart = startOfMonth(currentMonth);
		const monthEnd = endOfMonth(monthStart);

		const validFirstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 = [
			0, 1, 2, 3, 4, 5, 6,
		].includes(firstDayOfWeek)
			? (firstDayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6)
			: 0;

		const startDate = startOfWeek(monthStart, {
			weekStartsOn: validFirstDayOfWeek,
		});
		const endDate = endOfWeek(monthEnd, { weekStartsOn: validFirstDayOfWeek });

		const days = [];
		let day = startDate;

		// Verifica se duas datas representam o mesmo dia no calendário
		/**
		 * Checks if two dates represent the same calendar day
		 * @param {Date} date1
		 * @param {Date} date2
		 *
		 * @returns {boolean}
		 */
		const isSameCalendarDay = (date1: Date, date2: Date) => {
			return (
				date1.getDate() === date2.getDate() &&
				date1.getMonth() === date2.getMonth() &&
				date1.getFullYear() === date2.getFullYear()
			);
		};

		while (day <= endDate) {
			const currentDay = new Date(day); // Clone o dia atual para evitar referências
			days.push(
				<button
					key={currentDay.toString()}
					className={clsx(
						'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
						!isSameMonth(currentDay, currentMonth) && 'text-secondary-500',
						selectedDate && isSameCalendarDay(currentDay, selectedDate)
							? 'bg-primary-100  hover:bg-primary-300 hover:text-white'
							: 'hover:bg-secondary-300',
						minDate && isBefore(currentDay, minDate)
							? 'text-gray-400 cursor-not-allowed opacity-50'
							: '',
						maxDate && isAfter(currentDay, maxDate)
							? 'text-gray-400 cursor-not-allowed opacity-50'
							: ''
					)}
					onClick={() => handleDateSelect(currentDay)}
					disabled={
						(minDate && isBefore(currentDay, minDate)) ||
						(maxDate && isAfter(currentDay, maxDate))
					}
					type='button'
				>
					{format(currentDay, 'd')}
				</button>
			);
			day = addDays(day, 1);
		}
		return days;
	};

	return (
		<div
			className={clsx(
				'relative',
				isFullWidth && 'w-full',
				className,
				isDisabled && 'opacity-70'
			)}
		>
			{label && (
				<label className='block text-sm font-medium mb-1 dark:text-white'>
					{label}
				</label>
			)}
			<div
				className={clsx(
					'flex items-center rounded-md px-3 py-2 transition-all duration-200 bg-white border text-secondary-900 dark:text-white',
					isDisabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer',
					errorText
						? 'border-danger-500'
						: isOpen
							? 'border-primary-400 ring-2 ring-primary-200'
							: 'border-primary-300'
				)}
				onMouseDown={e => {
					e.stopPropagation();
					if (!isDisabled && !isReadOnly) {
						if (isOpen) {
							close();
						} else {
							open();
						}
					}
				}}
				ref={buttonRef}
			>
				<Controller
					name={name}
					control={control}
					defaultValue={null}
					render={({ field }) => {
						fieldRef.current = field;
						return (
							<div className='flex items-center w-full min-w-0'>
								<input
									type='text'
									{...field}
									className={clsx(
										'flex-1 min-w-0 outline-none bg-transparent',
										isDisabled
											? 'opacity-70 cursor-not-allowed'
											: 'cursor-pointer'
									)}
									value={
										field.value
											? format(field.value, dateFormat, {
													locale: locales[locale],
												})
											: ''
									}
									placeholder={defaultPlaceholder}
									readOnly={true}
									disabled={isDisabled}
									aria-label={label || 'Date'}
									style={{ minWidth: 0 }}
								/>
								<svg
									className={clsx(
										'h-5 w-5 ml-2 flex-shrink-0',
										isOpen ? 'text-primary-400' : 'text-primary-300'
									)}
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path
										fillRule='evenodd'
										d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
										clipRule='evenodd'
									/>
								</svg>
								{showClearButton && field.value && (
									<button
										className={clsx(
											'ml-2 hover:text-danger-500 flex-shrink-0',
											' text-primary-300'
										)}
										onClick={handleClear}
										type='button'
										aria-label='Clear date'
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
							</div>
						);
					}}
				/>
			</div>
			{isOpen &&
				createPortal(
					<div
						style={{
							top: coords.top,
							left: coords.left,
						}}
						ref={calendarRef}
						className='absolute -translate-x-1/2 mt-2 w-80 bg-white shadow-lg p-4 z-[9999] rounded-lg border border-gray-200 dark:bg-primary-600 dark:border-primary-700'
					>
						<div className='flex justify-between mb-4 items-center'>
							<button
								onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
								className='p-1 hover:bg-gray-100 rounded-full'
								type='button'
								aria-label='Previous month'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path
										fillRule='evenodd'
										d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
										clipRule='evenodd'
									/>
								</svg>
							</button>
							<span className='font-bold'>
								{format(currentMonth, 'MMMM yyyy', { locale: locales[locale] })}
							</span>
							<button
								onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
								className='p-1 hover:bg-gray-100 rounded-full'
								type='button'
								aria-label='Next month'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path
										fillRule='evenodd'
										d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
										clipRule='evenodd'
									/>
								</svg>
							</button>
						</div>
						<div className='grid grid-cols-7 gap-1 mb-2'>
							{renderWeekDays()}
						</div>
						<div className='grid grid-cols-7 gap-1'>{renderDays()}</div>
					</div>,
					document.body
				)}
			{helperText && <p className='text-sm text-gray-500 mt-1'>{helperText}</p>}
			{errorText && <p className='text-sm text-red-500 mt-1'>{errorText}</p>}
		</div>
	);
};
