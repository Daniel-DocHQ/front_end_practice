import React, { useState } from 'react';
import { Formik } from 'formik';
import BigWhiteContainer from '../Containers/BigWhiteContainer';
import BookingEngineForm from './BookingEngineForm';
import bookingFormModel from './bookingFormModel';
import validationSchema from './validationSchema';

const BookingEngine = () => {
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

	// function placeBooking() {
	// 	const body = {
	// 		billing_details: {
	// 			first_name: user.first_name,
	// 			last_name: user.last_name,
	// 			dateOfBirth: ddMMyyyy(user.date_of_birth),
	// 			email: user.email,
	// 			street_address: user.address_1,
	// 			extended_address: '',
	// 			locality: user.city,
	// 			region: user.county,
	// 			postal_code: user.postcode,
	// 		},
	// 		toc_accept: true,
	// 		marketing_accept: false,
	// 	};

	// 	bookingService
	// 		.paymentRequest(selectedAppointment.id, body, token)
	// 		.then(result => {
	// 			if (result.success && result.confirmation) {
	// 				handleNext();
	// 			} else {
	// 				handleNext();
	// 			}
	// 		})
	// 		.catch(() => {
	// 			handleNext();
	// 		});
	// }
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
						setRestFormValues({
							...restFormValues,
							...values,
						});
						actions.setTouched({});
						actions.setSubmitting(false);
						actions.setErrors({});
						handleNext();
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
		</BigWhiteContainer>
	);
};

export default BookingEngine;
