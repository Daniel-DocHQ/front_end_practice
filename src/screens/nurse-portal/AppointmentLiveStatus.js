import React, { useEffect, useState, useContext, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import { Grid } from '@material-ui/core';
import LiveStatusTable from '../../components/Tables/LiveStatusTable';
import { AuthContext } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import LiveDoctorsTable from '../../components/Tables/LiveDoctorsTable';

const AppointmentLiveStatus = () => {
	const { token } = useContext(AuthContext);
	const [appointments, setAppointments] = useState();
	const doctors = [
		{
			first_name: 'Bruce',
			last_name: 'Wayne',
			status: 'online',
			patients: 2,
		},
		{
			first_name: 'Mike',
			last_name: 'Johnson',
			status: 'offline',
			patients: 1,
		},
		{
			first_name: 'Taylor',
			last_name: 'Xavier',
			status: 'offline',
			patients: 3,
		},
		{
			first_name: 'Lady',
			last_name: 'Young',
			status: 'online',
			patients: 0,
		},
		{
			first_name: 'Loureen',
			last_name: 'Ling',
			status: 'offline',
			patients: 3,
		},
	];

	let history = useHistory();

	useEffect(() => {
		if (!appointments) {
			getFutureAppointments();
		}
		const interval = setInterval(() => {
			getFutureAppointments();
		}, 15000);
		return () => clearInterval(interval);
	  }, []);

	const getFutureAppointments = () => (
		adminService
			.getAppointments(token)
			.then(data => {
				if (data.success) {
					setAppointments(data.appointments);
				} else if (!data.authenticated) {
					history.push('/login');
				} else {
					ToastsStore.error('Error fetching appointments');
				}
			})
			.catch(err => ToastsStore.error('Error fetching appointments'))
    );

	return (
		<Grid container>
			<Grid item xs={12}>
				<LiveStatusTable
					appointments={appointments}
				/>
				<LiveDoctorsTable doctors={doctors} />
			</Grid>
		</Grid>
	);
};

export default memo(AppointmentLiveStatus);
