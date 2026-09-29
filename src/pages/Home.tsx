import { NavLink } from 'react-router-dom';
import BgHome from '../assets/capa.png';
import Services from '../components/Services';

export default function Home() {
	return (
		<>
			<section
				className="relative isolate min-h-svh bg-[position:58%_center] bg-cover bg-no-repeat pt-20 shadow-2xl sm:bg-[position:65%_center] xl:bg-[position:90%_10%] lg:pt-24"
				style={{ backgroundImage: `url(${BgHome})` }}
			>
				<div className="pointer-events-none absolute inset-0 z-0 bg-black/60" />

				<div className="relative z-10 flex min-h-[calc(100svh-5rem)] flex-col items-start justify-center gap-4 px-5 py-10 sm:gap-5 sm:px-8 lg:min-h-[calc(100svh-6rem)] lg:px-16">
					<span className="text-sm font-medium uppercase tracking-widest text-amber-500 sm:text-base">
						Barbearia Sr.Emídio
					</span>

					<h1 className="max-w-2xl text-3xl font-bold leading-tight text-white/90 sm:text-4xl lg:text-6xl">
						Um corte do seu jeito.
						<span className="block">Um lugar pra se sentir em casa.</span>
					</h1>

					<p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
						Na Barbearia Senhor Emídio, você cuida do visual, troca ideia e
						aproveita um espaço feito para se sentir à vontade.
					</p>

					<NavLink
						to="/scheduling"
						className="mt-2 inline-flex min-h-12 items-center justify-center rounded bg-amber-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					>
						Agende seu horário
					</NavLink>
				</div>
			</section>
			<Services />
		</>
	);
}
