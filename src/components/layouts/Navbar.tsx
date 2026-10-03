import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Logo from '../../assets/logo.png';

const links = [
	{ to: '#inicio', label: 'Início' },
	{ to: '#sobre', label: 'Sobre' },
	{ to: '#barbeiros', label: 'Barbeiros' },
	{ to: '#servicos', label: 'Serviços' },
	{ to: '#combos', label: 'Combos' },
	{ to: '#contatos', label: 'Contatos' },
	{ to: '#agendamentos', label: 'Agendar' }
];

export default function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [activeSection, setActiveSection] = useState('#inicio');
	const [scrolled, setScrolled] = useState(false);
	const closeMenu = () => setMenuOpen(false);

	useEffect(() => {
		const sections = links
			.map(({ to }) => document.querySelector(to))
			.filter((section): section is Element => section !== null);
		const updateScrollState = () => {
			setScrolled(window.scrollY > 12);
			const marker = window.scrollY + window.innerHeight * 0.3;
			const current = sections
				.map((section) => ({
					id: section.id,
					top: section.getBoundingClientRect().top + window.scrollY
				}))
				.filter((section) => section.top <= marker)
				.sort((first, second) => first.top - second.top)
				.at(-1);
			if (current) setActiveSection(`#${current.id}`);
		};
		updateScrollState();
		window.addEventListener('scroll', updateScrollState, { passive: true });
		window.addEventListener('resize', updateScrollState);

		return () => {
			window.removeEventListener('scroll', updateScrollState);
			window.removeEventListener('resize', updateScrollState);
		};
	}, []);

	return (
		<header
			className={`fixed top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300 ${scrolled ? 'border-neutral-700 bg-black/85 shadow-lg shadow-black/30' : 'border-neutral-800 bg-black/95'}`}
		>
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
							aria-current={activeSection === to ? 'location' : undefined}
							className={`rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${label === 'Agendar' ? 'bg-amber-500 px-4 py-2 font-semibold text-neutral-950 hover:bg-amber-400' : activeSection === to ? 'text-amber-400' : 'text-stone-200 hover:text-amber-400'}`}
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
						aria-current={activeSection === to ? 'location' : undefined}
						className={`border-l-2 px-3 py-3 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${activeSection === to ? 'border-amber-400 bg-neutral-900 text-amber-300' : 'border-transparent text-stone-200 hover:bg-neutral-900 hover:text-amber-300'}`}
						onClick={closeMenu}
					>
						{label}
					</a>
				))}
			</nav>
		</header>
	);
}
