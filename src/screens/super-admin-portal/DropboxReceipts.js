import React, { useState, useContext, useEffect } from 'react';
import { get } from 'lodash';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ReceiptsTable from '../../components/SAComponents/Tables/ReceiptsTable';

const DropboxReceipts = ({ token, isAuthenticated, role }) => {
    const { id } = useParams();
	const { logout } = useContext(AuthContext);
	const [dropbox, setDropbox] = useState();
    const [receipts, setReceipts] = useState();
    const [date, setDate] = useState(new Date());
    const dropboxName = `${get(dropbox, 'facility.name', '')} - ${get(dropbox, 'facility.city', '')}`;
    const [isLoading, setIsLoading] = useState(false);
	let history = useHistory();


    const getDropbox = async () => {
        setIsLoading(true);
		await adminService
			.getDropbox(id, token)
			.then(data => {
				if (data.success) {
					setDropbox(data.dropbox);
				} else if (!data.authenticated) {
					logoutUser();
				} else {
					ToastsStore.error('Error fetching Drop Boxes');
				}
			})
			.catch(err => ToastsStore.error('Error fetching Drop Boxes'));
        await adminService
			.getDropboxReceipts(id, moment.utc(date).startOf('day').format(), token)
			.then(data => {
				if (data.success) {
					setReceipts(data.receipts);
				} else if (!data.authenticated) {
					logoutUser();
				} else {
					ToastsStore.error('Error fetching Drop Boxes');
				}
			})
			.catch(err => ToastsStore.error('Error fetching Drop Boxes'));
        setIsLoading(false);
    };

    const getReceipts = async () => {
        setIsLoading(true);
        await adminService
			.getDropboxReceipts(id, moment.utc(date).startOf('day').format(), token)
			.then(data => {
				if (data.success) {
					setReceipts(data.receipts);
				} else if (!data.authenticated) {
					logoutUser();
				} else {
					ToastsStore.error('Error fetching receipts');
				}
			})
			.catch(err => ToastsStore.error('Error fetching receipts'));
        setIsLoading(false);
    };

	const logoutUser = () => {
		logout();
		history.push('/login');
	};

	if (isAuthenticated !== true && role !== 'super_admin') {
		logoutUser();
	}

    useEffect(() => {
		if (!dropbox) {
			getDropbox();
		}
	}, []);

    useEffect(() => {
		getReceipts();
	}, [date]);

    if (isLoading) {
		return (
			<BigWhiteContainer>
				<div className='row center'>
					<LoadingSpinner />
				</div>
			</BigWhiteContainer>
		);
	}

	return (
        <Grid container justify="space-between">
            <Grid item xs={12}>
                <ReceiptsTable
                    date={date}
                    setDate={setDate}
                    dropboxName={dropboxName}
                    receipts={receipts}
                />
            </Grid>
        </Grid>
	);
};

export default DropboxReceipts;
