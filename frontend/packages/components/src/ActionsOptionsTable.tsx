import { ComponentPropsWithoutRef, ElementType } from 'react';
import {
	ArrowsDownUp,
	IconProps,
	Pencil,
	SortAscending,
	SortDescending,
	Trash,
	UserCirclePlus,
} from 'phosphor-react';
import { useTranslation } from 'react-i18next';

export type ActionOptionsVariant = 'primary' | 'secondary' | 'danger';
export type ActionOptionsSize = 'sm' | 'md' | 'lg';
export type AdditionalAction = {
	Icon: React.ForwardRefExoticComponent<IconProps>;
	variant?: ActionOptionsVariant;
	action: () => void;
	title?: string;
};

export type ActionOptionsTableProps<C extends ElementType> = {
	onDelete?: () => void;
	onEdit?: () => void;
	onAddUser?: () => void;
	onList?: () => void;
	onAdd?: () => void;
	showArrows?: boolean;
	isListActive?: boolean;
	isListDisabled?: boolean;

	variant?: ActionOptionsVariant;
	size?: ActionOptionsSize;
	as?: C;
	className?: string;
	additionalActions?: AdditionalAction[];
} & ComponentPropsWithoutRef<C>;

const defaultElement = 'div';

/**
 * ActionsOptionsTable component
 * @param {object} root0
 * @param {Function} root0.onDelete
 * @param {Function} root0.onEdit
 * @param {Function} root0.onAddUser
 * @param {Function} root0.onList
 * @param {Function} root0.onAdd
 * @param {boolean} root0.showArrows
 * @param {boolean} root0.isListActive
 * @param {boolean} root0.isListDisabled
 * @param {string} root0.variant
 * @param {string} root0.size
 * @param {any} root0.as
 * @param {string} root0.className
 * @param {AdditionalAction} root0.additionalActions
 * @returns {any}
 */
export function ActionsOptionsTable<
	C extends ElementType = typeof defaultElement,
>({
	onDelete,
	onEdit,
	onAddUser,
	onList,
	onAdd,
	showArrows = false,
	isListActive = false,
	isListDisabled = false,
	variant = 'primary',
	size = 'md',
	as,
	className = '',
	additionalActions = [],
	...rest
}: ActionOptionsTableProps<C>) {
	const { t: translate } = useTranslation();
	const Component = as || defaultElement;

	const baseStyles = 'cursor-pointer transition-all';

	const variantStyles = {
		primary:
			'text-zinc-600 dark:text-secondary-300 hover:text-zinc-800 dark:hover:!text-zinc-50',
		secondary:
			'text-secondary-600 dark:text-primary-300 hover:text-secondary-800 dark:hover:!text-secondary-300 dark:!text-secondary-400',
		danger:
			'text-danger-600  dark:text-primary-300 hover:text-danger-800 dark:hover:!text-danger-300 dark:!text-danger-400',
	};

	const iconSizes = {
		sm: 18,
		md: 22,
		lg: 26,
	};

	const disabledStyle = 'cursor-not-allowed text-zinc-400 dark:text-zinc-500';

	return (
		<Component
			className={`flex gap-2 ${className}`}
			onClick={e => e.stopPropagation()}
			{...rest}
		>
			{onEdit && (
				<div title={translate('form.edit')}>
					<Pencil
						size={iconSizes[size]}
						className={`${baseStyles} ${variantStyles[variant]}`}
						onClick={() => onEdit()}
					/>
				</div>
			)}

			{onDelete && (
				<div title={translate('form.delete')}>
					<Trash
						size={iconSizes[size]}
						className={`${baseStyles} ${variant === 'danger' ? variantStyles.danger : variantStyles[variant]}`}
						onClick={() => onDelete()}
					/>
				</div>
			)}

			{showArrows && (
				<div>
					<ArrowsDownUp className='w-4 h-4 text-gray-600 hover:text-gray-600 cursor-move' />
				</div>
			)}

			{onAddUser && (
				<div title={translate('entities.user.add')}>
					<UserCirclePlus
						size={iconSizes[size]}
						className={`${baseStyles} ${variantStyles[variant]}`}
						onClick={() => onAddUser()}
					/>
				</div>
			)}

			{additionalActions.map(({ Icon, title, action }, i) => (
				<div
					key={i}
					title={title && translate(title)}
				>
					<Icon
						size={iconSizes[size]}
						className={`${baseStyles} ${variantStyles[variant]}`}
						onClick={() => action()}
					/>
				</div>
			))}

			{onList && (
				<div>
					{!isListActive ? (
						<SortAscending
							size={iconSizes[size]}
							className={`transition-all ${
								isListDisabled
									? disabledStyle
									: `${baseStyles} ${variantStyles[variant]}`
							}`}
							onClick={() => {
								if (!isListDisabled) {
									onList();
								}
							}}
						/>
					) : (
						<SortDescending
							size={iconSizes[size]}
							className={`${baseStyles} ${variantStyles[variant]}`}
							onClick={() => onList()}
						/>
					)}
				</div>
			)}
		</Component>
	);
}

export default ActionsOptionsTable;
