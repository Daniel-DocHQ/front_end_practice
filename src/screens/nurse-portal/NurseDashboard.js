import React, { useEffect, useState, useContext, memo } from 'react';
import AppointmentTable from '../../components/Tables/AppointmentTable';
import PastAppointmentsTable from '../../components/Tables/PastAppointmentsTable';
import NurseNavBar from '../../components/NurseNavBar/NurseNavBar';
import { UserContext } from '../../context/UserContext';
import nurseService from '../../services/nurseService';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import ClaimableAppointments from '../../components/Tables/ClaimableAppointments';
import bookingService from '../../services/bookingService';

const NurseDashboard = props => {
	const [gotAppointments, setGotAppointments] = useState(false);
	const [gotPastAppointments, setGotPastAppointments] = useState(false);
	const [gotClaimable, setGotClaimable] = useState(false);
	const [pastAppointments, setPastAppointments] = useState();
	const [appointments, setAppointments] = useState();
	const [claimableAppointments, setClaimableAppointments] = useState();
	const [isLoading, setIsLoading] = useState(false);

	let history = useHistory();
	if (props.isAuthenticated !== true && props.role !== 'practitioner') {
		history.push('/login');
	}
	// eslint-disable-next-line
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
					ToastsStore.success(
						`Found ${
							typeof data.appointments === 'object' ? data.appointments.length : 0
						} future appointments`
					);
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
					ToastsStore.success(
						`Found ${
							typeof data.appointments === 'object' ? data.appointments.length : 0
						} past appointments`
					);
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
		<React.Fragment>
			<div className='row center'>
				<div className='doc-container' style={{ width: '1000px', maxWidth: '90%' }}>
					<AppointmentTable 
						releaseAppointment={releaseAppointment}
						appointments={appointments}
						refresh={getFutureAppointments}
					/>
				</div>
			</div>
			<div className='row center'>
				<div className='doc-container' style={{ width: '1000px', maxWidth: '90%' }}>
					<PastAppointmentsTable appointments={pastAppointments} refresh={getPastAppointments} />
				</div>
			</div>
			<div className='row center'>
				<ClaimableAppointments
					appointments={claimableAppointments}
					claimAppointment={claimAppointment}
					refresh={getClaimableAppointments}
				/>
			</div>
		</React.Fragment>
	);
};

export default memo(NurseDashboard);
