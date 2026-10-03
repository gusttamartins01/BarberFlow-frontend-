import { type ReactNode, useEffect, useRef, useState } from 'react';

type RevealOnScrollProps = {
	children: ReactNode;
};

export default function RevealOnScroll({ children }: RevealOnScrollProps) {
	const elementRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(
		() => typeof window === 'undefined' || !('IntersectionObserver' in window)
	);

	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;
		if (!('IntersectionObserver' in window)) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.12 }
		);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			className={`scroll-reveal${visible ? ' is-visible' : ''}`}
			ref={elementRef}
		>
			{children}
		</div>
	);
}
