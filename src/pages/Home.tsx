import { ArrowUpRight, Clock3, MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import BgHome from '../assets/capa.png';
import About from '../components/home/About';
import Barbers from '../components/home/Barbers';
import BookingForm from '../components/home/BookingForm';
import Combos from '../components/home/Combos';
import Contacts from '../components/home/Contacts';
import Services from '../components/home/Services';
import RevealOnScroll from '../components/ui/RevealOnScroll';

export default function Home() {
	const [bookingSelection, setBookingSelection] = useState<{
		serviceId: string;
		barberId: string;
		requestId: number;
	}>({ serviceId: '', barberId: '', requestId: 0 });
	const updateBookingSelection = (
		field: 'serviceId' | 'barberId',
		value: string
	) =>
		setBookingSelection((current) => ({
			...current,
			[field]: value,
			requestId: current.requestId + 1
		}));

	return (
		<>
			<main>
				<section
					id="inicio"
					className="relative isolate min-h-svh bg-position-[58%_center] bg-cover bg-no-repeat pt-20 shadow-2xl sm:bg-position-[65%_center] xl:bg-position-[-90%_10%] lg:pt-24"
					style={{ backgroundImage: `url(${BgHome})` }}
				>
					<div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-black/95 via-black/60 to-black/10" />
					<div className="relative z-10 flex min-h-[calc(100svh-5rem)] flex-col items-start justify-center gap-4 px-5 py-10 sm:gap-5 sm:px-8 lg:min-h-[calc(100svh-6rem)] lg:px-16">
						<span className="text-sm font-medium uppercase tracking-widest text-amber-500 sm:text-base animate-pulse">
							Barbearia Sr.Emídio
						</span>
						<h1 className="max-w-2xl text-3xl font-bold leading-tight text-stone-100 sm:text-4xl lg:text-6xl">
							Um corte do seu jeito.
							<span className="block">Um lugar pra se sentir em casa.</span>
						</h1>
						<p className="max-w-xl text-base leading-relaxed text-stone-200 sm:text-lg">
							Na Barbearia Senhor Emídio, você cuida do visual, troca ideia e
							aproveita um espaço feito para se sentir à vontade.
						</p>
						<div className="mt-2 flex flex-wrap gap-3">
							<a
								href="#agendamentos"
								className="inline-flex min-h-12 items-center justify-center gap-2 bg-amber-500 px-6 py-3 text-center font-semibold text-neutral-950 transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
							>
								Agende seu horário <ArrowUpRight size={17} aria-hidden="true" />
							</a>
							<a
								href="#servicos"
								className="inline-flex min-h-12 items-center justify-center border border-white/50 px-6 py-3 text-center font-semibold text-stone-100 transition-colors hover:border-amber-400 hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
							>
								Ver serviços
							</a>
						</div>
					</div>
				</section>
				<section
					aria-label="Informações da barbearia"
					className="border-y border-white/10 bg-neutral-900 px-5 sm:px-8 lg:px-12"
				>
					<div className="mx-auto grid max-w-screen-2xl grid-cols-1 divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
						<div className="flex items-center gap-4 py-5 md:px-6 lg:py-7">
							<Clock3
								className="shrink-0 text-amber-400"
								size={21}
								aria-hidden="true"
							/>
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-300">
									Funcionamento
								</p>
								<p className="mt-1 text-sm font-medium text-stone-100 sm:text-base">
									Seg–Sáb, 09:00–19:00 · Dom fechado
								</p>
							</div>
						</div>
						<a
							href="https://www.google.com/maps/search/?api=1&query=Rua+Dr.+Jos%C3%A9+Francisco+S%C3%A1+Pires%2C+58%2C+Fortaleza%2C+CE"
							target="_blank"
							rel="noreferrer"
							className="flex items-center gap-4 py-5 transition-colors hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 md:px-6 lg:py-7"
						>
							<MapPin
								className="shrink-0 text-amber-400"
								size={21}
								aria-hidden="true"
							/>
							<span>
								<span className="block text-xs font-semibold uppercase tracking-[0.12em] text-stone-300">
									Endereço
								</span>
								<span className="mt-1 block text-sm font-medium leading-5 text-stone-100 sm:text-base">
									Rua Dr. José Francisco Sá Pires, 58 · Fortaleza/CE
								</span>
							</span>
							<ArrowUpRight
								className="ml-auto shrink-0 text-neutral-400"
								size={16}
								aria-hidden="true"
							/>
						</a>
						<a
							href="https://www.google.com/maps/search/?api=1&query=Sr.Emidio+Barbearia"
							target="_blank"
							rel="noreferrer"
							className="flex items-center gap-4 py-5 transition-colors hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 md:px-6 lg:py-7"
						>
							<Star
								className="shrink-0 fill-amber-400 text-amber-400"
								size={21}
								aria-hidden="true"
							/>
							<span>
								<span className="block text-xs font-semibold uppercase tracking-[0.12em] text-stone-300">
									Google
								</span>
								<span className="mt-1 block text-sm font-medium text-stone-100 sm:text-base">
									5,0 · Ver avaliações
								</span>
							</span>
							<ArrowUpRight
								className="ml-auto shrink-0 text-neutral-400"
								size={16}
								aria-hidden="true"
							/>
						</a>
					</div>
				</section>
				<RevealOnScroll>
					<About />
				</RevealOnScroll>
				<RevealOnScroll>
					<Barbers
						onScheduleBarber={(barberId) =>
							updateBookingSelection('barberId', String(barberId))
						}
					/>
				</RevealOnScroll>
				<RevealOnScroll>
					<Services
						onScheduleService={(serviceId) =>
							updateBookingSelection('serviceId', String(serviceId))
						}
					/>
				</RevealOnScroll>
				<RevealOnScroll>
					<Combos />
				</RevealOnScroll>
				<RevealOnScroll>
					<BookingForm
						selection={bookingSelection}
						onSelectionChange={updateBookingSelection}
					/>
				</RevealOnScroll>
			</main>
			<RevealOnScroll>
				<Contacts />
			</RevealOnScroll>
		</>
	);
}
