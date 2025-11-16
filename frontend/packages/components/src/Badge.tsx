import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export type BadgeVariant =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'danger'
	| 'warning'
	| 'ghost';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type BadgeRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

export type BadgeProps<C extends ElementType> = {
	children?: ReactNode;
	variant?: BadgeVariant;
	size?: BadgeSize;
	rounded?: BadgeRounded;
	className?: string;
	as?: C;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
} & ComponentPropsWithoutRef<C>;

const defaultElement = 'span';

/**
 * Badge component
 * @param {BadgeProps<C>} root0
 * @param {ReactNode} root0.children
 * @param {BadgeVariant} root0.variant
 * @param {BadgeSize} root0.size
 * @param {BadgeRounded} root0.rounded
 * @param {string} root0.className
 * @param {C} root0.as
 * @param {ReactNode} root0.leftIcon
 * @param {ReactNode} root0.rightIcon
 * @returns {JSX.Element}
 */
export function Badge<C extends ElementType = typeof defaultElement>({
	children,
	variant = 'primary',
	size = 'sm',
	rounded = 'full',
	className = '',
	as,
	leftIcon,
	rightIcon,
	...rest
}: BadgeProps<C>) {
	const Component = as || defaultElement;

	const baseStyles =
		'inline-flex items-center font-medium whitespace-nowrap transition-all duration-400 hover:animate-pulse';

	const variantStyles = {
		primary: 'dark:bg-primary-400 bg-primary-900 text-white',
		secondary:
			'bg-transparent text-primary-700 dark:text-white border border-primary-700 dark:border-primary-300',
		success: 'bg-success-500 text-white',
		danger: 'bg-danger-500 text-white',
		warning: 'bg-warning-500 text-white',
		ghost: 'bg-secondary-1000/10 text-secondary-800 dark:text-white',
	};

	const sizeStyles = {
		xs: 'text-xs px-2 py-0.5',
		sm: 'text-sm px-2.5 py-1',
		md: 'text-base px-3 py-1.5',
		lg: 'text-lg px-4 py-2',
		xl: 'text-xl px-5 py-2.5',
	};

	const roundedStyles = {
		none: 'rounded-none',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		full: 'rounded-full',
	};

	return (
		<Component
			className={`
				${baseStyles}
				${variantStyles[variant]}
				${sizeStyles[size]}
				${roundedStyles[rounded]}
				${className}
			`}
			{...rest}
		>
			{leftIcon && <span className='mr-1.5 inline-flex'>{leftIcon}</span>}
			{children}
			{rightIcon && <span className='ml-1.5 inline-flex'>{rightIcon}</span>}
		</Component>
	);
}

export default Badge;
