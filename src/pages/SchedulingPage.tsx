import { type FormEvent, useEffect, useState } from 'react';
import {
	type ApiAppointment,
	type ApiBarber,
	type ApiBusinessHours,
	type ApiCustomer,
	type ApiService,
	apiRequest
} from '../lib/api';

const fieldClassName =
	'min-h-13 w-full border border-neutral-700 bg-neutral-950 px-4 text-sm text-stone-100 outline-none transition-colors placeholder:text-neutral-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50';

function localToday() {
	const date = new Date();
	date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
	return date.toISOString().slice(0, 10);
}

function weekday(date: string) {
	const [year, month, day] = date.split('-').map(Number);
	return new Date(year, month - 1, day).getDay();
}

function minutes(time: string) {
	const [hours, mins] = time.split(':').map(Number);
	return hours * 60 + mins;
}

function timeFromMinutes(value: number) {
	return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}

function priceLabel(price: ApiService['price']) {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	}).format(Number(price));
}

function errorMessage(error: unknown) {
	return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';
}

export default function SchedulingPage() {
	const [services, setServices] = useState<ApiService[]>([]);
	const [barbers, setBarbers] = useState<ApiBarber[]>([]);
	const [hours, setHours] = useState<ApiBusinessHours[]>([]);
	const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [serviceId, setServiceId] = useState('');
	const [barberId, setBarberId] = useState('');
	const [date, setDate] = useState('');
	const [startTime, setStartTime] = useState('');
	const [savedCustomer, setSavedCustomer] = useState<ApiCustomer | null>(null);
	const [feedback, setFeedback] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	useEffect(() => {
		let active = true;
		Promise.all([
			apiRequest<ApiService[]>('/services'),
			apiRequest<ApiBarber[]>('/barbers'),
			apiRequest<ApiBusinessHours[]>('/business-hours'),
			apiRequest<ApiAppointment[]>('/appointments')
		])
			.then(([serviceItems, barberItems, businessHours, bookingItems]) => {
				if (!active) return;
				setServices(serviceItems);
				setBarbers(barberItems);
				setHours(businessHours);
				setAppointments(bookingItems);
			})
			.catch((error: unknown) => {
				if (active) setLoadError(errorMessage(error));
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => {
			active = false;
		};
	}, []);

	const service = services.find((item) => item.id === Number(serviceId));
	const businessHours = date
		? hours.find((item) => item.dayOfWeek === weekday(date))
		: undefined;
	const endTime =
		service && startTime
			? timeFromMinutes(minutes(startTime) + service.duration)
			: '';
	const outsideBusinessHours = Boolean(
		businessHours?.isOpen &&
			startTime &&
			endTime &&
			(startTime < businessHours.openTime || endTime > businessHours.closeTime)
	);
	const alreadyBooked = Boolean(
		date &&
			barberId &&
			startTime &&
			endTime &&
			appointments.some(
				(appointment) =>
					appointment.barberId === Number(barberId) &&
					appointment.date.slice(0, 10) === date &&
					appointment.status !== 'cancelled' &&
					minutes(startTime) < minutes(appointment.endTime) &&
					minutes(appointment.startTime) < minutes(endTime)
			)
	);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFeedback(null);
		const form = event.currentTarget;
		const formData = new FormData(form);
		const name = String(formData.get('name') ?? '').trim();
		const phone = String(formData.get('phone') ?? '').trim();
		const chosenServiceId = Number(formData.get('serviceId'));
		const chosenBarberId = Number(formData.get('barberId'));
		const chosenDate = String(formData.get('date') ?? '');
		const chosenStartTime = String(formData.get('startTime') ?? '');
		const chosenService = services.find((item) => item.id === chosenServiceId);
		const chosenHours = hours.find(
			(item) => item.dayOfWeek === weekday(chosenDate)
		);

		if (!chosenService || !barbers.some((item) => item.id === chosenBarberId)) {
			setFeedback({
				success: false,
				message: 'Selecione um serviço e um barbeiro disponíveis.'
			});
			return;
		}
		if (!chosenHours?.isOpen) {
			setFeedback({
				success: false,
				message: 'A barbearia não abre na data selecionada.'
			});
			return;
		}

		const chosenEndTime = timeFromMinutes(
			minutes(chosenStartTime) + chosenService.duration
		);
		const overlapsBooking = appointments.some(
			(appointment) =>
				appointment.barberId === chosenBarberId &&
				appointment.date.slice(0, 10) === chosenDate &&
				appointment.status !== 'cancelled' &&
				minutes(chosenStartTime) < minutes(appointment.endTime) &&
				minutes(appointment.startTime) < minutes(chosenEndTime)
		);
		if (
			chosenStartTime < chosenHours.openTime ||
			chosenEndTime > chosenHours.closeTime ||
			overlapsBooking
		) {
			setFeedback({
				success: false,
				message: overlapsBooking
					? 'Este horário já está reservado para o barbeiro selecionado.'
					: 'O horário escolhido está fora do expediente da barbearia.'
			});
			return;
		}

		setSubmitting(true);
		try {
			let customer = savedCustomer;
			if (!customer || customer.phone !== phone) {
				customer = await apiRequest<ApiCustomer>('/customers', {
					method: 'POST',
					body: JSON.stringify({ name, phone })
				});
			} else if (customer.name !== name) {
				customer = await apiRequest<ApiCustomer>(`/customers/${customer.id}`, {
					method: 'PUT',
					body: JSON.stringify({ name, phone })
				});
			}
			setSavedCustomer(customer);

			const appointment = await apiRequest<ApiAppointment>('/appointments', {
				method: 'POST',
				body: JSON.stringify({
					customerId: customer.id,
					barberId: chosenBarberId,
					serviceId: chosenServiceId,
					date: chosenDate,
					startTime: chosenStartTime,
					endTime: chosenEndTime
				})
			});
			setAppointments((current) => [...current, appointment]);
			setFeedback({
				success: true,
				message: 'Reserva criada. A equipe confirmará o horário.'
			});
			form.reset();
			setServiceId('');
			setBarberId('');
			setDate('');
			setStartTime('');
		} catch (error) {
			setFeedback({ success: false, message: errorMessage(error) });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<main className="min-h-svh bg-neutral-950 px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pt-36">
			<div className="mx-auto max-w-4xl">
				<header className="mb-10 sm:mb-14">
					<p className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
						<span
							className="w-8 border-t border-amber-500"
							aria-hidden="true"
						/>
						Agendamento
					</p>
					<h1 className="font-serif text-4xl font-semibold leading-tight text-stone-100 sm:text-5xl">
						Reserve seu horário.
					</h1>
					<p className="mt-5 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base sm:leading-7">
						Preencha o formulário para solicitar sua reserva.
					</p>
				</header>

				{loadError && (
					<p
						className="mb-6 border border-red-900/70 bg-red-950/30 p-4 text-sm leading-6 text-red-200"
						role="alert"
					>
						Não foi possível carregar os dados da API: {loadError}
					</p>
				)}

				<form
					className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6"
					onSubmit={handleSubmit}
				>
					<div className="flex flex-col gap-2">
						<label
							className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400"
							htmlFor="customer-name"
						>
							Nome completo
						</label>
						<input
							className={fieldClassName}
							autoComplete="name"
							id="customer-name"
							name="name"
							placeholder="Ex: João Silva"
							required
							type="text"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label
							className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400"
							htmlFor="customer-phone"
						>
							Telefone / WhatsApp
						</label>
						<input
							className={fieldClassName}
							autoComplete="tel"
							id="customer-phone"
							inputMode="tel"
							name="phone"
							placeholder="(85) 99999-9999"
							required
							type="tel"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label
							className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400"
							htmlFor="service"
						>
							Serviço
						</label>
						<select
							className={`${fieldClassName} appearance-none`}
							disabled={loading || !services.length}
							id="service"
							name="serviceId"
							required
							value={serviceId}
							onChange={(event) => {
								setServiceId(event.target.value);
								setStartTime('');
								setFeedback(null);
							}}
						>
							<option disabled value="">
								{loading ? 'Carregando serviços...' : 'Selecione um serviço'}
							</option>
							{services.map((item) => (
								<option key={item.id} value={item.id}>
									{item.name} · {priceLabel(item.price)} · {item.duration} min
								</option>
							))}
						</select>
					</div>
					<div className="flex flex-col gap-2">
						<label
							className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400"
							htmlFor="barber"
						>
							Barbeiro
						</label>
						<select
							className={`${fieldClassName} appearance-none`}
							disabled={loading || !barbers.length}
							id="barber"
							name="barberId"
							required
							value={barberId}
							onChange={(event) => {
								setBarberId(event.target.value);
								setFeedback(null);
							}}
						>
							<option disabled value="">
								{loading ? 'Carregando barbeiros...' : 'Selecione um barbeiro'}
							</option>
							{barbers.map((item) => (
								<option key={item.id} value={item.id}>
									{item.name}
								</option>
							))}
						</select>
					</div>
					<div className="flex flex-col gap-2">
						<label
							className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400"
							htmlFor="preferred-date"
						>
							Data preferencial
						</label>
						<input
							className={fieldClassName}
							disabled={loading}
							id="preferred-date"
							min={localToday()}
							name="date"
							required
							type="date"
							value={date}
							onChange={(event) => {
								setDate(event.target.value);
								setStartTime('');
								setFeedback(null);
							}}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label
							className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400"
							htmlFor="preferred-time"
						>
							Horário preferencial
						</label>
						<input
							className={fieldClassName}
							disabled={loading || !service || !date || !barberId}
							id="preferred-time"
							max={businessHours?.closeTime}
							min={businessHours?.openTime}
							name="startTime"
							required
							step={60}
							type="time"
							value={startTime}
							onChange={(event) => {
								setStartTime(event.target.value);
								setFeedback(null);
							}}
						/>
						{date && businessHours?.isOpen && service && (
							<p className="text-xs leading-5 text-neutral-500">
								Expediente {businessHours.openTime}–{businessHours.closeTime} ·
								duração de {service.duration} min
							</p>
						)}
						{date && !loading && !businessHours?.isOpen && (
							<p className="text-xs leading-5 text-amber-400">
								A barbearia não abre neste dia.
							</p>
						)}
						{outsideBusinessHours && (
							<p className="text-xs leading-5 text-red-300" role="alert">
								O serviço ultrapassa o horário de fechamento.
							</p>
						)}
						{alreadyBooked && (
							<p className="text-xs leading-5 text-red-300" role="alert">
								Este horário já está reservado para este barbeiro.
							</p>
						)}
					</div>
					<div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center">
						<button
							className="inline-flex min-h-13 w-full items-center justify-center bg-amber-600 px-8 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-60"
							disabled={
								loading ||
								Boolean(loadError) ||
								submitting ||
								!services.length ||
								!barbers.length
							}
							type="submit"
						>
							{submitting ? 'Enviando...' : 'Solicitar reserva'}
						</button>
						{feedback && (
							<p
								className={`text-sm leading-6 ${feedback.success ? 'text-amber-400' : 'text-red-300'}`}
								role="status"
							>
								{feedback.message}
							</p>
						)}
					</div>
				</form>
			</div>
		</main>
	);
}
