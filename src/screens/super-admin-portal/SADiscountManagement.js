import React, { useEffect, useState, memo, useContext } from 'react';
import { get } from 'lodash';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { ToastsStore } from 'react-toasts';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import DiscountTable from '../../components/SAComponents/Tables/DiscountTable';
import DiscountAppBar from '../../components/SAComponents/DiscountAppBar';

const SADiscountManagement = ({ token, role, isAuthenticated, user }) => {
    const userName = `${get(user, 'first_name', '')} ${get(user, 'last_name', '')}`;
	const { logout } = useContext(AuthContext);
	const [discounts, setDiscounts] = useState();
    const [usedDiscounts, setUsedDiscounts] = useState();
	let history = useHistory();

	const getDiscounts = async () => (
		adminService
			.getDiscounts(token)
			.then(data => {
				if (data.success) {
                    const discountsToUse = [...data.discounts].filter((item) => !!item.uses);
					setDiscounts(discountsToUse);
                    const usedDiscountCodes = [...data.discounts].filter((item) => !item.uses);
                    setUsedDiscounts(usedDiscountCodes);
				} else {
					ToastsStore.error('Error fetching Discounts');
				}
			})
			.catch(err => ToastsStore.error('Error fetching Discounts'))
    );
	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if ((isAuthenticated !== true && role !== 'super_admin') || (!!user && (userName !== 'Super Admin' && userName !== 'Silva Quattrocchi' && userName !== 'Madhur Srivastava' && userName !== 'Janet Webber'))) {
		logoutUser();
	}

    useEffect(() => {
        getDiscounts();
	}, []);

	return (
        <DiscountAppBar value={0}>
            <Grid container justify="space-between">
                <Grid item xs={12}>
                    <DiscountTable token={token} reload={getDiscounts} discounts={discounts} />
                </Grid>
                <Grid item xs={12}>
                    <DiscountTable isUsed discounts={usedDiscounts} />
                </Grid>
            </Grid>
        </DiscountAppBar>
	);
};

export default memo(SADiscountManagement);
