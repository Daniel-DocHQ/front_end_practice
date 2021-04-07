import React, { useState } from 'react';
import { Formik } from 'formik';
import BigWhiteContainer from '../Containers/BigWhiteContainer';
import BookingEngineForm from './BookingEngineForm';
import bookingFormModel from './bookingFormModel';
import validationSchema from './validationSchema';

const BookingEngine = () => {
	const [activeStep, setActiveStep] = useState(0);
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
		setActiveStep(activeStep - 1);
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
					if (activeStep === 4) {
						handleNext();
						actions.setTouched({});
						actions.setSubmitting(false);
						actions.setErrors({});
					} else {
						handleNext();
						actions.setTouched({});
						actions.setSubmitting(false);
						actions.setErrors({});
					}
				}}
			>
				<BookingEngineForm
					activeStep={activeStep}
					handleBack={handleBack}
					steps={steps}
				/>
			</Formik>
		</BigWhiteContainer>
	);
};

export default BookingEngine;
