interface IncludeOption {
	include?: Record<string, unknown>;
	select?: Record<string, unknown>;
}

interface SelectOption {
	select?: Record<string, unknown>;
	include?: Record<string, unknown>;
}

type OrderByValue = 'asc' | 'desc' | OrderByObject;
interface OrderByObject {
	[key: string]: OrderByValue;
}

interface BaseQueryArguments {
	where?: object;
	orderBy?: OrderByObject[];
}

export type QueryArguments = BaseQueryArguments &
	(IncludeOption | SelectOption);

