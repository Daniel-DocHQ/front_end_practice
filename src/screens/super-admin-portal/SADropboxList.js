import React, { useEffect, useState, memo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { ToastsStore } from 'react-toasts';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import DropboxTable from '../../components/SAComponents/Tables/DropboxTable';

const SADropboxList = ({ token, role, isAuthenticated }) => {
	const { logout } = useContext(AuthContext);
	const [dropboxes, setDropboxes] = useState();
	let history = useHistory();

	const getDropboxes = async () => (
		adminService
			.getDropboxes(token)
			.then(data => {
				if (data.success) {
					setDropboxes(data.dropboxes);
				} else if (!data.authenticated) {
					logoutUser();
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
		if (!dropboxes) {
			getDropboxes();
		}
	}, []);

	return (
		<Grid container justify="space-between">
			<Grid item xs={12}>
				<DropboxTable dropboxes={dropboxes} />
			</Grid>
		</Grid>
	);
};

export default memo(SADropboxList);
