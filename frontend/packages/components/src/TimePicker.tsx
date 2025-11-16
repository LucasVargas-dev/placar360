import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Control, Controller } from 'react-hook-form';
import { createPortal } from 'react-dom';
import { usePicker } from './hooks/usePicker.js';
import { useTranslation } from 'react-i18next';

interface TimePickerProps {
	minuteStep?: number;
	placeholder?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	label?: string;
	helperText?: string;
	errorText?: string;
	showClearButton?: boolean;
	className?: string;
	isFullWidth?: boolean;
	name: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>;
}

interface TimeValue {
	hours: number;
	minutes: number;
}

/**
 * TimePicker component
 * @param {object} root0
 * @param {number} root0.minuteStep
 * @param {string} root0.placeholder
 * @param {boolean} root0.isDisabled
 * @param {boolean} root0.isReadOnly
 * @param {string} root0.label
 * @param {string} root0.helperText
 * @param {string} root0.errorText
 * @param {boolean} root0.showClearButton
 * @param {string} root0.className
 * @param {boolean} root0.isFullWidth
 * @param {string} root0.name
 * @param {string} root0.control
 * @returns {JSX.Element}
 */
export const TimePicker: React.FC<TimePickerProps> = ({
	minuteStep = 5,
	placeholder,
	isDisabled = false,
	isReadOnly = false,
	label,
	helperText,
	errorText,
	showClearButton = true,
	className,
	isFullWidth = false,
	name,
	control,
}) => {
	const { t: translate } = useTranslation();
	const defaultPlaceholder = placeholder ?? translate('hour');
	const pickerId = `time-${name}`;
	const { isOpen, open, close } = usePicker(pickerId);
	const [selectedTime, _setSelectedTime] = useState<TimeValue | null>(
		control._defaultValues[name]
			? parseTimeString(control._defaultValues[name])
			: null
	);
	const [mode, setMode] = useState<'hours' | 'minutes'>('hours');
	const clockRef = useRef<HTMLDivElement>(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const fieldRef = useRef<any>(null);
	const buttonRef = useRef<HTMLDivElement>(null);
	const [coords, setCoords] = useState<{ top: number; left: number }>({
		top: 0,
		left: 0,
	});

	/**
	 * Parse time string to TimeValue object
	 * @param {string} timeString
	 * @returns {TimeValue | null}
	 */
	function parseTimeString(timeString: string): TimeValue | null {
		if (!timeString) return null;
		const [hours, minutes] = timeString.split(':').map(Number);
		return { hours, minutes };
	}

	/**
	 * Sets the selected time and triggers the onChange event
	 * @param {TimeValue | null} value
	 */
	const setSelectedTime = (value: TimeValue | null) => {
		_setSelectedTime(value);
		if (fieldRef.current?.onChange) {
			fieldRef.current.onChange(
				value === null ? undefined : formatTimeValue(value)
			);
		}
	};

	/**
	 * Format TimeValue to string (24h format)
	 * @param {TimeValue | null} timeValue
	 * @returns {string}
	 */
	const formatTimeValue = (timeValue: TimeValue | null): string => {
		if (!timeValue) return '';

		const { hours, minutes } = timeValue;
		const formattedHours = hours.toString().padStart(2, '0');
		const formattedMinutes = minutes.toString().padStart(2, '0');
		return `${formattedHours}:${formattedMinutes}`;
	};

	// Close clock when clicking outside
	useEffect(() => {
		/**
		 * Handle click outside the clock
		 * @param {MouseEvent} event
		 */
		const handleClickOutside = (event: MouseEvent) => {
			if (
				clockRef.current &&
				!clockRef.current.contains(event.target as Node)
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
	 * Handle hour selection
	 * @param {number} hour
	 */
	const handleHourSelect = (hour: number) => {
		const newTime = {
			hours: hour,
			minutes: selectedTime?.minutes || 0,
		} as TimeValue;

		setSelectedTime(newTime);
		setMode('minutes');
	};

	/**
	 * Handle minute selection
	 * @param {number} minute
	 */
	const handleMinuteSelect = (minute: number) => {
		if (!selectedTime) return;

		const newTime = {
			...selectedTime,
			minutes: minute,
		};

		setSelectedTime(newTime);
	};

	/**
	 * Clear time selection
	 * @param {React.MouseEvent} e
	 */
	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isDisabled) return;
		setSelectedTime(null);
	};

	/**
	 * Generate clock numbers for hours or minutes
	 * @param {'hours' | 'minutes'} type
	 * @returns {JSX.Element[]}
	 */
	const generateClockNumbers = (type: 'hours' | 'minutes'): JSX.Element[] => {
		const numbers = [];
		const centerX = 100;
		const centerY = 100;

		if (type === 'hours') {
			const outerRadius = 78;
			const innerRadius = 53;

			// Horas 0-11 no círculo externo
			for (let i = 0; i < 12; i++) {
				const angle = (i * 30 - 90) * (Math.PI / 180);
				const x = centerX + outerRadius * Math.cos(angle);
				const y = centerY + outerRadius * Math.sin(angle);
				const isSelected = selectedTime?.hours === i;
				numbers.push(
					<button
						key={`hours-outer-${i}`}
						className={clsx(
							'absolute w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transform -translate-x-1/2 -translate-y-1/2',
							isSelected
								? 'bg-primary-300 text-white'
								: 'hover:bg-secondary-300 text-gray-700'
						)}
						style={{ left: x, top: y }}
						onClick={() => handleHourSelect(i)}
						type='button'
					>
						{i.toString().padStart(2, '0')}
					</button>
				);
			}

			// Horas 12-23 no círculo interno
			for (let i = 12; i < 24; i++) {
				const angle = ((i - 12) * 30 - 90) * (Math.PI / 180);
				const x = centerX + innerRadius * Math.cos(angle);
				const y = centerY + innerRadius * Math.sin(angle);
				const isSelected = selectedTime?.hours === i;
				numbers.push(
					<button
						key={`hours-inner-${i}`}
						className={clsx(
							'absolute w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transform -translate-x-1/2 -translate-y-1/2',
							isSelected
								? 'bg-primary-300 text-white'
								: 'hover:bg-secondary-300 text-gray-700'
						)}
						style={{ left: x, top: y }}
						onClick={() => handleHourSelect(i)}
						type='button'
					>
						{i.toString().padStart(2, '0')}
					</button>
				);
			}
		} else {
			const radius = 79;

			for (let i = 0; i < 60; i += minuteStep) {
				const angle = (i * 6 - 90) * (Math.PI / 180);
				const x = centerX + radius * Math.cos(angle);
				const y = centerY + radius * Math.sin(angle);
				const isSelected = selectedTime?.minutes === i;
				numbers.push(
					<button
						key={`minutes-${i}`}
						className={clsx(
							'absolute w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transform -translate-x-1/2 -translate-y-1/2',
							isSelected
								? 'bg-primary-300 text-white'
								: 'hover:bg-secondary-300 text-gray-700'
						)}
						style={{ left: x, top: y }}
						onClick={() => handleMinuteSelect(i)}
						type='button'
					>
						{i.toString().padStart(2, '0')}
					</button>
				);
			}
		}
		return numbers;
	};

	/**
	 * Generate clock hand
	 * @param {'hours' | 'minutes'} type
	 * @returns {JSX.Element | null}
	 */
	const generateClockHand = (type: 'hours' | 'minutes'): JSX.Element | null => {
		if (!selectedTime) return null;

		let value = type === 'hours' ? selectedTime.hours : selectedTime.minutes;

		let angle, length;
		if (type === 'hours') {
			// Horas 0-11 no círculo externo, 12-23 no círculo interno
			if (value < 12) {
				angle = (value * 30 - 90) * (Math.PI / 180);
				length = 66;
			} else {
				angle = ((value - 12) * 30 - 90) * (Math.PI / 180);
				length = 46;
			}
		} else {
			angle = (value * 6 - 90) * (Math.PI / 180);
			length = 66;
		}

		const centerX = 96;
		const centerY = 97;
		const endX = centerX + length * Math.cos(angle);
		const endY = centerY + length * Math.sin(angle);

		return (
			<g>
				<line
					x1={centerX}
					y1={centerY}
					x2={endX}
					y2={endY}
					stroke='#44789B'
					strokeWidth='2'
					strokeLinecap='round'
				/>
				<circle
					cx={centerX}
					cy={centerY}
					r='4'
					fill='#44789B'
				/>
			</g>
		);
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
					'flex items-center border rounded-md px-3 py-2 dark:text-white',
					isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer',
					errorText ? 'border-red-500' : 'border-primary-300',
					isOpen
						? 'bg-primary-300 dark:bg-primary-600 text-white'
						: 'bg-white dark:bg-primary-600'
				)}
				onMouseDown={e => {
					e.stopPropagation();
					if (!isDisabled && !isReadOnly) {
						if (isOpen) {
							close();
							setMode('hours');
						} else {
							open();
							setMode('hours');
						}
					}
				}}
				ref={buttonRef}
			>
				<Controller
					name={name}
					control={control}
					defaultValue=''
					render={({ field }) => {
						fieldRef.current = field;
						return (
							<div className='flex items-center w-full min-w-0'>
								<input
									type='text'
									{...field}
									className={clsx(
										'flex-1 min-w-0 outline-none bg-transparent',
										isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
									)}
									value={field.value || ''}
									placeholder={defaultPlaceholder}
									readOnly={true}
									disabled={isDisabled}
									aria-label={label || 'Time'}
									style={{ minWidth: 0 }}
								/>
								<svg
									className={clsx(
										'h-5 w-5 ml-2 flex-shrink-0',
										isOpen ? 'text-white' : 'text-primary-300'
									)}
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
										clipRule='evenodd'
									/>
								</svg>
								{showClearButton && field.value && (
									<button
										className={clsx(
											'ml-2 hover:text-red-500 flex-shrink-0',
											isOpen ? 'text-white' : 'text-primary-300'
										)}
										onClick={handleClear}
										type='button'
										aria-label='Clear time'
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
						ref={clockRef}
						className='absolute -translate-x-1/2 mt-2 w-80 bg-white shadow-lg p-4 z-[9999] rounded-lg border border-gray-200 dark:bg-primary-600 dark:border-primary-700'
					>
						<div className='flex justify-center items-center'>
							<span className='text-3xl font-bold select-none'>
								<span
									className={clsx(
										'cursor-pointer',
										mode === 'hours' ? 'text-primary-300' : 'text-gray-700'
									)}
									onClick={() => setMode('hours')}
								>
									{selectedTime
										? selectedTime.hours.toString().padStart(2, '0')
										: '--'}
								</span>
								<span className='mx-1'>:</span>
								<span
									className={clsx(
										'cursor-pointer',
										mode === 'minutes' ? 'text-primary-300' : 'text-gray-700'
									)}
									onClick={() => setMode('minutes')}
								>
									{selectedTime
										? selectedTime.minutes.toString().padStart(2, '0')
										: '--'}
								</span>
							</span>
						</div>

						<div className='relative w-52 h-52 mx-auto'>
							<svg
								viewBox='0 0 200 200'
								className='absolute inset-0 w-full h-full'
							>
								<circle
									cx='96'
									cy='97'
									r='90'
									fill='none'
									stroke='#44789B'
									strokeWidth='2'
								/>
								{generateClockHand(mode)}
							</svg>

							<div className='absolute inset-0'>
								{generateClockNumbers(mode)}
							</div>
						</div>
					</div>,
					document.body
				)}
			{helperText && <p className='text-sm text-gray-500 mt-1'>{helperText}</p>}
			{errorText && <p className='text-sm text-red-500 mt-1'>{errorText}</p>}
		</div>
	);
};
