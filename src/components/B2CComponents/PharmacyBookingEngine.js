import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { get } from 'lodash';
import moment from 'moment';
import { format } from 'date-fns';
import cityTimezones from 'city-timezones';
import { ToastsStore } from 'react-toasts';
import BigWhiteContainer from '../Containers/BigWhiteContainer';
import BookingEngineForm from './BookingEngineForm';
import bookingFormModel from './bookingFormModel';
import useValidationSchema from './validationSchema';
import bookingService from '../../services/bookingService';
import adminService from '../../services/adminService';
import COUNTRIES from '../../helpers/countries';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { PRODUCTS_WITH_ADDITIONAL_INFO, FIT_TO_FLY_PCR } from '../../helpers/productsWithAdditionalInfo';
import CountdownTimer from '../CountdownTimer';
import Summary from './Summary';

const AmberDay2 = 'SYN-UK-PCR-SNS-002';
const AntigenFitToFly = 'FLX-UK-ANT-SNS-001';

const PharmacyBookingEngine = () => {
	const [products, setProducts] = useState([]);
	const [timerStart, setTimerStart] = useState();
	const [status, setStatus] = useState(); // { severity, message }
	const [isLoading, setLoading] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const [activePassenger, setActivePassenger] = useState(0);
	const { formInitialValues } = bookingFormModel;
	const defaultTimeZone = cityTimezones.findFromCityStateProvince('Westminster')[0];
	const defaultCountryCode = COUNTRIES.find(({ country }) => country === 'United Kingdom');
	const currentValidationSchema = useValidationSchema(activeStep, false, true);
	const steps = [
		'Purchase Code',
		'Travel Details',
		'Booking Appointment',
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
        await adminService.getProducts()
            .then(result => {
                if (result.success && result.products) {
                    setProducts(result.products);
                }
            })
            .catch(err => ToastsStore.error('Error fetching products'))
		setLoading(false);
	};

    useEffect(() => {
        getData();
    }, [])

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
            <Formik
                initialValues={{
                    ...formInitialValues,
                    numberOfPeople: 1,
                    testType: {},
                    passengers: [
                        {
                            ...passengerInitialValues,
                        },
                    ],
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
                    } else if (steps[activeStep] === 'Purchase Code') {
                        const { purchaseCode } = values;
                        await adminService.checkPurchaseCodeInfo(purchaseCode)
                            .then(result => {
                                if (result.success && result.data && result.data.value) {
                                    if (!!result.data.uses) {
                                        switch (purchaseCode.slice(0, 3)) {
                                            case 'ANT':
                                                actions.setFieldValue('testType', products.find(({ sku }) => sku === AntigenFitToFly));
                                                break;
                                            case 'PFF':
                                                actions.setFieldValue('testType', products.find(({ sku }) => sku === FIT_TO_FLY_PCR));
                                                break;
                                            case 'ATE':
                                                actions.setFieldValue('testType', products.find(({ sku }) => sku === AmberDay2));
                                                break;
                                        }
                                        actions.setSubmitting(false);
                                        actions.setTouched({});
                                        actions.setErrors({});
                                        handleNext();
                                    } else {
                                        actions.setFieldValue('Your code is expired', result.error);
                                    }
                                } else {
                                    actions.setFieldValue('purchaseCodeError', result.error);
                                }
                            }).catch((error) => actions.setFieldValue('purchaseCodeError', error.error));
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
                            numberOfPeople,
                            selectedSlot,
                            travelDate,
                            travelTime,
                            passengers,
                            timezone: timezoneValue,
                            testType: { id, sku, type },
                            transportNumber,
                            transportType,
                            landingDate,
                            landingTime,
                            vaccineNumber,
                            vaccineStatus,
                            vaccineType,
                            vaccineTypeName,
                            city,
                            tocAccept,
                        } = values;
                        const isAdditionalProduct = PRODUCTS_WITH_ADDITIONAL_INFO.includes(sku);
                        const isPCR = sku === FIT_TO_FLY_PCR;
                        const booking_users = Array.from(Array(numberOfPeople).keys()).map((item) => {
                            const {
                                firstName,
                                lastName,
                                dateOfBirth,
                                passportNumber,
                                phone,
                                countryCode,
                                ...rest
                            } = passengers[item];
                            return ({
                                first_name: firstName,
                                last_name: lastName,
                                tz_location: (isAdditionalProduct || isPCR) ? defaultTimeZone.timezone : timezoneValue,
                                date_of_birth: moment.utc(format(dateOfBirth, 'dd/MM/yyyy'), 'DD/MM/YYYY').format(),
                                language: 'EN',
                                phone: `${countryCode.label}${phone.trim()}`,
                                country: 'GB',
                                toc_accept: tocAccept,
                                metadata: {
                                    product_id: parseInt(id),
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
                                vaccine_number: vaccineNumber,
                                vaccine_status: vaccineStatus,
                                vaccine_type: vaccineType === 'Other' ? vaccineTypeName : vaccineType,
                            },
                        };
                        await bookingService
                            .paymentRequest(selectedSlot.id, body)
                            .then(result => {
                                if (result.success && result.confirmation) {
                                    handleNext();
                                    setTimerStart();
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
                        isPharmacy
                        activePassenger={activePassenger}
                        activeStep={activeStep}
                        defaultTimezone={defaultTimeZone}
                        handleBack={handleBack}
                        status={status}
                        steps={steps}
                        timer={timerStart}
                        defaultCountryCode={defaultCountryCode}
                        dropTimer={() => setTimerStart()}
                    />
                </>
            </Formik>
		</BigWhiteContainer>
	);
};

export default PharmacyBookingEngine;