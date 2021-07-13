import React, { useState, useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment-timezone';
import { Field, useFormikContext, ErrorMessage } from 'formik';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createMuiTheme, Divider } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import bookingService from '../../services/bookingService';
import bookingFormModel from './bookingFormModel';
import { ddMMyyyy, formatTimeSlotWithTimeZone } from '../../helpers/formatDate';
import Slot from './Slot';
import { PRODUCTS_WITH_ADDITIONAL_INFO, FIT_TO_FLY_PCR } from '../../helpers/productsWithAdditionalInfo';
import DocButton from '../DocButton/DocButton';
import './BookingEngine.scss';
import ADDITIONAL_PRODUCT_TEXT from './additionalProductText';

const datePickerTheme = () => createMuiTheme({
	overrides: {
		MuiTypography: {
			colorPrimary: { color: 'var(--doc-pink)' },
		},
		MuiPickersMonth: { monthSelected: { color: 'var(--doc-pink)' } },
		MuiPickersDay: {
			daySelected: {
				'&:hover': { backgroundColor: 'inherit' },
				backgroundColor: 'inherit',
				MuiIconButton: {
					label: { color: 'var(--doc-pink)' },
				},
			},
			current: {
				color: 'var(--doc-pink)!important',
			},
			dayDisabled: {
				color: 'var(--doc-dark-grey)',
				opacity: '0.5',
				backgroundColor: 'var(--doc-white)!important',
			},
			hidden: {
				opacity: '0 !important',
			},
			day: {
				width: '24px',
				height: '24px',
				backgroundColor: 'var(--doc-green)!important',
				marginTop: '5px',
				marginBottom: '5px',
				color: 'var(--doc-white)',
			},
		},
		MuiIconButton: {
			label: {
				backgroundColor: 'inherit',
				color: 'inherit',
				transition: '0.3s',
				'&:hover': { backgroundColor: 'var(--doc-pink)', color: 'var(--doc-white)' },
				borderRadius: '50%',
				height: '24px',
				width: '24px',
			},
		},
		MuiButton: {
			label: {
				color: 'var(--doc-green)',
			},
		},
		MuiPickersToolbar: {
			toolbar: { backgroundColor: 'var(--doc-green)' },
		},
		MuiPickersStaticWrapper: {
			staticWrapperRoot: {
				width: '90%',
				border: '2px solid var(--doc-green)',
				borderRadius: '10px',
				minWidth: '200px',
				maxWidth: '300px',
			},
		},
		MuiPickersToolbarText: {
			toolbarTxt: { fontSize: '22px' },
		},
		MuiPickersBasePicker: {
			pickerView: {
				maxWidth: '300px',
				minWidth: '200px',
			},
		},
		MuiPickersCalendar: {
			week: {
				justifyContent: 'space-evenly',
			},
		},
		MuiPickersCalendarHeader: {
			daysHeader: { justifyContent: 'space-evenly' },
			dayLabel: {
				width: 'auto',
			},
		},
	},
});

const Step3 = ({ defaultTimezone, dropTimer, isPharmacy, timer }) => {
	const [showMore, setShowMore] = useState(false);
	const [appointments, setAppointments] = useState([]);
	const today = new Date().setHours(0, 0, 0, 0);
	const {
        formField: {
            appointmentDate,
			selectedSlot,
        }
    } = bookingFormModel;
	const pickerTheme = datePickerTheme();
	const {
		values: {
			appointmentDate: selectedDate,
			selectedSlot: selectedSlotValue,
			travelDate,
			travelTime,
			timezone: timezoneValue,
			landingDate,
			testType: {
				sku,
			},
		},
		setFieldValue,
	} = useFormikContext();

	const isPCR = sku === FIT_TO_FLY_PCR;
	const isSelectedSlotToday = !!selectedSlotValue && new Date(selectedSlotValue.start_time).setHours(0, 0, 0, 0) === new Date(selectedDate).setHours(0, 0, 0, 0);
	const isBundle = PRODUCTS_WITH_ADDITIONAL_INFO.includes(sku);
	const filteredAppointments = (isSelectedSlotToday && !!timer)
		? [...appointments, selectedSlotValue].sort(({ start_time: aStartTime }, { start_time: bStartTime }) => new Date(aStartTime).getTime() - new Date(bStartTime).getTime())
		: [...appointments];
	const timezone = (isBundle || isPCR) ? defaultTimezone.timezone : timezoneValue;
	const maxDate = new Date(new Date(new Date(travelDate).setHours(travelTime.getHours() - 57)).setMinutes(travelTime.getMinutes()));
	const startDateTime = new Date(new Date(maxDate).setHours(maxDate.getHours() - 15));
	const startDate = new Date(startDateTime).setHours(0,0,0,0);
	const landingDateTime = new Date(landingDate).setHours(0,0,0,0);
	// const startDate = new Date(new Date(travelDate).setDate(new Date(travelDate).getDate() - (type === 'Antigen' ? 1 : 3))).setHours(0,0,0,0);
	// const selectedDateTime = new Date(selectedDate).setHours(0,0,0,0);

	// useEffect(() => {
	// 	if (!!appointments && !!selectedDateTime) {
	// 		setFilteredAppointments([...appointments].filter(({ start_time }) => new Date(start_time).setHours(0,0,0,0) === selectedDateTime));
	// 	}
	// 	setFieldValue(selectedSlot.name, null);
	// }, [selectedDate, appointments]);

	// useEffect(() => {
	// 	bookingService
	// 		.getSlotsByTime({
	// 			date_time: moment(new Date(new Date(startDate).setHours(travelTime.getHours())).setMinutes(travelTime.getMinutes())).tz(timezone).format().replace('+', '%2B'),
	// 			date_time_to: moment(new Date(new Date(travelDate).setHours(travelTime.getHours() - 4)).setMinutes(travelTime.getMinutes())).tz(timezone).format().replace('+', '%2B'),
	// 			language: 'EN',
	// 		})
	// 		.then(result => {
	// 			if (result.success && result.appointments) {
	// 				setAppointments(result.appointments);
	// 			} else {
	// 				setAppointments([]);
	// 			}
	// 		})
	// 		.catch(err => {
	// 			console.log(err);
	// 			setAppointments([]);
	// 		});
	// 	setFieldValue(selectedSlot.name, null);
	// }, []);

	useEffect(() => {
		if (selectedDate) {
			getSlots();
		}
	}, [selectedDate]);

	const getSlots = async () => {
		if (isPCR) {
			const selectedDateTime = new Date(selectedDate).setHours(0,0,0,0);
			await bookingService
				.getSlotsByTime({
					date_time: moment(new Date(new Date(startDate).setHours(startDateTime.getHours())).setMinutes(startDateTime.getMinutes())).tz(timezone).format().replace('+', '%2B'),
					date_time_to: moment(new Date(new Date(maxDate).setHours(maxDate.getHours())).setMinutes(maxDate.getMinutes())).tz(timezone).format().replace('+', '%2B'),
					language: 'EN',
					isPharmacy,
				})
				.then(result => {
					if (result.success && result.appointments) {
						const newAppointments = [...result.appointments].filter(({ start_time }) => new Date(start_time).setHours(0,0,0,0) === selectedDateTime);
						if (new Date(selectedDate).setHours(0,0,0,0) === today) {
							const in30min = new Date(new Date().getTime() + 30 * 60000).getTime();
							setAppointments(newAppointments.filter(({ start_time }) => new Date(start_time).getTime() > in30min));
						} else {
							setAppointments(newAppointments);
						}
					} else {
						setAppointments([]);
					}
				})
				.catch(err => {
					console.log(err);
					setAppointments([]);
				});
		} else {
			await bookingService
				.getSlots(selectedDate, isPharmacy)
				.then(result => {
					if (result.success && result.appointments) {
						const newAppointments = result.appointments;
						if (new Date(selectedDate).setHours(0,0,0,0) === today) {
							const in30min = new Date(new Date().getTime() + 30 * 60000).getTime();
							setAppointments(newAppointments.filter(({ start_time }) => new Date(start_time).getTime() > in30min));
						} else {
							setAppointments(newAppointments);
						}
					} else {
						setAppointments([]);
					}
				})
				.catch(err => setAppointments([]));
		}
		if (!!selectedSlotValue && !isSelectedSlotToday) {
			await bookingService.updateAppointmentStatus(
				selectedSlotValue.id,
				{ status: 'AVAILABLE' },
				'token',
			).catch(() => console.log('error'));
			setFieldValue(selectedSlot.name, null);
			dropTimer();
		}
	}

	return (
		<React.Fragment>
			<div className='no-margin col'>
				<div className='appointment-calendar-container'>
					<p>{ADDITIONAL_PRODUCT_TEXT[sku]}</p>
					<ThemeProvider theme={pickerTheme}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Field name={appointmentDate.name}>
								{({ field, form }) => (
									<DatePicker
										{...field}
										disablePast
										variant='static'
										maxDate={isPCR ? maxDate : (isBundle ? undefined : travelDate)}
										label={appointmentDate.label}
										onChange={(value) => form.setFieldValue(field.name, value)}
										shouldDisableDate={isPCR
											? (date) => date.setHours(0,0,0,0) < startDate
											: (isBundle
												? (date) => date.setHours(0,0,0,0) < landingDateTime
												: (date) => false)}
									/>
								)}
							</Field>
						</MuiPickersUtilsProvider>
					</ThemeProvider>
					<div className='appointment-guide'>
						<div className='available guide' style={{ marginRight: 10 }}>
							<i className='fa fa-circle'></i>
							<span>Available Date(s)</span>
						</div>
						<div className='selected guide'>
							<i className='fa fa-circle'></i>
							<span>Selected Date</span>
						</div>
					</div>
				</div>
				{filteredAppointments.length > 0 ? (
					<div className='appointment-slot-container'>
						<div className='row flex-start' >
							<p style={{ margin: 0, width: 'max-content' }}>
								<b>Appointments Available (selected timezone: {timezone})</b>
							</p>
						</div>
						<div className='slot-container'>
							<Field name={selectedSlot.name}>
								{({ field, form }) =>
									(showMore ? filteredAppointments : filteredAppointments.slice(0, 18)).map((item, i) => (
										<Slot
											start_time={item.start_time}
											key={i}
											timezone={timezone}
											{...field}
											id={item.id}
											item={item}
											selectSlot={async (value) => {
												if (!!selectedSlotValue && !!timer) {
													await bookingService.updateAppointmentStatus(
														selectedSlotValue.id,
														{ status: 'AVAILABLE' },
														'token',
													).catch(() => console.log('error'));
													await getSlots();
													dropTimer();
												}
												form.setFieldValue(field.name, value);
											}}
											isSelected={
												!!selectedSlotValue ? item.id === selectedSlotValue.id : false
											}
										/>
									))
								}
							</Field>
						</div>
						{filteredAppointments.length > 18 && (
							<div className="row center">
								<DocButton
									text={showMore ? 'Show less'  : 'Show more'}
									color='green'
									onClick={() => setShowMore(!showMore)}
								/>
							</div>
						)}
					</div>
				) : (
					<p style={{ marginBottom: 0, width: 'max-content' }}>
						No available appointments at this day
					</p>
				)}
			</div>
			<Divider style={{ width: '522px', margin: '20px 0 10px 0px' }} />
			<div className='row no-margin'>
				<p>
					<strong>Selected appointment Date:&nbsp;</strong>
					{ddMMyyyy(selectedDate)}
				</p>
			</div>
			{selectedSlotValue && (
				<div className='row no-margin'>
					<p style={{ marginTop: 0 }}>
						<strong>Selected appointment Time:&nbsp;</strong>
						{formatTimeSlotWithTimeZone(selectedSlotValue.start_time, timezone)} - {formatTimeSlotWithTimeZone(selectedSlotValue.end_time, timezone)} ({timezone})
					</p>
				</div>
			)}
			<ErrorMessage component="p" className="error" name={selectedSlot.name} />
		</React.Fragment>
	);
}

export default Step3;
