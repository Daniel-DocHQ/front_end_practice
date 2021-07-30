import React, { useEffect, useState, useContext, memo } from 'react';
import { get } from 'lodash';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import { Grid } from '@material-ui/core';
import NurseMeeting2 from '../../screens/nurse-portal/NurseMeeting2';
import nurseService from '../../services/nurseService';
import { AuthContext } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import UrgentClaimable from '../Tables/UrgentClaimable';
import NextAppointmentsTable from '../Tables/NextAppointmentsTable';
import nurseSvc from '../../services/nurseService';

const REQUEST_INTERVAL = 30 * 1000; // 30 seconds

const MyRoomsContainer = () => {
    const { user, token, logout } = useContext(AuthContext);
	const [appointments, setAppointments] = useState();
	const [claimableAppointments, setClaimableAppointments] = useState();
    const [appointmentId, setAppointmentId] = useState();
    const [holdAppointments, setHoldAppointments] = useState();
	let history = useHistory();

	const handleSetAppointmentId = async (id) => {
		await nurseSvc.clearPractitionerInformation(token, get(user, 'roles[0].id', 0));
		localStorage.setItem('appointmentId', id);
		setAppointmentId(id);
	};

	const logoutUser = () => {
		logout();
		history.push('/login');
	};

	useEffect(() => {
		if (!claimableAppointments) {
			getClaimableAppointments();
		}

		if (!appointmentId) {
			getPractitionerInfo();
		}

		const interval = setInterval(() => {
            getFutureAppointments();
		}, REQUEST_INTERVAL);

		return () => clearInterval(interval);
	  }, []);

	useEffect(() => {
		getFutureAppointments();
	}, [appointmentId]);

	const getPractitionerInfo = () => {
		nurseService
			.getPractitionerInformation(token)
			.then(data => {
				if (data.success) {
					handleSetAppointmentId(localStorage.getItem('appointmentId') || data.appointments.last_atteneded_appointment || '');
				} else if (!data.authenticated) {
					logoutUser();
				} else {
					ToastsStore.error('Error fetching practitioner information');
				}
			})
			.catch(err => ToastsStore.error('Error fetching practitioner information'))
	}

	const getFutureAppointments = () => (
		nurseService
			.getAppointments(token)
			.then(data => {
				if (data.success) {
                    const results = data.appointments;
					setAppointments(results.filter((item) => item.status !== 'ON_HOLD'));
                    setHoldAppointments(results.filter((item) => item.status === 'ON_HOLD'));
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
		<>
			<Grid container>
				<Grid item xs={3}>
					<NextAppointmentsTable
						user={user}
						appointmentId={appointmentId}
						join={handleSetAppointmentId}
						nextAppointments={appointments}
						holdAppointments={holdAppointments}
					/>
				</Grid>
				{appointmentId && (
					<Grid item xs={9}>
						<div className='doc-container' style={{ justifyContent: 'unset' }}>
							<NurseMeeting2
								isVideo
								appointmentId={appointmentId}
								hideVideoAppointment={() => {
									localStorage.removeItem('appointmentId');
									setAppointmentId();
								}}
							/>
						</div>
					</Grid>
				)}
			</Grid>
			<Grid container>
				<Grid item xs={6}>
					<UrgentClaimable
						claimAppointment={(slotId) => claimAppointment(slotId)}
						appointments={claimableAppointments}
					/>
				</Grid>
			</Grid>
		</>
	);
};

export default memo(MyRoomsContainer);
