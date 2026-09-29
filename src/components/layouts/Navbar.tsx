import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from '../../assets/logo.png';

export default function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const closeMenu = () => setMenuOpen(false);
	const links = [
		{ to: '#inicio', label: 'Início' },
		{ to: '#sobre', label: 'Sobre' },
		{ to: '#barbeiros', label: 'Barbeiros' },
		{ to: '#servicos', label: 'Serviços' },
		{ to: '#combos', label: 'Combos' },
		{ to: '#contatos', label: 'Contatos' },
		{ to: '#agendamentos', label: 'Agendar' }
	];

	return (
		<header className="fixed top-0 z-50 w-full border-b border-neutral-800 bg-black/95 backdrop-blur-xl">
			<div className="mx-auto flex h-18 w-full max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-12">
				<button
					type="button"
					className="flex shrink-0 items-center transition-opacity hover:opacity-80"
					onClick={closeMenu}
				>
					<img
						src={Logo}
						alt="Logo Barbearia Sr.Emidio"
						width={64}
						height={64}
						className="object-contain"
					/>
				</button>

				<nav className="hidden items-center gap-4 text-sm font-medium xl:flex 2xl:gap-6">
					{links.map(({ to, label }) => (
						<a
							key={to}
							href={to}
							className={`transition-colors  hover:text-amber-400 ${label === 'Agendar' ? ' rounded-md bg-amber-500 px-4 py-2 text-gray-300 hover:bg-amber-500 hover:text-neutral-950' : 'text-stone-200'}`}
						>
							{label}
						</a>
					))}
				</nav>

				<button
					type="button"
					className="inline-flex size-11 items-center justify-center text-stone-200 transition-colors hover:bg-neutral-900 hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 xl:hidden"
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
				className={`${menuOpen ? 'grid' : 'hidden'} gap-1 border-t border-neutral-800 bg-neutral-950 px-4 py-3 sm:px-6 xl:hidden`}
			>
				{links.map(({ to, label }) => (
					<a
						key={to}
						href={to}
						className="px-3 py-3 text-base text-stone-200 transition-colors hover:bg-neutral-900 hover:text-amber-400"
						onClick={closeMenu}
					>
						{label}
					</a>
				))}
			</nav>
		</header>
	);
}
