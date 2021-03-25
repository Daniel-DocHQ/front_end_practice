import React, { useEffect, useState, memo } from 'react';
import AppointmentTable from '../../components/Tables/AppointmentTable';
import PastAppointmentsTable from '../../components/Tables/PastAppointmentsTable';
import nurseService from '../../services/nurseService';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import ClaimableAppointments from '../../components/Tables/ClaimableAppointments';
import bookingService from '../../services/bookingService';
import { Grid } from '@material-ui/core';
import TodayDoctors from '../../components/Tables/TodayDoctors';

const NurseDashboard = props => {
	const [gotAppointments, setGotAppointments] = useState(false);
	const [gotPastAppointments, setGotPastAppointments] = useState(false);
	const [gotClaimable, setGotClaimable] = useState(false);
	const [pastAppointments, setPastAppointments] = useState();
	const [appointments, setAppointments] = useState();
	const [claimableAppointments, setClaimableAppointments] = useState();
	const [isLoading, setIsLoading] = useState(false);
	// const doctors = [
	// 	{
	// 		first_name: 'Bruce',
	// 		last_name: 'Wayne',
	// 		start_time: '2021-03-19T08:30:00Z',
	// 		end_time: '2021-03-19T17:00:00Z',
	// 		start_in: {
	// 			minutes: 5,
	// 			seconds: 59,
	// 		},
	// 		status: 'online',
	// 	},
	// 	{
	// 		first_name: 'Mike',
	// 		last_name: 'Johnson',
	// 		start_time: '2021-03-19T08:30:00Z',
	// 		end_time: '2021-03-19T17:00:00Z',
	// 		start_in: {
	// 			minutes: 4,
	// 			seconds: 23,
	// 		},
	// 		status: 'offline',
	// 	},
	// 	{
	// 		first_name: 'Taylor',
	// 		last_name: 'Xavier',
	// 		start_time: '2021-03-19T08:30:00Z',
	// 		end_time: '2021-03-19T17:00:00Z',
	// 		start_in: {
	// 			minutes: 20,
	// 			seconds: 15,
	// 		},
	// 		status: 'offline',
	// 	},
	// 	{
	// 		first_name: 'Lady',
	// 		last_name: 'Young',
	// 		start_time: '2021-03-19T08:30:00Z',
	// 		end_time: '2021-03-19T17:00:00Z',
	// 		start_in: {
	// 			minutes: 3,
	// 			seconds: 10,
	// 		},
	// 		status: 'online',
	// 	},
	// 	{
	// 		first_name: 'Loureen',
	// 		last_name: 'Ling',
	// 		start_time: '2021-03-19T08:30:00Z',
	// 		end_time: '2021-03-19T17:00:00Z',
	// 		start_in: {
	// 			minutes: 15,
	// 			seconds: 11,
	// 		},
	// 		status: 'offline',
	// 	},
	// ];

	let history = useHistory();
	if (props.isAuthenticated !== true && props.role !== 'practitioner') {
		history.push('/login');
	}
	useEffect(() => {
		if (!isLoading) {
			if (
				typeof props.token !== 'undefined' &&
				!gotAppointments &&
				!gotPastAppointments &&
				!gotClaimable
			) {
				getFutureAppointments();
				getPastAppointments();
				getClaimableAppointments();
				setIsLoading(true);
			}
		}
	});
	function getFutureAppointments() {
		nurseService
			.getAppointments(props.token)
			.then(data => {
				if (data.success) {
					setGotAppointments(true);
					setAppointments(data.appointments);
				} else if (!data.authenticated) {
					history.push('/login');
				} else {
					ToastsStore.error('Error fetching appointments');
				}
			})
			.catch(err => ToastsStore.error('Error fetching appointments'));
	}
	function getPastAppointments() {
		nurseService
			.getPastAppointments(props.token)
			.then(data => {
				if (data.success && data.appointments) {
					setPastAppointments(data.appointments);
				} else if (!data.success && !data.authenticated) {
					history.push('/login');
				} else {
					ToastsStore.error('Error fetching appointments');
				}
				setGotPastAppointments(true);
			})
			.catch(err => ToastsStore.error('Error fetching appointments'));
	}

	function getClaimableAppointments() {
		bookingService
			.getClaimableAppointments(props.token)
			.then(result => {
				if (result.success && result.claimable_appointments) {
					setGotClaimable(true);
					setClaimableAppointments(result.claimable_appointments);
				} else {
					ToastsStore.error('Unable to load claimable appointments');
				}
			})
			.catch(() => ToastsStore.error('Unable to load claimable appointments'));
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
	return (
		<Grid container justify="space-between">
			<Grid item xs={12} md={6}>
				<ClaimableAppointments
					appointments={claimableAppointments}
					claimAppointment={claimAppointment}
				/>
			</Grid>
			<Grid item xs={12} md={6}>
				<AppointmentTable
					releaseAppointment={releaseAppointment}
					appointments={appointments}
				/>
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<PastAppointmentsTable appointments={pastAppointments} />
			</Grid>
			{/* <Grid item xs={12} style={{ paddingTop: 20 }}>
				<TodayDoctors doctors={doctors} />
			</Grid> */}
		</Grid>
	);
};

export default memo(NurseDashboard);
