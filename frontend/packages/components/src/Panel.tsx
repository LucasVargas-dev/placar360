import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { ContainerHeader } from './ContainerHeader.js';

export type PanelVariant = 'default' | 'outlined' | 'elevated' | 'flat';

export type PanelSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'custom';
export type PanelBorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type PanelTextAlign = 'left' | 'center' | 'right';
export type PanelActionAlignment = 'left' | 'center' | 'right';

export type PanelActionButton = {
	text: string;
	onClick: () => void;
	variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
	icon?: ReactNode;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export type PanelProps<C extends ElementType> = {
	children?: ReactNode;
	variant?: PanelVariant;
	size?: PanelSize;
	customSize?: string;
	borderRadius?: PanelBorderRadius;
	title?: string;
	icon?: ReactNode;
	as?: C;
	className?: string;
} & ComponentPropsWithoutRef<C>;

const defaultElement = 'div';

/**
 * InfoPanel component
 * @param {object} root0
 * @param {ReactNode} root0.children
 * @param {string} root0.variant
 * @param {string} root0.size
 * @param {string} root0.borderRadius
 * @param {string} root0.title
 * @param {any} root0.as
 * @param {string} root0.className
 * @param {ReactNode} root0.icon
 * @param {string} root0.customSize
 * @returns {any}
 */
export function Panel<C extends ElementType = typeof defaultElement>({
	children,
	variant = 'default',
	size = 'full',
	customSize = '',
	borderRadius = 'md',
	title,
	icon,
	as,
	className = '',
	...rest
}: PanelProps<C>) {
	const Component = as || defaultElement;

	const baseStyles = 'flex flex-col transition-all duration-300 ease-in-out';

	const variantStyles = {
		default:
			'bg-secondary-100 dark:bg-primary-500 shadow-sm border border-gray-100',
		outlined: 'bg-secondary-100 dark:bg-primary-500 border border-gray-200',
		elevated: 'bg-secondary-100 dark:bg-primary-500 shadow-lg',
		flat: 'bg-secondary-100 dark:bg-primary-500z border border-gray-100',
	};

	const sizeStyles = {
		sm: 'w-xs',
		md: 'w-sm',
		lg: 'w-md',
		xl: 'w-lg',
		full: 'w-full',
		custom: customSize,
	};

	const borderRadiusStyles = {
		none: 'rounded-none',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		full: 'rounded-xl',
	};

	return (
		<Component
			className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${borderRadiusStyles[borderRadius]}
        ${className}
      `}
			{...rest}
		>
			{title && (
				<ContainerHeader
					icon={icon}
					title={title}
					borderRadius={borderRadius}
				/>
			)}
			{children}
		</Component>
	);
}

export default Panel;
