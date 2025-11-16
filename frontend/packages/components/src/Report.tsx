import clsx from 'clsx';
import React, {
	ComponentPropsWithoutRef,
	createContext,
	Dispatch,
	ElementType,
	MemoExoticComponent,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import { Container, ContainerFooter, ContainerProps } from './Container.js';
import { useTranslation } from 'react-i18next';
import {
	FileText,
	Funnel,
	Info,
	MagnifyingGlass,
	Spinner,
} from 'phosphor-react';
import Button from './Button.js';
import { useSearchParams } from 'react-router-dom';
import { ZodType, ZodTypeDef } from 'zod';
import qs from 'qs';
import {
	Control,
	DefaultValues,
	useForm,
	UseFormGetValues,
	UseFormHandleSubmit,
	UseFormRegister,
	UseFormResetField,
	UseFormWatch,
} from 'react-hook-form';
import {
	itemsPerPageOptionsDefault,
	ItemsPerPageSelect,
} from './FilterHeader.js';
import {
	Table,
	TableBody,
	TableFooter,
	TableHeader,
	TableProps,
} from './Table.js';
import EmptyTable from './EmptyTable.js';
import Pagination, { PaginationProps } from './Pagination.js';

export type ReportContextType<
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
> = {
	handleSubmit: UseFormHandleSubmit<F, F>;
	query: Q | undefined;
	setQuery: Dispatch<SetStateAction<Q | undefined>>;
	watch: UseFormWatch<F>;
	control: Control<F>;
	resetField: UseFormResetField<F>;
	register: UseFormRegister<F>;
	getValues: UseFormGetValues<F>;
	data: R | undefined;
	refresh: () => void;
	isLoading: boolean;
	error: string | null;
};

export type ReportContextProps<
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
> = {
	filterSchema: ZodType<Q, ZodTypeDef, Partial<Q>>;
	defaultValues: DefaultValues<F>;
	initValues: (query: Q | undefined) => Partial<Omit<F, 'itemsPerPage'>>;
	fetch: (query: Q) => Promise<R>;
};

/**
 * Creates the report context used by all the child components in the report; the context includes the report data, form parameters and filters
 * @param {ReportContextProps<Q, F, R>} root0
 * @param {ZodType<Q, ZodTypeDef, Partial<Q>>} root0.filterSchema
 * @param {(query: Q | undefined) => Partial<Omit<F, "itemsPerPage">>} root0.initValues
 * @param {DefaultValues<F>} root0.defaultValues
 * @param {Promise<R>} root0.fetch
 * @returns {ReportContextProps<Q, F, R>}
 */
export function createReportContext<
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
>({
	filterSchema,
	initValues,
	defaultValues,
	fetch,
}: ReportContextProps<Q, F, R>) {
	const Context = createContext<ReportContextType<Q, F, R> | null>(null);

	/**
	 * Returns the current report context
	 * @returns {ReportContextType<Q, F, R>}
	 */
	const useReport = () => {
		const context = useContext(Context);
		if (!context) {
			throw new Error('useReport must be called within a ReportProvider');
		}
		return context;
	};

	const ReportProvider = React.memo(({ children }: { children: ReactNode }) => {
		const [searchParams] = useSearchParams();

		/**
		 * Parses the search params and transforms it to the query object (filters)
		 * @param {URLSearchParams} searchParams
		 * @returns {Q | undefined}
		 */
		const searchParamsToQuery = (
			searchParams: URLSearchParams
		): Q | undefined => {
			if (!searchParams.size) return;
			const result = filterSchema.parse(
				qs.parse(searchParams.toString(), {
					ignoreQueryPrefix: true,
				})
			);
			return result;
		};
		// Initializes the query with the values in the search params
		const [query, setQuery] = useState<Q | undefined>(() =>
			searchParamsToQuery(searchParams)
		);
		// Creates the filters form
		const {
			control,
			handleSubmit,
			watch,
			resetField,
			reset,
			register,
			getValues,
		} = useForm<F>({
			defaultValues,
		});

		// Inits the filters input with the values in the query
		useEffect(() => {
			reset(
				{
					...getValues(),
					itemsPerPage:
						query?.limit ||
						getValues().itemsPerPage ||
						itemsPerPageOptionsDefault[0],
					...Object.fromEntries(
						Object.entries(initValues(query) ?? {}).filter(
							([_, v]) => v !== undefined
						)
					),
				} as F,
				{ keepDefaultValues: true }
			);
		}, []);

		const [data, setData] = useState<R>();

		/**
		 * Fetches the data if the query is valid
		 */
		const refresh = () => {
			if (query) fetchData(query);
		};

		useEffect(() => {
			refresh();
		}, [query]);

		const [isLoading, setIsLoading] = useState(false);
		const [error, setError] = useState<string | null>(null);
		/**
		 * Reiceves the current query data and updates the URL search params, then calls the fetche method and updates the report data
		 * @param {Q} query
		 */
		const fetchData = async (query: Q) => {
			const queryParsed = filterSchema.parse(query);
			window.history.pushState(
				{},
				'',
				`${window.location.pathname}?${new URLSearchParams(qs.stringify(query)).toString()}`
			);
			try {
				setIsLoading(true);
				setError(null);
				const data = await fetch(queryParsed);
				setData(data);
			} catch (error) {
				setError((error as Error).message || 'An error occurred');
			} finally {
				setIsLoading(false);
			}
		};

		return (
			<Context.Provider
				value={{
					handleSubmit,
					query,
					setQuery,
					control,
					watch,
					resetField,
					register,
					getValues,
					data,
					refresh,
					isLoading,
					error,
				}}
			>
				{children}
			</Context.Provider>
		);
	});

	return {
		ReportProvider,
		useReport,
	};
}

export type ReportProps<C extends ElementType> = {
	ContextProvider: MemoExoticComponent<
		({ children }: { children: ReactNode }) => JSX.Element
	>;
	as?: C;
} & ComponentPropsWithoutRef<C>;

const defaultElement = 'div';

/**
 * Wrapper that uses the Report context provider created on the parent component
 * @param {ReportProps<C>} root0
 * @param {React.MemoExoticComponent} root0.ContextProvider
 * @param {C | undefined} root0.as
 * @param {any} root0.className
 * @returns {JSX.Element}
 */
export function Report<C extends ElementType = typeof defaultElement>({
	ContextProvider,
	as,
	className,
	...rest
}: ReportProps<C>) {
	const Component = as || defaultElement;

	const baseStyles = 'flex flex-col gap-3';

	return (
		<ContextProvider>
			<Component
				className={clsx(baseStyles, className)}
				{...rest}
			/>
		</ContextProvider>
	);
}

export type ReportFiltersProps<
	C extends ElementType,
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
> = {
	as?: C;
	useReportContext: () => ReportContextType<Q, F, R>;
	transformArgs?: (data: F) => Q['args'];
} & ContainerProps<C>;

const defaultFiltersElement = 'div';

/**
 * Filters container including a submit button at the footer
 * @param {ReportFiltersProps<C, Q, F, R>} root0
 * @param {C | undefined} root0.as
 * @param {string | undefined} root0.title
 * @param {React.ReactNode} root0.icon
 * @param {ContainerVariant | undefined} root0.variant
 * @param {() => ReportContextType<Q, F, R>} root0.useReportContext
 * @returns {JSX.Element}
 */
export function ReportFilters<
	C extends ElementType,
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
>({
	as,
	title,
	icon,
	variant,
	useReportContext,
	transformArgs,
	...rest
}: ReportFiltersProps<C, Q, F, R>) {
	const Component = as || defaultFiltersElement;

	const { t: translate } = useTranslation();

	const { handleSubmit, setQuery, isLoading } = useReportContext();

	return (
		<Container
			title={title || translate('filters')}
			icon={icon || <Funnel size={18} />}
			variant={variant || 'elevated'}
			as={Component}
			{...rest}
			isCollapsible={true}
		>
			<form
				onSubmit={handleSubmit((data: F) =>
					setQuery(
						query =>
							({
								...(query || { page: 1 }),
								limit: data.itemsPerPage,
								args: transformArgs ? transformArgs(data) : { ...data },
								page: 1,
							}) as Q
					)
				)}
				className='w-full'
			>
				{rest.children}

				<ContainerFooter className='flex justify-end py-2 px-4'>
					<Button
						type='submit'
						variant='primary'
						size='md'
						leftIcon={
							isLoading ? (
								<Spinner
									size={16}
									className='animate-spin'
								/>
							) : (
								<MagnifyingGlass size={16} />
							)
						}
						isDisabled={isLoading}
					>
						{isLoading
							? translate('form.generatingReport')
							: translate('form.generateReport')}
					</Button>
				</ContainerFooter>
			</form>
		</Container>
	);
}

export type ReportContentProps<C extends ElementType> = {
	as?: C;
} & ContainerProps<C>;

const defaultContentElement = 'div';

/**
 * Creates a container for the report's content
 * @param {ReportContentProps<C>} root0
 * @param {C | undefined} root0.as
 * @param {string | undefined} root0.title
 * @param {React.ReactNode} root0.icon
 * @param {ContainerVariant | undefined} root0.variant
 * @returns {JSX.Element}
 */
export function ReportContent<C extends ElementType>({
	as,
	title,
	icon,
	variant,
	...rest
}: ReportContentProps<C>) {
	const Component = as || defaultContentElement;

	return (
		<Container
			variant={variant || 'elevated'}
			title={title}
			icon={icon || <FileText size={18} />}
			as={Component}
			{...rest}
		/>
	);
}

export type ReportTableProps<
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
> = {
	Heads: React.ComponentType<{ context: () => ReportContextType<Q, F, R> }>;
	Rows: React.ComponentType<{ context: () => ReportContextType<Q, F, R> }>;
	Foots?: React.ComponentType<{ context: () => ReportContextType<Q, F, R> }>;
	useReportContext: () => ReportContextType<Q, F, R>;
} & TableProps;

/**
 * Creates the report table structure, content can be added passing Rows, Heads and Foots arguments as React Components
 * @param {ReportTableProps<Q, F, R>} root0
 * @param {React.ComponentType} root0.Heads
 * @param {React.ComponentType} root0.Rows
 * @param {React.ComponentType} root0.Foots
 * @param {() => ReportContextType<Q, F, R>} root0.useReportContext
 * @returns {JSX.Element}
 */
export function ReportTable<
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
>({
	Heads,
	Rows,
	Foots,
	useReportContext,
	...rest
}: ReportTableProps<Q, F, R>) {
	const { t: translate } = useTranslation();

	const { data } = useReportContext();

	return (
		<Table {...rest}>
			<TableHeader>
				<Heads context={useReportContext} />
			</TableHeader>
			<TableBody>
				{data?.data && data.data.length > 0 ? (
					<Rows context={useReportContext} />
				) : (
					<EmptyTable
						colSpan={100}
						message={translate(
							data ? 'noResultsForSearch' : 'searchForDataToGetStarted'
						)}
						variant='info'
					/>
				)}
			</TableBody>
			{data?.data && data?.data.length > 0 && Foots && (
				<TableFooter>{<Foots context={useReportContext} />}</TableFooter>
			)}
		</Table>
	);
}

export type NoDataTextProps<
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
> = {
	useReportContext: () => ReportContextType<Q, F, R>;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Displays a div with an alert icon and a text indicating to the user that they must search for data
 * @param {NoDataTextProps<Q, F, R>} root0
 * @param {string | undefined} root0.className
 * @returns {JSX.Element}
 */
export function NoDataText<
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
>({ useReportContext, className, ...rest }: NoDataTextProps<Q, F, R>) {
	const baseStyles =
		'flex flex-row items-center justify-center gap-2 py-2 dark:text-secondary-300';

	const { t: translate } = useTranslation();

	const { data } = useReportContext();

	return (
		<div
			className={clsx(baseStyles, className)}
			{...rest}
		>
			<Info size={20} />
			<span className='text-left align-middle font-medium'>
				{translate(data ? 'noResultsForSearch' : 'searchForDataToGetStarted')}
			</span>
		</div>
	);
}

export type ReportContentHeaderProps<
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
> = {
	defaultFeatures?: boolean;
	useReportContext: () => ReportContextType<Q, F, R>;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Header for the report content containing usual features like itensPerPage and PDF/CSV Buttons
 * @param {ReportContentHeaderProps<Q, F, R>} root0
 * @param {() => ReportContextType<Q, F, R>} root0.useReportContext
 * @param {string | undefined} root0.className
 * @returns {JSX.Element}
 */
export function ReportContentHeader<
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
>({
	defaultFeatures = true,
	useReportContext,
	className,
	...rest
}: ReportContentHeaderProps<Q, F, R>) {
	const { control, watch, setQuery } = useReportContext();
	const { t: translate } = useTranslation();

	const baseStyles =
		'flex items-center justify-end py-2 px-4 gap-2 border-b border-gray-200 dark:border-primary-300';

	return (
		<div
			className={clsx(baseStyles, className)}
			{...rest}
		>
			{defaultFeatures && (
				<>
					<div>
						<ItemsPerPageSelect<F>
							control={control}
							watch={watch}
							onTableItemsPerPageChange={value => {
								setQuery(
									query =>
										({
											...(query || { page: 1, args: {} }),
											limit: value,
										}) as Q
								);
							}}
							isFullWidth={true}
							size={'sm'}
							itemsPerPageLabel={translate(
								'navigation.pagination.perPage'
							).toLowerCase()}
						/>
					</div>
					<Button
						type='submit'
						variant='secondary'
						size='sm'
						leftIcon={<MagnifyingGlass size={16} />}
						isDisabled={true}
					>
						{translate('form.generatePDF')}
					</Button>
					<Button
						type='submit'
						variant='secondary'
						size='sm'
						leftIcon={<MagnifyingGlass size={16} />}
						isDisabled={true}
					>
						{translate('form.generateCSV')}
					</Button>
				</>
			)}
			{rest.children}
		</div>
	);
}

export type ReportPaginationProps<
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
> = {
	useReportContext: () => ReportContextType<Q, F, R>;
} & Omit<PaginationProps, 'currentPage' | 'totalPages' | 'onPageChange'>;

/**
 * Creates tbe pagination and abstracts its logic for the report content
 * @param {ReportPaginationProps<Q, F, R>} root0
 * @param {() => ReportContextType<Q, F, R>} root0.useReportContext
 * @returns {JSX.Element}
 */
export function ReportPagination<
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
>({ useReportContext, ...rest }: ReportPaginationProps<Q, F, R>) {
	const { setQuery, data } = useReportContext();

	return (
		<Pagination
			currentPage={data?.pageOptions.page || 1}
			totalPages={data?.pageOptions.lastPage || 1}
			onPageChange={page =>
				setQuery(
					query =>
						({
							...(query || { limit: 0, args: {} }),
							page,
						}) as Q
				)
			}
			size='md'
			{...rest}
		/>
	);
}
