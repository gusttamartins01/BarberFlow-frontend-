import { ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { useState } from 'react';
import { type CatalogPhotoType, catalogPhotos } from '../../data/catalogPhotos';

type CatalogPhotoCarouselProps = {
	type: CatalogPhotoType;
	id: number;
	name: string;
	maxPhotos: 2 | 6;
};

export default function CatalogPhotoCarousel({
	type,
	id,
	name,
	maxPhotos
}: CatalogPhotoCarouselProps) {
	const photos = (catalogPhotos[type][id] ?? []).slice(0, maxPhotos);
	const [activeIndex, setActiveIndex] = useState(0);
	const hasPhotos = photos.length > 0;

	return (
		<div className="relative aspect-4/3 overflow-hidden bg-neutral-900">
			{hasPhotos ? (
				<img
					src={photos[activeIndex]}
					alt={`${name}, foto ${activeIndex + 1}`}
					className="size-full object-cover grayscale-[35%] transition duration-500 group-hover:grayscale-0 group-focus-within:grayscale-0"
				/>
			) : (
				<div
					className="flex size-full items-center justify-center text-neutral-700"
					aria-hidden="true"
				>
					<Image size={40} strokeWidth={1.25} />
				</div>
			)}

			<div className="absolute bottom-3 right-3 flex items-center gap-2">
				{photos.length > 1 && (
					<>
						<button
							className="inline-flex size-9 items-center justify-center border border-white/15 bg-black/80 text-stone-100 backdrop-blur transition-colors hover:border-amber-500 hover:text-amber-400"
							aria-label="Foto anterior"
							type="button"
							onClick={() =>
								setActiveIndex(
									(index) => (index - 1 + photos.length) % photos.length
								)
							}
						>
							<ChevronLeft size={18} aria-hidden="true" />
						</button>
						<button
							className="inline-flex size-9 items-center justify-center border border-white/15 bg-black/80 text-stone-100 backdrop-blur transition-colors hover:border-amber-500 hover:text-amber-400"
							aria-label="Próxima foto"
							type="button"
							onClick={() =>
								setActiveIndex((index) => (index + 1) % photos.length)
							}
						>
							<ChevronRight size={18} aria-hidden="true" />
						</button>
					</>
				)}
				{hasPhotos && (
					<span
						className="min-w-12 bg-black/80 px-2 py-2 text-center text-xs tabular-nums text-stone-200 backdrop-blur"
						aria-live="polite"
					>
						{activeIndex + 1}/{photos.length}
					</span>
				)}
			</div>
		</div>
	);
}
