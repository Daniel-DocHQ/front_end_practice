import { useState, useEffect } from 'react';

const useDateFilter = (appointments) => {
	const [filter, setFilter] = useState('today');
	const [filteredAppointments, setFilteredAppointments] = useState([]);
	const today = new Date();
	const todayTime = new Date(today.getTime()).setHours(0,0,0,0);
	const todayDay = new Date().getDate();
	// const nextMonth = new Date (new Date ().setDate(todayDay + 31)).setHours(0,0,0,0);
	// const lastMonth = new Date (new Date ().setDate(todayDay - 31)).setHours(0,0,0,0);
	const tomorrow = new Date(new Date ().setDate(todayDay + 1)).setHours(0,0,0,0)
	const yesterdayTime = new Date(new Date ().setDate(todayDay - 1)).setHours(0,0,0,0);
	const firstDayOfWeek = new Date(new Date ().setDate(todayDay - 7)).setHours(0,0,0,0);
	const lastDayOfWeek = new Date(new Date ().setDate(todayDay + 7)).setHours(0,0,0,0);

	useEffect(() => {
		if (!!appointments.length) {
			let newAppointments;
			switch (filter) {
				case 'last month':
					newAppointments = [...appointments].filter((appointment) => {
						const appointmentDate = new Date(appointment.start_time).setHours(0,0,0,0);
						return appointmentDate <= todayTime;
					});
					break;
				case 'last week':
					newAppointments = [...appointments].filter((appointment) => {
						const appointmentDate = new Date(appointment.start_time).setHours(0,0,0,0);
						return appointmentDate >= firstDayOfWeek && appointmentDate <= todayTime;
					});
					break;
				case 'yesterday':
					newAppointments = [...appointments].filter((appointment) =>
						new Date(appointment.start_time).setHours(0,0,0,0) === yesterdayTime
					);
					break;
				case 'today':
					newAppointments = [...appointments].filter((appointment) =>
						new Date(appointment.start_time).setHours(0,0,0,0) === todayTime);
					break;
				case 'tomorrow':
					newAppointments = [...appointments].filter((appointment) =>
						new Date(appointment.start_time).setHours(0,0,0,0) === tomorrow);
					break;
				case 'week':
					newAppointments = [...appointments].filter((appointment) => {
						const appointmentDate = new Date(appointment.start_time).setHours(0,0,0,0);
						return appointmentDate >= todayTime && appointmentDate <= lastDayOfWeek;
					});
					break;
				case 'month':
					newAppointments = [...appointments].filter((appointment) => {
						const appointmentDate = new Date(appointment.start_time).setHours(0,0,0,0);
						return appointmentDate >= todayTime;
					});
					break;
				default:
					newAppointments = [...appointments];
			}
			newAppointments.sort(({ start_time: aStartTime }, { start_time: bStartTime }) => new Date(aStartTime).getTime() - new Date(bStartTime).getTime());
			setFilteredAppointments(newAppointments);
		}
	}, [filter, appointments]);

	return ({ filteredAppointments, filter, setFilter });
};

export default useDateFilter;
