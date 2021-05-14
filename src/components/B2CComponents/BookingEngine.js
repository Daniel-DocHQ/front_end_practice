import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { get } from 'lodash';
import moment from 'moment';
import parsePhoneNumber from 'libphonenumber-js'
import cityTimezones from 'city-timezones';
import { ToastsStore } from 'react-toasts';
import BigWhiteContainer from '../Containers/BigWhiteContainer';
import BookingEngineForm from './BookingEngineForm';
import bookingFormModel from './bookingFormModel';
import useValidationScheme from './validationSchema';
import bookingService from '../../services/bookingService';
import getURLParams from '../../helpers/getURLParams';
import LinkButton from '../DocButton/LinkButton';
import adminService from '../../services/adminService';
import COUNTRIES from '../../helpers/countries';

const BookingEngine = () => {
	const params = getURLParams(window.location.href);
	const short_token = params['short_token'];
	const [orderInfo, setOrderInfo] = useState();
	const [activeStep, setActiveStep] = useState(0);
	const [activePassenger, setActivePassenger] = useState(0);
	const { formInitialValues } = bookingFormModel;
	const defaultTimeZone = cityTimezones.findFromCityStateProvince('Westminster')[0];
	const usersPhoneNumber = get(orderInfo, 'shipping_address.telephone', '')
	const parsedPhoneNumber = parsePhoneNumber(usersPhoneNumber);
	const defaultCountyCode =  COUNTRIES.find(({ country }) => country === 'United Kingdom');
	const antigenProductQuantity = get(get(orderInfo, 'items', []).find(({ product_id }) => product_id === 9), 'quantity', 1);
	const currentValidationSchema = useValidationScheme(antigenProductQuantity)[activeStep];
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
		countryCode: defaultCountyCode,
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
		if (short_token) {
			adminService.getOrderInfo(short_token)
				.then(data => {
					if (data.success) {
						setOrderInfo(data.order);
					}
				})
				.catch(err => ToastsStore.error('Error fetching order information'))
		}
	}, []);

	return (
		<BigWhiteContainer>
			{(short_token && !!orderInfo) ? (
				<Formik
					initialValues={{
						...formInitialValues,
						antigenTest: antigenProductQuantity <= 4 ? antigenProductQuantity : 4,
						passengers: [
							{
								firstName: get(orderInfo, 'billing_detail.first_name', ''),
								lastName: get(orderInfo, 'billing_detail.last_name', ''),
								email: get(orderInfo, 'billing_detail.email', ''),
								phone: !!parsedPhoneNumber ? parsedPhoneNumber.nationalNumber : usersPhoneNumber,
								countryCode: !!parsedPhoneNumber
									? COUNTRIES.find(({ code, label }) => (code === parsedPhoneNumber.country && label === `+${parsedPhoneNumber.countryCallingCode}`))
									: defaultCountyCode,
								dateOfBirth: moment(get(orderInfo, 'billing_detail.date_of_birth', new Date)).format('DD/MM/YYYY'),
								ethnicity: '',
								sex: 'Female',
								passportNumber: '',
							},
						],
						city: defaultTimeZone,
						timezone: defaultTimeZone.timezone,
					}}
					validationSchema={currentValidationSchema}
					onSubmit={async (values, actions) => {
						if (activeStep === 3) {
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
								items,
								shipping_address: {
									address_1,
									address_2,
									town,
									postcode,
									county,
								},
							} = orderInfo;
							const test_type = get(items, '[0].product.type', 'Antigen');
							const {
								selectedSlot,
								travelDate,
								travelTime,
								passengers,
								timezone,
							} = values;
							const booking_users = passengers.map(({
								firstName,
								lastName,
								dateOfBirth,
								passportNumber,
								phone,
								countryCode,
								...rest
							}) => ({
								first_name: firstName,
								last_name: lastName,
								tz_location: timezone,
								date_of_birth: moment.utc(dateOfBirth, 'DD/MM/YYYY').format(),
								street_address: address_1,
								language: 'EN',
								extended_address: address_2,
								postal_code: postcode,
								phone: `${countryCode.label}${phone.trim()}`,
								region: county,
								country: 'GB',
								locality: town,
								metadata: {
									short_token,
									passport_number: passportNumber,
									test_type,
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
