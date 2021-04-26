import React, { useEffect, useState, memo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import PastAppointmentsTable from '../../components/SAComponents/Tables/PastAppointmentsTable';
import UpcomingAppointmentsTable from '../../components/SAComponents/Tables/UpcomingAppointmentsTable';
import CancelledAppointmentsTable from '../../components/SAComponents/Tables/CancelledAppointmentsTable';
import ClaimableAppointmentsTable from '../../components/SAComponents/Tables/ClaimableAppointmentsTable';
import AvailableAppointmentsTable from '../../components/SAComponents/Tables/AvailableAppointmentsTable';

const DoctorsManagement = props => {
	const { logout } = useContext(AuthContext);
	const [appointments, setAppointments] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const today = new Date();
	today.setHours(0,0,0,0);
	const start_time = new Date(today.setDate(today.getDate() - 30));
	const end_time = new Date(today.setDate(today.getDate() + 30));
	let history = useHistory();

	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if (props.isAuthenticated !== true && props.role !== 'practitioner') {
		logoutUser();
	}

	useEffect(() => {
        (async () => {
			setIsLoading(true);
			await adminService
				.getAllAppointments({
					start_time: start_time.toISOString(),
					end_time: end_time.toISOString(),
				}, props.token)
				.then(data => {
					if (data.success) {
						setAppointments(data.appointments);
					} else if (!data.authenticated) {
						logoutUser();
					}
				})
				.catch(err => {
					console.log(err);
				});
			setIsLoading(false);
		})();
	}, []);

	return isLoading ? (
		 <div className='row center' style={{ height: '100vh', alignContent: 'center' }}>
			<LoadingSpinner />
		</div>
	) :(
		<Grid container justify="space-between">
			<Grid item xs={12}>
				<UpcomingAppointmentsTable
					appointments={appointments.filter(({ status }) => {
						const appStatus = status.toLowerCase();
						return appStatus !== 'canceled' && appStatus !== 'completed' && appStatus !== 'available';
					})}
				/>
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<AvailableAppointmentsTable
					appointments={appointments.filter(({ status }) =>  status.toLowerCase() === 'available')}
				/>
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<ClaimableAppointmentsTable
					appointments={appointments.filter(({ status, user }) => (status.toLowerCase() === 'waiting' && parseFloat(user) < 20))}
				/>
			</Grid>
            <Grid item xs={12} style={{ paddingTop: 20 }}>
				<CancelledAppointmentsTable
					appointments={appointments.filter(({ status }) => status.toLowerCase() === 'canceled')}
				/>
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<PastAppointmentsTable
					appointments={appointments.filter(({ status }) => status.toLowerCase() === 'completed')} />
			</Grid>
		</Grid>
	);
};

export default memo(DoctorsManagement);
