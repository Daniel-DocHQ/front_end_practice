import React, { useEffect, useState, memo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { ToastsStore } from 'react-toasts';
import moment from 'moment';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import PickupsTable from '../../components/SAComponents/Tables/PickupsTable';
import DropboxAppBar from '../../components/SAComponents/DropboxAppBar';

const PickupsManagement = ({ token, role, isAuthenticated }) => {
	const { logout } = useContext(AuthContext);
	const [dropboxes, setDropboxes] = useState();
	const [date, setDate] = useState(new Date());
	let history = useHistory();

	const getDropboxes = async () => (
		adminService
			.getPickups(token, moment.utc(date).startOf('day').format())
			.then(data => {
				if (data.success) {
					setDropboxes(data.dropboxes || []);
				} else {
					ToastsStore.error('Error fetching Drop Boxes');
				}
			})
			.catch(err => ToastsStore.error('Error fetching Drop Boxes'))
    );
	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if (isAuthenticated !== true && role !== 'super_admin') {
		logoutUser();
	}

    useEffect(() => {
		setDropboxes([]);
        getDropboxes();
	}, [date]);

	return (
		<DropboxAppBar value={0}>
			<Grid container justify="space-between">
				<Grid item xs={12}>
					<PickupsTable
						date={date}
						token={token}
						setDate={setDate}
						dropboxes={dropboxes}
					/>
				</Grid>
			</Grid>
		</DropboxAppBar>
	);
};

export default memo(PickupsManagement);
