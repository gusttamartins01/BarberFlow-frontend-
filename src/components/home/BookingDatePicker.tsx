import { DayPicker } from 'react-day-picker';
import { ptBR } from 'react-day-picker/locale/pt-BR';
import type { ApiBusinessHours } from '../../types/api';

type BookingDatePickerProps = {
	date: string;
	hours: ApiBusinessHours[];
	onSelect: (date: string) => void;
};

function parseLocalDate(value: string) {
	const [year, month, day] = value.split('-').map(Number);
	return new Date(year, month - 1, day);
}

function dateInputValue(date: Date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function BookingDatePicker({
	date,
	hours,
	onSelect
}: BookingDatePickerProps) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const selectedDate = date ? parseLocalDate(date) : undefined;

	return (
		<DayPicker
			aria-label="Escolha a data do agendamento"
			className="booking-calendar"
			disabled={(day) => {
				const dayStart = new Date(day);
				dayStart.setHours(0, 0, 0, 0);
				const businessHours = hours.find(
					(item) => item.dayOfWeek === day.getDay()
				);
				return dayStart < today || !businessHours?.isOpen;
			}}
			locale={ptBR}
			mode="single"
			navLayout="around"
			onSelect={(selected) =>
				onSelect(selected ? dateInputValue(selected) : '')
			}
			selected={selectedDate}
			showOutsideDays
			weekStartsOn={1}
		/>
	);
}
