import {
	ComponentPropsWithoutRef,
	ElementType,
	ReactNode,
	useEffect,
	useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button.js';
import { Select, SelectProps } from './Select.js';
import { Input } from './Input.js';
import { Control, Path, useForm, UseFormWatch } from 'react-hook-form';

export type FilterSearchOption = {
	value: string;
	label: string;
	type?: 'input' | 'select';
	selectOptions?: { value: string | number; label: string }[];
};

export type FilterHeaderProps<C extends ElementType> = {
	searchOptions: FilterSearchOption[];
	onSearchOptionChange: (value: string) => void;
	onSearchFilterSubmit: (value?: string, filter?: string) => void;
	onTableItemsPerPageChange?: (value: number) => void;
	filterOpened?: boolean;
	placeholder?: string;
	searchButtonText?: string;
	searchIcon?: ReactNode;
	itemsPerPageOptions?: number[];
	itemsPerPageLabel?: string;

	as?: C;
	className?: string;
} & ComponentPropsWithoutRef<C>;

type FormValues = {
	filter: string;
	searchField: string;
	itemsPerPage: number;
};

const defaultElement = 'div';

/**
 * Filter Header component for managing search, filter, and pagination controls.
 * @param {object} props - The component props.
 * @param {FilterSearchOption[]} props.searchOptions - List of available search/filter options.
 * @param {(value: string) => void} props.onSearchOptionChange - Callback triggered when the search option changes.
 * @param {(value?: string, filter?: string) => void} props.onSearchFilterSubmit - Callback triggered when the search form is submitted.
 * @param {(value: number) => void} [props.onTableItemsPerPageChange] - Callback triggered when the items-per-page selection changes.
 * @param {boolean} [props.filterOpened] - Whether the filter section should be initially opened.
 * @param {string} [props.placeholder] - Placeholder text for the search input. Defaults to translated 'form.typeToSearch'.
 * @param {string} [props.searchButtonText] - Label for the search button. Defaults to translated 'form.search'.
 * @param {ReactNode} [props.searchIcon] - Icon element to display inside the search button.
 * @param {number[]} [props.itemsPerPageOptions] - Available options for items per page.
 * @param {string} [props.itemsPerPageLabel] - Label for the items-per-page selector.
 * @param {C} [props.as] - The component or HTML element to render as.
 * @param {string} [props.className] - Additional CSS class names to apply.
 * @returns {JSX.Element} The rendered Filter Header component.
 */
export function FilterHeader<C extends ElementType = typeof defaultElement>({
	searchOptions,
	onSearchOptionChange,
	onSearchFilterSubmit,
	onTableItemsPerPageChange,
	filterOpened = false,
	placeholder,
	searchButtonText,
	searchIcon,
	itemsPerPageOptions,
	itemsPerPageLabel = 'per page',
	as,
	className = '',
	...rest
}: FilterHeaderProps<C>) {
	const { t: translate } = useTranslation();
	const defaultPlaceholder = placeholder ?? translate('form.typeToSearch');
	const defaultSearchButtonText = searchButtonText ?? translate('form.search');
	const Component = as || defaultElement;
	const { control, register, handleSubmit, watch } = useForm<FormValues>({
		defaultValues: {
			filter: '',
			searchField: searchOptions[0]?.value || '',
			itemsPerPage: itemsPerPageOptionsDefault[0],
		},
	});

	const selectOptions = searchOptions.map(option => ({
		value: option.value,
		label: option.label,
	}));

	const selectedField = watch('searchField');
	const currentOption = searchOptions.find(opt => opt.value === selectedField);

	/**
	 * Handles the submit
	 * @param {FormValues} data
	 */
	const handleSearchSubmit = (data: FormValues) => {
		const trimmed = data.filter?.toString().trim();
		if (trimmed) {
			onSearchFilterSubmit(data.searchField, trimmed);
		} else {
			onSearchFilterSubmit();
		}
	};

	return (
		<Component
			className={`
		  transition-height duration-300 ease-in-out overflow-hidden
		  ${filterOpened ? 'h-12' : 'h-0'}
		  ${className}
		`}
			{...rest}
		>
			<div className='flex items-center justify-between mt-1'>
				<form
					onSubmit={handleSubmit(handleSearchSubmit)}
					className='flex items-center gap-2'
				>
					<Select
						name='searchField'
						control={control}
						options={selectOptions}
						placeholder='Selecione...'
						className='w-40'
						searchable={selectOptions.length > 5}
					/>

					{currentOption?.type === 'select' ? (
						<Select
							name='filter'
							control={control}
							options={currentOption.selectOptions ?? []}
							placeholder='Selecione...'
							className='min-w-[200px]'
						/>
					) : (
						<Input
							name='filter'
							register={register}
							placeholder={defaultPlaceholder}
							size='md'
							className='min-w-[200px]'
						/>
					)}

					<Button
						type='submit'
						variant='primary'
						size='md'
						leftIcon={searchIcon}
					>
						{defaultSearchButtonText}
					</Button>
				</form>

				{onTableItemsPerPageChange && (
					<div className='flex items-center ml-4'>
						<ItemsPerPageSelect<FormValues>
							control={control}
							watch={watch}
							onTableItemsPerPageChange={onTableItemsPerPageChange}
							itemsPerPageOptions={itemsPerPageOptions}
							itemsPerPageLabel={itemsPerPageLabel}
						/>
					</div>
				)}
			</div>
		</Component>
	);
}

export const itemsPerPageOptionsDefault = [15, 30, 50];

export type ItemsPerPageSelectProps<T extends { itemsPerPage: number }> = {
	control: Control<T>;
	watch: UseFormWatch<T>;
	onTableItemsPerPageChange?: (value: number) => void;
	itemsPerPageOptions?: number[];
	itemsPerPageLabel?: string;
} & Omit<SelectProps<T>, 'options' | 'name' | 'control'>;

/**
 * ItemsPerPageSelect component for controlling pagination size in a table.
 * @param {object} props - The component props.
 * @param {Control<T>} props.control - The react-hook-form control object for managing form state.
 * @param {UseFormWatch<T>} props.watch - The react-hook-form watch function to observe form values.
 * @param {(value: number) => void} [props.onTableItemsPerPageChange] - Callback triggered when the selected items-per-page value changes.
 * @param {number[]} [props.itemsPerPageOptions] - List of selectable options for items per page. Defaults to `itemsPerPageOptionsDefault`.
 * @param {string} [props.itemsPerPageLabel] - Label displayed next to the items-per-page selector.
 * @returns {JSX.Element} The rendered ItemsPerPageSelect component.
 */
export function ItemsPerPageSelect<T extends { itemsPerPage: number }>({
	control,
	watch,
	onTableItemsPerPageChange,
	itemsPerPageOptions = itemsPerPageOptionsDefault,
	itemsPerPageLabel,
	...rest
}: ItemsPerPageSelectProps<T>) {
	const perPageOptions = itemsPerPageOptions.map(option => ({
		value: option,
		label: `${option} ${itemsPerPageLabel ?? ''}`,
	}));

	const selectedItemsPerPage = watch('itemsPerPage' as Path<T>);
	const hasMountedRef = useRef(false);

	useEffect(() => {
		if (!hasMountedRef.current) {
			hasMountedRef.current = true;
			return;
		}
		if (selectedItemsPerPage && onTableItemsPerPageChange) {
			onTableItemsPerPageChange(Number(selectedItemsPerPage));
		}
	}, [selectedItemsPerPage]);

	// Reset the ref on unmount to handle StrictMode properly
	useEffect(() => {
		return () => {
			hasMountedRef.current = false;
		};
	}, []);

	return (
		<Select<T>
			name={'itemsPerPage' as Path<T>}
			control={control}
			options={perPageOptions}
			{...rest}
		/>
	);
}

export default FilterHeader;
