import { useState, useEffect } from 'react';

const useDateFilter = (appointments) => {
	const [filter, setFilter] = useState('today');
	const [filteredAppointments, setFilteredAppointments] = useState([]);
	const today = new Date();
	const tomorrow = new Date(today);
	const currentMonth = new Date ().getMonth();
	today.setHours(0,0,0,0)
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(0,0,0,0);
	const todayTime = today.getTime();
	const tomorrowTime = tomorrow.getTime();
	const todayObj = new Date();
	const todayDate = todayObj.getDate();
	const todayDay = todayObj.getDay();
	const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));
	const lastDayOfWeek = new Date(firstDayOfWeek);
	lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

	useEffect(() => {
		if (!!appointments.length) {
			switch (filter) {
				case 'today':
					setFilteredAppointments([...appointments].filter((appointment) =>
						new Date(appointment.start_time).setHours(0,0,0,0) === todayTime));
					break;
				case 'tomorrow':
					setFilteredAppointments([...appointments].filter((appointment) =>
						new Date(appointment.start_time).setHours(0,0,0,0) === tomorrowTime));
					break;
				case 'week':
					setFilteredAppointments([...appointments].filter((appointment) => {
						const appointmentDate = new Date(appointment.start_time);
						return appointmentDate >= firstDayOfWeek && appointmentDate <= lastDayOfWeek;
					}));
					break;
				case 'month':
					setFilteredAppointments([...appointments].filter((appointment) =>
						new Date(appointment.start_time).getMonth() === currentMonth));
					break;
				default:
					setFilteredAppointments([...appointments]);
			}
		}
	}, [filter, appointments]);

	return ({ filteredAppointments, filter, setFilter });
};

export default useDateFilter;
