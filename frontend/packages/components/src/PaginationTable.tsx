import clsx from 'clsx';
import * as React from 'react';
import { ReactNode } from 'react';
import Button from './Button.js';
import { CaretLeft, CaretRight } from 'phosphor-react';
import { AnimatePresence, motion } from 'framer-motion';

// Define types for the PaginationTable component
export type PaginationTableVariant =
	| 'default'
	| 'striped'
	| 'bordered'
	| 'unstyled';
export type PaginationTableSize = 'sm' | 'md' | 'lg';

export type PaginationTableProps = {
	children?: ReactNode;
	variant?: PaginationTableVariant;
	size?: PaginationTableSize;
	isBordered?: boolean;
	isStriped?: boolean;
	isCompact?: boolean;
	isScrollable?: boolean;
	maxHeight?: string | number;
	className?: string;
	// Pagination props
	currentPage: number;
	totalPages: number;
	totalItems?: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	showTotalItems?: boolean;
	isLoading?: boolean;
	// Internationalization props
	translations?: {
		page?: string;
		of?: string;
		previous?: string;
		next?: string;
		records?: string;
	};
} & React.HTMLAttributes<HTMLTableElement>;

export type PaginationTableSectionProps = {
	children?: ReactNode;
	className?: string;
} & React.HTMLAttributes<HTMLTableSectionElement>;

export type PaginationTableRowProps = {
	children?: ReactNode;
	isHoverable?: boolean;
	className?: string;
} & React.HTMLAttributes<HTMLTableRowElement>;

export type CollapsiblePaginationTableRowProps = {
	expandedContent: ReactNode;
	colSpan?: number;
	initialExpanded?: boolean;
	onToggle?: (isExpanded: boolean) => void;
} & PaginationTableRowProps &
	React.HTMLAttributes<HTMLTableRowElement>;

export type PaginationTableCellProps = {
	children?: ReactNode;
	isTruncated?: boolean;
	colSpan?: number;
	rowSpan?: number;
	className?: string;
} & React.TdHTMLAttributes<HTMLTableCellElement>;

export type PaginationTableHeadProps = {
	children?: ReactNode;
	className?: string;
} & React.ThHTMLAttributes<HTMLTableCellElement>;

export type PaginationTableCaptionProps = {
	children?: ReactNode;
	className?: string;
} & React.HTMLAttributes<HTMLTableCaptionElement>;

const PaginationTable = React.forwardRef<
	HTMLTableElement,
	PaginationTableProps
>(
	(
		{
			className,
			variant = 'default',
			size = 'md',
			isBordered = false,
			isStriped = false,
			isCompact = false,
			isScrollable = false,
			maxHeight,
			children,
			currentPage,
			totalPages,
			totalItems,
			itemsPerPage,
			onPageChange,
			showTotalItems = true,
			isLoading = false,
			translations = {
				page: 'Página',
				of: 'de',
				previous: 'Anterior',
				next: 'Próxima',
				records: 'registros',
			},
			...props
		},
		ref
	) => {
		// Default translations
		const t = {
			page: 'Página',
			of: 'de',
			previous: 'Anterior',
			next: 'Próxima',
			records: 'registros',
			...translations,
		};

		const variantStyles = {
			default: '',
			striped: '',
			bordered: '',
			unstyled: 'border-none shadow-none',
		};

		const sizeStyles = {
			sm: 'text-xs',
			md: 'text-sm',
			lg: 'text-base',
		};

		// Container styles based on scrollable and maxHeight
		const containerStyles = clsx(
			'relative w-full',
			isScrollable ? 'overflow-auto' : '',
			maxHeight ? 'overflow-y-auto' : ''
		);

		// Table styles
		const tableStyles = clsx(
			'w-full caption-bottom',
			sizeStyles[size],
			variantStyles[variant],
			isBordered &&
				'border border-gray-200 dark:border-gray-400 [&_th]:border [&_td]:border [&_th]:border-gray-200 [&_td]:border-gray-200 dark:[&_th]:border-gray-400 dark:[&_td]:border-gray-400',
			isStriped &&
				'[&_tbody_tr:nth-child(odd)]:bg-secondary-100 dark:[&_tbody_tr:nth-child(odd)]:bg-primary-600',
			isCompact ? 'p-1' : 'p-4',
			className
		);

		// Inline style for maxHeight
		const inlineStyle = maxHeight
			? {
					maxHeight:
						typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
				}
			: {};

		// Pagination logic
		const startItem = totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0;
		const endItem = totalItems
			? Math.min(currentPage * itemsPerPage, totalItems)
			: 0;

		/**
		 * Handle previous page navigation
		 */
		const handlePreviousPage = () => {
			if (currentPage > 1 && !isLoading) {
				onPageChange(currentPage - 1);
			}
		};

		/**
		 * Handle next page navigation
		 */
		const handleNextPage = () => {
			if (currentPage < totalPages && !isLoading) {
				onPageChange(currentPage + 1);
			}
		};

		return (
			<div className='flex flex-col h-full'>
				{/* Table Container */}
				<div className='flex-1 overflow-hidden'>
					<div
						className={containerStyles}
						style={inlineStyle}
					>
						<table
							ref={ref}
							className={tableStyles}
							{...props}
						>
							{children}
						</table>
					</div>
				</div>

				{/* Pagination Footer */}
				{totalPages > 1 && (
					<div className='flex h-12 items-center justify-between border-t border-gray-200 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-900'>
						{/* Left: Page info */}
						<div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
							<span>
								{t.page} {currentPage} {t.of} {totalPages}
							</span>
						</div>

						{/* Center: Total items (optional) */}
						<div className='flex items-center'>
							{showTotalItems && totalItems && (
								<span className='text-sm text-gray-600 dark:text-gray-300'>
									{startItem}-{endItem} {t.of} {totalItems} {t.records}
								</span>
							)}
						</div>

						{/* Right: Navigation buttons */}
						<div className='flex items-center space-x-2'>
							<Button
								variant='secondary'
								size='sm'
								onClick={handlePreviousPage}
								disabled={currentPage <= 1 || isLoading}
								className='flex h-8 items-center space-x-1 px-3'
							>
								<CaretLeft size={16} />
								<span>{t.previous}</span>
							</Button>
							<Button
								variant='secondary'
								size='sm'
								onClick={handleNextPage}
								disabled={currentPage >= totalPages || isLoading}
								className='flex h-8 items-center space-x-1 px-3'
							>
								<span>{t.next}</span>
								<CaretRight size={16} />
							</Button>
						</div>
					</div>
				)}
			</div>
		);
	}
);
PaginationTable.displayName = 'PaginationTable';

const PaginationTableHeader = React.forwardRef<
	HTMLTableSectionElement,
	PaginationTableSectionProps
>(({ className, ...props }, ref) => (
	<thead
		ref={ref}
		className={clsx('dark:text-zinc-200 [&_tr]:border-b', className)}
		{...props}
	/>
));
PaginationTableHeader.displayName = 'PaginationTableHeader';

const PaginationTableBody = React.forwardRef<
	HTMLTableSectionElement,
	PaginationTableSectionProps
>(({ className, ...props }, ref) => (
	<tbody
		ref={ref}
		className={clsx('[&_tr:last-child]:border-0 dark:text-zinc-200', className)}
		{...props}
	/>
));
PaginationTableBody.displayName = 'PaginationTableBody';

const PaginationTableFooter = React.forwardRef<
	HTMLTableSectionElement,
	PaginationTableSectionProps
>(({ className, ...props }, ref) => (
	<tfoot
		ref={ref}
		className={clsx(
			'dark:text-zinc-200 border-t border-gray-200 dark:border-primary-300 bg-muted/50 font-medium [&>tr]:last:border-b-0',
			className
		)}
		{...props}
	/>
));
PaginationTableFooter.displayName = 'PaginationTableFooter';

const PaginationTableRow = React.forwardRef<
	HTMLTableRowElement,
	PaginationTableRowProps
>(({ className, isHoverable = false, ...props }, ref) => (
	<tr
		ref={ref}
		className={clsx(
			'dark:text-secondary-300 border-b dark:border-primary-400 transition-colors data-[state=selected]:bg-muted',
			isHoverable && 'hover:bg-primary-100 dark:hover:bg-primary-700',
			props.onClick && 'cursor-pointer',
			className
		)}
		{...props}
	/>
));
PaginationTableRow.displayName = 'PaginationTableRow';

const CollapsiblePaginationTableRow = React.forwardRef<
	HTMLTableRowElement,
	CollapsiblePaginationTableRowProps
>(
	(
		{
			className,
			expandedContent,
			children,
			colSpan,
			initialExpanded = false,
			onToggle,
			isHoverable,
			...props
		},
		ref
	) => {
		const [isExpanded, setIsExpanded] = React.useState(initialExpanded);

		/**
		 * Toggles expansion
		 */
		const handleToggle = () => {
			const newExpandedState = !isExpanded;
			setIsExpanded(newExpandedState);
			if (onToggle) {
				onToggle(newExpandedState);
			}
		};

		return (
			<>
				<PaginationTableRow
					ref={ref}
					className={className}
					{...props}
				>
					<PaginationTableCell className='w-10 p-1'>
						<Button
							variant='ghost'
							size='xs'
							onClick={handleToggle}
							aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
						>
							<CaretRight
								className={`h-4 w-4 duration-200 ease-in-out ${isExpanded && 'rotate-90'}`}
							/>
						</Button>
					</PaginationTableCell>
					{children}
				</PaginationTableRow>
				<AnimatePresence>
					{isExpanded && (
						<PaginationTableRow>
							<PaginationTableCell></PaginationTableCell>
							<PaginationTableCell colSpan={colSpan || 100}>
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={
										isExpanded
											? { height: 'auto', opacity: 1 }
											: { height: 0, opacity: 0 }
									}
									className={`overflow-hidden`}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.2, ease: 'easeInOut' }}
								>
									{expandedContent}
								</motion.div>
							</PaginationTableCell>
						</PaginationTableRow>
					)}
				</AnimatePresence>
			</>
		);
	}
);

CollapsiblePaginationTableRow.displayName = 'CollapsiblePaginationTableRow';

const PaginationTableHead = React.forwardRef<
	HTMLTableCellElement,
	PaginationTableHeadProps
>(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={clsx(
			'dark:text-zinc-300 h-8 px-4 text-left align-middle font-medium text-secondary-1200 [&:has([role=checkbox])]:pr-0 !text-xs',
			className
		)}
		{...props}
	/>
));
PaginationTableHead.displayName = 'PaginationTableHead';

const PaginationTableCell = React.forwardRef<
	HTMLTableCellElement,
	PaginationTableCellProps
>(({ className, isTruncated = false, colSpan, rowSpan, ...props }, ref) => (
	<td
		ref={ref}
		className={clsx(
			'p-1 align-middle [&:has([role=checkbox])]:pr-0 h-10 px-4',
			isTruncated && 'truncate max-w-xs',
			className
		)}
		colSpan={colSpan}
		rowSpan={rowSpan}
		{...props}
	/>
));
PaginationTableCell.displayName = 'PaginationTableCell';

export {
	PaginationTable,
	PaginationTableHeader,
	PaginationTableBody,
	PaginationTableFooter,
	PaginationTableHead,
	PaginationTableRow,
	CollapsiblePaginationTableRow,
	PaginationTableCell,
};
