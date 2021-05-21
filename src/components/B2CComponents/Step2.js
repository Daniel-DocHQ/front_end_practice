import React, { useState, useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';
// import moment from 'moment-timezone';
import { Field, useFormikContext, ErrorMessage } from 'formik';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import bookingService from '../../services/bookingService';
import bookingFormModel from './bookingFormModel';
import { ddMMyyyy, formatTimeSlotWithTimeZone } from '../../helpers/formatDate';
import Slot from './Slot';
import './BookingEngine.scss';

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
				backgroundColor: 'var(--doc-green)',
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

const Step3 = () => {
	const [appointments, setAppointments] = useState([]);
	const today = new Date().setHours(0, 0, 0, 0);
	// const [filteredAppointments, setFilteredAppointments] = useState([]);
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
			// travelDate,
			// travelTime,
			timezone,
			// testType: {
			// 	product: {
			// 		type,
			// 	},
			// },
		},
		setFieldValue,
	} = useFormikContext();

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
	function getSlots() {
		bookingService
			.getSlots(selectedDate)
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
		setFieldValue(selectedSlot.name, null);
	}

	return (
		<React.Fragment>
			<div className='no-margin col' sty>
				<div className='appointment-calendar-container'>
					<p>Please make sure that you book an appointment in the time window required by the destination country or airline for any PCR test or Antigen test requirement.</p>
					<ThemeProvider theme={pickerTheme}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Field name={appointmentDate.name}>
								{({ field, form }) => (
									<DatePicker
										{...field}
										disablePast
										variant='static'
										// maxDate={travelDate}
										label={appointmentDate.label}
										onChange={(value) => form.setFieldValue(field.name, value)}
										// shouldDisableDate={(date) => date.setHours(0,0,0,0) < startDate}
									/>
								)}
							</Field>
						</MuiPickersUtilsProvider>
					</ThemeProvider>
					<div className='appointment-guide'>
						<div className='available guide'>
							<i className='fa fa-circle'></i>
							<span>Available Date(s)</span>
						</div>
					</div>
				</div>
				{appointments.length > 0 && (
					<div className='appointment-slot-container'>
						<div className='row flex-start' >
							<h3 style={{ marginBottom: 0 }}>Appointments Available (selected timezone: {timezone})</h3>
						</div>
						<div className='slot-container'>
							<Field name={selectedSlot.name}>
								{({ field, form }) =>
									appointments.map((item, i) => (
										<Slot
											start_time={item.start_time}
											key={i}
											timezone={timezone}
											{...field}
											id={item.id}
											item={item}
											selectSlot={(value) => form.setFieldValue(field.name, value)}
											isSelected={
												!!selectedSlotValue ? item.id === selectedSlotValue.id : false
											}
										/>
									))
								}
							</Field>
						</div>
					</div>
				)}
			</div>
			<div className='row no-margin'>
				<p >
					<strong>Selected appointment Date:&nbsp;</strong>
					{ddMMyyyy(selectedDate)}
				</p>
			</div>
			{appointments.length <= 0 && (
				<>No available appointments at this day</>
			)}
			{selectedSlotValue && (
				<div className='row no-margin'>
					<p style={{ marginTop: 0 }}>
						<strong>Selected appointment Time:&nbsp;</strong>
						{formatTimeSlotWithTimeZone(selectedSlotValue.start_time, timezone)} - {formatTimeSlotWithTimeZone(selectedSlotValue.end_time, timezone)}
					</p>
				</div>
			)}
			<ErrorMessage component="p" className="error" name={selectedSlot.name} />
		</React.Fragment>
	);
}

export default Step3;
