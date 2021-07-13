import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import MyRoomsContainer from '../../components/LiveDashboardComponents/MyRoomsContainer';

const LiveDashboard = (props) => {
    let history = useHistory();

    if (props.isAuthenticated !== true && props.role !== 'practitioner') {
        history.push('/login');
    }

	return (
        <MyRoomsContainer />
	);
};

export default memo(LiveDashboard);



