export default function Hero() {
	return (
		<section
			id="inicio"
			className="relative flex min-h-[calc(100vh-6rem)] items-center bg-neutral-800 bg-[url('/capa
			.jpeg')] bg-cover bg-[position:70%_top] md:bg-[position:75%_12%]"
		>
			<div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/45 via-45% to-transparent to-70%" />

			<div className="relative w-full px-6 py-16 lg:px-10">
				<p className="mb-4 text-sm font-bold uppercase tracking-widest text-brand">
					Barbearia Senhor Emídio
				</p>

				<h1 className="max-w-2xl text-5xl font-bold leading-[1.05] text-neutral-100 md:text-6xl">
					Um corte do seu jeito. Um lugar pra se sentir em casa.
				</h1>

				<p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-200">
					Na Barbearia Senhor Emídio, você cuida do visual, troca ideia e
					aproveita um espaço feito para se sentir à vontade.
				</p>

				<a
					href="#contatos"
					className="mt-8 inline-block rounded bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
				>
					Agende seu horário
				</a>
			</div>
		</section>
	);
}
