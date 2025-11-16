import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export type ButtonVariant =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'danger'
	| 'warning'
	| 'ghost';

export type ButtonSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

export type ButtonProps<C extends ElementType> = {
	children: ReactNode;
	variant?: ButtonVariant;
	size?: ButtonSize;
	rounded?: ButtonRounded;
	isFullWidth?: boolean;
	isDisabled?: boolean;
	isLoading?: boolean;

	leftIcon?: ReactNode;
	rightIcon?: ReactNode;

	as?: C;
	className?: string;
} & ComponentPropsWithoutRef<C>;

const defaultElement = 'button';

/**
 * Button component
 * @param {object} root0
 * @param {ReactNode} root0.children
 * @param {string} root0.variant
 * @param {string} root0.size
 * @param {string} root0.rounded
 * @param {boolean} root0.isFullWidth
 * @param {boolean} root0.isDisabled
 * @param {boolean} root0.isLoading
 * @param {ReactNode} root0.leftIcon
 * @param {ReactNode} root0.rightIcon
 * @param {any} root0.as
 * @param {string} root0.className
 *
 * @returns {any}
 */
export function Button<C extends ElementType = typeof defaultElement>({
	children,
	variant = 'primary',
	size = 'md',
	rounded = 'md',
	isFullWidth = false,
	isDisabled = false,
	isLoading = false,
	leftIcon,
	rightIcon,
	as,
	className = '',
	...rest
}: ButtonProps<C>) {
	const Component = as || defaultElement;

	const baseStyles =
		'relative inline-flex items-center justify-center font-semibold transition-colors transition-all duration-200 active:brightness-90 active:scale-95';

	const variantStyles = {
		primary:
			'bg-secondary-900 text-white hover:bg-secondary-800 border border-secondary-900 dark:bg-primary-500 dark:hover:bg-primary-400 dark:border-primary-500',
		secondary:
			'bg-white text-secondary-700 hover:bg-secondary-100 border border-secondary-300',
		success:
			'bg-success-500 text-white hover:bg-success-700 border border-success-500',
		danger:
			'bg-danger-500 text-white hover:bg-danger-700 border border-danger-500',
		warning:
			'bg-warning-500 text-white hover:bg-warning-700 border border-warning-500',
		ghost: 'bg-transparent hover:bg-secondary-100',
	};

	const sizeStyles = {
		xxs: 'px-2 py-0.5 text-xxs',
		xs: 'px-2 py-1 text-xs',
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-5 py-2.5 text-lg',
		xl: 'px-6 py-3 text-xl',
	};

	const roundedStyles = {
		none: 'rounded-none',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		full: 'rounded-full',
	};

	const fullWidthStyle = isFullWidth ? 'w-full' : '';
	const disabledStyle =
		isDisabled || isLoading
			? 'opacity-50 cursor-not-allowed'
			: 'cursor-pointer';

	return (
		<Component
			className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${roundedStyles[rounded]}
        ${fullWidthStyle}
        ${disabledStyle}
        ${className}
      `}
			disabled={isDisabled || isLoading}
			{...rest}
		>
			{leftIcon && <span className='mr-1 inline-flex'>{leftIcon}</span>}
			{children}
			{rightIcon && <span className='ml-2 inline-flex'>{rightIcon}</span>}

			{isLoading && (
				<div
					className={`absolute inset-0 flex items-center justify-center bg-inherit ${roundedStyles[rounded]}`}
				>
					<svg
						className='animate-spin h-5 w-5 text-current'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
					>
						<circle
							className='opacity-25'
							cx='12'
							cy='12'
							r='10'
							stroke='currentColor'
							strokeWidth='4'
						></circle>
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
						></path>
					</svg>
				</div>
			)}
		</Component>
	);
}

export default Button;
