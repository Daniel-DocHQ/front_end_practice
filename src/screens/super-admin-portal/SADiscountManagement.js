import React, { useEffect, useState, memo, useContext } from 'react';
import { get } from 'lodash';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { ToastsStore } from 'react-toasts';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import DiscountTable from '../../components/SAComponents/Tables/DiscountTable';
import DiscountAppBar from '../../components/SAComponents/DiscountAppBar';
import { DISCOUNT_USER_NAMES } from '../../helpers/permissions';

const SADiscountManagement = ({ token, role, isAuthenticated, user }) => {
    const userName = `${get(user, 'first_name', '')} ${get(user, 'last_name', '')}`;
	const { logout } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const [discounts, setDiscounts] = useState();
    const [usedDiscounts, setUsedDiscounts] = useState();
	let history = useHistory();

	const getDiscounts = async () => {
		setLoading(true);
		await adminService
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
			.catch(err => ToastsStore.error('Error fetching Discounts'));
		setLoading(false);
	};
	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if ((isAuthenticated !== true && role !== 'super_admin') || (!!user && !DISCOUNT_USER_NAMES.includes(userName))) {
		logoutUser();
	}

    useEffect(() => {
        getDiscounts();
	}, []);

	return (
        <DiscountAppBar value={1}>
            <Grid container justify="space-between">
                <Grid item xs={12}>
                    <DiscountTable
						token={token}
						loading={loading}
						reload={getDiscounts}
						discounts={discounts}
					/>
                </Grid>
                <Grid item xs={12}>
                    <DiscountTable
						isUsed
						loading={loading}
						discounts={usedDiscounts}
					/>
                </Grid>
            </Grid>
        </DiscountAppBar>
	);
};

export default memo(SADiscountManagement);
