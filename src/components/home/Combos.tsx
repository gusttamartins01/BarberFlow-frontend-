import { ArrowUpRight, Scissors } from 'lucide-react';
import { usePublicList } from '../../hooks/usePublicList';
import type { ApiCombo } from '../../types/api';
import CatalogPhotoCarousel from './CatalogPhotoCarousel';

export default function Combos() {
	const { items, loading, error, retry } = usePublicList<ApiCombo>('/combos');
	const formatPrice = (price: number | string) =>
		new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(Number(price));

	return (
		<section
			id="combos"
			aria-labelledby="combos-title"
			className="scroll-mt-20 bg-neutral-900 px-5 py-16 text-stone-100 sm:px-8 sm:py-20 lg:scroll-mt-24 lg:px-12 lg:py-24"
		>
			<div className="mx-auto max-w-screen-2xl">
				<div className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
							<span
								className="w-8 border-t border-amber-700"
								aria-hidden="true"
							/>
							Combos
						</p>
						<h2
							id="combos-title"
							className="font-serif text-4xl font-semibold leading-tight sm:text-5xl"
						>
							Seu cuidado, completo
						</h2>
					</div>
					<p className="max-w-sm text-sm leading-6 text-stone-300 sm:text-base sm:leading-7">
						Combine seus serviços favoritos em uma só visita.
					</p>
				</div>

				{loading ? (
					<p className="py-8 text-sm text-stone-400" role="status">
						Carregando combos...
					</p>
				) : error ? (
					<div className="border border-white/10 p-6 sm:p-8" role="alert">
						<p className="text-sm text-stone-300">
							Não foi possível mostrar os combos agora.
						</p>
						<button
							className="mt-4 text-sm font-semibold text-amber-400 hover:text-amber-300"
							onClick={retry}
							type="button"
						>
							Tentar novamente
						</button>
					</div>
				) : items.length === 0 ? (
					<p className="py-8 text-sm text-stone-400">
						Novas combinações estarão disponíveis em breve.
					</p>
				) : (
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{items.map((combo) => (
							<article
								key={combo.id}
								className="flex min-h-64 flex-col overflow-hidden border border-white/10 bg-neutral-950"
							>
								<CatalogPhotoCarousel
									type="combo"
									id={combo.id}
									name={combo.name}
									maxPhotos={6}
								/>
								<div className="flex flex-1 flex-col p-6 sm:p-8">
									<div className="mb-6 flex items-start justify-between gap-4">
										<Scissors
											size={20}
											className="mt-1 text-amber-500"
											aria-hidden="true"
										/>
										<span className="shrink-0 text-base font-semibold text-amber-400">
											{formatPrice(combo.price)}
										</span>
									</div>
									<h3 className="mb-3 font-serif text-2xl font-semibold">
										{combo.name}
									</h3>
									<p className="mb-6 text-sm leading-6 text-stone-300">
										{combo.description}
									</p>
									<p className="mt-auto border-t border-white/10 pt-4 text-xs leading-5 text-stone-400">
										{combo.services.map((service) => service.name).join(' · ')}
									</p>
								</div>
							</article>
						))}
					</div>
				)}
				<a
					href="#agendamentos"
					className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-stone-100 transition-colors hover:text-amber-400"
				>
					Escolher um horário <ArrowUpRight size={16} aria-hidden="true" />
				</a>
			</div>
		</section>
	);
}
