import React, { useEffect, useState, memo, useContext } from 'react';
import { get } from 'lodash';
import AppointmentTable from '../../components/Tables/AppointmentTable';
import AvailableAppointments from '../../components/Tables/AvailableAppointments';
import PastAppointmentsTable from '../../components/Tables/PastAppointmentsTable';
import nurseService from '../../services/nurseService';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import ClaimableAppointments from '../../components/Tables/ClaimableAppointments';
import bookingService from '../../services/bookingService';
import { Grid } from '@material-ui/core';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const SmDashboard = props => {
	const userId = get(props, 'role.id');
	const { logout } = useContext(AuthContext);
	const [ongoingAppointmentId, setOngoingAppointmentId] = useState();
	const [reload, setReload] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	let history = useHistory();

	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if (props.isAuthenticated !== true && props.role !== 'practitioner') {
		logoutUser();
	}
	function claimAppointment(slot_id) {
		bookingService
			.claimAppointment(props.token, slot_id)
			.then(result => {
				if (result.success) {
					ToastsStore.success('Appointment claimed');
					setReload(!reload);
					// getFutureAppointments();
					// getClaimableAppointments();
				} else {
					ToastsStore.error('Error claiming appointment');
				}
			})
			.catch(() => ToastsStore.error('Error claiming appointment'));
	}
	function releaseAppointment(slot_id) {
		bookingService
			.releaseAppointment(props.token, slot_id)
			.then(result => {
				if (result.success) {
					ToastsStore.success('Appointment released');
					setReload(!reload);
					// getFutureAppointments();
					// getClaimableAppointments();
				} else {
					ToastsStore.error('Error releasing appointment');
				}
			})
			.catch(() => ToastsStore.error('Error releasing appointment'));
	}

	const getPractitionerInfo = () => {
		nurseService
			.getPractitionerInformation(props.token)
			.then(data => {
				if (data.success) {
					setOngoingAppointmentId(localStorage.getItem('appointmentId') || data.appointments.last_atteneded_appointment  || '');
				} else if (!data.authenticated) {
					logoutUser();
				} else {
					ToastsStore.error('Error fetching practitioner information');
				}
			})
			.catch(err => ToastsStore.error('Error fetching practitioner information'))
	}
	const getAllInfo = async () => {
		await getPractitionerInfo();
	};

	useEffect(() => {
		if (typeof props.token !== 'undefined')
			getAllInfo();
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			getAllInfo();
		}, 20000);
		return () => clearInterval(interval);
	}, []);

	return isLoading ? (
		 <div className='row center' style={{ height: '100vh', alignContent: 'center' }}>
			<LoadingSpinner />
		</div>
	) :(
		<Grid container justify="space-between">
			<Grid item xs={12}>
				<ClaimableAppointments
					token={props.token}
					reload={reload}
					claimAppointment={claimAppointment}
				/>
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<AppointmentTable
					ongoingAppointmentId={ongoingAppointmentId}
					releaseAppointment={releaseAppointment}
					reload={reload}
					token={props.token}
					roleId={userId}
				/>
                </Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<PastAppointmentsTable
					token={props.token}
					userId={userId}
				/>
			</Grid>
		</Grid>
	);
};

export default memo(SmDashboard);
