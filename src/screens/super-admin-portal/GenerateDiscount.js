import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Alert } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import DiscountForm from '../../components/SAComponents/DiscountForm';

const GenerateDiscount = ({ token, isAuthenticated, role }) => {
	const { logout } = useContext(AuthContext);
	const today = new Date();
	const [status, setStatus] = useState(); // { severity, message }
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
					code: '',
                    type: '',
                    value: '',
                    active_from: today,
                    active_to: new Date(new Date().setFullYear(today.getFullYear() + 1)),
                    uses: '',
				}}
				validationSchema={Yup.object().shape({
					code: Yup.string().required('Input discount unique code'),
					type: Yup.string().required('Select discount type'),
					value: Yup.number().required('Input value'),
					active_from: Yup.date().required('Input start date'),
					active_to: Yup.date().required('Select end date'),
                    uses: Yup.number().required('Input uses quantity'),
				})}
				onSubmit={async (values) => {
					await adminService.generateDiscount(token, {
                        active: true,
                        ...values,
                    }).then((response) => {
						if (response.success) {
							setStatus({ severity: 'success', message: 'Discount successfully generated.' });
						} else {
							ToastsStore.error(response.error);
							setStatus({ severity: 'error', message: response.error });
						}
					})
					.catch((err) => setStatus({ severity: 'error', message: err.error }));
				}}
			>
				<DiscountForm />
			</Formik>
			{typeof status !== 'undefined' && (
				<div className='row center'>
					<Alert severity={status.severity} variant='outlined'>
						{status.message}
					</Alert>
				</div>
			)}
		</BigWhiteContainer>
	);
};

export default GenerateDiscount;
