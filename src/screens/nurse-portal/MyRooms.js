import React, { useEffect, useState, memo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import nurseService from '../../services/nurseService';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import NextAppointmentsTable from '../../components/Tables/NextAppointmentsTable';
import { Grid } from '@material-ui/core';
import NurseMeeting2 from './NurseMeeting2';

const REQUEST_INTERVAL = 30 * 1000; // 30 seconds

const MyRooms = ({ appointmentIdParam = '' }) => {
    const { user, token } = useContext(AuthContext);
	const [appointments, setAppointments] = useState();
    const [appointmentId, setAppointmentId] = useState(appointmentIdParam);
    const [holdAppointments, setHoldAppointments] = useState();

	let history = useHistory();

	useEffect(() => {
		const interval = setInterval(() => {
            getFutureAppointments();
		}, REQUEST_INTERVAL);
		return () => clearInterval(interval);
	  }, []);

	useEffect(() => {
		getFutureAppointments();
	}, [appointmentId]);

	const getFutureAppointments = () => (
		nurseService
			.getAppointments(token)
			.then(data => {
				if (data.success) {
                    const results = data.appointments;
					setAppointments(results.filter((item) => item.status !== 'ON_HOLD'));
                    setHoldAppointments(results.filter((item) => item.status === 'ON_HOLD'));
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
            <Grid item xs={3}>
                <NextAppointmentsTable
                    user={user}
					appointmentId={appointmentId}
                    join={(id) => setAppointmentId(id)}
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
							hideVideoAppointment={() => setAppointmentId()}
						/>
                    </div>
                </Grid>
            )}
		</Grid>
	);
};

export default memo(MyRooms);
