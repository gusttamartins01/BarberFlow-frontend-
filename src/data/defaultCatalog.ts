import type { ApiBarber, ApiCombo, ApiService } from '../types/api';

export const defaultBarbers: ApiBarber[] = [
	{ id: 1, name: 'Fabrício Emidio' },
	{ id: 2, name: 'Antonio Marcos' }
];

export const barberProfiles: Record<
	number,
	{ specialty: string; instagramUrl?: string; instagramLabel?: string }
> = {
	1: {
		specialty: 'Especialista em degradê e acabamento',
		instagramUrl: 'https://www.instagram.com/barbearia_sr.emidio',
		instagramLabel: '@barbearia_sr.emidio'
	},
	2: { specialty: 'Cortes clássicos e estilo tradicional' }
};

export const defaultServices: ApiService[] = [
	{
		id: 1,
		name: 'Corte degradê',
		description: 'Degradê preciso e personalizado para valorizar seu estilo.',
		price: 30,
		duration: 35
	},
	{
		id: 2,
		name: 'Corte clássico',
		description: 'Um corte clássico, alinhado e feito sob medida para você.',
		price: 30,
		duration: 30
	}
];

export const defaultCombos: ApiCombo[] = [
	{
		id: 1,
		name: 'Corte + Hidratação',
		description:
			'Combine um corte personalizado com hidratação capilar para deixar os fios macios, cuidados e renovados.',
		price: 50,
		services: [
			{ id: 1, name: 'Corte degradê' },
			{ id: 2, name: 'Hidratação capilar' }
		]
	}
];
