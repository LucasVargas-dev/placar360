import { QueryArguments } from '@interfaces/QueryArguments.js';
import { api } from '@services/api.js';
import { PaginationReturn, BackendPaginationReturn, PageOptions } from '@interfaces/PaginationReturn.js';

export class DefaultService<T extends any, C, U> {
	public url: string;

	constructor(url: string) {
		this.url = url;
	}

	all = async (
		page: number,
		limit: number,
		args?: QueryArguments
	): Promise<PaginationReturn<T & { [key: string]: unknown }>> => {
		const argsParam = args ? `&args=${encodeURIComponent(JSON.stringify(args))}` : '';
		return await api
			.get(
				`${this.url}?page=${page}&limit=${limit}${argsParam}`
			)
			.then((res: { data: BackendPaginationReturn<T & { [key: string]: unknown }> }) => {
				// Transform backend response (meta) to frontend format (pageOptions)
				const backendData = res.data;
				const meta = backendData.meta;
				// Calculate pagination values
				const hasNext = meta.hasNextPage ?? meta.page < meta.totalPages;
				const hasPrevious = meta.hasPreviousPage ?? meta.page > 1;
				const nextPage = meta.nextPage ?? (hasNext ? meta.page + 1 : null);
				const previousPage = meta.previousPage ?? (hasPrevious ? meta.page - 1 : null);
				
				const pageOptions: PageOptions = {
					page: meta.page,
					limit: meta.limit,
					total: meta.total,
					totalPages: meta.totalPages,
					hasNextPage: hasNext ? 1 : 0,
					hasPreviousPage: hasPrevious ? 1 : 0,
					nextPage,
					previousPage,
					firstPage: 1,
					lastPage: meta.totalPages,
					startIndex: (meta.page - 1) * meta.limit,
					endIndex: Math.min(meta.page * meta.limit, meta.total),
				};
				return {
					data: backendData.data,
					pageOptions,
				};
			})
			.catch((error: unknown) => {
				throw error;
			});
	};

	getAllByConditions = async (args?: QueryArguments): Promise<T[]> => {
		const argsParam = args ? `?args=${encodeURIComponent(JSON.stringify(args))}` : '';
		return await api
			.get(`${this.url}${argsParam}`)
			.then((res: { data: T[] }) => res.data)
			.catch((error: unknown) => {
				throw error;
			});
	};

	show = async (id: string, args?: QueryArguments): Promise<T | null> => {
		const argsParam = args ? `?args=${encodeURIComponent(JSON.stringify(args))}` : '';
		return await api
			.get(`${this.url}/${id}${argsParam}`)
			.then((res: { data: T | null }) => res.data)
			.catch((error: unknown) => {
				throw error;
			});
	};

	create = async (data: C, args?: QueryArguments): Promise<string | T> => {
		const queryParam = args ? `?args=${encodeURIComponent(JSON.stringify(args))}` : '';
		return await api
			.post(`${this.url}${queryParam}`, data)
			.then((res: { data: string | T }) => res.data)
			.catch((error: unknown) => {
				throw error;
			});
	};

	update = async (
		id: string,
		data: U,
		args?: QueryArguments
	): Promise<string | T> => {
		const queryParam = args ? `?args=${encodeURIComponent(JSON.stringify(args))}` : '';
		return await api
			.put(`${this.url}/${id}${queryParam}`, data)
			.then((res: { data: string | T }) => res.data)
			.catch((error: unknown) => {
				throw error;
			});
	};

	delete = async (id: string): Promise<string | T> => {
		return await api
			.delete(`${this.url}/${id}`)
			.then((res: { data: string | T }) => res.data)
			.catch((error: unknown) => {
				throw error;
			});
	};

	softDelete = async (id: string): Promise<string | T> => {
		return await api
			.patch(`${this.url}/soft-delete/${id}`)
			.then((res: { data: string | T }) => res.data)
			.catch((error: unknown) => {
				throw error;
			});
	};
}

