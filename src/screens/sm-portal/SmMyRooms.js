import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import MyRoomsContainer from '../../components/LiveDashboardComponents/MyRoomsContainer';
import LiveAppBar from '../../components/LiveDashboardComponents/LiveAppBar';

const SmMyRooms = (props) => {
  let history = useHistory();

  if (props.isAuthenticated !== true) {
    history.push('/login');
  }

	return (
    <LiveAppBar value={1}>
      <MyRoomsContainer {...props} />
    </LiveAppBar>
  );
};

export default memo(SmMyRooms);
