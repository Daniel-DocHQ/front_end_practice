import React, { useEffect, useState, memo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { ToastsStore } from 'react-toasts';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import DropboxTable from '../../components/SAComponents/Tables/DropboxTable';
import DropboxAppBar from '../../components/SAComponents/DropboxAppBar';

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
        getDropboxes();
	}, []);

	return (
		<DropboxAppBar value={1}>
			<Grid container justify="space-between">
				<Grid item xs={12}>
					<DropboxTable token={token} reload={getDropboxes} dropboxes={dropboxes} />
				</Grid>
			</Grid>
		</DropboxAppBar>
	);
};

export default memo(SADropboxList);
