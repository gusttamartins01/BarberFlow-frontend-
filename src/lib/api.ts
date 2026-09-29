import type { ApiErrorResponse } from '../types/api';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(
	/\/$/,
	''
);

export async function apiRequest<T>(
	path: string,
	options: RequestInit = {}
): Promise<T> {
	let response: Response;

	try {
		response = await fetch(`${apiBaseUrl}${path}`, {
			...options,
			headers: {
				Accept: 'application/json',
				...(options.body ? { 'Content-Type': 'application/json' } : {}),
				...options.headers
			}
		});
	} catch {
		throw new Error(
			'Não foi possível carregar as informações. Tente novamente em instantes.'
		);
	}

	const body = (await response.json().catch(() => null)) as
		| ApiErrorResponse
		| T
		| null;

	if (!response.ok) {
		const errorBody = body as ApiErrorResponse | null;
		const fieldMessages = errorBody?.fields?.map(
			({ field, message }) => `${field}: ${message}`
		);
		throw new Error(
			fieldMessages?.length
				? fieldMessages.join(' ')
				: (errorBody?.message ??
						`Não foi possível concluir a solicitação (${response.status}).`)
		);
	}

	return body as T;
}
