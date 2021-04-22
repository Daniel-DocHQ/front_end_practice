import React, { useEffect, useState, memo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import { Grid } from '@material-ui/core';
import nurseService from '../../services/nurseService';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import PastAppointmentsTable from '../../components/SAComponents/Tables/PastAppointmentsTable';
import UpcomingAppointmentsTable from '../../components/SAComponents/Tables/UpcomingAppointmentsTable';
import CancelledAppointmentsTable from '../../components/SAComponents/Tables/CancelledAppointmentsTable';

const DoctorsManagement = props => {
	const { logout } = useContext(AuthContext);
	const [pastAppointments, setPastAppointments] = useState();
	const [appointments, setAppointments] = useState();
    const [cancelledAppointments, setCancelledAppointments] = useState();
	const [isLoading, setIsLoading] = useState(true);
	let history = useHistory();

	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if (props.isAuthenticated !== true && props.role !== 'practitioner') {
		logoutUser();
	}

    const getCancelledAppointments = async () => {
		await nurseService
			.getAppointments(props.token)
			.then(data => {
				if (data.success) {
					setCancelledAppointments(data.appointments);
				} else if (!data.authenticated) {
					logoutUser();
				} else {
					ToastsStore.error('Error fetching appointments');
				}
			})
			.catch(err => ToastsStore.error('Error fetching appointments'));
	}

	const getFutureAppointments = async () => {
		await nurseService
			.getAppointments(props.token)
			.then(data => {
				if (data.success) {
					setAppointments(data.appointments);
				} else if (!data.authenticated) {
					logoutUser();
				} else {
					ToastsStore.error('Error fetching appointments');
				}
			})
			.catch(err => ToastsStore.error('Error fetching appointments'));
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
			})
			.catch(err => ToastsStore.error('Error fetching appointments'));
	}


	const getAllInfo = async () => {
		await setIsLoading(true);
		await getFutureAppointments();
		await getPastAppointments();
        await getCancelledAppointments()
		await setIsLoading(false);
	};

	useEffect(() => {
        getAllInfo();
	}, []);

	return isLoading ? (
		 <div className='row center' style={{ height: '100vh', alignContent: 'center' }}>
			<LoadingSpinner />
		</div>
	) :(
		<Grid container justify="space-between">
			<Grid item xs={12}>
				<UpcomingAppointmentsTable
					appointments={appointments}
				/>
			</Grid>
            <Grid item xs={12} style={{ paddingTop: 20 }}>
				<CancelledAppointmentsTable appointments={cancelledAppointments} />
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<PastAppointmentsTable appointments={pastAppointments} />
			</Grid>
		</Grid>
	);
};

export default memo(DoctorsManagement);
