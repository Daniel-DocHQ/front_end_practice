import React, { useEffect, useState, memo } from 'react';
import { Grid } from '@material-ui/core';
import { ToastsStore } from 'react-toasts';
import adminService from '../../services/adminService';
import CountriesTable from '../../components/SAComponents/Tables/CountriesTable';
import CountriesAppBar from '../../components/SAComponents/CountriesAppBar';

const SACountriesManagement = ({ token }) => {
	const [countries, setCountries] = useState();
	const [loading, setLoading] = useState(false);

	const getCountries = async () => {
        setLoading(true);
		await adminService
			.getCountries(token)
			.then(data => {
				if (data.success) {
					setCountries(data.countries);
				} else {
					ToastsStore.error('Error fetching Countries');
				}
			})
			.catch(err => ToastsStore.error(err.error))
        setLoading(false);
    };

    useEffect(() => {
        getCountries();
	}, []);

	return (
        <CountriesAppBar value={0}>
            <Grid container justify="space-between">
                <Grid item xs={12}>
                    <CountriesTable
						token={token}
						reload={getCountries}
						countries={countries}
						loading={loading}
					/>
                </Grid>
            </Grid>
        </CountriesAppBar>
	);
};

export default memo(SACountriesManagement);
