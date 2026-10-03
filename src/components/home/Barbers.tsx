import { ArrowUpRight, Scissors } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import { barberProfiles, defaultBarbers } from '../../data/defaultCatalog';
import { usePublicList } from '../../hooks/usePublicList';
import type { ApiBarber } from '../../types/api';
import CatalogPhotoCarousel from './CatalogPhotoCarousel';

type BarbersProps = {
	onScheduleBarber: (barberId: number) => void;
};

export default function Barbers({ onScheduleBarber }: BarbersProps) {
	const { items, loading, error, retry } = usePublicList<ApiBarber>(
		'/barbers',
		defaultBarbers
	);
	const orderedItems = [...items].sort((first, second) => {
		const firstPriority = first.name === 'Fabrício Emidio' ? 0 : 1;
		const secondPriority = second.name === 'Fabrício Emidio' ? 0 : 1;
		return firstPriority - secondPriority;
	});

	return (
		<section
			id="barbeiros"
			aria-labelledby="barbers-title"
			className="scroll-mt-20 bg-neutral-950 px-5 py-16 sm:px-8 sm:py-20 lg:scroll-mt-24 lg:px-12 lg:py-24"
		>
			<div className="mx-auto max-w-screen-2xl">
				<div className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
							<span
								className="w-8 border-t border-amber-500"
								aria-hidden="true"
							/>
							Nossa equipe
						</p>
						<h2
							id="barbers-title"
							className="font-serif text-4xl font-semibold leading-tight text-stone-100 sm:text-5xl"
						>
							Quem cuida do seu corte
						</h2>
					</div>
					<p className="max-w-sm text-sm leading-6 text-neutral-400 sm:text-base sm:leading-7">
						Técnica, atenção aos detalhes e um atendimento feito para você.
					</p>
				</div>

				{loading ? (
					<p className="py-8 text-sm text-neutral-400" role="status">
						Conhecendo a equipe...
					</p>
				) : error ? (
					<div className="border border-white/10 p-6 sm:p-8" role="alert">
						<p className="text-sm text-neutral-300">
							Não foi possível mostrar a equipe agora.
						</p>
						<button
							className="mt-4 text-sm font-semibold text-amber-500 hover:text-amber-400"
							onClick={retry}
							type="button"
						>
							Tentar novamente
						</button>
					</div>
				) : items.length === 0 ? (
					<p className="py-8 text-sm text-neutral-400">
						As informações da equipe estarão disponíveis em breve.
					</p>
				) : (
					<div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2">
						{orderedItems.map((barber, index) => (
							<article
								key={barber.id}
								className="group overflow-hidden border border-white/10 bg-neutral-950 transition duration-300 hover:-translate-y-1 hover:border-amber-500/60"
							>
								<CatalogPhotoCarousel
									type="barber"
									id={barber.id}
									name={barber.name}
									maxPhotos={2}
									layout="compact"
								/>
								<div className="flex min-h-56 flex-col p-7 sm:p-9 lg:p-10">
									<div className="mb-7 flex items-center justify-between">
										<span className="font-serif text-sm text-neutral-500">
											{String(index + 1).padStart(2, '0')}
										</span>
										<Scissors
											size={20}
											className="text-amber-500 transition-transform group-hover:rotate-12"
											aria-hidden="true"
										/>
									</div>
									<p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
										Barbeiro
									</p>
									<h3 className="font-serif text-2xl font-semibold text-stone-100">
										{barber.name}
									</h3>
									<p className="mt-2 text-sm leading-6 text-stone-300">
										{barberProfiles[barber.id]?.specialty ??
											'Atendimento personalizado'}
									</p>
									<div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
										{barberProfiles[barber.id]?.instagramUrl && (
											<a
												href={barberProfiles[barber.id].instagramUrl}
												target="_blank"
												rel="noreferrer"
												className="inline-flex min-h-11 items-center gap-2 border border-neutral-700 px-3 text-sm text-stone-200 transition-colors hover:border-amber-500 hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
											>
												<FaInstagram size={16} aria-hidden="true" />
												{barberProfiles[barber.id].instagramLabel}
												<ArrowUpRight size={14} aria-hidden="true" />
											</a>
										)}
										<button
											type="button"
											className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 bg-amber-500 px-4 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
											onClick={() => {
												onScheduleBarber(barber.id);
												document
													.getElementById('agendamentos')
													?.scrollIntoView({ behavior: 'smooth' });
											}}
										>
											Agendar com {barber.name}
											<ArrowUpRight size={16} aria-hidden="true" />
										</button>
									</div>
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
