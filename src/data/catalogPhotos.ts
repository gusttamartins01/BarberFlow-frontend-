export type CatalogPhotoType = 'barber' | 'service' | 'combo';

// Add local image paths by catalog ID; store files in public/catalog/.
export const catalogPhotos: Record<
	CatalogPhotoType,
	Record<number, string[]>
> = {
	barber: {
		1: ['/barbers/barber1.png', '/barbers/barber1.2.png'],
		2: ['/barbers/barber2.png']
	},
	service: {
		1: [
			'/catalog/service1.png',
			'/catalog/service2.png',
			'/catalog/service3.png',
			'/catalog/service4.png',
			'/catalog/service5.png'
		]
	},
	combo: {
		1: ['/combos/combo1.png'],
		2: ['/combos/combo1.png'],
		3: ['/combos/combo1.png'],
		4: ['/combos/combo1.png'],
		5: ['/combos/combo1.png'],
		6: ['/combos/combo1.png']
	}
};
