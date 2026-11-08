import { useEffect, useRef, useState } from 'react';
import {
	defaultBarbers,
	defaultBusinessHours,
	defaultServices
} from '../data/defaultCatalog';
import { apiRequest } from '../lib/api';
import type {
	ApiAppointment,
	ApiBarber,
	ApiBusinessHours,
	ApiService
} from '../types/api';

export function useSchedulingData() {
	const [services, setServices] = useState<ApiService[]>([]);
	const [barbers, setBarbers] = useState<ApiBarber[]>([]);
	const [hours, setHours] = useState<ApiBusinessHours[]>([]);
	const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
	const [appointmentsLoaded, setAppointmentsLoaded] = useState(false);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState('');
	const [retryCount, setRetryCount] = useState(0);
	const retryCountRef = useRef(0);

	useEffect(() => {
		const controller = new AbortController();
		const options = { signal: controller.signal };

		Promise.allSettled([
			apiRequest<ApiService[]>('/services', options),
			apiRequest<ApiBarber[]>('/barbers', options),
			apiRequest<ApiBusinessHours[]>('/business-hours', options),
			apiRequest<ApiAppointment[]>('/appointments', options)
		])
			.then(([serviceResult, barberResult, hoursResult, appointmentResult]) => {
				if (controller.signal.aborted || retryCount !== retryCountRef.current)
					return;

				const failures: string[] = [];
				if (serviceResult.status === 'fulfilled') {
					setServices(serviceResult.value);
				} else {
					setServices(defaultServices);
					failures.push('serviços');
				}
				if (barberResult.status === 'fulfilled') {
					setBarbers(barberResult.value);
				} else {
					setBarbers(defaultBarbers);
					failures.push('barbeiros');
				}
				if (hoursResult.status === 'fulfilled') {
					setHours(hoursResult.value);
				} else {
					setHours(defaultBusinessHours);
					failures.push('horários de funcionamento');
				}
				if (appointmentResult.status === 'fulfilled') {
					setAppointments(appointmentResult.value);
					setAppointmentsLoaded(true);
				} else {
					setAppointments([]);
					setAppointmentsLoaded(false);
					failures.push('reservas existentes');
				}

				if (failures.length) {
					setLoadError(
						`Não foi possível carregar ${failures.join(', ')} da API. Alguns dados provisórios podem ser exibidos; a reserva só será confirmada após o envio.`
					);
				}
			})
			.finally(() => {
				if (!controller.signal.aborted && retryCount === retryCountRef.current)
					setLoading(false);
			});

		return () => controller.abort();
	}, [retryCount]);

	return {
		services,
		barbers,
		hours,
		appointments,
		appointmentsLoaded,
		setAppointments,
		loading,
		loadError,
		retry: () => {
			retryCountRef.current += 1;
			setLoading(true);
			setLoadError('');
			setAppointmentsLoaded(false);
			setRetryCount(retryCountRef.current);
		}
	};
}
