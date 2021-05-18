import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import { get } from 'lodash';
import moment from 'moment';
import { ToastsStore } from 'react-toasts';
import cityTimezones from 'city-timezones';
import parsePhoneNumber from 'libphonenumber-js'
import BigWhiteContainer from '../Containers/BigWhiteContainer';
import BookingEngineForm from './BookingEngineForm';
import bookingFormModel from './bookingFormModel';
import validationSchema from './validationSchema';
import bookingService from '../../services/bookingService';
import getURLParams from '../../helpers/getURLParams';
import LinkButton from '../DocButton/LinkButton';
import nurseSvc from '../../services/nurseService';
import { AuthContext } from '../../context/AuthContext';
import COUNTRIES from '../../helpers/countries';

const BookingEngine = () => {
	const { token } = useContext(AuthContext);
	const [appointment, setAppointment] = useState();
	const params = getURLParams(window.location.href);
	const appointmentId = params['appointmentId'];
	const bookingUsers = get(appointment, 'booking_users', []);
	const [activeStep, setActiveStep] = useState(0);
	const [activePassenger, setActivePassenger] = useState(0);
	const { formInitialValues } = bookingFormModel;
	const defaultTimeZone = cityTimezones.findFromCityStateProvince('Westminster')[0];
	const defaultCountyCode = COUNTRIES.find(({ country }) => country === 'United Kingdom');
	const currentValidationSchema = validationSchema[activeStep];
	const usersTravelDate = get(bookingUsers, '[0].metadata.travel_date', new Date ());
	const usersTimeZone = get(bookingUsers, '[0].tz_location', defaultTimeZone.timezone);
	const usersTimeZoneObj = cityTimezones.cityMapping.find(({ timezone }) => timezone === usersTimeZone);
	const steps = [
        'How many people will take the test?',
        'Travel Details',
        'Booking Appointment',
        'Passenger Details',
        'Summary',
        'Booking Confirmation',
    ];

	const passengerInitialValues = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		dateOfBirth: '',
		ethnicity: '',
		countryCode: defaultCountyCode,
		sex: 'Female',
		passportNumber: '',
	};

	function handleBack() {
		activeStep === 2 && activePassenger !== 0
			? setActivePassenger(activePassenger - 1)
			: setActiveStep(activeStep - 1);
	}
	function handleNext() {
		setActiveStep(activeStep + 1);
	}

	useEffect(() => {
		if (appointmentId) {
			nurseSvc
            .getAppointmentDetails(appointmentId, token)
            .then(result => {
                if (result.success && result.appointment) {
                    setAppointment(result.appointment);
                } else {
                    ToastsStore.error(`Cannot find appointment details`);
                }
            })
            .catch(() => ToastsStore.error(`Cannot find appointment details`))
		}
	}, []);

	return (
		<BigWhiteContainer>
			{!!appointment && !!bookingUsers.length ? (
				<Formik
					initialValues={{
						...formInitialValues,
						travelDate: new Date(usersTravelDate),
						travelTime: new Date(usersTravelDate),
						testType: {
							quantity: bookingUsers.length,
							product: {
								type: get(bookingUsers, '[0].metadata.test_type', 'Antigen'),
							},
						},
						city: usersTimeZoneObj,
						timezone: usersTimeZoneObj.timezone,
						numberOfPeople: bookingUsers.length,
						passengers: bookingUsers.map(({
							id,
							first_name,
							date_of_birth,
							last_name,
							phone,
							metadata: {
								passport_number,
								test_type,
								short_token,
							},
							...rest
						}) => {
							const parsedPhoneNumber =  parsePhoneNumber(phone);

							return ({
								firstName: first_name,
								lastName: last_name,
								dateOfBirth: moment(date_of_birth).format('DD/MM/YYYY'),
								passportNumber: passport_number,
								test_type,
								countryCode: COUNTRIES.find(({ code, label }) => (code === parsedPhoneNumber.country && label === `+${parsedPhoneNumber.countryCallingCode}`)),
								short_token,
								...rest,
							});
						}),
					}}
					validationSchema={currentValidationSchema}
					onSubmit={async (values, actions) => {
						if (activeStep === 2) {
							const {
								numberOfPeople,
								passengers,
							} = values;
							if (activePassenger === (numberOfPeople  - 1)) {
								actions.setSubmitting(false);
								actions.setTouched({});
								actions.setErrors({});
								handleNext();
							} else {
								if (get(passengers, `[${activePassenger + 1}].firstName`, 'default') === 'default') {
									const newPassengers = [...passengers];
									newPassengers.push({ ...passengerInitialValues });
									actions.setValues({
										...values,
										passengers: newPassengers,
									});
								}
								setActivePassenger(activePassenger + 1);
								actions.setSubmitting(false);
								actions.setTouched({});
								actions.setErrors({});
							}
						} else if (activeStep === 4) {
							const {
								selectedSlot,
								travelDate,
								travelTime,
								passengers,
							} = values;
							const booking_users = passengers.map(({
								firstName,
								lastName,
								dateOfBirth,
								passportNumber,
								test_type,
								phone,
								countryCode,
								short_token,
								...rest
							}) => ({
								first_name: firstName,
								last_name: lastName,
								date_of_birth: moment.utc(dateOfBirth, 'DD/MM/YYYY').format(),
								phone: `${countryCode.label}${phone.trim()}`,
								metadata: {
									travel_date: moment(
										new Date(
											travelDate.getFullYear(),
											travelDate.getMonth(),
											travelDate.getDate(),
											travelTime.getHours(),
											travelTime.getMinutes(),
											0,
										)).format(),
									passport_number: passportNumber,
									test_type,
									short_token,
								},
								...rest,
							}));
							const body = {
								booking_users,
							};
							await bookingService.deleteBooking(appointmentId, token);
							await bookingService
								.paymentRequest(selectedSlot.id, body)
								.then(result => {
									if (result.success && result.confirmation) {
										handleNext();
									} else {
										ToastsStore.error('Something went wrong');
									}
								})
								.catch(() => ToastsStore.error('Something went wrong'));
						} else {
							actions.setTouched({});
							actions.setSubmitting(false);
							actions.setErrors({});
							handleNext();
						}
					}}
				>
					<BookingEngineForm
						isEdit
						activePassenger={activePassenger}
						activeStep={activeStep}
						handleBack={handleBack}
						steps={steps}
					/>
				</Formik>
			) : (
				<>
					<div className="row center">
						<h3>Appointment doesn’t exist</h3>
					</div>
					<div className="row center">
						<LinkButton
							text='Back to Home'
							color='green'
							linkSrc="/customer_services/dashboard"
						/>
					</div>
				</>
			)}
		</BigWhiteContainer>
	);
};

export default BookingEngine;
