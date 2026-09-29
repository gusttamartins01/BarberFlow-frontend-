export type ApiService = {
	id: number;
	name: string;
	description?: string | null;
	price: number | string;
	duration: number;
};

export type ApiBarber = {
	id: number;
	name: string;
};

export type ApiCombo = {
	id: number;
	name: string;
	description: string;
	price: number | string;
	services: ApiService[];
};

export type ApiBusinessHours = {
	id: number;
	dayOfWeek: number;
	openTime: string;
	closeTime: string;
	isOpen: boolean;
};

export type ApiAppointment = {
	id: number;
	customerId: number;
	barberId: number;
	serviceId: number;
	date: string;
	startTime: string;
	endTime: string;
	status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
	totalPrice: number | string;
	notes?: string | null;
};

export type ApiCustomer = {
	id: number;
	name: string;
	phone: string;
};

type ApiErrorResponse = {
	message?: string;
	fields?: Array<{ field: string; message: string }>;
};

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
			'Não foi possível conectar à API. Confira se o backend está em execução.'
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
				: (errorBody?.message ?? `A API respondeu com erro ${response.status}.`)
		);
	}

	return body as T;
}
