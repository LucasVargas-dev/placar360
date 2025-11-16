/**
 * Pagination Return Type
 */
export interface PaginationReturn<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    nextPage?: number | null;
    previousPage?: number | null;
  };
}