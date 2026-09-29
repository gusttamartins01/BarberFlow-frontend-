import { ArrowUpRight } from 'lucide-react';

export default function About() {
	return (
		<section
			id="sobre"
			aria-labelledby="about-title"
			className="scroll-mt-20 bg-neutral-900 px-5 py-16 text-stone-100 sm:px-8 sm:py-20 lg:scroll-mt-24 lg:px-12 lg:py-28"
		>
			<div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
				<div>
					<p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
						<span
							className="w-8 border-t border-amber-700"
							aria-hidden="true"
						/>
						Sobre a barbearia
					</p>
					<h2
						id="about-title"
						className="max-w-lg font-serif text-4xl font-semibold leading-tight sm:text-5xl"
					>
						Um bom corte. Uma boa conversa.
					</h2>
				</div>
				<div className="flex flex-col justify-end gap-6 border-l border-neutral-700 pl-6 sm:pl-8">
					<p className="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg sm:leading-8">
						Na Barbearia Senhor Emídio, cuidar do visual vem junto com se sentir
						à vontade. Um espaço para desacelerar, trocar ideia e sair com o
						corte do seu jeito.
					</p>
					<a
						href="#barbeiros"
						className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-stone-100 transition-colors hover:text-amber-400"
					>
						Conheça os barbeiros <ArrowUpRight size={16} aria-hidden="true" />
					</a>
				</div>
			</div>
		</section>
	);
}
