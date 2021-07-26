import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import { get } from 'lodash';
import moment from 'moment';
import { differenceInHours, format } from 'date-fns';
import { ToastsStore } from 'react-toasts';
import cityTimezones from 'city-timezones';
import parsePhoneNumber from 'libphonenumber-js'
import BigWhiteContainer from '../Containers/BigWhiteContainer';
import BookingEngineForm from './BookingEngineForm';
import bookingFormModel from './bookingFormModel';
import useValidationSchema from './validationSchema';
import bookingService from '../../services/bookingService';
import getURLParams from '../../helpers/getURLParams';
import LinkButton from '../DocButton/LinkButton';
import nurseSvc from '../../services/nurseService';
import { AuthContext } from '../../context/AuthContext';
import COUNTRIES from '../../helpers/countries';
import adminService from '../../services/adminService';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import CountdownTimer from '../CountdownTimer';
import DocModal from '../DocModal/DocModal';
import DocButton from '../DocButton/DocButton';

const BookingEngine = () => {
	const { token } = useContext(AuthContext);
	const [items, setItems] = useState([]);
	const [timerStart, setTimerStart] = useState();
	const [isVisible, setIsVisible] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [appointment, setAppointment] = useState();
	const params = getURLParams(window.location.href);
	const appointmentId = params['appointmentId'];
	const short_token = params['short_token'];
	const bookingUsers = get(appointment, 'booking_users', []);
	const [activeStep, setActiveStep] = useState(0);
	const [activePassenger, setActivePassenger] = useState(0);
	const [status, setStatus] = useState(); // { severity, message }
	const { formInitialValues } = bookingFormModel;
	const defaultTimeZone = cityTimezones.findFromCityStateProvince('Westminster')[0];
	const defaultCountryCode = COUNTRIES.find(({ country }) => country === 'United Kingdom');
	const currentValidationSchema = useValidationSchema(activeStep);
	const usersTravelDate = get(bookingUsers, '[0].metadata.travel_date', new Date ());
	const usersLandingDate = get(bookingUsers, '[0].metadata.landing_date', '');
	const usersFlightNumber = get(bookingUsers, '[0].metadata.flight_number', '');
	const usersTimeZone = get(bookingUsers, '[0].tz_location', defaultTimeZone.timezone);
	const bookingUsersQuantity = get(bookingUsers, 'length', 0);
	const bookingUsersTestType = get(bookingUsers, '[0].test_type', 'Antigen');
	const bookingUsersProductId = get(bookingUsers, '[0].product_id');
	const bookingUsersProduct = items.find(({ id }) => bookingUsersProductId === id) || get(items, '[0]', {});
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
		dateOfBirth: null,
		ethnicity: '',
		countryCode: defaultCountryCode,
		sex: '',
		passportNumber: '',
		passportNumberConfirmation: '',
		test_type: bookingUsersTestType,
	};

	function handleBack() {
		activeStep === 3 && activePassenger !== 0
			? setActivePassenger(activePassenger - 1)
			: setActiveStep(activeStep - 1);
	}
	function handleNext() {
		setActiveStep(activeStep + 1);
	}

	const getData = async () => {
		await setLoading(true);
		if (short_token && appointmentId) {
			await nurseSvc
				.getAppointmentDetails(appointmentId, token)
				.then(result => {
					if (result.success && result.appointment) {
						const { appointment } = result;
						setAppointment(appointment);
						if (differenceInHours(new Date(appointment.start_time), new Date()) <= 24)
							setIsVisible(true);
					} else {
						ToastsStore.error(`Cannot find appointment details`);
					}
				})
				.catch(() => ToastsStore.error(`Cannot find appointment details`));
			await adminService.getOrderProducts(short_token)
				.then(data => {
					if (data.success) {
						setItems(data.order);
					}
				})
				.catch(err => ToastsStore.error('Error fetching order information'))
		}
		setLoading(false);
	};

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
			{!!appointment && !!bookingUsersQuantity ? (
				<>
					<DocModal
						isVisible={isVisible}
						onClose={() => setIsVisible(false)}
						content={
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								<p>
									This appointment is due to start in less than 24h from now.<br />
									Are you sure you want to edit/delete this appointment?
								</p>
								<div className="row space-between">
									<LinkButton
										color='green'
										text='No'
										linkSrc='/customer_services/order-list'
										style={{ marginRight: '5px' }}
									/>
									<DocButton
										color='pink'
										text='Yes'
										onClick={() => setIsVisible(false)}
									/>
								</div>
							</div>
						}
					/>
					<Formik
						initialValues={{
							...formInitialValues,
							travelDate: new Date(usersTravelDate),
							travelTime: new Date(usersTravelDate),
							...(!!usersLandingDate ? {
								landingDate: new Date(usersLandingDate),
								landingTime: new Date(usersLandingDate),
								transportNumber: usersFlightNumber,
							} : {}),
							testType: {
								quantity: 4,
								title: bookingUsersProduct.title,
								type: bookingUsersProduct.type,
							},
							product: bookingUsersProduct.id,
							city: usersTimeZoneObj,
							timezone: usersTimeZoneObj.timezone,
							numberOfPeople: bookingUsersQuantity,
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
									...restMetadata
								},
								...rest
							}) => {
								const parsedPhoneNumber = parsePhoneNumber(phone);

								return ({
									...passengerInitialValues,
									firstName: first_name,
									lastName: last_name,
									dateOfBirth: new Date(date_of_birth),
									passportNumber: passport_number,
									test_type,
									metadata: {
										...restMetadata,
									},
									phone: !!parsedPhoneNumber ? parsedPhoneNumber.nationalNumber : phone,
									countryCode: !!parsedPhoneNumber ? COUNTRIES.find(({ code, label }) => (code === parsedPhoneNumber.country && label === `+${parsedPhoneNumber.countryCallingCode}`)): defaultCountryCode,
									short_token,
									...rest,
								});
							}),
						}}
						validationSchema={currentValidationSchema}
						onSubmit={async (values, actions) => {
							if (activeStep === 2) {
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
							} else if (activeStep === 3) {
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
									landingDate,
									landingTime,
									transportNumber,
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
									metadata,
									...rest
								}) => ({
									...rest,
									first_name: firstName,
									last_name: lastName,
									date_of_birth: moment.utc(format(dateOfBirth, 'dd/MM/yyyy'), 'DD/MM/YYYY').format(),
									phone: `${countryCode.label}${phone.trim()}`,
									metadata: {
										...metadata,
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
										...(!!usersLandingDate ? {
											landing_date: moment(
												new Date(
													landingDate.getFullYear(),
													landingDate.getMonth(),
													landingDate.getDate(),
													landingTime.getHours(),
													landingTime.getMinutes(),
													0,
												)).format(),
											flight_number: transportNumber,
										} : {}),
									},
								}));
								const body = {
									type: appointment.type,
									booking_users,
								};
								await bookingService
									.paymentRequest(selectedSlot.id, body)
									.then(async (result) => {
										if (result.success && result.confirmation) {
											handleNext();
											setTimerStart();
											await bookingService.deleteBooking(appointmentId, token).catch(() => console.log('error'));
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
							isEdit
							status={status}
							items={items}
							defaultCountryCode={defaultCountryCode}
							activePassenger={activePassenger}
							activeStep={activeStep}
							handleBack={handleBack}
							defaultTimezone={defaultTimeZone}
							bookingUsersQuantity={bookingUsersQuantity}
							steps={steps}
							timer={timerStart}
							dropTimer={() => setTimerStart()}
						/>
					</Formik>
					{timerStart && (
						<div className="countdown-timer">
							<p>
								Your appointment is available for the next&nbsp;
								<CountdownTimer
									timerStart={timerStart.getTime()}
									timerStop={new Date(new Date(timerStart).setMinutes(timerStart.getMinutes() + 1)).getTime()}
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
				</>
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
