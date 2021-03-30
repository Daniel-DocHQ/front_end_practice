import { format } from 'date-fns';

export function ddMMyyyy(date) {
	return format(new Date(date), 'dd-MM-yyyy');
}
export function formatTimeSlot(date) {
	const d = new Date(date).toLocaleTimeString();
	const dString = d.split(':');
	return `${dString[0]}:${dString[1]}${dString[0] < 12 ? ' AM' : ' PM'}`;
}
export function formatOrderDate(date) {
	const d = new Date(date);
	const dString = d.toString().split(' ');
	return `${dString[1]} ${dString[2]}, ${dString[3]}`;
}
