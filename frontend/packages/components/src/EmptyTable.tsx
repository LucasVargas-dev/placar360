import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TableCell, TableRow } from './Table.js';
import { Info } from 'phosphor-react';

export type EmptyTableVariant = 'default' | 'warning' | 'info' | 'error';
export type EmptyTableSize = 'sm' | 'md' | 'lg';

export type EmptyTableProps<C extends ElementType> = {
	message?: string;
	icon?: ReactNode;
	variant?: EmptyTableVariant;
	size?: EmptyTableSize;
	colSpan?: number;

	as?: C;
	className?: string;
} & ComponentPropsWithoutRef<C>;

const defaultElement = TableRow;

/**
 * EmptyTable component
 * Displays a message when a table has no data to show
 * @param {object} root0
 * @param {string} root0.message
 * @param {ReactNode} root0.icon
 * @param {string} root0.variant
 * @param {string} root0.size
 * @param {number} root0.colSpan
 * @param {any} root0.as
 * @param {string} root0.className
 *
 * @returns {JSX.Element}
 */
export function EmptyTable<C extends ElementType = typeof defaultElement>({
	message,
	icon = (
		<Info
			size={20}
			className='mr-2'
		/>
	),
	variant = 'default',
	size = 'md',
	colSpan = 100,
	as,
	className = '',
	...rest
}: EmptyTableProps<C>) {
	const { t: translate } = useTranslation();
	const Component = as || defaultElement;

	const defaultMessage = translate('noItemRegisteredOnTheList');

	const baseStyles = 'flex items-center justify-center w-full';

	const variantStyles = {
		default: 'bg-tableBackground text-extraDarkBlue dark:bg-opacity-100',
		warning:
			'bg-warning-50 text-warning-800 dark:bg-warning-900 dark:text-warning-100',
		info: 'bg-info-50 text-info-800 dark:bg-info-900 dark:text-info-100',
		error:
			'bg-danger-50 text-danger-800 dark:bg-danger-900 dark:text-danger-100',
	};

	const sizeStyles = {
		sm: 'py-2 text-sm',
		md: 'py-4 text-base',
		lg: 'py-6 text-lg',
	};

	return (
		<Component
			className={className}
			{...rest}
		>
			<TableCell
				colSpan={colSpan}
				className={`
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          font-medium
        `}
			>
				<div className={baseStyles}>
					{icon}
					<span>{message || defaultMessage}</span>
				</div>
			</TableCell>
		</Component>
	);
}

export default EmptyTable;
