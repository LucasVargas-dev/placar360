import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export type ShortcutCardVariant = 'primary' | 'secondary';
export type ShortcutCardSize = 'sm' | 'md' | 'lg' | 'xl';

export type ShortcutCardProps<C extends ElementType> = {
	icon: ReactNode;
	label: string;
	variant?: ShortcutCardVariant;
	size?: ShortcutCardSize;
	isLoading?: boolean;
	isDisabled?: boolean;

	as?: C;
	className?: string;
} & ComponentPropsWithoutRef<C>;

const defaultElement = 'div';

/**
 * ShortcutCard component
 * @param {object} root0
 * @param {ReactNode} root0.icon
 * @param {string} root0.label
 * @param {string} root0.variant
 * @param {string} root0.size
 * @param {boolean} root0.isLoading
 * @param {boolean} root0.isDisabled
 * @param {any} root0.as
 * @param {string} root0.className
 *
 * @returns {any}
 */
export function ShortcutCard<C extends ElementType = typeof defaultElement>({
	icon,
	label,
	variant = 'primary',
	size = 'md',
	isLoading = false,
	isDisabled = false,
	as,
	className = '',
	...rest
}: ShortcutCardProps<C>) {
	const Component = as || defaultElement;

	const baseStyles =
		'flex flex-col items-center justify-center w-full h-full rounded-md transition-all duration-200';

	const variantStyles = {
		primary:
			'bg-secondary-100 dark:bg-primary-400 text-primary-900 dark:text-white hover:bg-secondary-500 dark:hover:bg-primary-300 active:brightness-90 active:scale-95',
		secondary:
			'bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-primary-900 dark:text-white hover:bg-secondary-500 dark:hover:bg-secondary-700 active:brightness-90 active:scale-95',
	};

	const sizeStyles = {
		sm: 'p-3 gap-2',
		md: 'p-4 gap-3',
		lg: 'p-5 gap-4',
		xl: 'p-6 gap-5',
	};

	const iconSizeStyles = {
		sm: 'text-2xl',
		md: 'text-3xl',
		lg: 'text-4xl',
		xl: 'text-5xl',
	};

	const textSizeStyles = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base',
		xl: 'text-lg',
	};

	const disabledStyle = isDisabled
		? 'opacity-50 cursor-not-allowed pointer-events-none'
		: 'cursor-pointer';

	const skeletonSizes = {
		sm: { icon: 'w-8 h-8', text: 'w-16 h-3' },
		md: { icon: 'w-10 h-10', text: 'w-20 h-4' },
		lg: { icon: 'w-14 h-14', text: 'w-24 h-5' },
		xl: { icon: 'w-16 h-16', text: 'w-28 h-6' },
	};

	/**
	 *	Render content based on loading state
	 *
	 * @returns {void}
	 */
	const renderContent = () => {
		if (isLoading) {
			const { icon: iconSize, text: textSize } = skeletonSizes[size];
			return (
				<>
					<div
						className={`${iconSize} rounded-full bg-secondary-900/30 dark:bg-secondary-600/30 animate-pulse`}
					/>
					<div
						className={`${textSize} rounded bg-secondary-900/30 dark:bg-secondary-600/30 animate-pulse`}
					/>
				</>
			);
		}

		return (
			<>
				<div className={iconSizeStyles[size]}>{icon}</div>
				<p className={`text-center font-medium ${textSizeStyles[size]}`}>
					{label}
				</p>
			</>
		);
	};

	return (
		<Component
			className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyle}
        ${className}
      `}
			role='button'
			aria-disabled={isDisabled || isLoading}
			{...rest}
		>
			{renderContent()}
		</Component>
	);
}

export default ShortcutCard;
