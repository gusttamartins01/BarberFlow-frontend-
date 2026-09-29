import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import Logo from '../../assets/logo.png';

export default function Contacts() {
	return (
		<footer>
			<section
				id="contatos"
				aria-labelledby="contact-title"
				className="scroll-mt-20 bg-neutral-950 px-5 py-16 sm:px-8 sm:py-20 lg:scroll-mt-24 lg:px-12 lg:py-24"
			>
				<div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
					<div>
						<p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
							<span
								className="w-8 border-t border-amber-500"
								aria-hidden="true"
							/>
							Vamos conversar
						</p>
						<h2
							id="contact-title"
							className="max-w-2xl font-serif text-4xl font-semibold leading-tight text-stone-100 sm:text-5xl"
						>
							Seu próximo corte começa aqui.
						</h2>
						<p className="mt-5 max-w-xl text-sm leading-6 text-neutral-400 sm:text-base sm:leading-7">
							Escolha o serviço, encontre um horário e venha passar um tempo com
							a gente.
						</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
						<a
							href="#agendamentos"
							className="inline-flex min-h-12 items-center justify-center gap-3 bg-amber-500 px-6 text-sm font-semibold text-[#111820] transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
						>
							<CalendarDays size={18} aria-hidden="true" />
							Agendar horário
						</a>
						<a
							href="https://www.google.com/maps/search/?api=1&query=Barbearia+Senhor+Emidio"
							target="_blank"
							rel="noreferrer"
							className="inline-flex min-h-12 items-center justify-center gap-3 border border-neutral-700 px-6 text-sm font-semibold text-stone-100 transition-colors hover:border-amber-500 hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
						>
							<MapPin size={18} aria-hidden="true" />
							Encontrar no mapa <ArrowUpRight size={16} aria-hidden="true" />
						</a>
					</div>
				</div>
			</section>

			<div className="border-t border-neutral-800 bg-black px-5 py-5 sm:px-8 lg:px-12">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
					<a
						href="#inicio"
						className="flex items-center gap-3 text-sm text-stone-300"
					>
						<img
							src={Logo}
							alt=""
							width={36}
							height={36}
							className="object-contain"
						/>
						<span>Barbearia Sr. Emídio</span>
					</a>
					<a
						href="#inicio"
						className="text-xs text-neutral-500 transition-colors hover:text-amber-400"
					>
						Voltar ao início ↑
					</a>
				</div>
			</div>
		</footer>
	);
}
