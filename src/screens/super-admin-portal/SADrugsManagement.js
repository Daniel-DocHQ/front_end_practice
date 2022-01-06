import React, { useEffect, useState, memo } from 'react';
import { Grid } from '@material-ui/core';
import { ToastsStore } from 'react-toasts';
import adminService from '../../services/adminService';
import DrugsTable from '../../components/SAComponents/Tables/DrugsTable';
import DrugsAppBar from '../../components/SAComponents/DrugsAppBar';

const SADrugsManagement = ({ token }) => {
	const [drugs, setDrugs] = useState();
	const [loading, setLoading] = useState(false);

	const getDrugs = async () => {
        setLoading(true);
		await adminService
			.getDrugs(token)
			.then(data => {
				if (data.success) {
					setDrugs(data.drugs);
				} else {
					ToastsStore.error('Error fetching Drugs');
				}
			})
			.catch(err => ToastsStore.error(err.error))
        setLoading(false);
    };

    useEffect(() => {
        getDrugs();
	}, []);

	return (
        <DrugsAppBar value={0}>
            <Grid container justify="space-between">
                <Grid item xs={12}>
                    <DrugsTable
                        token={token}
                        reload={getDrugs}
                        drugs={drugs}
                        loading={loading}
                    />
                </Grid>
            </Grid>
        </DrugsAppBar>
	);
};

export default memo(SADrugsManagement);
