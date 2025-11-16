import { Toast } from '@packages/components';

type ApiErrorResponse =
	| string
	| {
			message?: string;
			error?: string;
			errors?:
				| string[]
				| Array<{ message?: string; field?: string | number }>;
	  };

/**
 * Extract a readable message from different error shapes (Axios, Fetch, native).
 */
export function getApiErrorMessage(
	error: unknown,
	fallbackMessage = 'Ocorreu um erro inesperado.'
): string {
	if (!error) return fallbackMessage;

	if (typeof error === 'string') {
		return error;
	}

	if (error instanceof Error) {
		return error.message || fallbackMessage;
	}

	if (typeof error !== 'object') {
		return fallbackMessage;
	}

	const maybeAxiosError = error as {
		response?: { data?: ApiErrorResponse };
		message?: string;
	};

	const responseData = maybeAxiosError.response?.data;

	if (responseData) {
		if (typeof responseData === 'string') {
			return responseData;
		}

		if (responseData.message) {
			return responseData.message;
		}

		if (responseData.error) {
			return responseData.error;
		}

		if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
			return responseData.errors
				.map(errorEntry => {
					if (!errorEntry) return null;
					if (typeof errorEntry === 'string') return errorEntry;
					return errorEntry.message ?? null;
				})
				.filter(Boolean)
				.join('\n');
		}
	}

	if (maybeAxiosError.message) {
		return maybeAxiosError.message;
	}

	return fallbackMessage;
}

type ShowApiErrorToastArgs = {
	error: unknown;
	title: string;
	defaultMessage?: string;
	status?: 'info' | 'success' | 'warning' | 'error';
};

/**
 * Convenience helper to surface API errors with a standardized toast message.
 */
export function showApiErrorToast({
	error,
	title,
	defaultMessage = 'Não foi possível concluir a ação.',
	status = 'error',
}: ShowApiErrorToastArgs) {
	const description = getApiErrorMessage(error, defaultMessage);

	Toast.show({
		title,
		description,
		status,
	});
}



