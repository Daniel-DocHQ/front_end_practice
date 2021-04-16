import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import AppointmentLiveStatus from '../../components/LiveDashboardComponents/AppointmentLiveStatus';
import LiveAppBar from '../../components/LiveDashboardComponents/LiveAppBar';

const LiveDashboard = (props) => {
    let history = useHistory();

    if (props.isAuthenticated !== true && props.role !== 'practitioner') {
        history.push('/login');
    }

	return (
        <LiveAppBar value={0}>
            <AppointmentLiveStatus />
        </LiveAppBar>
	);
};

export default memo(LiveDashboard);



