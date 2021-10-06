import React, { useEffect, useState, memo, useContext } from 'react';
import { get } from 'lodash';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { ToastsStore } from 'react-toasts';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import ProductsTable from '../../components/SAComponents/Tables/ProductsTable';
import ProductAppBar from '../../components/SAComponents/ProductAppBar';
import { PRODUCT_USER_NAMES } from '../../helpers/permissions';

const ProductManagement = ({ token, role, isAuthenticated, user }) => {
	const userName = `${get(user, 'first_name', '')} ${get(user, 'last_name', '')}`;
	const { logout } = useContext(AuthContext);
	const [products, setProducts] = useState();
	let history = useHistory();
	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if ((isAuthenticated !== true && role !== 'super_admin') || (!!user && !PRODUCT_USER_NAMES.includes(userName))) {
		logoutUser();
	}

	const getProducts = async () => (
		adminService
			.getProducts(token)
			.then(data => {
				if (data.success) {
					setProducts(data.products);
				} else {
					ToastsStore.error(data.error);
				}
			})
			.catch((err) => ToastsStore.error(err.error))
    );

    useEffect(() => {
        getProducts();
	}, []);

	return (
		<ProductAppBar value={0}>
			<Grid container justify="space-between">
				<Grid item xs={12}>
					<ProductsTable token={token} reload={getProducts} products={products} />
				</Grid>
			</Grid>
		</ProductAppBar>
	);
};

export default memo(ProductManagement);
