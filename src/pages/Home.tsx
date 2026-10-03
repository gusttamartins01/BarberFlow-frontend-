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
					<div className="pointer-events-none absolute inset-0 z-0 bg-black/60" />

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

						<a
							href="#agendamentos"
							className="mt-2 inline-flex min-h-12 items-center justify-center rounded bg-amber-600 px-6 py-3 text-center font-semibold text-[#111820] transition-colors hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
						>
							Agende seu horário
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
