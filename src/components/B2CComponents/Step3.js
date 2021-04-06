import React, { useState, useEffect, useContext } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { Field, useFormikContext } from 'formik';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import bookingService from '../../services/bookingService';
import datesAreSameDay from '../../helpers/datesAreSameDay';
import { AuthContext } from '../../context/AuthContext';
import bookingFormModel from './bookingFormModel';
import Slot from './Slot';
import './BookingEngine.scss';

const datePickerTheme = createMuiTheme({
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
				color: 'var(--doc-white)',
			},
			dayDisabled: {
				color: 'var(--doc-dark-grey)',
				opacity: '0.5',
				backgroundColor: 'var(--doc-white)!important',
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
	const { token } = useContext(AuthContext);
	const [appointments, setAppointments] = useState();
	const [availableDates, setAvailableDates] = useState();
	const today = new Date();
	const in40days = new Date(today.setDate(today.getDate() + 40));
	const dateRange = {
		start: `${('0' + today.getDate()).slice(-2)}-${('0' + today.getMonth()).slice(-2)}-${today.getFullYear()}`,
		end: `${('0' + in40days.getDate()).slice(-2)}-${('0' + (in40days.getMonth() +1 )).slice(-2)}-${in40days.getFullYear()}`,
	};
	const {
        formField: {
            appointmentDate,
			selectedSlot,
        }
    } = bookingFormModel;
	const { values: { appointmentDate: selectedDate }, setFieldValue } = useFormikContext();

	function getSlots() {
		bookingService
			.getSlots(typeof selectedDate === 'undefined' ? new Date() : selectedDate)
			.then(result => {
				if (result.success && result.appointments) {
					setAppointments(result.appointments);
				} else {
					// handle
				}
			})
			.catch(err => console.log(err));
	}
	function getAvailableDates() {
		bookingService
			.getAvailableDates(dateRange.start, dateRange.end, token)
			.then(result => {
				if (result.success && result.availableDates) {
					setAvailableDates(result.availableDates);
					const firstAvailableDate = result.availableDates.find(({ has_appointments }) => has_appointments);
					setFieldValue(appointmentDate.name, !!firstAvailableDate && !!firstAvailableDate.date ? firstAvailableDate.date : null);
				} else {
					// handle
				}
			})
			.catch(err => console.log(err));
	};
	function disableDates(date) {
		const day = availableDates.filter(item => datesAreSameDay(item.date, date));
		return day && day.length === 1 && typeof day[0].has_appointments !== 'undefined'
			? !day[0].has_appointments
			: false;
	};

	useEffect(() => {
		if (availableDates === null || typeof availableDates === 'undefined') {
			// get available days
			getAvailableDates();
		}
	}, []);
	useEffect(() => {
		if (selectedDate) {
			getSlots();
		}
	}, [selectedDate]);

	return (
		<React.Fragment>
			<div className='no-margin col'>
				<div className='appointment-calendar-container'>
					<ThemeProvider theme={datePickerTheme}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Field name={appointmentDate.name}>
								{({ field, form }) => (
									<DatePicker
										{...field}
										variant='static'
										label={appointmentDate.label}
										maxDate={in40days}
										disablePast
										shouldDisableDate={typeof availableDates !== 'undefined' ? disableDates : null}
										onChange={(value) => form.setFieldValue(field.name, value)}
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
				{typeof appointments !== 'undefined' && appointments.length > 0 ? (
					<div className='appointment-slot-container'>
						<div className='row flex-start'>
							<h3 id='appointments'>Appointments Available</h3>
						</div>
						<div className='slot-container'>
							<Field name={selectedSlot.name}>
								{({ field, form }) =>
									appointments.map((item, i) => {
										return (
											<Slot
												start_time={item.start_time}
												key={i}
												{...field}
												id={item.id}
												selectSlot={(value) => form.setFieldValue(field.name, value)}
												isSelected={
													typeof selectedSlot === 'undefined' ? false : item.id === selectedSlot.id
												}
											/>
										);
									})
								}
							</Field>
						</div>
					</div>
				) : (
					<></>
				)}
			</div>
		</React.Fragment>
	);
}

export default Step3;
