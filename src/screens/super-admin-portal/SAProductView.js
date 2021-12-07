import React, { useState, useContext, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { get } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ProductForm from '../../components/SAComponents/ProductForm';
import { PRODUCT_USER_NAMES } from '../../helpers/permissions';


const SAProductView = ({ token, role, isAuthenticated, user }) => {
    const { id } = useParams();
	let history = useHistory();
    const [product, setProduct] = useState();
	const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
	const userName = `${get(user, 'first_name', '')} ${get(user, 'last_name', '')}`;
    const { logout } = useContext(AuthContext);
	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if ((isAuthenticated !== true && role !== 'super_admin') || (!!user && !PRODUCT_USER_NAMES.includes(userName))) {
		logoutUser();
	}

	const getProduct = async () => {
        setIsLoading(true);
		await adminService
			.getProduct(id, token)
			.then(data => {
				if (data.success) {
					setProduct(data.product);
				} else if (!data.authenticated) {
					logoutUser();
				} else {
					ToastsStore.error(data.error);
				}
			})
			.catch(err => ToastsStore.error(err.err));
        setIsLoading(false);
    };

    useEffect(() => {
		if (!product) {
			getProduct();
		}
	}, []);

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
		<BigWhiteContainer>
			<Formik
				initialValues={{
					...product,
				}}
				validationSchema={Yup.object().shape({
					title: Yup.string().required('Input title'),
					country: Yup.string().required('Input country'),
					price: Yup.number().min(1, 'Minimal price is 1').required('Input price'),
				})}
				onSubmit={async (values) => {
					await adminService.editProduct(id, token, values).then((response) => {
						if (response.success) {
							setIsEdit(false);
							history.push(`/super_admin/product/${id}`);
						} else {
							ToastsStore.error(response.error);
						}
					})
					.catch((err) => ToastsStore.error(err.error));
				}}
			>
				<ProductForm isView isEdit={isEdit} setIsEdit={setIsEdit} />
			</Formik>
		</BigWhiteContainer>
	);
};

export default SAProductView;
