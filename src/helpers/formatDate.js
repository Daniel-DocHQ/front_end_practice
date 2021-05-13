import { format } from 'date-fns';

export function ddMMyyyy(date) {
	return format(new Date(date), 'dd-MM-yyyy');
}
export function formatTimeSlot(date) {
	return format(new Date(date), 'p');
}
export function formatOrderDate(date) {
	const d = new Date(date);
	const dString = d.toString().split(' ');
	return `${dString[1]} ${dString[2]}, ${dString[3]}`;
}
