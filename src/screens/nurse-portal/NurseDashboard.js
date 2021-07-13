import React, { useEffect, useState, memo, useContext } from 'react';
import AppointmentTable from '../../components/Tables/AppointmentTable';
import PastAppointmentsTable from '../../components/Tables/PastAppointmentsTable';
import nurseService from '../../services/nurseService';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import ClaimableAppointments from '../../components/Tables/ClaimableAppointments';
import bookingService from '../../services/bookingService';
import { Grid } from '@material-ui/core';
import TodayDoctors from '../../components/Tables/TodayDoctors';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const NurseDashboard = props => {
	const { logout } = useContext(AuthContext);
	const [gotAppointments, setGotAppointments] = useState(false);
	const [gotPastAppointments, setGotPastAppointments] = useState(false);
	const [gotClaimable, setGotClaimable] = useState(false);
	const [pastAppointments, setPastAppointments] = useState();
	const [ongoingAppointmentId, setOngoingAppointmentId] = useState();
	const [appointments, setAppointments] = useState();
	const [claimableAppointments, setClaimableAppointments] = useState();
	const [todayDoctors, setTodayDoctors] = useState();
	const [isLoading, setIsLoading] = useState(true);
	let history = useHistory();

	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if (props.isAuthenticated !== true && props.role !== 'practitioner') {
		logoutUser();
	}

	const getFutureAppointments = async () => {
		await nurseService
			.getAppointments(props.token)
			.then(data => {
				if (data.success) {
					setGotAppointments(true);
					setAppointments(data.appointments);
				} else if (!data.authenticated) {
					logoutUser();
				} else {
					ToastsStore.error('Error fetching appointments');
				}
			})
			.catch(err => ToastsStore.error('Error fetching appointments'));
	}
	const getTodayDoctors = async () => {
		await nurseService
			.getTodayDoctors(props.token)
			.then(data => {
				if (data.success) {
					setTodayDoctors(data.appointments);
				} else if (!data.authenticated) {
					logoutUser();
				} else {
					ToastsStore.error('Error fetching doctors');
				}
			})
			.catch(err => ToastsStore.error('Error fetching doctors'));
	}
	const getPastAppointments = async () => {
		await nurseService
			.getPastAppointments(props.token)
			.then(data => {
				if (data.success && data.appointments) {
					setPastAppointments(data.appointments);
				} else if (!data.success && !data.authenticated) {
					logoutUser();
				} else {
					ToastsStore.error('Error fetching appointments');
				}
				setGotPastAppointments(true);
			})
			.catch(err => ToastsStore.error('Error fetching appointments'));
	}

	const getClaimableAppointments = async () => {
		await bookingService
			.getClaimableAppointments(props.token)
			.then(result => {
				if (result.success && result.claimable_appointments) {
					setGotClaimable(true);
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
	function claimAppointment(slot_id) {
		bookingService
			.claimAppointment(props.token, slot_id)
			.then(result => {
				if (result.success) {
					ToastsStore.success('Appointment claimed');
					getFutureAppointments();
					getClaimableAppointments();
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
					getFutureAppointments();
					getClaimableAppointments();
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
					setOngoingAppointmentId(data.appointments.last_atteneded_appointment || localStorage.getItem('appointmentId') || '');
				} else if (!data.authenticated) {
					logoutUser();
				} else {
					ToastsStore.error('Error fetching practitioner information');
				}
			})
			.catch(err => ToastsStore.error('Error fetching practitioner information'))
	}

	const getAllInfo = async () => {
		await setIsLoading(true);
		await getFutureAppointments();
		await getPastAppointments();
		await getTodayDoctors();
		await getClaimableAppointments();
		await getPractitionerInfo();
		await setIsLoading(false);
	};

	useEffect(() => {
		if (
			typeof props.token !== 'undefined' &&
			!gotAppointments &&
			!gotPastAppointments &&
			!gotClaimable
		) {
			getAllInfo();
		}
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			getAllInfo();
		}, 15000);
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
					appointments={claimableAppointments}
					claimAppointment={claimAppointment}
				/>
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<AppointmentTable
					ongoingAppointmentId={ongoingAppointmentId}
					releaseAppointment={releaseAppointment}
					appointments={appointments}
				/>
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<PastAppointmentsTable appointments={pastAppointments} />
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<TodayDoctors doctors={todayDoctors} />
			</Grid>
		</Grid>
	);
};

export default memo(NurseDashboard);
