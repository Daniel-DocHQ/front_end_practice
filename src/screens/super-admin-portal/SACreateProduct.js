import React, { useContext } from 'react';
import * as Yup from 'yup';
import { get } from 'lodash';
import { Formik } from 'formik';
import { ToastsStore } from 'react-toasts';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';
import adminService from '../../services/adminService';
import ProductForm from '../../components/SAComponents/ProductForm';
import { PRODUCT_USER_NAMES } from '../../helpers/permissions';
import ProductAppBar from '../../components/SAComponents/ProductAppBar';

const SACreateProduct = ({ token, role, isAuthenticated, user }) => {
	const userName = `${get(user, 'first_name', '')} ${get(user, 'last_name', '')}`;
    const { logout } = useContext(AuthContext);
	let history = useHistory();
	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if ((isAuthenticated !== true && role !== 'super_admin') || (!!user && !PRODUCT_USER_NAMES.includes(userName))) {
		logoutUser();
	}

	return (
        <ProductAppBar value={1}>
            <BigWhiteContainer>
                <Formik
                    initialValues={{
                        title: '',
                        sku: '',
                        price: '',
                        type: '',
                        description: '',
                        lab: '',
                        country: 'UK',
                        active: 1,
                    }}
                    validationSchema={Yup.object().shape({
                        title: Yup.string().required('Input title'),
                        sku: Yup.string().required('Input sku'),
                        country: Yup.string().required('Input country'),
                        price: Yup.number().required('Input price'),
                        type: Yup.string().required('Input type'),
                    })}
                    onSubmit={async (values) => {
                        await adminService.createProduct(token, values).then((response) => {
                            if (response.success && response.data) {
                                history.push(`/super_admin/product/${response.data.id}`);
                            } else {
                                ToastsStore.error(response.error);
                            }
                        })
                        .catch((err) => ToastsStore.error(err.error));
                    }}
                >
                    <ProductForm isEdit />
                </Formik>
            </BigWhiteContainer>
        </ProductAppBar>
	);
};

export default SACreateProduct;
