import React from 'react';
import { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DatePicker } from './DatePicker.js';
import { TimePicker } from './TimePicker.js';

interface DateTimePickerProps {
	labelKey: string;
	dateName: string;
	timeName: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>;
	isFullWidth?: boolean;
	showClearButton?: boolean;
	isDisabled?: boolean;
}

/**
 * DateTimePicker component that combines DatePicker and TimePicker
 * @param {object} props
 * @param {string} props.labelKey - Translation key for the label
 * @param {string} props.dateName - Name for the date field
 * @param {string} props.timeName - Name for the time field
 * @param {Control} props.control - React Hook Form control
 * @param {boolean} props.isFullWidth - Whether the pickers are full width
 * @param {boolean} props.showClearButton - Whether to show clear button
 * @param {boolean} props.isDisabled - Whether the pickers are disabled
 * @returns {JSX.Element}
 */
export const DateTimePicker: React.FC<DateTimePickerProps> = ({
	labelKey,
	dateName,
	timeName,
	control,
	isFullWidth = true,
	showClearButton = false,
	isDisabled = false,
}) => {
	const { t: translate } = useTranslation();

	return (
		<div>
			<label className='mb-1 block text-sm font-medium dark:text-white'>
				{translate(labelKey)}
			</label>
			<div className='grid grid-cols-12 gap-2'>
				<div className='col-span-7'>
					<DatePicker
						name={dateName}
						control={control}
						isFullWidth={isFullWidth}
						showClearButton={showClearButton}
						isDisabled={isDisabled}
					/>
				</div>
				<div className='col-span-5'>
					<TimePicker
						name={timeName}
						control={control}
						isFullWidth={isFullWidth}
						showClearButton={showClearButton}
						isDisabled={isDisabled}
					/>
				</div>
			</div>
		</div>
	);
};
