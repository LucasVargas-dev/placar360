import {
	ComponentPropsWithoutRef,
	ElementType,
	ReactNode,
	useState,
} from 'react';
import { ContainerHeader } from './ContainerHeader.js';
import { motion } from 'framer-motion';

export type ContainerVariant = 'default' | 'outlined' | 'elevated' | 'flat';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'custom';
export type ContainerBorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type ContainerTextAlign = 'left' | 'center' | 'right';
export type ContainerActionAlignment = 'left' | 'center' | 'right';

export type ContainerActionButton = {
	text: string;
	onClick: () => void;
	variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
	icon?: ReactNode;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export type ContainerProps<C extends ElementType> = {
	children?: ReactNode;
	variant?: ContainerVariant;
	size?: ContainerSize;
	customSize?: string;
	borderRadius?: ContainerBorderRadius;
	title?: string;
	icon?: ReactNode;
	as?: C;
	className?: string;
	contentClassName?: string;
	isCollapsible?: boolean;
	collapsed?: boolean;
} & ComponentPropsWithoutRef<C>;

const defaultElement = 'div';

/**
 * InfoContainer component
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
 * @param {string} root0.contentClassName
 * @param {boolean} root0.isCollapsible
 * @param {boolean} root0.collapsed
 * @returns {any}
 */
export function Container<C extends ElementType = typeof defaultElement>({
	children,
	variant = 'default',
	size = 'full',
	customSize = '',
	borderRadius = 'md',
	title,
	icon,
	as,
	className = '',
	contentClassName = '',
	isCollapsible,
	collapsed,
	...rest
}: ContainerProps<C>) {
	const Component = as || defaultElement;

	const baseStyles =
		'flex flex-col transition-all duration-300 overflow-hidden';

	const variantStyles = {
		default: 'bg-white dark:bg-primary-500 border border-secondary-200',
		outlined:
			'bg-white dark:bg-primary-500 border border-secondary-300 dark:border-primary-300',
		elevated: 'bg-white dark:bg-primary-500 shadow-lg',
		flat: 'bg-white dark:bg-primary-500',
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

	const [isOpen, setIsOpen] = useState(
		collapsed === undefined ? false : !collapsed
	);

	const initialState = { height: 10, opacity: 0 };

	const defaultState = { height: 'auto', opacity: 1 };

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
					onClick={isCollapsible ? () => setIsOpen(!isOpen) : undefined}
					isOpen={isOpen}
				/>
			)}

			{/* There are some problems when the children depend on the content div size for inner logic like some charts do, so it uses
				motion.div only when necessary*/}
			{isCollapsible ? (
				<motion.div
					initial={initialState}
					animate={isOpen ? defaultState : initialState}
					className={`overflow-hidden`}
					exit={initialState}
					transition={{ duration: 0.2, ease: 'easeInOut' }}
				>
					{children}
				</motion.div>
			) : (
				<div className={`w-full h-[calc(100%-40px)] ${contentClassName}`}>
					{children}
				</div>
			)}
		</Component>
	);
}

export type ContainerFooterProps<C extends ElementType> = {
	as?: C;
	className?: string;
} & ComponentPropsWithoutRef<C>;

const defaultFooterElement = 'div';

/**
 * Container footer
 * @param {ContainerFooterProps<C>} root0
 * @param {C} root0.as
 * @param {string} root0.className
 * @param {ReactNode} root0.children
 * @returns {JSX.Element}
 */
export function ContainerFooter<
	C extends ElementType = typeof defaultFooterElement,
>({ as, className, children }: ContainerFooterProps<C>) {
	const Component = as || defaultFooterElement;

	const baseStyles =
		'bg-transparent border-t border-secondary-500 dark:border-primary-300 ';
	return (
		<Component
			className={`${baseStyles} ${className}`}
			children={children}
		/>
	);
}
