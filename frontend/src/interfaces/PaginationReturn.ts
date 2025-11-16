// Backend returns meta, frontend transforms to pageOptions
export type BackendPaginationMeta = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage?: boolean;
	hasPreviousPage?: boolean;
	nextPage?: number | null;
	previousPage?: number | null;
};

export type BackendPaginationReturn<T> = {
	data: T[];
	meta: BackendPaginationMeta;
};

export type PaginationReturn<T> = {
	data: (T & { [key: string]: unknown })[];
	pageOptions: PageOptions;
};

export interface PageOptions {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage: number;
	hasPreviousPage: number;
	nextPage: number | null;
	previousPage: number | null;
	firstPage: number;
	lastPage: number;
	startIndex: number;
	endIndex: number;
}

