import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import './DocCalendar.scss';
import { calc8thWorkingDay } from '../../../helpers/calcWorkingDays';

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
				color: 'var(--doc-green)',
				backgroundColor: 'var(--doc-white)',
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

const otherDatePickerTheme = createMuiTheme({
	overrides: {
		MuiPickersDatePickerRoot: { toolbar: { display: 'none' } },
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
				color: 'var(--doc-green)',
				backgroundColor: 'var(--doc-white)',
			},
			dayDisabled: {
				color: 'var(--doc-dark-grey)',
				opacity: '0.5',
				backgroundColor: 'var(--doc-white)!important',
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
const DocCalendar = ({ date, updateDate, maxDate, availableDates, handleDisableDates }) => {
	return (
		<ThemeProvider theme={datePickerTheme}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<DatePicker
					label='Select Date'
					value={date}
					onChange={updateDate}
					variant='static'
					maxDate={maxDate}
					disablePast
					shouldDisableDate={handleDisableDates}
				/>
			</MuiPickersUtilsProvider>
		</ThemeProvider>
	);
};
export const DocCalendarSpecial = ({ label, date, updateDate, maxDate, enablePast }) => {
	const lastDay = calc8thWorkingDay(new Date());
	return (
		<React.Fragment>
			<ThemeProvider theme={otherDatePickerTheme}>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<DatePicker
						label={typeof label === 'undefined' ? 'Select Date' : label}
						value={date}
						onChange={updateDate}
						variant='static'
						maxDate={typeof maxDate === 'undefined' ? null : maxDate}
						disablePast={typeof enablePast === 'undefined' ? true : false}
						shouldDisableDate={date => {
							if (new Date(date).getTime() <= new Date(lastDay).getTime()) {
								// date is more than 8 working days away so do not disable
								return true;
							} else {
								return false;
							}
						}}
					/>
				</MuiPickersUtilsProvider>
			</ThemeProvider>
		</React.Fragment>
	);
};

export default DocCalendar;
