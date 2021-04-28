import React, { useState } from 'react';
import { Formik } from 'formik';
import { ToastsStore } from 'react-toasts';
import BigWhiteContainer from '../Containers/BigWhiteContainer';
import BookingEngineForm from './BookingEngineForm';
import bookingFormModel from './bookingFormModel';
import validationSchema from './validationSchema';
import bookingService from '../../services/bookingService';
import getURLParams from '../../helpers/getURLParams';
import LinkButton from '../DocButton/LinkButton';

const BookingEngine = () => {
	const params = getURLParams(window.location.href);
	const short_token = params['short_token'];
	const [activeStep, setActiveStep] = useState(0);
	const [activePassenger, setActivePassenger] = useState(0);
	const [passengers, setPassengers] = useState([]);
	const [restFormValues, setRestFormValues] = useState([]);
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

	return (
		<BigWhiteContainer>
			{short_token ? (
				<Formik
					initialValues={formInitialValues}
					validationSchema={currentValidationSchema}
					onSubmit={async (values, actions) => {
						if (activeStep === 0) {
							setRestFormValues(values);
							const {
								antigenTest,
								pcrTest,
							} = values;
							const newPassengers = [...Array(antigenTest + pcrTest)].map(() => ({
								...passengerInitialValues,
							}));
							actions.setTouched({});
							actions.setSubmitting(false);
							actions.setErrors({});
							setPassengers(newPassengers);
							handleNext();
						} else if (activeStep === 2) {
							actions.setSubmitting(false);
							actions.setTouched({});
							actions.setErrors({});
							const {
								firstName,
								lastName,
								email,
								phone,
								dateOfBirth,
								ethnicity,
								sex,
								passportNumber,
							} = values;
							const newPassengers = [...passengers];
							newPassengers[activePassenger] = {
								firstName,
								lastName,
								email,
								phone,
								dateOfBirth,
								ethnicity,
								sex,
								passportNumber,
							};
							setPassengers(newPassengers);
							if (activePassenger === passengers.length - 1) {
								handleNext();
							} else {
								actions.resetForm({
									...restFormValues,
									...passengerInitialValues,
								});
								setActivePassenger(activePassenger + 1);
							}
						} else if (activeStep === 4) {
							const {
								selectedSlot,
								travelDate,
								travelTime,
							} = values;
							const bookingUsers = passengers.map((item) => ({ ...item, metadata: { short_token } }));
							const body = {
								bookingUsers,
								travelDate,
								travelTime,
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
							setRestFormValues({
								...restFormValues,
								...values,
							});
							actions.setTouched({});
							actions.setSubmitting(false);
							actions.setErrors({});
							handleNext();
						}
					}}
				>
					<BookingEngineForm
						passengers={passengers}
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
