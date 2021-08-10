import React, { useEffect, useState, memo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import { ToastsStore } from 'react-toasts';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import TodayDoctors from '../../components/Tables/TodayDoctors';
import nurseSvc from '../../services/nurseService';
import LiveStatusTable from '../../components/Tables/LiveStatusTable';
import bookingService from '../../services/bookingService';

const LiveDoctorsManagement = ({ token, role, isAuthenticated }) => {
	const { logout } = useContext(AuthContext);
	const today = moment();
	const [appointments, setAppointments] = useState();
	const [doctors, setDoctors] = useState();
	let history = useHistory();

	const getTodayDoctors = async () => {
		nurseSvc
			.getTodayDoctors(token)
			.then(data => {
				if (data.success) {
					setDoctors(data.appointments);
				} else if (!data.authenticated) {
					logoutUser();
				} else {
					ToastsStore.error('Error fetching doctors');
				}
			})
			.catch(err => ToastsStore.error('Error fetching doctors'));
	}

	const releaseAppointment = (slot_id) => {
		bookingService
			.releaseAppointment(token, slot_id)
			.then(result => {
				if (result.success) {
					ToastsStore.success('Appointment released');
					getFutureAppointments()
				} else {
					ToastsStore.error('Error releasing appointment');
				}
			})
			.catch(() => ToastsStore.error('Error releasing appointment'));
	}

	const getFutureAppointments = async () => (
		adminService
			.getLiveAppointments({
				token,
				dateRange: {
					start_time: moment(today).utc(0).startOf('day').format(),
					end_time: moment(today).add(15, 'minutes').utc(0).format(),
				},
			})
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
	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if (isAuthenticated !== true && role !== 'super_admin') {
		logoutUser();
	}

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

	return (
		<Grid container justify="space-between">
			<Grid item xs={12}>
				<TodayDoctors doctors={doctors} />
			</Grid>
            <Grid item xs={12} style={{ paddingTop: 20 }}>
                <LiveStatusTable
					releaseAppointment={releaseAppointment}
					appointments={appointments}
				/>
            </Grid>
		</Grid>
	);
};

export default memo(LiveDoctorsManagement);
