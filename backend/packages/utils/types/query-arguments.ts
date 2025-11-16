type IncludeOption = {
	include?: Record<string, unknown>;
	select?: Record<string, unknown>;
};
type SelectOption = {
	select?: Record<string, unknown>;
	include?: Record<string, unknown>;
};

export type QueryArguments = {
	where?: object;
	distinct?: string[];
	take?: number;
	orderBy?: Array<Record<string, 'asc' | 'desc'>>;
} & (IncludeOption | SelectOption);
