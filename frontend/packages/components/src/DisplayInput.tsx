import { ReactNode } from 'react';

export type DisplayInputType = 'text' | 'password' | 'number';
export type DisplayInputVariant = 'default' | 'flushed';
export type DisplayInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type DisplayInputProps = {
	type?: DisplayInputType;
	variant?: DisplayInputVariant;
	size?: DisplayInputSize;

	isFullWidth?: boolean;
	isFullHeight?: boolean;
	isTextarea?: boolean;

	label?: string;

	leftIcon?: ReactNode;
	rightIcon?: ReactNode;

	value?: string | number;
	placeholder?: string;

	min?: number;
	max?: number;
	className?: string;
};

/**
 * DisplayInput component - for displaying data only, no form functionality
 * @param {DisplayInputProps} root0
 * @param {string} root0.label
 * @param {string} root0.name
 * @param {DisplayInputType} root0.type
 * @param {string | number} root0.value
 * @param {string} root0.placeholder
 * @param {DisplayInputVariant} root0.variant
 * @param {DisplayInputSize} root0.size
 * @param {boolean} root0.isFullWidth
 * @param {boolean} root0.isDisabled
 * @param {boolean} root0.isTextarea
 * @param {ReactNode} root0.leftIcon
 * @param {ReactNode} root0.rightIcon
 * @param {string} root0.min
 * @param {string} root0.max
 * @param {string} root0.className
 *
 * @returns {JSX.Element}
 */
export function DisplayInput({
	type = 'text',
	variant = 'default',
	size = 'md',

	isFullWidth = false,
	isFullHeight = false,
	isTextarea = false,

	label,

	leftIcon,
	rightIcon,

	value,
	placeholder,

	min,
	max,
	className = '',
}: DisplayInputProps) {
	const baseStyles = 'transition-colors focus:outline-none dark:text-white';

	const defaultVariantStyles = {
		default:
			'border border-primary-300 rounded-md bg-white dark:bg-primary-600 focus:ring-1 focus:ring-primary-300 focus:border-primary-300',
		flushed:
			'border-b border-primary-300 rounded-none bg-transparent focus:outline-none focus:border-b-2 focus:border-primary-500 px-0 focus:ring-1 focus:ring-primary-400 px-0',
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

	const fullWidthStyle = isFullWidth ? 'w-full' : 'w-52';

	const fullHeightStyle = isFullHeight ? 'h-full' : '';

	const placeholderStyles =
		'placeholder:text-gray-400 dark:placeholder:text-gray-400';

	const caretStyles = 'caret-black dark:caret-white';

	return (
		<div className={`${fullWidthStyle} ${isFullHeight && 'flex flex-col'}`}>
			{label && (
				<label
					className={
						'block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200'
					}
				>
					{label}
				</label>
			)}
			<div
				className={`relative flex items-center justify-center ${isFullHeight && 'flex-1'}`}
			>
				{leftIcon && (
					<div className='absolute left-3 flex items-center text-secondary-900'>
						{leftIcon}
					</div>
				)}

				{isTextarea ? (
					<textarea
						placeholder={placeholder}
						disabled={true}
						value={value}
						readOnly
						className={`
							${baseStyles}
							${defaultVariantStyles[variant]}
							${sizeStyles[size]}
							${fullWidthStyle}
							${placeholderStyles}
							${className}
							${caretStyles}
							${fullHeightStyle}
						`}
						rows={3}
						style={{
							resize: 'vertical',
							minHeight: `${3 * 1.5}rem`,
							maxHeight: `${7 * 1.5}rem`,
						}}
					/>
				) : (
					<input
						type={type}
						placeholder={placeholder}
						disabled={true}
						value={value}
						readOnly
						min={type === 'number' ? min : undefined}
						max={type === 'number' ? max : undefined}
						className={`
							${baseStyles}
							${defaultVariantStyles[variant]}
							${sizeStyles[size]}
							${fullWidthStyle}
							${placeholderStyles}
							${iconPaddingStyles.left}
							${iconPaddingStyles.right}
							${className}
							${caretStyles}
						`}
					/>
				)}

				{rightIcon && (
					<div className='absolute right-3 flex items-center text-secondary-900'>
						{rightIcon}
					</div>
				)}
			</div>
		</div>
	);
}
