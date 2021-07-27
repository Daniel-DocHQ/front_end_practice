import React, { useContext } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import DiscountForm from '../../components/SAComponents/DiscountForm';

const GenerateDiscount = ({ token, isAuthenticated, role }) => {
	const { logout } = useContext(AuthContext);
	let history = useHistory();
	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if (isAuthenticated !== true && role !== 'super_admin') {
		logoutUser();
	}

	return (
		<BigWhiteContainer>
			<Formik
				initialValues={{
					discount: '',
                    discountType: '',
                    value: '',
                    from: new Date(),
                    to: new Date(),
                    uses: '',
				}}
				validationSchema={Yup.object().shape({
					discount: Yup.string().required('Input discount unique code'),
					discountType: Yup.string().required('Select discount type'),
					value: Yup.number().required('Input value'),
					from: Yup.date().required('Input start date'),
					to: Yup.date().required('Select end date'),
                    uses: Yup.number().required('Input uses quantity'),
				})}
				onSubmit={async (values) => {
					await adminService.generateDiscount(token, {
                        ...values,
                    }).then((response) => {
						if (response.success) {
							ToastsStore.success('Success');
						} else {
							ToastsStore.error(response.error);
						}
					})
					.catch((err) => ToastsStore.error(err.error));
				}}
			>
				<DiscountForm />
			</Formik>
		</BigWhiteContainer>
	);
};

export default GenerateDiscount;
