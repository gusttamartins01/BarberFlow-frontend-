import { ArrowUpRight, Clock3 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { defaultServices } from '../../data/defaultCatalog';
import { apiRequest } from '../../lib/api';
import type { ApiService } from '../../types/api';
import CatalogPhotoCarousel from './CatalogPhotoCarousel';

type ServicesProps = {
	onScheduleService: (serviceId: number) => void;
};

export default function Services({ onScheduleService }: ServicesProps) {
	const [services, setServices] = useState<ApiService[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const loadServices = useCallback(
		(signal?: AbortSignal) =>
			apiRequest<ApiService[]>('/services', { signal })
				.then((items) => {
					if (!signal?.aborted) {
						setServices(items.length ? items : defaultServices);
						setError('');
					}
				})
				.catch((requestError: unknown) => {
					if (!signal?.aborted) {
						setError(
							requestError instanceof Error
								? requestError.message
								: 'Não foi possível carregar os serviços.'
						);
					}
				})
				.finally(() => {
					if (!signal?.aborted) setLoading(false);
				}),
		[]
	);

	useEffect(() => {
		const controller = new AbortController();
		void loadServices(controller.signal);

		return () => controller.abort();
	}, [loadServices]);

	const formatPrice = (price: ApiService['price']) =>
		new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(Number(price));

	return (
		<section
			id="servicos"
			aria-labelledby="services-title"
			className="scroll-mt-20 bg-neutral-900 px-5 py-16 sm:px-8 sm:py-20 lg:scroll-mt-24 lg:px-12 lg:py-24"
		>
			<div className="mx-auto max-w-screen-2xl">
				<div className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
							<span
								className="w-8 border-t border-amber-500"
								aria-hidden="true"
							/>
							Serviços
						</p>
						<h2
							id="services-title"
							className="font-serif text-4xl font-semibold leading-tight text-stone-100 sm:text-5xl"
						>
							O que oferecemos
						</h2>
					</div>
					<p className="max-w-sm text-sm leading-6 text-neutral-400 sm:text-base sm:leading-7 lg:pb-1">
						Cada serviço foi refinado ao longo de anos para entregar o máximo em
						precisão e conforto.
					</p>
				</div>

				{loading ? (
					<p className="py-8 text-sm text-neutral-400" role="status">
						Carregando serviços...
					</p>
				) : error ? (
					<div className="border border-white/10 p-6 sm:p-8" role="alert">
						<p className="text-sm leading-6 text-neutral-300">{error}</p>
						<button
							className="mt-4 text-sm font-semibold text-amber-500 hover:text-amber-400"
							onClick={() => {
								setError('');
								setLoading(true);
								void loadServices();
							}}
							type="button"
						>
							Tentar novamente
						</button>
					</div>
				) : services.length === 0 ? (
					<p className="py-8 text-sm text-neutral-400">
						Nenhum serviço cadastrado no momento.
					</p>
				) : (
					<div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{services.map((service, index) => (
							<article
								key={service.id}
								className="group flex min-h-full flex-col overflow-hidden border border-white/10 bg-neutral-950 transition duration-300 hover:-translate-y-1 hover:border-amber-500/60"
							>
								<CatalogPhotoCarousel
									type="service"
									id={service.id}
									name={service.name}
									maxPhotos={6}
								/>
								<div className="flex flex-1 flex-col p-6 sm:p-7">
									<div className="mb-6 flex items-center justify-between gap-4">
										<span className="font-serif text-sm text-neutral-500">
											{String(index + 1).padStart(2, '0')}
										</span>
										<span className="shrink-0 text-sm font-semibold text-amber-500">
											{formatPrice(service.price)}
										</span>
									</div>
									<h3 className="mb-3 font-serif text-xl font-semibold leading-snug text-stone-100">
										{service.name}
									</h3>
									<p className="mb-6 text-sm leading-6 text-stone-300">
										{service.description || `${service.duration} minutos`}
									</p>
									<div className="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-4">
										<span className="inline-flex items-center gap-2 text-sm text-stone-300">
											<Clock3
												size={16}
												className="text-amber-500"
												aria-hidden="true"
											/>
											{service.duration} min
										</span>
										<button
											type="button"
											className="inline-flex min-h-10 items-center gap-2 px-2 text-sm font-semibold text-amber-400 transition-colors hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
											onClick={() => {
												onScheduleService(service.id);
												document
													.getElementById('agendamentos')
													?.scrollIntoView({ behavior: 'smooth' });
											}}
										>
											Agendar <ArrowUpRight size={16} aria-hidden="true" />
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
