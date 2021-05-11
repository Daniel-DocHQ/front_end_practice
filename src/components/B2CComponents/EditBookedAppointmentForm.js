import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import { get } from 'lodash';
import moment from 'moment';
import { ToastsStore } from 'react-toasts';
import BigWhiteContainer from '../Containers/BigWhiteContainer';
import BookingEngineForm from './BookingEngineForm';
import bookingFormModel from './bookingFormModel';
import validationSchema from './validationSchema';
import bookingService from '../../services/bookingService';
import getURLParams from '../../helpers/getURLParams';
import LinkButton from '../DocButton/LinkButton';
import adminService from '../../services/adminService';
import nurseSvc from '../../services/nurseService';
import { AuthContext } from '../../context/AuthContext';

const BookingEngine = () => {
	const { token } = useContext(AuthContext);
	const [appointment, setAppointment] = useState();
	const params = getURLParams(window.location.href);
	const appointmentId = params['appointmentId'];
	const bookingUsers = get(appointment, 'booking_users', []);
	const [activeStep, setActiveStep] = useState(0);
	const [activePassenger, setActivePassenger] = useState(0);
	const { formInitialValues } = bookingFormModel;
	const currentValidationSchema = validationSchema[activeStep];
	const steps = [
        'How many people will take the test?',
        'Travel Details',
        'Passenger Details',
        'Booking Appointment',
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
						antigenTest: bookingUsers.length,
						passengers: bookingUsers.map(({
							id,
							first_name,
							date_of_birth,
							last_name,
							metadata: {
								passport_number,
							},
							...rest
						}) => ({
							firstName: first_name,
							lastName: last_name,
							dateOfBirth: moment(date_of_birth).format('DD/MM/YYYY'),
							passportNumber: passport_number,
							...rest,
						})),
					}}
					validationSchema={currentValidationSchema}
					onSubmit={async (values, actions) => {
						if (activeStep === 2) {
							const {
								antigenTest,
								pcrTest,
								passengers,
							} = values;
							if (activePassenger === (antigenTest + pcrTest - 1)) {
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
								...rest
							}) => ({
								first_name: firstName,
								last_name: lastName,
								date_of_birth: moment(dateOfBirth, 'DD/MM/YYYY').utc(0).format(),
								metadata: {
									passport_number: passportNumber,
								},
								...rest,
							}));
							const body = {
								booking_users,
								travel_date: travelDate,
								travel_time: travelTime,
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
