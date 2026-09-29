import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../../assets/logo.png';

export default function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const getLinksStyle = ({ isActive }: { isActive: boolean }) =>
		isActive
			? 'text-amber-500 font-semibold'
			: 'text-gray-100 hover:text-amber-400 transition-colors';
	const closeMenu = () => setMenuOpen(false);
	const links = [
		{ to: '/', label: 'Início' },
		{ to: '/about', label: 'Sobre' },
		{ to: '/barbers', label: 'Barbeiros' },
		{ to: '/services', label: 'Serviços' },
		{ to: '/combos', label: 'Combos' },
		{ to: '/appointments', label: 'Agendamentos' },
		{ to: '/contacts', label: 'Contatos' }
	];

	return (
		<header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black backdrop-blur-md">
			<div className="mx-auto flex h-20 w-full max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:h-24 lg:px-12">
				<NavLink
					to="/"
					className="flex shrink-0 items-center transition duration-300 ease-in-out hover:scale-105"
					onClick={closeMenu}
				>
					<img
						src={Logo}
						alt="Logo Barbearia Sr.Emidio"
						width={64}
						height={64}
						className="object-contain"
					/>
				</NavLink>

				<nav className="hidden items-center gap-5 text-base font-medium xl:flex 2xl:gap-7 2xl:text-lg">
					{links.map(({ to, label }) => (
						<NavLink key={to} to={to} className={getLinksStyle}>
							{label}
						</NavLink>
					))}
				</nav>

				<button
					type="button"
					className="inline-flex size-11 items-center justify-center rounded text-gray-100 transition-colors hover:bg-white/10 hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 xl:hidden"
					aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
					aria-expanded={menuOpen}
					aria-controls="mobile-navigation"
					onClick={() => setMenuOpen((open) => !open)}
				>
					{menuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			<nav
				id="mobile-navigation"
				aria-label="Navegação principal"
				className={`${menuOpen ? 'grid' : 'hidden'} gap-1 border-t border-white/10 bg-black px-4 py-3 sm:px-6 xl:hidden`}
			>
				{links.map(({ to, label }) => (
					<NavLink
						key={to}
						to={to}
						className={({ isActive }) =>
							`${getLinksStyle({ isActive })} rounded px-3 py-3 text-base`
						}
						onClick={closeMenu}
					>
						{label}
					</NavLink>
				))}
			</nav>
		</header>
	);
}
