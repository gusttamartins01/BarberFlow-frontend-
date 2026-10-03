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
	services: Array<Pick<ApiService, 'id' | 'name'>>;
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

export type ApiErrorResponse = {
	message?: string;
	fields?: Array<{ field: string; message: string }>;
};
