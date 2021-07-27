import 'date-fns';
import React, { memo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { AuthContext } from '../../context/AuthContext';
import PastAppointmentsTable from '../../components/SAComponents/Tables/PastAppointmentsTable';
import UpcomingAppointmentsTable from '../../components/SAComponents/Tables/UpcomingAppointmentsTable';
import ClaimableAppointmentsTable from '../../components/SAComponents/Tables/ClaimableAppointmentsTable';
import AvailableAppointmentsTable from '../../components/SAComponents/Tables/AvailableAppointmentsTable';

const DoctorsManagement = ({ token, role, isAuthenticated }) => {
	const { logout } = useContext(AuthContext);
	let history = useHistory();
	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if (isAuthenticated !== true && role !== 'practitioner') {
		logoutUser();
	};

	return (
        <Grid container justify="space-between">
			<Grid item xs={12}>
				<UpcomingAppointmentsTable token={token} />
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<AvailableAppointmentsTable token={token} />
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<ClaimableAppointmentsTable token={token} />
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<PastAppointmentsTable token={token} />
			</Grid>
		</Grid>
	);
};

export default memo(DoctorsManagement);
