import React from 'react';
import './BookingEngine.scss';
import datesAreSameDay from '../../helpers/datesAreSameDay';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import Slot from './Slot';
import { formatTimeSlot } from '../../helpers/formatDate';
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
const Step1 = ({ appointments, availableDates, date, updateDate, selectedSlot, updateSlot }) => {
	const today = new Date();
	const in40days = new Date(today.setDate(today.getDate() + 40));
	function disableDates(date) {
		const day = availableDates.filter(item => datesAreSameDay(item.date, date));
		return day && day.length === 1 && typeof day[0].has_appointments !== 'undefined'
			? !day[0].has_appointments
			: false;
	}
	return (
		<React.Fragment>
			<div className='no-margin col'>
				<div className='appointment-calendar-container'>
					<ThemeProvider theme={datePickerTheme}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<DatePicker
								label='Select Date'
								value={date}
								onChange={updateDate}
								variant='static'
								maxDate={in40days}
								disablePast
								shouldDisableDate={typeof availableDates !== 'undefined' ? disableDates : null}
							/>
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
							{appointments.map((item, i) => {
								return (
									<Slot
										start_time={item.start_time}
										key={i}
										id={item.id}
										selectSlot={updateSlot}
										isSelected={
											typeof selectedSlot === 'undefined' ? false : item.id === selectedSlot.id
										}
									/>
								);
							})}
						</div>
					</div>
				) : (
					<></>
				)}
			</div>
		</React.Fragment>
	);
};

export default Step1;
