import React, { memo, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { ToastsStore } from 'react-toasts';
import { AuthContext } from '../../context/AuthContext';
import PastAppointmentsTable from '../../components/SAComponents/Tables/PastAppointmentsTable';
import UpcomingAppointmentsTable from '../../components/SAComponents/Tables/UpcomingAppointmentsTable';
import ClaimableAppointmentsTable from '../../components/SAComponents/Tables/ClaimableAppointmentsTable';
import AvailableAppointmentsTable from '../../components/SAComponents/Tables/AvailableAppointmentsTable';
import bookingService from '../../services/bookingService';
import ShiftOverview from '../../components/Tables/ShiftOverview';
import AvailabilityPercentage from '../../components/SAComponents/Tables/AvailabilityPercentage';

const DoctorsManagement = ({ token, role, isAuthenticated }) => {
	const [reload, setReload] = useState(false);
	const { logout } = useContext(AuthContext);
	let history = useHistory();
	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if (isAuthenticated !== true && role !== 'practitioner') {
		logoutUser();
	};

	const releaseAppointment = (slot_id) => {
		bookingService
			.releaseAppointment(token, slot_id)
			.then(result => {
				if (result.success) {
					ToastsStore.success('Appointment released');
					setReload(!reload);
				} else {
					ToastsStore.error('Error releasing appointment');
				}
			})
			.catch(() => ToastsStore.error('Error releasing appointment'));
	}

	return (
        <Grid container justify="space-between">
			<Grid item xs={12}>
				<ClaimableAppointmentsTable token={token} reload={reload} />
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<UpcomingAppointmentsTable
					releaseAppointment={releaseAppointment}
					token={token}
					reload={reload}
				/>
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<ShiftOverview token={token} isTimeFilters />
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<PastAppointmentsTable token={token} />
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<AvailableAppointmentsTable token={token} />
			</Grid>
			<Grid item xs={12} style={{ paddingTop: 20 }}>
				<AvailabilityPercentage token={token} />
			</Grid>
		</Grid>
	);
};

export default memo(DoctorsManagement);
