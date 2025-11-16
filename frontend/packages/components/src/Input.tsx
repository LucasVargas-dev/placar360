import { ReactNode, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import Information, { InformationSize } from './Information.js';

export type InputType = 'text' | 'password' | 'number' | 'file';
export type InputVariant = 'default' | 'flushed';
export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type InputProps = {
	type?: InputType;
	variant?: InputVariant;
	size?: InputSize;

	isFullWidth?: boolean;
	isFullHeight?: boolean;
	isDisabled?: boolean;
	isTextarea?: boolean;

	label?: string;
	errorInfo?: string;

	leftIcon?: ReactNode;
	rightIcon?: ReactNode;

	name: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	register: UseFormRegister<any>;
	placeholder?: string;

	min?: number;
	max?: number;
	className?: string;

	showTooltipInformation?: boolean;
	tooltipInformationMessage?: string;
	tooltipInformationSize?: InformationSize;

	multiple?: boolean;
	accept?: string;
	width?: string;
};

/**
 * Input component
 * @param {InputProps} root0
 * @param {string} root0.label
 * @param {string} root0.name
 * @param {InputType} root0.type
 * @param {UseFormRegister<any>} root0.register
 * @param {string} root0.placeholder
 * @param {InputVariant} root0.variant
 * @param {InputSize} root0.size
 * @param {boolean} root0.isFullWidth
 * @param {boolean} root0.isDisabled
 * @param {boolean} root0.isTextarea
 * @param {string} root0.errorInfo
 * @param {ReactNode} root0.leftIcon
 * @param {ReactNode} root0.rightIcon
 * @param {string} root0.min
 * @param {string} root0.max
 * @param {string} root0.className
 * @param {string} root0.showTooltipInformation
 * @param {string} root0.tooltipInformationMessage
 * @param {string} root0.tooltipInformationSize
 * @param {string} root0.width
 *
 * @returns {JSX.Element}
 */
export function Input({
	type = 'text',
	variant = 'default',
	size = 'md',

	isFullWidth = false,
	isFullHeight = false,
	isDisabled = false,
	isTextarea = false,

	label,
	errorInfo,

	leftIcon,
	rightIcon,

	name,
	register,
	placeholder,

	min,
	max,
	className = '',

	showTooltipInformation = false,
	tooltipInformationMessage = '',
	tooltipInformationSize = 'md',

	accept,
	multiple,
	width,
}: InputProps) {
	const [selectedFiles, setSelectedFiles] = useState<string>('');
	const baseStyles = 'transition-colors focus:outline-none';

	const defaultVariantStyles = {
		default:
			'border border-primary-300 rounded-md bg-white focus:ring-1 focus:ring-primary-300 focus:border-primary-300',
		flushed:
			'border-b border-primary-300 rounded-none bg-transparent focus:outline-none focus:border-b-2 focus:border-primary-500 px-0 focus:ring-1 focus:ring-primary-400 px-0',
	};

	const errorBaseStyles = {
		default:
			'rounded-md bg-white dark:bg-primary-800 focus:ring-1 border border-danger-500 focus:border-danger-500 focus:ring-danger-500',
		flushed:
			'rounded-none focus:ring-0 px-0 border-b border-danger-500 focus:border-danger-500 focus:ring-danger-500',
	};

	const sizeStyles = {
		xs: 'px-2 py-1 text-xs',
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-5 py-2.5 text-lg',
		xl: 'px-6 py-3 text-xl',
	};

	const iconPaddingStyles = {
		left: leftIcon ? 'pl-10' : '',
		right: rightIcon ? 'pr-10' : '',
	};

	const fullWidthStyle = isFullWidth ? 'w-full' : width || 'w-52';

	const fullHeightStyle = isFullHeight ? 'h-full' : '';

	const placeholderStyles =
		'placeholder:text-gray-400 dark:placeholder:text-gray-400';

	const variantBaseStyles = errorInfo
		? errorBaseStyles[variant]
		: defaultVariantStyles[variant];

	const disabledStyle = isDisabled
		? 'bg-gray-900 dark:bg-gray-700 cursor-not-allowed'
		: '';

	/**
	 * Handle key down events for number inputs.
	 * @param {React.KeyboardEvent<HTMLInputElement>} e
	 */
	const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		//Isso aqui serve para não permitir letras especiais nos número como a letra "e" e não permite negativos.
		if (
			['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)
		)
			return;

		if (!/[0-9]/.test(e.key)) e.preventDefault();
	};

	return (
		<div className={`${fullWidthStyle} ${isFullHeight && 'flex flex-col'}`}>
			{label && (
				<div className='flex flex-row justify-between'>
					{label && (
						<label className='block text-sm font-medium mb-1 text-secondary-900 dark:text-secondary-900'>
							{label}
						</label>
					)}
					{showTooltipInformation && (
						<div>
							<Information
								message={tooltipInformationMessage}
								size={tooltipInformationSize}
							/>
						</div>
					)}
				</div>
			)}
			<div
				className={`relative flex items-center justify-center ${isFullHeight && 'flex-1'}`}
			>
				{leftIcon && (
					<div className='absolute left-3 flex items-center text-gray-500'>
						{leftIcon}
					</div>
				)}

				{type === 'file' ? (
					<label
						className={`
          cursor-pointer
          flex items-center justify-center
          ${variantBaseStyles}
          ${sizeStyles[size]}
          ${fullWidthStyle}
          ${disabledStyle}
          ${placeholderStyles}
          ${iconPaddingStyles.left}
          ${iconPaddingStyles.right}
          ${className}
        `}
					>
						{leftIcon && <span className='mr-2'>{leftIcon}</span>}

						{/* Show file name if selected, otherwise placeholder */}
						{selectedFiles || placeholder || 'Choose file'}

						<input
							type='file'
							multiple={multiple}
							accept={accept}
							disabled={isDisabled}
							{...register(name, {
								/**
								 * Listens for on change events on the file input to update the displayed file names
								 * @param {React.ChangeEvent<HTMLInputElement>} e
								 */
								onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
									const files = e.target.files;
									if (files && files.length > 0) {
										// Join multiple file names with comma
										setSelectedFiles(
											Array.from(files)
												.map(f => f.name)
												.join(', ')
										);
									} else {
										setSelectedFiles('');
									}
								},
							})}
							className='hidden'
						/>
					</label>
				) : isTextarea ? (
					<textarea
						placeholder={placeholder}
						disabled={isDisabled}
						{...register(name)}
						className={`
							${baseStyles}
							${variantBaseStyles}
							${sizeStyles[size]}
							${fullWidthStyle}
							${disabledStyle}
							${placeholderStyles}
							text-gray-900
							${className}
							${fullHeightStyle}
						`}
						rows={3}
						style={{
							color: '#111827',
							WebkitTextFillColor: '#111827',
							resize: 'vertical',
							minHeight: `${3 * 1.5}rem`,
							maxHeight: `${7 * 1.5}rem`,
						}}
					/>
				) : (
					<input
						type={type}
						placeholder={placeholder}
						disabled={isDisabled}
						{...register(name, {
							valueAsNumber: type === 'number',
						})}
						min={type === 'number' ? min : undefined}
						max={type === 'number' ? max : undefined}
						style={{ color: '#111827', WebkitTextFillColor: '#111827' }}
						className={`
							${baseStyles}
							${variantBaseStyles}
							${sizeStyles[size]}
							${fullWidthStyle}
							${disabledStyle}
							${placeholderStyles}
							${iconPaddingStyles.left}
							${iconPaddingStyles.right}
							text-gray-900
							${className}
						`}
						onKeyDown={type === 'number' ? handleNumberKeyDown : undefined}
					/>
				)}

				{rightIcon && (
					<div className='absolute right-3 flex items-center text-gray-500'>
						{rightIcon}
					</div>
				)}
			</div>
			{errorInfo && (
				<p className={`mt-1 text-sm text-danger-500`}>{errorInfo}</p>
			)}
		</div>
	);
}
