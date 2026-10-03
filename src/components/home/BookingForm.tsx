import {
	ArrowUpRight,
	CheckCircle2,
	ChevronDown,
	Clock3,
	MessageCircle
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useSchedulingData } from '../../hooks/useSchedulingData';
import { apiRequest } from '../../lib/api';
import type {
	ApiAppointment,
	ApiBusinessHours,
	ApiCustomer,
	ApiService
} from '../../types/api';
import BookingDatePicker from './BookingDatePicker';

const fieldClassName =
	'min-h-13 w-full appearance-none border border-neutral-700 bg-[#141414] px-4 pr-10 text-sm text-stone-100 accent-amber-500 outline-none transition-colors placeholder:text-neutral-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 disabled:cursor-not-allowed disabled:opacity-50';

type Selection = { serviceId: string; barberId: string; requestId: number };
type Props = {
	selection: Selection;
	onSelectionChange: (field: 'serviceId' | 'barberId', value: string) => void;
};
type TimeSlot = { time: string; unavailableReason: string };

function localToday() {
	const date = new Date();
	date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
	return date.toISOString().slice(0, 10);
}

function weekday(value: string) {
	const [year, month, day] = value.split('-').map(Number);
	return new Date(year, month - 1, day).getDay();
}

function minutes(time: string) {
	const [hours, mins] = time.split(':').map(Number);
	return hours * 60 + mins;
}

function timeFromMinutes(value: number) {
	return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}

function maskPhone(value: string) {
	const digits = value.replace(/\D/g, '').slice(0, 11);
	if (digits.length < 3) return digits ? `(${digits}` : '';
	const area = digits.slice(0, 2);
	const number = digits.slice(2);
	if (digits.length <= 10)
		return number.length > 4
			? `(${area}) ${number.slice(0, 4)}-${number.slice(4)}`
			: `(${area}) ${number}`;
	return number.length > 5
		? `(${area}) ${number.slice(0, 5)}-${number.slice(5)}`
		: `(${area}) ${number}`;
}

function dateLabel(value: string) {
	const [year, month, day] = value.split('-').map(Number);
	return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
}

function priceLabel(price: ApiService['price']) {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	}).format(Number(price));
}

function createTimeSlots(
	hours: ApiBusinessHours | undefined,
	service: ApiService | undefined,
	date: string,
	barberId: string,
	appointments: ApiAppointment[]
): TimeSlot[] {
	if (!hours?.isOpen || !service || !barberId) return [];
	const open = minutes(hours.openTime);
	const close = minutes(hours.closeTime);
	const now = new Date();
	const currentMinutes = now.getHours() * 60 + now.getMinutes();
	const slots: TimeSlot[] = [];
	for (let start = open; start < close; start += 30) {
		const end = start + service.duration;
		const extendsPastClosing = end > close;
		const isPast = date === localToday() && start <= currentMinutes;
		const isBooked = appointments.some(
			(appointment) =>
				appointment.barberId === Number(barberId) &&
				appointment.date.slice(0, 10) === date &&
				appointment.status !== 'cancelled' &&
				start < minutes(appointment.endTime) &&
				minutes(appointment.startTime) < end
		);
		slots.push({
			time: timeFromMinutes(start),
			unavailableReason: extendsPastClosing
				? 'Ultrapassa o fechamento'
				: isPast
					? 'Horário passado'
					: isBooked
						? 'Já reservado'
						: ''
		});
	}
	return slots;
}

export default function BookingForm({ selection, onSelectionChange }: Props) {
	const {
		services,
		barbers,
		hours,
		appointments,
		setAppointments,
		loading,
		loadError
	} = useSchedulingData();
	const [date, setDate] = useState('');
	const [slotSelection, setSlotSelection] = useState<{
		time: string;
		requestId: number;
	} | null>(null);
	const [phone, setPhone] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [savedCustomer, setSavedCustomer] = useState<ApiCustomer | null>(null);
	const [feedback, setFeedback] = useState<{
		success: boolean;
		message: string;
	} | null>(null);
	const [whatsappUrl, setWhatsappUrl] = useState('');
	const { serviceId, barberId } = selection;
	const startTime =
		slotSelection?.requestId === selection.requestId ? slotSelection.time : '';
	const service = services.find((item) => item.id === Number(serviceId));
	const barber = barbers.find((item) => item.id === Number(barberId));
	const businessHours = date
		? hours.find((item) => item.dayOfWeek === weekday(date))
		: undefined;
	const timeSlots = createTimeSlots(
		businessHours,
		service,
		date,
		barberId,
		appointments
	);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFeedback(null);
		setWhatsappUrl('');
		const form = event.currentTarget;
		const name = String(new FormData(form).get('name') ?? '').trim();
		const phoneDigits = phone.replace(/\D/g, '');
		const chosenServiceId = Number(serviceId);
		const chosenBarberId = Number(barberId);
		const chosenService = services.find((item) => item.id === chosenServiceId);
		const chosenBarber = barbers.find((item) => item.id === chosenBarberId);
		if (phoneDigits.length < 8) {
			setFeedback({
				success: false,
				message: 'Informe um telefone válido com DDD.'
			});
			return;
		}
		if (!chosenService || !chosenBarber || !date || !startTime) {
			setFeedback({
				success: false,
				message: 'Preencha serviço, barbeiro, data e horário.'
			});
			return;
		}

		const chosenHours = hours.find((item) => item.dayOfWeek === weekday(date));
		if (!chosenHours?.isOpen) {
			setFeedback({
				success: false,
				message: 'A barbearia não abre na data selecionada.'
			});
			return;
		}
		const chosenEndTime = timeFromMinutes(
			minutes(startTime) + chosenService.duration
		);
		const chosenSlot = timeSlots.find((slot) => slot.time === startTime);
		const overlapsBooking = appointments.some(
			(appointment) =>
				appointment.barberId === chosenBarberId &&
				appointment.date.slice(0, 10) === date &&
				appointment.status !== 'cancelled' &&
				minutes(startTime) < minutes(appointment.endTime) &&
				minutes(appointment.startTime) < minutes(chosenEndTime)
		);
		if (
			!chosenSlot ||
			chosenSlot.unavailableReason ||
			minutes(startTime) < minutes(chosenHours.openTime) ||
			minutes(chosenEndTime) > minutes(chosenHours.closeTime) ||
			overlapsBooking
		) {
			setFeedback({
				success: false,
				message: overlapsBooking
					? 'Este horário já está reservado para o barbeiro selecionado.'
					: 'O horário escolhido não está disponível.'
			});
			return;
		}

		setSubmitting(true);
		try {
			let customer = savedCustomer;
			if (!customer || customer.phone.replace(/\D/g, '') !== phoneDigits) {
				customer = await apiRequest<ApiCustomer>('/customers', {
					method: 'POST',
					body: JSON.stringify({ name, phone: phoneDigits })
				});
			} else if (customer.name !== name) {
				customer = await apiRequest<ApiCustomer>(`/customers/${customer.id}`, {
					method: 'PUT',
					body: JSON.stringify({ name, phone: phoneDigits })
				});
			}
			setSavedCustomer(customer);
			const appointment = await apiRequest<ApiAppointment>('/appointments', {
				method: 'POST',
				body: JSON.stringify({
					customerId: customer.id,
					barberId: chosenBarberId,
					serviceId: chosenServiceId,
					date,
					startTime,
					endTime: chosenEndTime
				})
			});
			setAppointments((current) => [...current, appointment]);
			const confirmationText = [
				'Olá! Acabei de solicitar um agendamento na Barbearia Sr. Emídio.',
				`Serviço: ${chosenService.name}`,
				`Barbeiro: ${chosenBarber.name}`,
				`Data: ${dateLabel(date)} às ${startTime}`
			].join('\n');
			setWhatsappUrl(
				`https://wa.me/?text=${encodeURIComponent(confirmationText)}`
			);
			setFeedback({
				success: true,
				message: 'Solicitação enviada. A equipe confirmará seu horário.'
			});
			form.reset();
			setDate('');
			setSlotSelection(null);
			setPhone('');
			onSelectionChange('serviceId', '');
			onSelectionChange('barberId', '');
		} catch (error) {
			setFeedback({
				success: false,
				message:
					error instanceof Error
						? error.message
						: 'Não foi possível concluir a reserva.'
			});
		} finally {
			setSubmitting(false);
		}
	};

	const selectService = (value: string) => {
		onSelectionChange('serviceId', value);
		setSlotSelection(null);
		setFeedback(null);
	};
	const selectBarber = (value: string) => {
		onSelectionChange('barberId', value);
		setSlotSelection(null);
		setFeedback(null);
	};

	return (
		<section
			id="agendamentos"
			aria-labelledby="booking-title"
			className="scroll-mt-20 bg-neutral-900 px-5 py-16 sm:px-8 sm:py-20 lg:scroll-mt-24 lg:px-12 lg:py-24"
		>
			<div className="mx-auto max-w-6xl">
				<header className="mb-10 sm:mb-14">
					<p className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
						<span
							className="w-8 border-t border-amber-500"
							aria-hidden="true"
						/>
						Agendamento
					</p>
					<h2
						id="booking-title"
						className="font-serif text-4xl font-semibold leading-tight text-stone-100 sm:text-5xl"
					>
						Reserve seu horário.
					</h2>
					<p className="mt-5 max-w-2xl text-sm leading-6 text-stone-300 sm:text-base sm:leading-7">
						Preencha o formulário para solicitar sua reserva.
					</p>
				</header>
				{loadError && (
					<p
						className="mb-6 border border-red-900/70 bg-red-950/30 p-4 text-sm leading-6 text-red-200"
						role="alert"
					>
						Não foi possível carregar as informações: {loadError}
					</p>
				)}
				<div className="grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(17rem,0.85fr)] lg:items-start">
					<form
						className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6"
						onSubmit={handleSubmit}
					>
						<div className="flex flex-col gap-2">
							<label
								className="text-xs font-medium uppercase tracking-[0.14em] text-stone-300"
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
								className="text-xs font-medium uppercase tracking-[0.14em] text-stone-300"
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
								value={phone}
								onChange={(event) => setPhone(maskPhone(event.target.value))}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label
								className="text-xs font-medium uppercase tracking-[0.14em] text-stone-300"
								htmlFor="service"
							>
								Serviço
							</label>
							<div className="relative">
								<select
									className={fieldClassName}
									disabled={loading || !services.length}
									id="service"
									name="serviceId"
									required
									value={serviceId}
									onChange={(event) => selectService(event.target.value)}
								>
									<option disabled value="">
										{loading
											? 'Carregando serviços...'
											: 'Selecione um serviço'}
									</option>
									{services.map((item) => (
										<option key={item.id} value={item.id}>
											{item.name} · {priceLabel(item.price)} · {item.duration}{' '}
											min
										</option>
									))}
								</select>
								<ChevronDown
									className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
									size={16}
									aria-hidden="true"
								/>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<label
								className="text-xs font-medium uppercase tracking-[0.14em] text-stone-300"
								htmlFor="barber"
							>
								Barbeiro
							</label>
							<div className="relative">
								<select
									className={fieldClassName}
									disabled={loading || !barbers.length}
									id="barber"
									name="barberId"
									required
									value={barberId}
									onChange={(event) => selectBarber(event.target.value)}
								>
									<option disabled value="">
										{loading
											? 'Carregando barbeiros...'
											: 'Selecione um barbeiro'}
									</option>
									{barbers.map((item) => (
										<option key={item.id} value={item.id}>
											{item.name}
										</option>
									))}
								</select>
								<ChevronDown
									className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
									size={16}
									aria-hidden="true"
								/>
							</div>
						</div>
						<fieldset className="m-0 min-w-0 border-0 p-0 sm:col-span-2">
							<legend
								className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-300"
								id="preferred-date-label"
							>
								Data preferencial
							</legend>
							<BookingDatePicker
								date={date}
								hours={loading ? [] : hours}
								onSelect={(selectedDate) => {
									setDate(selectedDate);
									setSlotSelection(null);
									setFeedback(null);
								}}
							/>
						</fieldset>
						<fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0 sm:col-span-2">
							<legend
								className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-300"
								id="preferred-time-label"
							>
								Horário preferencial
							</legend>
							{date && businessHours?.isOpen && service && (
								<p className="-mt-2 text-sm leading-6 text-stone-300">
									Expediente {businessHours.openTime.slice(0, 5)}–
									{businessHours.closeTime.slice(0, 5)} · duração de{' '}
									{service.duration} min
								</p>
							)}
							{date && !loading && !businessHours?.isOpen && (
								<p className="text-sm leading-6 text-amber-300" role="status">
									A barbearia não abre neste dia.
								</p>
							)}
							{!loading && !date && (
								<p className="text-sm leading-6 text-stone-300">
									Escolha um serviço, barbeiro e data para ver os horários.
								</p>
							)}
							{date && businessHours?.isOpen && service && barberId && (
								<div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
									{timeSlots.map(({ time, unavailableReason }) => (
										<button
											aria-pressed={startTime === time}
											className={`min-h-11 border px-2 text-sm font-medium tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${startTime === time ? 'border-amber-400 bg-amber-500 text-neutral-950' : unavailableReason ? 'cursor-not-allowed border-neutral-800 bg-neutral-950 text-neutral-500 line-through' : 'border-neutral-700 bg-neutral-950 text-stone-200 hover:border-amber-500 hover:text-amber-300'}`}
											disabled={Boolean(unavailableReason)}
											key={time}
											title={unavailableReason || undefined}
											type="button"
											onClick={() => {
												setSlotSelection({
													time,
													requestId: selection.requestId
												});
												setFeedback(null);
											}}
										>
											{time}
										</button>
									))}
								</div>
							)}
							{date &&
								businessHours?.isOpen &&
								service &&
								barberId &&
								timeSlots.length === 0 && (
									<p className="text-sm leading-6 text-stone-300">
										Não há horários disponíveis para este serviço neste dia.
									</p>
								)}
						</fieldset>
						<div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center">
							<button
								className="inline-flex min-h-13 w-full items-center justify-center bg-amber-500 px-8 text-sm font-semibold uppercase tracking-[0.12em] text-[#111820] transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-60"
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
						</div>
					</form>
					<aside
						aria-labelledby="booking-summary-title"
						className="border border-white/10 bg-neutral-950 p-5 sm:p-6 lg:sticky lg:top-28"
					>
						<p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
							Resumo
						</p>
						<h3
							id="booking-summary-title"
							className="font-serif text-2xl font-semibold text-stone-100"
						>
							Seu agendamento
						</h3>
						<dl className="mt-6 divide-y divide-white/10 text-sm">
							<div className="flex justify-between gap-4 py-3">
								<dt className="text-stone-400">Serviço</dt>
								<dd className="text-right font-medium text-stone-100">
									{service?.name ?? 'Não selecionado'}
								</dd>
							</div>
							<div className="flex justify-between gap-4 py-3">
								<dt className="text-stone-400">Barbeiro</dt>
								<dd className="text-right font-medium text-stone-100">
									{barber?.name ?? 'Não selecionado'}
								</dd>
							</div>
							<div className="flex justify-between gap-4 py-3">
								<dt className="text-stone-400">Data e horário</dt>
								<dd className="text-right font-medium text-stone-100">
									{date
										? `${dateLabel(date)}${startTime ? ` · ${startTime}` : ''}`
										: 'Não selecionados'}
								</dd>
							</div>
							<div className="flex justify-between gap-4 py-3">
								<dt className="inline-flex items-center gap-2 text-stone-400">
									<Clock3 size={15} aria-hidden="true" />
									Duração
								</dt>
								<dd className="text-right font-medium text-stone-100">
									{service ? `${service.duration} min` : '—'}
								</dd>
							</div>
							<div className="flex justify-between gap-4 py-4">
								<dt className="font-medium text-stone-300">Valor</dt>
								<dd className="text-lg font-semibold text-amber-400">
									{service ? priceLabel(service.price) : '—'}
								</dd>
							</div>
						</dl>
						<p className="mt-3 text-xs leading-5 text-stone-300">
							A reserva será confirmada pela equipe.
						</p>
					</aside>
				</div>
				{feedback && (
					<div
						aria-live="polite"
						className={`mt-6 flex flex-col gap-4 border p-4 sm:flex-row sm:items-center sm:justify-between ${feedback.success ? 'border-emerald-800 bg-emerald-950/50 text-emerald-100' : 'border-red-900/70 bg-red-950/30 text-red-200'}`}
						role={feedback.success ? 'status' : 'alert'}
					>
						<p className="flex items-center gap-3 text-sm leading-6">
							{feedback.success && (
								<CheckCircle2
									size={20}
									className="shrink-0 text-emerald-400"
									aria-hidden="true"
								/>
							)}
							{feedback.message}
						</p>
						{feedback.success && whatsappUrl && (
							<a
								className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
								href={whatsappUrl}
								rel="noreferrer"
								target="_blank"
							>
								<MessageCircle size={17} aria-hidden="true" />
								Confirmar pelo WhatsApp
								<ArrowUpRight size={15} aria-hidden="true" />
							</a>
						)}
					</div>
				)}
			</div>
		</section>
	);
}
