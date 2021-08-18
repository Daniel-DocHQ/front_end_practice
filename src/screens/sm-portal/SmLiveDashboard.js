import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import LiveAppBar from '../../components/LiveDashboardComponents/LiveAppBar';
import LiveDoctorsManagement from '../super-admin-portal/LiveDoctorsManagement';

const SmLiveDashboard = (props) => {
    let history = useHistory();

    if (props.isAuthenticated !== true) {
        history.push('/login');
    }

	return (
        <LiveAppBar value={0}>
            <LiveDoctorsManagement {...props} />
        </LiveAppBar>
	);
};

export default memo(SmLiveDashboard);



