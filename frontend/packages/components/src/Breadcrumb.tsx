import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import React from 'react';

export type BreadcrumbSeparator = '/' | '>' | '-' | '•' | ReactNode;
export type BreadcrumbSize = 'sm' | 'md' | 'lg';

export type BreadcrumbProps<C extends ElementType> = {
	children: ReactNode;
	separator?: BreadcrumbSeparator;
	size?: BreadcrumbSize;
	icon?: ReactNode;
	enableFavorite?: boolean;
	isFavorite?: boolean;
	onToggleFavorite?: () => void;

	as?: C;
	className?: string;
} & ComponentPropsWithoutRef<C>;

export type BreadcrumbItemProps<C extends ElementType> = {
	children: ReactNode;
	isCurrentPage?: boolean;
	href?: string;

	as?: C;
	className?: string;
} & ComponentPropsWithoutRef<C>;

const defaultElement = 'nav';
const defaultItemElement = 'li';

/**
 * Function to render the appropriate separator
 * @param {BreadcrumbSeparator} separator
 *
 * @returns {ReactNode}
 */
const renderSeparator = (separator?: BreadcrumbSeparator) => {
	if (!separator) return <ChevronRight className='w-3 h-3' />;

	if (typeof separator === 'string') {
		return <span>{separator}</span>;
	}

	return separator;
};

/**
 * BreadcrumbItem component
 * @param {object} root0
 * @param {ReactNode} root0.children
 * @param {boolean} root0.isCurrentPage
 * @param {string} root0.href
 * @param {any} root0.as
 * @param {string} root0.className
 *
 * @returns {any}
 */
export function BreadcrumbItem<
	C extends ElementType = typeof defaultItemElement,
>({
	children,
	isCurrentPage = false,
	href,
	as,
	className = '',
	...rest
}: BreadcrumbItemProps<C>) {
	const Component = as || defaultItemElement;

	const baseStyles = 'inline-flex items-center';
	const currentPageStyles = isCurrentPage
		? 'font-normal text-black dark:text-white'
		: 'text-zinc-800 dark:text-white hover:text-primary-500 dark:hover:text-primary-100';

	const content = isCurrentPage ? (
		<span
			aria-current='page'
			className='truncate'
			title={typeof children === 'string' ? children : undefined}
		>
			{children}
		</span>
	) : href ? (
		<a
			href={href}
			className='truncate transition-colors'
			title={typeof children === 'string' ? children : undefined}
		>
			{children}
		</a>
	) : (
		<span
			className='truncate'
			title={typeof children === 'string' ? children : undefined}
		>
			{children}
		</span>
	);

	return (
		<Component
			className={`
        ${baseStyles}
        ${currentPageStyles}
        ${className}
      `}
			{...rest}
		>
			{content}
		</Component>
	);
}

/**
 * Breadcrumb component
 * @param {object} root0
 * @param {ReactNode} root0.children
 * @param {BreadcrumbSeparator} root0.separator
 * @param {BreadcrumbSize} root0.size
 * @param {ReactNode} root0.icon
 * @param {boolean} root0.enableFavorite
 * @param {boolean} root0.isFavorite
 * @param {Function} root0.onToggleFavorite
 * @param {any} root0.as
 * @param {string} root0.className
 *
 * @returns {any}
 */
export function Breadcrumb<C extends ElementType = typeof defaultElement>({
	children,
	separator = '>',
	size = 'md',
	icon,
	enableFavorite = false,
	isFavorite = false,
	onToggleFavorite,
	as,
	className = '',
	...rest
}: BreadcrumbProps<C>) {
	const Component = as || defaultElement;

	const baseStyles = 'flex items-center h-10';

	const sizeStyles = {
		sm: 'text-xs gap-1',
		md: 'text-sm gap-1.5',
		lg: 'text-base gap-2',
	};

	const childrenArray = React.Children.toArray(children).filter(Boolean);

	const childrenWithSeparators = childrenArray.flatMap((child, index) => {
		if (index === childrenArray.length - 1) {
			return [child];
		}

		return [
			child,
			<li
				key={`separator-${index}`}
				className='text-current dark:text-white opacity-60 inline-flex items-center mx-1'
				aria-hidden='true'
			>
				{renderSeparator(separator)}
			</li>,
		];
	});

	return (
		<Component
			aria-label='Navegação breadcrumb'
			className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${className}
      `}
			{...rest}
		>
			{icon && (
				<div className='flex items-center text-zinc-800 dark:text-white self-center mb-[2px]'>
					{icon}
				</div>
			)}

			<ol className='flex items-center'>{childrenWithSeparators}</ol>

			{enableFavorite && (
				<button
					onClick={onToggleFavorite}
					className='text-zinc-800 dark:text-white hover:text-primary-500 dark:hover:text-primary-300 self-center'
					title={
						isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
					}
				>
					<Star
						className={`w-5 h-5 hover:animate-pulse ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
					/>
				</button>
			)}
		</Component>
	);
}

export default {
	Breadcrumb,
	BreadcrumbItem,
};
