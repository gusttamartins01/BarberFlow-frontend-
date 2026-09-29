import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
	type ApiAppointment,
	type ApiBarber,
	type ApiBusinessHours,
	type ApiCombo,
	type ApiCustomer,
	type ApiService,
	apiRequest
} from '../lib/api';

type ManagementSection =
	| 'appointments'
	| 'barbers'
	| 'business-hours'
	| 'combos'
	| 'customers';

type ManagementData = {
	appointments?: ApiAppointment[];
	barbers?: ApiBarber[];
	'business-hours'?: ApiBusinessHours[];
	combos?: ApiCombo[];
	customers?: ApiCustomer[];
	services?: ApiService[];
};

type ManagementRecord = {
	key: string | number;
	title: string;
	summary: string;
	details: string[];
	status?: string;
};

const sections: Array<{ path: ManagementSection; label: string }> = [
	{ path: 'appointments', label: 'Agendamentos' },
	{ path: 'barbers', label: 'Barbeiros' },
	{ path: 'combos', label: 'Combos' },
	{ path: 'customers', label: 'Clientes' },
	{ path: 'business-hours', label: 'Expediente' }
];

const weekdays = [
	'Domingo',
	'Segunda-feira',
	'Terça-feira',
	'Quarta-feira',
	'Quinta-feira',
	'Sexta-feira',
	'Sábado'
];

function formatPrice(price: number | string) {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	}).format(Number(price));
}

function formatDate(value: string) {
	const [year, month, day] = value.slice(0, 10).split('-').map(Number);
	return new Intl.DateTimeFormat('pt-BR').format(
		new Date(year, month - 1, day)
	);
}

function getStatusLabel(status: ApiAppointment['status']) {
	const labels: Record<ApiAppointment['status'], string> = {
		pending: 'Pendente',
		confirmed: 'Confirmado',
		cancelled: 'Cancelado',
		completed: 'Concluído'
	};
	return labels[status];
}

function getErrorMessage(error: unknown) {
	return error instanceof Error
		? error.message
		: 'Não foi possível carregar os dados.';
}

export default function ManagementPage({
	section
}: {
	section: ManagementSection;
}) {
	const [data, setData] = useState<ManagementData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [reload, setReload] = useState(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reload retriggers the request after a retry.
	useEffect(() => {
		let active = true;

		const loadData = async () => {
			try {
				let nextData: ManagementData;
				switch (section) {
					case 'appointments': {
						const [appointments, barbers, customers, services] =
							await Promise.all([
								apiRequest<ApiAppointment[]>('/appointments'),
								apiRequest<ApiBarber[]>('/barbers'),
								apiRequest<ApiCustomer[]>('/customers'),
								apiRequest<ApiService[]>('/services')
							]);
						nextData = { appointments, barbers, customers, services };
						break;
					}
					case 'barbers': {
						const [barbers, appointments] = await Promise.all([
							apiRequest<ApiBarber[]>('/barbers'),
							apiRequest<ApiAppointment[]>('/appointments')
						]);
						nextData = { barbers, appointments };
						break;
					}
					case 'business-hours':
						nextData = {
							'business-hours':
								await apiRequest<ApiBusinessHours[]>('/business-hours')
						};
						break;
					case 'combos':
						nextData = { combos: await apiRequest<ApiCombo[]>('/combos') };
						break;
					case 'customers':
						nextData = {
							customers: await apiRequest<ApiCustomer[]>('/customers')
						};
						break;
				}
				if (active) setData(nextData);
			} catch (requestError) {
				if (active) setError(getErrorMessage(requestError));
			} finally {
				if (active) setLoading(false);
			}
		};

		void loadData();

		return () => {
			active = false;
		};
	}, [reload, section]);

	const records: ManagementRecord[] = [];
	if (data) {
		const barbers = data.barbers ?? [];
		const appointments = data.appointments ?? [];
		const customers = data.customers ?? [];
		const services = data.services ?? [];
		const barbersById = new Map(
			barbers.map((barber) => [barber.id, barber.name])
		);
		const customersById = new Map(
			customers.map((customer) => [customer.id, customer.name])
		);
		const servicesById = new Map(
			services.map((service) => [service.id, service])
		);

		switch (section) {
			case 'appointments':
				records.push(
					...appointments.map((appointment) => ({
						key: appointment.id,
						title: `${formatDate(appointment.date)} · ${appointment.startTime}–${appointment.endTime}`,
						summary: `${customersById.get(appointment.customerId) ?? `Cliente #${appointment.customerId}`} · ${barbersById.get(appointment.barberId) ?? `Barbeiro #${appointment.barberId}`}`,
						details: [
							servicesById.get(appointment.serviceId)?.name ??
								`Serviço #${appointment.serviceId}`,
							formatPrice(appointment.totalPrice),
							...(appointment.notes ? [appointment.notes] : [])
						],
						status: getStatusLabel(appointment.status)
					}))
				);
				break;
			case 'barbers':
				records.push(
					...barbers.map((barber) => ({
						key: barber.id,
						title: barber.name,
						summary: `Barbeiro #${barber.id}`,
						details: [
							`${appointments.filter((appointment) => appointment.barberId === barber.id).length} agendamentos`
						]
					}))
				);
				break;
			case 'combos':
				records.push(
					...(data.combos ?? []).map((combo) => ({
						key: combo.id,
						title: combo.name,
						summary: combo.description,
						details: [
							formatPrice(combo.price),
							`Serviços: ${combo.services.map((service) => service.name).join(', ') || 'Nenhum'}`
						]
					}))
				);
				break;
			case 'customers':
				records.push(
					...customers.map((customer) => ({
						key: customer.id,
						title: customer.name,
						summary: `Cliente #${customer.id}`,
						details: [customer.phone]
					}))
				);
				break;
			case 'business-hours':
				records.push(
					...(data['business-hours'] ?? []).map((hours) => ({
						key: hours.id,
						title: weekdays[hours.dayOfWeek] ?? `Dia ${hours.dayOfWeek}`,
						summary: hours.isOpen
							? `${hours.openTime}–${hours.closeTime}`
							: 'Fechado',
						details: [hours.isOpen ? 'Aberto' : 'Não abre neste dia']
					}))
				);
				break;
		}
	}

	const pageTitle =
		sections.find((item) => item.path === section)?.label ?? 'Painel';

	return (
		<main className="min-h-svh bg-neutral-950 px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pt-36">
			<div className="mx-auto max-w-screen-xl">
				<header className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
							<span
								className="w-8 border-t border-amber-500"
								aria-hidden="true"
							/>
							BarberFlow · Gestão
						</p>
						<h1 className="font-serif text-4xl font-semibold leading-tight text-stone-100 sm:text-5xl">
							{pageTitle}
						</h1>
					</div>
					<p className="text-sm leading-6 text-neutral-400">
						{data ? 'Dados carregados da API' : 'Conectando à API'}
					</p>
				</header>

				<nav
					aria-label="Seções de gestão"
					className="mb-8 flex gap-2 overflow-x-auto border-b border-white/10 pb-3"
				>
					{sections.map((item) => (
						<NavLink
							key={item.path}
							to={`/${item.path}`}
							className={({ isActive }) =>
								`shrink-0 px-4 py-2 text-sm transition-colors ${isActive ? 'bg-amber-600 text-white' : 'text-neutral-400 hover:text-stone-100'}`
							}
						>
							{item.label}
						</NavLink>
					))}
				</nav>

				{section === 'customers' && (
					<p className="mb-6 border border-amber-900/50 bg-amber-950/20 px-4 py-3 text-xs leading-5 text-amber-200/80">
						Esta tela exibe dados pessoais de clientes. Restrinja o acesso antes
						de publicar o painel.
					</p>
				)}

				{loading ? (
					<p className="py-10 text-sm text-neutral-400" role="status">
						Carregando informações...
					</p>
				) : error ? (
					<div className="border border-white/10 p-6 sm:p-8" role="alert">
						<p className="text-sm leading-6 text-neutral-300">
							Não foi possível carregar os dados: {error}
						</p>
						<button
							className="mt-4 text-sm font-semibold text-amber-500 hover:text-amber-400"
							onClick={() => {
								setError('');
								setLoading(true);
								setReload((value) => value + 1);
							}}
							type="button"
						>
							Tentar novamente
						</button>
					</div>
				) : records.length === 0 ? (
					<p className="py-10 text-sm text-neutral-400">
						Nenhum registro encontrado nesta seção.
					</p>
				) : (
					<div className="grid grid-cols-1 gap-px bg-white/10 md:grid-cols-2 xl:grid-cols-3">
						{records.map((record) => (
							<article
								key={record.key}
								className="flex min-h-44 flex-col bg-neutral-950 p-6 sm:p-7"
							>
								<div className="mb-4 flex items-start justify-between gap-4">
									<h2 className="font-serif text-xl font-semibold leading-snug text-stone-100">
										{record.title}
									</h2>
									{record.status && (
										<span className="shrink-0 border border-amber-500/40 px-2 py-1 text-xs text-amber-400">
											{record.status}
										</span>
									)}
								</div>
								<p className="text-sm leading-6 text-neutral-400">
									{record.summary}
								</p>
								<div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-5 text-xs leading-5 text-neutral-500">
									{record.details.map((detail) => (
										<span key={detail}>{detail}</span>
									))}
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
