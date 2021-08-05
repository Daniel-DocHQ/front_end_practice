import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import MyRoomsContainer from '../../components/LiveDashboardComponents/MyRoomsContainer';
import LiveAppBar from '../../components/LiveDashboardComponents/LiveAppBar';

const MyRooms = (props) => {
  let history = useHistory();

  if (props.isAuthenticated !== true && props.role !== 'practitioner') {
    history.push('/login');
  }

	return (
    <LiveAppBar value={1}>
      <MyRoomsContainer {...props} />
    </LiveAppBar>
  );
};

export default memo(MyRooms);
