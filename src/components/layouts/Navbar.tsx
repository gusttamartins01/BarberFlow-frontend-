import { NavLink } from 'react-router-dom';
import Logo from '../../assets/logo.png';

export default function Navbar() {
	const getLinksStyle = ({ isActive }: { isActive: boolean }) =>
		isActive
			? 'text-amber-500 font-semibold'
			: 'text-gray-100 hover:text-amber-400 transition-colors';
	return (
		<header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black backdrop-blur-md">
			<div className="max-w-8xl px-16 max-auto h-24 flex items-center justify-between">
				<NavLink
					to="/"
					className="flex pl-5 items-center transition duration-500 ease-in-out hover:scale-110 cursor-pointer"
				>
					<img
						src={Logo}
						alt="Logo Barbearia Sr.Emidio"
						width={72}
						height={72}
						className="object-contain"
					/>
				</NavLink>

				<div>
					<nav className="flex items-center gap-6 text-lg font-medium">
						<NavLink to="/" className={getLinksStyle}>
							Início
						</NavLink>

						<NavLink to="/about" className={getLinksStyle}>
							Sobre
						</NavLink>

						<NavLink to="/barbers" className={getLinksStyle}>
							Barbeiros
						</NavLink>

						<NavLink to="/services" className={getLinksStyle}>
							Serviços
						</NavLink>

						<NavLink to="/combos" className={getLinksStyle}>
							Combos
						</NavLink>

						<NavLink to="/contacts" className={getLinksStyle}>
							Contatos
						</NavLink>
					</nav>
				</div>

				{/* <div>
					<NavLink
						to="/scheduling"
						className="bg-amber-600 text-lg px-4 py-3 rounded-2xl text-gray-200 transition duration-500 ease-in-out hover:scale-110 cursor-pointer"
					>
						Agendamento
					</NavLink>
				</div> */}
			</div>
		</header>
	);
}
