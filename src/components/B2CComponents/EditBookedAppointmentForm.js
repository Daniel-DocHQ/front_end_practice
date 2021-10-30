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
import { Divider } from '@material-ui/core';

const BookingEngine = ({ isCustomerEdit = false }) => {
	const { token } = useContext(AuthContext);
	const [items, setItems] = useState([]);
	const [timerStart, setTimerStart] = useState();
	const [isAppointmentStartsIn24Hours, setIsAppointmentStartsIn24Hours] = useState(false);
	const [isDeleteVisible, setIsDeleteVisible] = useState(false);
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
        ...(isCustomerEdit ? [] : ['How many people will take the test?']),
        'Travel Details',
        'Booking Appointment',
        ...(isCustomerEdit ? [] : ['Passenger Details']),
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
							setIsAppointmentStartsIn24Hours(true);
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
						title={isAppointmentStartsIn24Hours ? "Thank you" : 'Delete Appointment'}
						isVisible={isDeleteVisible}
						onClose={() => setIsDeleteVisible(false)}
						content={
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								{isAppointmentStartsIn24Hours ? (
									<>
										<p>
											Thank you for notifying the practitioner that you are not going to attend the appointment.
										</p>
										<LinkButton
											text='Buy new one'
											color='green'
											linkSrc={`${process.env.REACT_APP_WEBSITE_LINK}/shop`}
										/>
									</>
								) : (
									<>
										<p>
											Are you sure you want to <b>DELETE</b> your appointment?
										</p>
										<div className="row center">
											<DocButton
												color='green'
												text='No'
												style={{ marginRight: 20 }}
												onClick={async () => {
													setIsDeleteVisible(false)
												}}
											/>
											<DocButton
												color='pink'
												text='Yes'
												style={{ marginRight: 20 }}
												onClick={async () => {
													await bookingService.deleteBooking(appointment.id, token, "patient", 'delete').catch(() => console.log('error'));
													setIsDeleteVisible(false);
													getData();
												}}
											/>
										</div>
									</>
								)}
							</div>
						}
					/>
					{(isCustomerEdit && isAppointmentStartsIn24Hours) ? (
						<>
							<div className="row center">
								<p style={{ textAlign: 'center' }}>
									Unfortunately, you cannot edit or delete your appointment as it is due to start in less that 24h.<br /><br />
									Do you still want to notify the practitioner that your are not going to attend?
								</p>
							</div>
							<div className="row center">
								<DocButton
									color='green'
									text='Notify Practitioner'
									style={{ marginRight: 20 }}
									onClick={async () => {
										await bookingService.deleteBooking(appointment.id, token, "patient", 'delete').catch(() => console.log('error'));
										setIsDeleteVisible(true);
									}}
								/>
							</div>
						</>
					) : (
						<DocModal
							isVisible={isAppointmentStartsIn24Hours}
							onClose={() => setIsAppointmentStartsIn24Hours(false)}
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
											onClick={() => setIsAppointmentStartsIn24Hours(false)}
										/>
									</div>
								</div>
							}
						/>
					)}
					{(isCustomerEdit && !isAppointmentStartsIn24Hours) && (
						<div style={{ padding: '0 20px'}}>
							<h4>
								This appointment is due to start in more than 24h.<br />
								You can still delete your appointment so you can book another one in future using the same booking link you have got in the order confirmation email.
							</h4>
							<div className="row center">
								<div className="row">
									<h4>
										Do you want to delete your appointment?
									</h4>
								</div>
								<DocButton
									color='pink'
									text='Delete'
									style={{ marginRight: 20 }}
									onClick={() => setIsDeleteVisible(true)}
								/>
							</div>
							<Divider />
							<h4>
								Do you want to edit your appointment?
							</h4>
						</div>
					)}
					{!isAppointmentStartsIn24Hours && (
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
									sku: bookingUsersProduct.sku,
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
								} else if (steps[activeStep] === 'Summary') {
									const {
										selectedSlot,
										travelDate,
										travelTime,
										passengers,
										landingDate,
										landingTime,
										transportNumber,
										timezone
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
										tz_location: timezone,
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
												await bookingService.deleteBooking(appointment.id, token, isCustomerEdit ? "patient" : "practitioner", 'edit').catch(() => console.log('error'));
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
								isCustomerEdit={isCustomerEdit}
								status={status}
								items={items}
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
				</>
			) : (
				<>
					<div className="row center">
						<h3>
							Your appointment has been successfully deleted.<br />
							When you are ready to book a new appointment, simply use the booking link you got on your order confirmation email.
						</h3>
					</div>
					<div className="row center">
						{isCustomerEdit ? (
							<LinkButton
								text='Buy new one'
								color='green'
								linkSrc={`${process.env.REACT_APP_WEBSITE_LINK}/shop`}
							/>
						) : (
							<LinkButton
								text='Back to Home'
								color='green'
								linkSrc="/customer_services/dashboard"
							/>
						)}
					</div>
				</>
			)}
			{(isCustomerEdit) && (
				<h4 style={{ textAlign: 'center', marginTop: 40 }}>
					If you have any questions, please contact us at <b>covidtesthelp@dochq.co.uk</b> or at 03300 880645 from 7 AM to 7 PM days per week
				</h4>
			)}
		</BigWhiteContainer>
	);
};

export default BookingEngine;
