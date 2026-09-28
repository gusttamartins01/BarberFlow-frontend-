import { NavLink } from 'react-router-dom';
import BgHome from '../assets/capa.png';

export default function Home() {
	return (
		<section
			className="relative isolate min-h-screen bg-position-[40%_60%] bg-cover bg-no-repeat shadow-2xl md:bg-position-[90%_10%]"
			style={{ backgroundImage: `url(${BgHome})` }}
		>
			<div className="pointer-events-none absolute inset-0 z-0 bg-black/60" />

			<div className="relative z-10 flex min-h-screen flex-col items-start justify-center gap-5 px-6  md:px-16">
				<span className="text-md font-medium uppercase tracking-widest text-amber-600 animate-pulse">
					Barbearia Sr.Emídio
				</span>

				<h1 className="max-w-2xl text-3xl font-bold md:text-6xl text-white/90">
					Um corte do seu jeito.
					<span className="block">Um lugar pra se sentir em casa.</span>
				</h1>

				<p className="max-w-2xl text-lg text-white/80">
					Na Barbearia Senhor Emídio, você cuida do visual, troca ideia e
					aproveita um espaço feito para se sentir à vontade.
				</p>

				<NavLink
					to="/scheduling"
					className="mt-2 rounded px-6 py-3 font-semibold text-white bg-amber-600 hover:bg-amber-700 cursor-pointer"
				>
					Agende seu horário
				</NavLink>
			</div>
		</section>
	);
}
