import React, { useEffect, useState, useContext, memo } from 'react';
import { get } from 'lodash';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import { Grid } from '@material-ui/core';
import NurseMeeting2 from '../../screens/nurse-portal/NurseMeeting2';
import nurseService from '../../services/nurseService';
import { AuthContext } from '../../context/AuthContext';
import NextAppointmentsTable from '../Tables/NextAppointmentsTable';
import nurseSvc from '../../services/nurseService';
import adminService from '../../services/adminService';

const REQUEST_INTERVAL = 30 * 1000; // 30 seconds

const MyRoomsContainer = () => {
    const { user, token, logout } = useContext(AuthContext);
	const [appointments, setAppointments] = useState();
    const [appointmentId, setAppointmentId] = useState();
    const [holdAppointments, setHoldAppointments] = useState();
	const userId = get(user, 'roles[0].id', 0);
	let history = useHistory();

	const handleSetAppointmentId = async (id) => {
		await nurseSvc.clearPractitionerInformation(token, userId);
		localStorage.setItem('appointmentId', id);
		setAppointmentId(id);
	};

	const logoutUser = () => {
		logout();
		history.push('/login');
	};

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

	const getFutureAppointments = async () => {
		await adminService
			.getNextAppointments({
				token,
				dateRange: {
					start_time: moment().startOf('day').utc(0).format(),
					end_time: moment().endOf('day').utc(0).format(),
				},
				userId,
			})
			.then(data => {
				if (data.success) {
                    const results = data.appointments;
					setAppointments(results.filter((item) => item.status !== 'ON_HOLD'));
                    setHoldAppointments(results.filter((item) => item.status === 'ON_HOLD'));
				} else if (!data.authenticated) {
					logoutUser();
				} else {
					setAppointments([]);
					setHoldAppointments([]);
					ToastsStore.error('Error fetching appointments');
				}
			})
			.catch(err => {
				setAppointments([]);
				setHoldAppointments([]);
				if (!!err && !!err.error)
					ToastsStore.error(err.error);
			});
	};

	useEffect(() => {
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
		</>
	);
};

export default memo(MyRoomsContainer);
