import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { get } from 'lodash';
import { ToastsStore } from 'react-toasts';
import BigWhiteContainer from '../Containers/BigWhiteContainer';
import BookingEngineForm from './BookingEngineForm';
import bookingFormModel from './bookingFormModel';
import validationSchema from './validationSchema';
import bookingService from '../../services/bookingService';
import getURLParams from '../../helpers/getURLParams';
import LinkButton from '../DocButton/LinkButton';
import adminService from '../../services/adminService';

const BookingEngine = () => {
	const params = getURLParams(window.location.href);
	const short_token = params['short_token'];
	const order_id = params['order_id'];
	const [orderInfo, setOrderInfo] = useState(0);
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
		if (order_id) {
			adminService.getOrderInfo(order_id)
				.then(data => {
					console.log(data);
					if (data.success) {
						setOrderInfo(data.order);
					} else {
						ToastsStore.error('Error fetching order information');
					}
				})
				.catch(err => ToastsStore.error('Error fetching order information'))
		}
	}, []);

	console.log(orderInfo);

	return (
		<BigWhiteContainer>
			{(short_token && order_id) ? (
				<Formik
					initialValues={formInitialValues}
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
								test_type,
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
								date_of_birth: dateOfBirth,
								metadata: {
									short_token,
									passport_number: passportNumber,
									test_type: get(orderInfo, 'items[0].product.type', 'ANT'),
								},
								...rest,
							}));
							const body = {
								test_type,
								booking_users,
								travel_date: travelDate,
								travel_time: travelTime,
							};
							bookingService
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
						activePassenger={activePassenger}
						activeStep={activeStep}
						handleBack={handleBack}
						steps={steps}
					/>
				</Formik>
			) : (
				<>
					<div className="row center">
						<h3>You haven't bought any test kit yet</h3>
					</div>
					<div className="row center">
						<LinkButton
							text='Buy Now!'
							color='green'
							linkSrc={`${process.env.REACT_APP_WEBSITE_LINK}/shop`}
						/>
					</div>
				</>
			)}
		</BigWhiteContainer>
	);
};

export default BookingEngine;
