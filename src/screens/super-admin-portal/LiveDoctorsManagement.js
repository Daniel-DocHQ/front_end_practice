import React, { useEffect, useState, memo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import { ToastsStore } from 'react-toasts';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import LiveStatusTable from '../../components/Tables/LiveStatusTable';
import bookingService from '../../services/bookingService';
import ClaimableAppointmentsTable from '../../components/SAComponents/Tables/ClaimableAppointmentsTable';
import ShiftOverview from '../../components/Tables/ShiftOverview';

const LiveDoctorsManagement = ({ token, role, isAuthenticated }) => {
	const { logout } = useContext(AuthContext);
	const today = moment();
	const [reload, setReload] = useState(false);
	const [appointments, setAppointments] = useState();
	let history = useHistory();

	const releaseAppointment = (slot_id) => {
		bookingService
			.releaseAppointment(token, slot_id)
			.then(result => {
				if (result.success) {
					ToastsStore.success('Appointment released');
					getFutureAppointments();
					setReload(!reload);
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
	if (isAuthenticated !== true && (role !== 'super_admin' || role !== 'shift_manager')) {
		logoutUser();
	}

    useEffect(() => {
		if (!appointments) {
			getFutureAppointments();
		}
		const interval = setInterval(() => {
			getFutureAppointments();
		}, 15000);
		return () => clearInterval(interval);
	}, []);

	return (
		<Grid container justify="space-between">
            <Grid item xs={12}>
                <LiveStatusTable
					releaseAppointment={releaseAppointment}
					appointments={appointments}
				/>
            </Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<ClaimableAppointmentsTable token={token} reload={reload} />
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<ShiftOverview token={token} isTimeFilters />
			</Grid>
		</Grid>
	);
};

export default memo(LiveDoctorsManagement);
