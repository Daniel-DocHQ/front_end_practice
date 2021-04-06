import React, { useEffect, useState, useContext, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import { Grid } from '@material-ui/core';
import LiveStatusTable from '../../components/Tables/LiveStatusTable';
import { AuthContext } from '../../context/AuthContext';
import nurseService from '../../services/nurseService';
import adminService from '../../services/adminService';
import LiveDoctorsTable from '../../components/Tables/LiveDoctorsTable';

const AppointmentLiveStatus = () => {
	const { token } = useContext(AuthContext);
	const [appointments, setAppointments] = useState();
	const [doctors, setDoctors] = useState();
	let history = useHistory();

	useEffect(() => {
		if (!appointments) {
			getFutureAppointments();
		}
		if (!doctors) {
			getTodayDoctors();
		}
		const interval = setInterval(() => {
			getFutureAppointments();
			getTodayDoctors();
		}, 15000);
		return () => clearInterval(interval);
	}, []);

	function getTodayDoctors() {
		nurseService
			.getTodayDoctors(token)
			.then(data => {
				if (data.success) {
					setDoctors(data.appointments);
				} else if (!data.authenticated) {
					history.push('/login');
				} else {
					ToastsStore.error('Error fetching appointments');
				}
			})
			.catch(err => ToastsStore.error('Error fetching appointments'));
	}

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
				<LiveStatusTable appointments={appointments} />
				<LiveDoctorsTable doctors={doctors} />
			</Grid>
		</Grid>
	);
};

export default memo(AppointmentLiveStatus);
