import React, { useState, useContext, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import moment from 'moment';
import { get } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import WeekDays from '../../helpers/weekDays';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';
import DropboxForm from '../../components/SAComponents/DropboxForm';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const setDayTime = (time) => {
    const [hours, minutes] = time.split(':');

    return (new Date(new Date(new Date().setHours(hours)).setMinutes(minutes)));
};

const SADropboxView = ({ token, isAuthenticated, role }) => {
    const { id } = useParams();
	const { logout } = useContext(AuthContext);
	const [dropbox, setDropbox] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const facility = get(dropbox, 'facility', {});
    const opening_times = get(dropbox, 'opening_times', []);
	let history = useHistory();

	const getDropbox = async () => {
        setIsLoading(true);
		await adminService
			.getDropbox(id, token)
			.then(data => {
				if (data.success) {
					setDropbox(data.dropbox);
				} else if (!data.authenticated) {
					logoutUser();
				} else {
					ToastsStore.error('Error fetching Drop Boxes');
				}
			})
			.catch(err => ToastsStore.error('Error fetching Drop Boxes'));
        setIsLoading(false);
    };
	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if (isAuthenticated !== true && role !== 'super_admin') {
		logoutUser();
	}

    useEffect(() => {
		if (!dropbox) {
			getDropbox();
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
					...facility,
                    address_1: facility.address_1,
					opening_times: WeekDays.map(({ weekday, ...rest }) => {
                        const day = opening_times.find((item) => item.weekday === weekday);
                        const start_hour = !!day && !!day.start_hour
                            ?  setDayTime(day.start_hour)
                            : rest.start_hour;
                        const end_hour = !!day && !!day.end_hour
                            ?  setDayTime(day.end_hour)
                            : rest.start_hour;
                        return ({
                            ...rest,
                            ...day,
                            end_hour,
                            start_hour,
                            active: !!day && !!day.weekday,
                        });
                    }),
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
				<DropboxForm isView />
			</Formik>
		</BigWhiteContainer>
	);
};

export default SADropboxView;
