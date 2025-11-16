import React from 'react';
import {
	createReportContext,
	Report,
	ReportContent,
	ReportContentHeader,
	ReportContentProps,
	ReportContextProps,
	ReportContextType,
	ReportFilters,
	ReportFiltersProps,
	ReportPagination,
	ReportTable,
	ReportTableProps,
} from './Report.js';
import { TableCell, TableRow } from './Table.js';
import NoInformation from './NoInformation.js';
import Loading from './Loading.js';

export type DefaultReportProps<
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
> = {
	Filters: React.ComponentType<{ context: () => ReportContextType<Q, F, R> }>;
	contextProps: ReportContextProps<Q, F, R>;
	tableProps: Omit<ReportTableProps<Q, F, R>, 'Foots' | 'useReportContext'>;
	filtersProps?: Partial<ReportFiltersProps<'div', Q, F, R>>;
	contentProps?: Partial<ReportContentProps<'div'>>;
};

/**
 * Abstracts the creation of the most common type of report (filter + content table + pagination)
 * @param {DefaultReportProps<Q, F, R>} root0
 * @param {() => ReportContextType<Q, F, R>} root0.Filters
 * @param {ReportContextProps<Q, F, R>} root0.contextProps
 * @param {ReportTableProps<Q, F, R>} root0.tableProps
 * @param {ReportFiltersProps<"div", Q, F, R>} root0.filtersProps
 * @param {ReportContentProps<"div">} root0.contentProps
 * @returns {JSX.Element}
 */
export function DefaultReport<
	Q extends { limit: number; page: number; args: object },
	F extends { itemsPerPage: number },
	R extends {
		data: unknown[];
		pageOptions: { page: number; lastPage: number };
	},
>({
	Filters,
	contextProps,
	tableProps,
	filtersProps,
	contentProps,
}: DefaultReportProps<Q, F, R>) {
	const { ReportProvider, useReport } = createReportContext({
		...contextProps,
	});

	const ReportContentConditional = React.memo(() => {
		const { data, isLoading } = useReport();
		if (!data && !isLoading) return null;
		return (
			<ReportContent {...contentProps}>
				{isLoading ? (
					<Loading />
				) : data?.data && data.data.length > 0 ? (
					<>
						<ReportContentHeader
							useReportContext={useReport}
						></ReportContentHeader>
						<ReportTable
							useReportContext={useReport}
							Foots={() => (
								<TableRow>
									<TableCell colSpan={100}>
										<ReportPagination useReportContext={useReport} />
									</TableCell>
								</TableRow>
							)}
							{...tableProps}
						/>
					</>
				) : (
					<NoInformation />
				)}
			</ReportContent>
		);
	});

	return (
		<Report ContextProvider={ReportProvider}>
			<ReportFilters
				useReportContext={useReport}
				{...filtersProps}
			>
				<Filters context={useReport} />
			</ReportFilters>
			<ReportContentConditional />
		</Report>
	);
}
