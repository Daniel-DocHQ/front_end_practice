import React, { useEffect, useState, useContext, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import { Grid } from '@material-ui/core';
import LiveStatusTable from '../../components/Tables/LiveStatusTable';
import { AuthContext } from '../../context/AuthContext';
import nurseService from '../../services/nurseService';
import adminService from '../../services/adminService';
import bookingService from '../../services/bookingService';
import LiveDoctorsTable from '../../components/Tables/LiveDoctorsTable';
import UrgentClaimable from '../../components/Tables/UrgentClaimable';

const AppointmentLiveStatus = () => {
	const { token, logout, role, isAuthenticated } = useContext(AuthContext);
	const [claimableAppointments, setClaimableAppointments] = useState();
	const [appointments, setAppointments] = useState();
	const [doctors, setDoctors] = useState();
	let history = useHistory();

	const logoutUser = () => {
		logout();
		history.push('/login');
	};

	if (isAuthenticated !== true && role !== 'practitioner') {
		logoutUser();
	}

	useEffect(() => {
		if (!claimableAppointments) {
			getClaimableAppointments();
		}
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
					logoutUser();
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
					logoutUser();
				} else {
					ToastsStore.error('Error fetching appointments');
				}
			})
			.catch(err => ToastsStore.error('Error fetching appointments'))
    );

	const getClaimableAppointments = async () => {
		await bookingService
			.getClaimableAppointments(token)
			.then(result => {
				if (result.success && result.claimable_appointments) {
					setClaimableAppointments(result.claimable_appointments);
				} else if (!result.success) {
					ToastsStore.error('Unable to load claimable appointments');
				}
			})
			.catch(({ status }) => {
				if (status === 401) {
					logoutUser();
					ToastsStore.error('Token expired');
				} else {
					ToastsStore.error('Unable to load claimable appointments');
				}
			});
	}

	function claimAppointment(slotId) {
		bookingService
			.claimAppointment(token, slotId)
			.then(result => {
				if (result.success) {
					ToastsStore.success('Appointment claimed');
					getClaimableAppointments();
				} else {
					ToastsStore.error('Error claiming appointment');
				}
			})
			.catch(() => ToastsStore.error('Error claiming appointment'));
	}

	return (
		<Grid container>
			<Grid item xs={12}>
				<UrgentClaimable claimAppointment={(slotId) => claimAppointment(slotId)} appointments={claimableAppointments} />
				<LiveStatusTable appointments={appointments} />
				<LiveDoctorsTable doctors={doctors} />
			</Grid>
		</Grid>
	);
};

export default memo(AppointmentLiveStatus);
