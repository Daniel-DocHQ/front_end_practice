import React from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { useEffect } from 'react';

const datePickerTheme = createMuiTheme({
	overrides: {
		MuiTypography: {
			colorPrimary: { color: 'var(--doc-pink)' },
		},
		MuiPickersMonth: { monthSelected: { color: 'var(--doc-pink)' } },
		MuiPickersDay: {
			daySelected: {
				backgroundColor: 'var(--doc-pink)',
				color: 'var(--doc-white)',
				'&:hover': { backgroundColor: 'var(--doc-pink)', color: 'var(--doc-white)' },
			},
		},
		MuiButton: {
			label: {
				color: 'var(--doc-green)',
			},
		},
	},
});
const AppointmentDate = ({ value, minDate, format, onChange, updateStatus, required }) => {
	if (format === 'US') {
		format = 'MM/dd/yyyy';
	}
	useEffect(() => {
		if (value === '' && updateStatus) {
			updateStatus(false, 'appointment date');
		}
	}, [value]);
	return required === true ? (
		<ThemeProvider theme={datePickerTheme}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<DatePicker
					disableToolbar
					inputVariant='filled'
					minDate={new Date()}
					minDateMessage=''
					openTo='month'
					format='dd/MM/yyyy'
					label='Appointment Date'
					views={['year', 'month', 'date']}
					value={value}
					onChange={onChange}
					KeyboardButtonProps={{
						'aria-label': 'Change appointment date',
					}}
					hintText='Select your appointment date'
					style={{ flex: 1 }}
					required
				/>
			</MuiPickersUtilsProvider>
		</ThemeProvider>
	) : (
		<ThemeProvider theme={datePickerTheme}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<DatePicker
					disableToolbar
					inputVariant='filled'
					minDate={new Date()}
					minDateMessage=''
					openTo='year'
					format='dd/MM/yyyy'
					label='Appointment Date'
					views={['year', 'month', 'date']}
					value={value}
					onChange={onChange}
					KeyboardButtonProps={{
						'aria-label': 'Change appointment date',
					}}
					hintText='Select your appointment date'
					style={{ flex: 1 }}
				/>
			</MuiPickersUtilsProvider>
		</ThemeProvider>
	);
};
export default AppointmentDate;
