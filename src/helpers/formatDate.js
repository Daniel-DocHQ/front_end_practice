import { format } from 'date-fns';
import moment from 'moment-timezone';

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
export function formatTimeSlotWithTimeZone(date, tz) {
	return moment(date).utc(0).tz(tz).format('hh:mm A');
}
