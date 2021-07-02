import React from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { Formik } from 'formik';
import { ToastsStore } from 'react-toasts';
import { useHistory } from 'react-router-dom';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';
import DropboxForm from '../../components/SAComponents/DropboxForm';
import adminService from '../../services/adminService';
import WeekDays from '../../helpers/weekDays';

const SACreateDropbox = ({ token }) => {
	let history = useHistory();

	return (
		<BigWhiteContainer>
			<Formik
				initialValues={{
					address_1: '',
					address_2: '',
					city: '',
					country: '',
					county: '',
					name: '',
					postcode : '',
					type: '',
					first_name: '',
					last_name: '',
					phone: '',
					email: '',
					opening_times: WeekDays,
				}}
				validationSchema={Yup.object().shape({
					address_1: Yup.string().required('Input address line'),
					city: Yup.string().required('Input city'),
					name: Yup.string().required('Input name'),
					county: Yup.string().required('Input county'),
					postcode: Yup.string().required('Input postcode'),
				})}
				onSubmit={async (values) => {
					const {
						address_1,
						address_2,
						city,
						country,
						county,
						name,
						postcode,
						type,
						opening_times,
						first_name,
						last_name,
						phone,
						email,
					} = values;
					await adminService.createDropbox(token, {
						facility: {
							address_1,
							address_2,
							city,
							country,
							county,
							name,
							postcode,
							type,
							first_name,
							last_name,
							phone,
							email,
						},
						opening_times: opening_times
							.filter(({ active }) => active)
							.map(({ start_hour, end_hour, ...rest }) => ({
								...rest,
								start_hour: moment(start_hour).format('HH:mm'),
								end_hour: moment(end_hour).format('HH:mm'),
							})),
					}).then((response) => {
						if (response.success && response.data) {
							history.push(`/super_admin/dropbox/${response.data.id}`);
						} else {
							ToastsStore.error('Something went wrong');
						}
					})
					.catch(() => ToastsStore.error('Something went wrong'));
				}}
			>
				<DropboxForm />
			</Formik>
		</BigWhiteContainer>
	);
};

export default SACreateDropbox;
