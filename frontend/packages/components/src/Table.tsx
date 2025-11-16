import clsx from 'clsx';
import * as React from 'react';
import { ReactNode } from 'react';
import Button from './Button.js';
import { CaretRight } from 'phosphor-react';
import { AnimatePresence, motion } from 'framer-motion';

// Define types for the Table component
export type TableVariant = 'default' | 'striped' | 'bordered' | 'unstyled';
export type TableSize = 'sm' | 'md' | 'lg';

export type TableProps = {
	children?: ReactNode;
	variant?: TableVariant;
	size?: TableSize;
	isBordered?: boolean;
	isStriped?: boolean;
	isCompact?: boolean;
	isScrollable?: boolean;
	maxHeight?: string | number;
	className?: string;
} & React.HTMLAttributes<HTMLTableElement>;

export type TableSectionProps = {
	children?: ReactNode;
	className?: string;
} & React.HTMLAttributes<HTMLTableSectionElement>;

export type TableRowProps = {
	children?: ReactNode;
	isHoverable?: boolean;
	className?: string;
} & React.HTMLAttributes<HTMLTableRowElement>;

export type CollapsibleTableRowProps = {
	expandedContent: ReactNode;
	colSpan?: number;
	initialExpanded?: boolean;
	onToggle?: (isExpanded: boolean) => void;
} & TableRowProps &
	React.HTMLAttributes<HTMLTableRowElement>;

export type TableCellProps = {
	children?: ReactNode;
	isTruncated?: boolean;
	colSpan?: number;
	rowSpan?: number;
	className?: string;
} & React.TdHTMLAttributes<HTMLTableCellElement>;

export type TableHeadProps = {
	children?: ReactNode;
	className?: string;
} & React.ThHTMLAttributes<HTMLTableCellElement>;

export type TableCaptionProps = {
	children?: ReactNode;
	className?: string;
} & React.HTMLAttributes<HTMLTableCaptionElement>;

const Table = React.forwardRef<HTMLTableElement, TableProps>(
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
			...props
		},
		ref
	) => {
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

		return (
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
		);
	}
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	TableSectionProps
>(({ className, ...props }, ref) => (
	<thead
		ref={ref}
		className={clsx(
			'dark:text-secondary-900 [&_tr]:border-b',
			className
		)}
		{...props}
	/>
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, TableSectionProps>(
	({ className, ...props }, ref) => (
		<tbody
			ref={ref}
			className={clsx(
				'[&_tr:last-child]:border-0 dark:text-secondary-900',
				className
			)}
			{...props}
		/>
	)
);
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
	HTMLTableSectionElement,
	TableSectionProps
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
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
	({ className, isHoverable = false, ...props }, ref) => (
		<tr
			ref={ref}
			className={clsx(
				'dark:text-secondary-900 border-b  transition-colors data-[state=selected]:bg-muted',
				isHoverable && 'hover:bg-primary-100 dark:hover:bg-primary-700',
				props.onClick && 'cursor-pointer',
				className
			)}
			{...props}
		/>
	)
);
TableRow.displayName = 'TableRow';

const CollapsibleTableRow = React.forwardRef<
	HTMLTableRowElement,
	CollapsibleTableRowProps
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
				<TableRow
					ref={ref}
					className={className}
					{...props}
				>
					<TableCell className='w-10 p-1'>
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
					</TableCell>
					{children}
				</TableRow>
				<AnimatePresence>
					{isExpanded && (
						<TableRow>
							<TableCell></TableCell>
							<TableCell colSpan={colSpan || 100}>
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
							</TableCell>
						</TableRow>
					)}
				</AnimatePresence>
			</>
		);
	}
);

CollapsibleTableRow.displayName = 'CollapsibleTableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
	({ className, ...props }, ref) => (
		<th
			ref={ref}
			className={clsx(
				'dark:text-secondary-900 h-8 px-4 text-left align-middle font-medium text-secondary-1200 [&:has([role=checkbox])]:pr-0 !text-xs',
				className
			)}
			{...props}
		/>
	)
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
	({ className, isTruncated = false, colSpan, rowSpan, ...props }, ref) => (
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
	)
);
TableCell.displayName = 'TableCell';

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	CollapsibleTableRow,
	TableCell,
};
