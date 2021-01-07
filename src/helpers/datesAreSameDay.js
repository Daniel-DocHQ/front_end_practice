function datesAreSameDay(date1, date2) {
	const first = new Date(date1);
	const second = new Date(date2);
	return (
		first.getFullYear() === second.getFullYear() &&
		first.getMonth() === second.getMonth() &&
		first.getDate() === second.getDate()
	);
}
export default datesAreSameDay;
