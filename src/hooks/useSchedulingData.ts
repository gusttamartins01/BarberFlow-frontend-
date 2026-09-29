import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import type {
	ApiAppointment,
	ApiBarber,
	ApiBusinessHours,
	ApiService
} from '../types/api';

function getErrorMessage(error: unknown) {
	return error instanceof Error
		? error.message
		: 'Não foi possível carregar as informações.';
}

export function useSchedulingData() {
	const [services, setServices] = useState<ApiService[]>([]);
	const [barbers, setBarbers] = useState<ApiBarber[]>([]);
	const [hours, setHours] = useState<ApiBusinessHours[]>([]);
	const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState('');

	useEffect(() => {
		const controller = new AbortController();
		const options = { signal: controller.signal };

		Promise.all([
			apiRequest<ApiService[]>('/services', options),
			apiRequest<ApiBarber[]>('/barbers', options),
			apiRequest<ApiBusinessHours[]>('/business-hours', options),
			apiRequest<ApiAppointment[]>('/appointments', options)
		])
			.then(([serviceItems, barberItems, businessHours, bookingItems]) => {
				if (controller.signal.aborted) return;
				setServices(serviceItems);
				setBarbers(barberItems);
				setHours(businessHours);
				setAppointments(bookingItems);
			})
			.catch((error: unknown) => {
				if (!controller.signal.aborted) {
					setLoadError(getErrorMessage(error));
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});

		return () => controller.abort();
	}, []);

	return {
		services,
		barbers,
		hours,
		appointments,
		setAppointments,
		loading,
		loadError
	};
}
