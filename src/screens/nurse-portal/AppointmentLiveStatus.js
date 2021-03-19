import React, { useEffect, useState, memo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import LiveStatusTable from '../../components/Tables/LiveStatusTable';
import nurseService from '../../services/nurseService';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';

const REQUEST_INTERVAL = 30 * 1000; // 30 seconds

const AppointmentLiveStatus = props => {
    const { user } = useContext(AuthContext);
	const [appointments, setAppointments] = useState();

	let history = useHistory();
	if (props.isAuthenticated !== true && props.role !== 'practitioner') {
		history.push('/login');
	}

	useEffect(() => {
		const interval = setInterval(() => {
			if (typeof props.token !== 'undefined') {
				getFutureAppointments();
			}
		}, REQUEST_INTERVAL);
		return () => clearInterval(interval);
	  }, []);

	const getFutureAppointments = () => (
		nurseService
			.getAppointments(props.token)
			.then(data => {
				if (data.success) {
					setAppointments(data.appointments);
				} else if (!data.authenticated) {
					history.push('/login');
				} else {
					ToastsStore.error('Error fetching appointments');
				}
			})
			.catch(err => ToastsStore.error('Error fetching appointments'))
    );

	return (
        <LiveStatusTable
            user={user}
            appointments={appointments}
        />
	);
};

export default memo(AppointmentLiveStatus);
