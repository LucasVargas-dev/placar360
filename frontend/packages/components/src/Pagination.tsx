import { ComponentPropsWithoutRef, ElementType, useMemo } from 'react';

export type PaginationSize = 'sm' | 'md' | 'lg';

const defaultElement = 'nav';

export type PaginationProps<C extends ElementType = typeof defaultElement> = {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	visiblePages?: number;
	size?: PaginationSize;

	as?: C;
	className?: string;
} & ComponentPropsWithoutRef<C>;

/**
 * Generate pagination range for display
 * @param {number} currentPage - Current active page
 * @param {number} totalPages - Total number of pages
 * @param {number} visiblePages - Number of visible page buttons
 *
 * @returns {(number | string)[]} Array of page numbers and ellipsis
 */
const generatePaginationRange = (
	currentPage: number,
	totalPages: number,
	visiblePages: number = 5
): (number | string)[] => {
	if (totalPages <= visiblePages) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const half = Math.floor(visiblePages / 2);

	let startPage = Math.max(currentPage - half, 1);
	let endPage = Math.min(startPage + visiblePages - 1, totalPages);

	if (endPage - startPage + 1 < visiblePages) {
		startPage = Math.max(endPage - visiblePages + 1, 1);
	}

	const range: (number | string)[] = Array.from(
		{ length: endPage - startPage + 1 },
		(_, i) => startPage + i
	);

	if (startPage > 1) {
		if (startPage > 2) {
			range.unshift('...');
		}
		range.unshift(1);
	}

	if (endPage < totalPages) {
		if (endPage < totalPages - 1) {
			range.push('...');
		}
		range.push(totalPages);
	}

	return range;
};

/**
 * Pagination component
 * @param {object} props - Pagination props
 * @param {number} props.currentPage
 * @param {number} props.totalPages
 * @param {number} props.onPageChange
 * @param {number} props.visiblePages
 * @param {number} props.size
 * @param {any} props.as
 * @param {string} props.className
 *
 * @returns {any} Pagination component
 */
export function Pagination<C extends ElementType = typeof defaultElement>({
	currentPage,
	totalPages,
	onPageChange,
	visiblePages = 5,
	size = 'md',
	as,
	className = '',
	...rest
}: PaginationProps<C>) {
	const Component = as || defaultElement;

	const baseStyles = 'flex items-center justify-center';

	const sizeStyles = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base',
	};

	const buttonSizeStyles = {
		sm: 'w-6 h-6',
		md: 'w-8 h-8',
		lg: 'w-10 h-10',
	};

	const paginationRange = useMemo(() => {
		return generatePaginationRange(currentPage, totalPages, visiblePages);
	}, [currentPage, totalPages, visiblePages]);

	const pageButtonStyles = `
        flex items-center justify-center rounded-full
        ${buttonSizeStyles[size]}
        mx-1
        transition-colors duration-200
        cursor-pointer hover:bg-primary-900 dark:hover:bg-secondary-100
        text-primary-900 font-semibold dark:text-secondary-100 font-semibold
        hover:text-secondary-100 dark:hover:text-primary-900
        border border-transparent
    `;

	const currentPageStyles = `
        flex items-center justify-center rounded-full
        ${buttonSizeStyles[size]}
        mx-1
        bg-primary-900 dark:bg-secondary-100
        text-secondary-100 font-semibold dark:text-primary-900 font-semibold
        border border-secondary-200 dark:border-secondary-700
        'cursor-pointer'
    `;

	const ellipsisStyles = `
        flex items-center justify-center
        ${buttonSizeStyles[size]}
        mx-1
        text-primary-900 dark:text-secondary-100 font-semibold
    `;

	/**
	 * Handle page change
	 * @param {number} page - Page number to change to
	 * @returns {void}
	 */
	const handlePageChange = (page: number): void => {
		if (page < 1 || page > totalPages) return;
		if (page === currentPage) return;

		onPageChange(page);
	};

	if (totalPages <= 1) {
		return null;
	}

	return (
		<Component
			className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${className}
      `}
			aria-label='Paginação'
			{...rest}
		>
			{paginationRange.map((pageNumber, index) => {
				if (typeof pageNumber === 'string') {
					return (
						<span
							key={`ellipsis-${index}`}
							className={ellipsisStyles}
							aria-hidden='true'
						>
							...
						</span>
					);
				}

				const isCurrentPage = pageNumber === currentPage;

				return (
					<button
						key={pageNumber}
						type='button'
						className={isCurrentPage ? currentPageStyles : pageButtonStyles}
						onClick={() => handlePageChange(pageNumber as number)}
						aria-label={`Página ${pageNumber}`}
						aria-current={isCurrentPage ? 'page' : undefined}
						title={`Página ${pageNumber}`}
					>
						{pageNumber}
					</button>
				);
			})}
		</Component>
	);
}

export default Pagination;
