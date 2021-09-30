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
import useValidationSchema from './validationSchema';
import bookingService from '../../services/bookingService';
import getURLParams from '../../helpers/getURLParams';
import LinkButton from '../DocButton/LinkButton';
import adminService from '../../services/adminService';
import COUNTRIES from '../../helpers/countries';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import {
	PRODUCTS_WITH_ADDITIONAL_INFO,
	FIT_TO_FLY_PCR,
} from '../../helpers/productsWithAdditionalInfo';
import CountdownTimer from '../CountdownTimer';
import Summary from './Summary';
import useChat from '../../helpers/hooks/useChat';

const BookingEngine = () => {
	const params = getURLParams(window.location.href);
	const short_token = params['short_token'];
	const [orderInfo, setOrderInfo] = useState();
	const [timerStart, setTimerStart] = useState();
	const [appointments, setAppointments] = useState([]);
	const [items, setItems] = useState([]);
	const [status, setStatus] = useState(); // { severity, message }
	const [isLoading, setLoading] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const [createdAppointmentId, setCreatedAppointmentId] = useState();
	const [activePassenger, setActivePassenger] = useState(0);
	const { formInitialValues } = bookingFormModel;
	const defaultTimeZone = cityTimezones.findFromCityStateProvince('Westminster')[0];
	const usersPhoneNumber = get(orderInfo, 'shipping_address.telephone', '');
	const orderId = get(orderInfo, 'id', 0);
	const isBookingSkip = items.find(({ sku }) => (sku === 'FACE-2-FACE-HOTEL' || sku === 'SELF-SWABBING'));
	const parsedPhoneNumber = parsePhoneNumber(usersPhoneNumber);
	const defaultCountryCode = COUNTRIES.find(({ country }) => country === 'United Kingdom');
	const currentValidationSchema = useValidationSchema(activeStep, isBookingSkip);
	const itemsWithoutVirtual = [...items].filter(({ type }) => type !== 'Virtual');
	const defaultTestType = itemsWithoutVirtual.find(({ quantity }) => quantity > 0) || null;
	const totalAvailableQuantity = itemsWithoutVirtual.filter(({ type }) => type !== 'Virtual').reduce((sum, { quantity }) => quantity + sum, 0);
	const steps = [
		'Select Test',
		'Travel Details',
		...(isBookingSkip ? [] : ['Booking Appointment']),
		'Passenger Details',
		'Summary',
		'Booking Confirmation',
	];

	const passengerInitialValues = {
		fillWithBookingUser: '',
		firstName: '',
		lastName: '',
		email: '',
		countryCode: defaultCountryCode,
		phone: '',
		dateOfBirth: null,
		ethnicity: '',
		sex: '',
		passportNumber: '',
		passportNumberConfirmation: '',
		vaccineStatus: '',
        vaccineNumber: '',
        vaccineTypeName: '',
        vaccineType: '',
	};

	function handleBack() {
		(steps[activeStep] === 'Passenger Details' && activePassenger !== 0)
			? setActivePassenger(activePassenger - 1)
			: setActiveStep(activeStep - 1);
	}
	function handleNext() {
		setActiveStep(activeStep + 1);
	}

	const getData = async () => {
		setLoading(true);
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

			await bookingService.getAppointmentsByShortToken(short_token)
				.then(result => {
					if (result.success && result.appointments) {
						setAppointments(result.appointments);
					}
				}).catch(err => console.log(err));
		}
		setLoading(false);
	};

	useChat();
	useEffect(() => {
		getData();
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
					{(!!items.length && !!defaultTestType) ? (
						<>
							<Formik
								initialValues={{
									...formInitialValues,
									numberOfPeople: 1,
									product: defaultTestType.id || 0,
									testType: defaultTestType,
									...(!!appointments.length ? {
										bookingUsers: appointments[0].booking_users.map(({
											first_name,
											date_of_birth,
											last_name,
											phone,
											ethnicity,
											sex,
											email,
											metadata: {
												passport_number,
											},
										}) => {
											const parsedPhoneNumber = parsePhoneNumber(phone);

											return ({
												...passengerInitialValues,
												firstName: first_name,
												lastName: last_name,
												dateOfBirth: new Date(date_of_birth),
												passportNumber: passport_number,
												phone: !!parsedPhoneNumber ? parsedPhoneNumber.nationalNumber : phone,
												countryCode: !!parsedPhoneNumber ? COUNTRIES.find(({ code, label }) => (code === parsedPhoneNumber.country && label === `+${parsedPhoneNumber.countryCallingCode}`)) : defaultCountryCode,
												ethnicity,
												sex,
												email,
											});
										}),
									} : {
										passengers: [
											{
												...passengerInitialValues,
												firstName: get(orderInfo, 'billing_detail.first_name', ''),
												lastName: get(orderInfo, 'billing_detail.last_name', ''),
												email: get(orderInfo, 'billing_detail.email', ''),
												phone: !!parsedPhoneNumber ? parsedPhoneNumber.nationalNumber : usersPhoneNumber,
												countryCode: !!parsedPhoneNumber
												? COUNTRIES.find(({ code, label }) => (code === parsedPhoneNumber.country && label === `+${parsedPhoneNumber.countryCallingCode}`))
												: defaultCountryCode,
												dateOfBirth: new Date(get(orderInfo, 'billing_detail.date_of_birth', null)),
											},
										],
									}),
									city: undefined,
									timezone: undefined,
								}}
								validationSchema={currentValidationSchema}
								onSubmit={async (values, actions) => {
									if (steps[activeStep] === 'Booking Appointment') {
										const { selectedSlot } = values;
										await bookingService.updateAppointmentStatus(
											selectedSlot.id,
											{ status: 'LOCKED' },
											'token',
										).then((response) => {
											if (response.success) {
												setTimerStart(new Date());
											}
										}).catch(() => console.log('error'));
										actions.setTouched({});
										actions.setSubmitting(false);
										actions.setErrors({});
										handleNext();
									} else if (steps[activeStep] === 'Passenger Details') {
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
									} else if (steps[activeStep] === 'Summary') {
										const {
											source,
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
											timezone: timezoneValue,
											testType: { id, sku, type, bundle_id },
											transportNumber,
											transportType,
											landingDate,
											landingTime,
											city,
											tocAccept,
											selectedKit,
										} = values;
										const isAdditionalProduct = PRODUCTS_WITH_ADDITIONAL_INFO.includes(sku);
										const isPCR = sku === FIT_TO_FLY_PCR;
										const booking_users = Array.from(Array(passengers.length).keys()).map((item) => {
											const {
												firstName,
												lastName,
												dateOfBirth,
												passportNumber,
												phone,
												countryCode,
												vaccineNumber,
												vaccineStatus,
												vaccineType,
												vaccineTypeName,
												...rest
											} = passengers[item];
											return ({
												first_name: firstName,
												last_name: lastName,
												tz_location: (isAdditionalProduct || isPCR) ? defaultTimeZone.timezone : timezoneValue,
												date_of_birth: moment.utc(format(dateOfBirth, 'dd/MM/yyyy'), 'DD/MM/YYYY').format(),
												street_address: address_1,
												language: 'EN',
												extended_address: address_2,
												postal_code: postcode,
												phone: `${countryCode.label}${phone.trim()}`,
												region: county,
												country: 'GB',
												toc_accept: tocAccept,
												locality: town,
												bundle_id: parseInt(bundle_id),
												product_id: parseInt(id),
												selected_kit: selectedKit,
												...(isAdditionalProduct ? {
													vaccine_information: {
														number: vaccineNumber,
														status: vaccineStatus,
														type: vaccineType === 'Other' ? vaccineTypeName : vaccineType,
													}
												} : {}),
												metadata: {
													source,
													product_id: parseInt(id),
													short_token,
													order_id: parseInt(orderId),
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
													test_type: type,
												},
												...rest,
											});
										})
										const body = {
											type: 'video_gp_dochq',
											booking_users,
											flight_details: {
												transport_arrival_country: isAdditionalProduct ? 'GB' : timezoneValue,
												transport_arrival_date_time: moment(
													new Date(
														landingDate.getFullYear(),
														landingDate.getMonth(),
														landingDate.getDate(),
														landingTime.getHours(),
														landingTime.getMinutes(),
														0,
													)).format(),
												transport_departure_country: isAdditionalProduct ? city.iso2 : 'GB',
												transport_departure_date_time: moment(
													new Date(
														travelDate.getFullYear(),
														travelDate.getMonth(),
														travelDate.getDate(),
														travelTime.getHours(),
														travelTime.getMinutes(),
														0,
													)).format(),
												transport_number: transportNumber,
												transport_type: transportType,
											},
										};
										await bookingService
											.paymentRequest(isBookingSkip ? '' : selectedSlot.id, body)
											.then(result => {
												if (result.success && result.confirmation) {
													handleNext();
													setTimerStart();
													setCreatedAppointmentId(result.confirmation.id);
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
							<>
								<div className="fixed-box">
									{(activeStep < 4 && activeStep > 0) && (
										<Summary
											activeStep={activeStep}
											defaultTimezone={defaultTimeZone}
										/>
									)}
									{timerStart && (
										<div className="countdown-timer">
											<p>
												Your appointment is available for the next&nbsp;
												<CountdownTimer
													timerStart={timerStart.getTime()}
													timerStop={new Date(new Date(timerStart).setMinutes(timerStart.getMinutes() + 30)).getTime()}
													onTimeEnd={() => {
														setTimerStart();
														setActiveStep(2);
														setActivePassenger(0);
													}}
												/> min<br />
												If you do not complete the booking you might need to select another appointment
											</p>
										</div>
									)}
								</div>
								<BookingEngineForm
									activePassenger={activePassenger}
									activeStep={activeStep}
									defaultTimezone={defaultTimeZone}
									handleBack={handleBack}
									status={status}
									steps={steps}
									items={items}
									timer={timerStart}
									createdAppointmentId={createdAppointmentId}
									isBookingSkip={isBookingSkip}
									totalAvailableQuantity={totalAvailableQuantity}
									defaultCountryCode={defaultCountryCode}
									dropTimer={() => setTimerStart()}
								/>
								</>
							</Formik>
						</>
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
