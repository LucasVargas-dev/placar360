import clsx from 'clsx';
import { Controller, Control } from 'react-hook-form';
import Information, { InformationSize } from './Information.js';

type CheckboxProps = {
	name: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>;
	label?: string;
	size?: 'sm' | 'md' | 'lg';
	isDisabled?: boolean;
	className?: string;
	showTooltipInformation?: boolean;
	tooltipInformationMessage?: string;
	tooltipInformationSize?: InformationSize;
};

/**
 * Checkbox component
 * @param {CheckboxProps} root0
 * @param {string}root0.name
 * @param {Control<any>}root0.control
 * @param {string}root0.label
 * @param {string}root0.size
 * @param {boolean}root0.isDisabled
 * @param {string}root0.className
 *
 * @returns {JSX.Element}
 */
export function Checkbox({
	name,
	control,
	label = '',
	size = 'md',
	isDisabled = false,
	className,
	showTooltipInformation = false,
	tooltipInformationMessage = '',
	tooltipInformationSize = 'md',
}: CheckboxProps) {
	const sizeClasses = {
		sm: { switch: 'w-10 h-5', ball: 'w-4 h-4', translateX: 'translate-x-5' },
		md: { switch: 'w-12 h-6', ball: 'w-5 h-5', translateX: 'translate-x-6' },
		lg: { switch: 'w-16 h-8', ball: 'w-6 h-6', translateX: 'translate-x-8' },
	}[size];

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={false}
			render={({ field }) => (
				<label className='flex flex-col justify-center gap-4 cursor-pointer'>
					{label && (
						<span className='text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2'>
							{label}
						</span>
					)}
					<div className='flex flex-row gap-2'>
						<div
							className={clsx(
								'relative flex items-center rounded-full transition-all duration-300',
								sizeClasses.switch,
								field.value ? 'bg-primary-300' : 'bg-secondary-700',
								isDisabled && 'opacity-50 cursor-not-allowed',
								className
							)}
						>
							<input
								type='checkbox'
								disabled={isDisabled}
								checked={field.value}
								onChange={e => field.onChange(e.target.checked)}
								className='absolute w-full h-full opacity-0 cursor-pointer'
							/>
							<div
								className={clsx(
									'absolute bg-white rounded-full transition-transform duration-300',
									sizeClasses.ball,
									field.value ? sizeClasses.translateX : 'translate-x-1'
								)}
							/>
						</div>
						{showTooltipInformation && (
							<div>
								<Information
									message={tooltipInformationMessage}
									size={tooltipInformationSize}
								/>
							</div>
						)}
					</div>
				</label>
			)}
		/>
	);
}
