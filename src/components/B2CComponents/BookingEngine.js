import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { get } from 'lodash';
import moment from 'moment';
import { format } from 'date-fns';
import parsePhoneNumber from 'libphonenumber-js'
import cityTimezones from 'city-timezones';
import { ToastsStore } from 'react-toasts';
import BigWhiteContainer from '../Containers/BigWhiteContainer';
import BookingEngineForm from './BookingEngineForm';
import bookingFormModel from './bookingFormModel';
import validationSchema from './validationSchema';
import bookingService from '../../services/bookingService';
import getURLParams from '../../helpers/getURLParams';
import LinkButton from '../DocButton/LinkButton';
import adminService from '../../services/adminService';
import COUNTRIES from '../../helpers/countries';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const BookingEngine = () => {
	const params = getURLParams(window.location.href);
	const short_token = params['short_token'];
	const [orderInfo, setOrderInfo] = useState();
	const [items, setItems] = useState([]);
	const [status, setStatus] = useState(); // { severity, message }
	const [isLoading, setLoading] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const [activePassenger, setActivePassenger] = useState(0);
	const { formInitialValues } = bookingFormModel;
	const defaultTimeZone = cityTimezones.findFromCityStateProvince('Westminster')[0];
	const usersPhoneNumber = get(orderInfo, 'shipping_address.telephone', '')
	const parsedPhoneNumber = parsePhoneNumber(usersPhoneNumber);
	const defaultCountyCode = COUNTRIES.find(({ country }) => country === 'United Kingdom');
	const currentValidationSchema = validationSchema[activeStep];
	const defaultTestType = items.find(({ Quantity }) => Quantity > 0) || {};
	const steps = [
        'Select Test',
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
		dateOfBirth: new Date(),
		ethnicity: '',
		sex: 'Female',
		passportNumber: '',
	};

	function handleBack() {
		activeStep === 3 && activePassenger !== 0
			? setActivePassenger(activePassenger - 1)
			: setActiveStep(activeStep - 1);
	}
	function handleNext() {
		setActiveStep(activeStep + 1);
	}

	useEffect(() => {
		(async () => {
			await setLoading(true);
			if (short_token) {
				await adminService.getOrderInfo(short_token)
					.then(data => {
						if (data.success) {
							setOrderInfo(data.order);
						}
					})
					.catch(err => ToastsStore.error('Error fetching order information'))
				await adminService.getOrderProducts(short_token)
					.then(data => {
						if (data.success) {
							setItems(data.order);
						}
					})
					.catch(err => ToastsStore.error('Error fetching order information'))
			}
			setLoading(false);
		})();
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
			{(short_token && !!orderInfo) ? (
				<>
					{!!items.length ? (
						<Formik
							initialValues={{
								...formInitialValues,
								numberOfPeople: defaultTestType.Quantity || 1,
								product: defaultTestType.ID || 0,
								testType: defaultTestType,
								passengers: [
									{
										firstName: get(orderInfo, 'billing_detail.first_name', ''),
										lastName: get(orderInfo, 'billing_detail.last_name', ''),
										email: get(orderInfo, 'billing_detail.email', ''),
										phone: !!parsedPhoneNumber ? parsedPhoneNumber.nationalNumber : usersPhoneNumber,
										countryCode: !!parsedPhoneNumber
											? COUNTRIES.find(({ code, label }) => (code === parsedPhoneNumber.country && label === `+${parsedPhoneNumber.countryCallingCode}`))
											: defaultCountyCode,
										dateOfBirth: new Date(get(orderInfo, 'billing_detail.date_of_birth', new Date())),
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
										numberOfPeople,
										passengers,
									} = values;
									if (activePassenger === (numberOfPeople - 1)) {
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
										shipping_address: {
											address_1,
											address_2,
											town,
											postcode,
											county,
										},
									} = orderInfo;
									const {
										selectedSlot,
										travelDate,
										travelTime,
										passengers,
										timezone,
										testType: { ID, Type },
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
										date_of_birth: moment.utc(format(dateOfBirth, 'dd/MM/yyyy'), 'DD/MM/YYYY').format(),
										street_address: address_1,
										language: 'EN',
										extended_address: address_2,
										postal_code: postcode,
										phone: `${countryCode.label}${phone.trim()}`,
										region: county,
										country: 'GB',
										locality: town,
										metadata: {
											product_id: ID,
											short_token,
											passport_number: passportNumber,
											travel_date: moment(
												new Date(
													travelDate.getFullYear(),
													travelDate.getMonth(),
													travelDate.getDate(),
													travelTime.getHours(),
													travelTime.getMinutes(),
													0,
												)).format(),
											test_type: Type,
										},
										...rest,
									}));
									const body = {
										type: 'video_gp_dochq',
										booking_users,
									};
									bookingService
										.paymentRequest(selectedSlot.id, body)
										.then(result => {
											if (result.success && result.confirmation) {
												handleNext();
											} else {
												setStatus({
													severity: 'error',
													message: result.message,
												});
											}
										})
										.catch(({ error }) => {
											setStatus({
												severity: 'error',
												message: error,
											})
										});
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
								status={status}
								steps={steps}
								items={items}
							/>
						</Formik>
					) : (
						<>
							<div className="row center">
								<h3>You don't have available appointments for that order</h3>
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
				</>
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
