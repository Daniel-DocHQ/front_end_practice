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
const DateOfBirth = ({ value, minDate, format, onChange, updateStatus, required, disabled }) => {
	if (format === 'US') {
		format = 'MM/dd/yyyy';
	}
	useEffect(() => {
		if (value === '' && updateStatus) {
			updateStatus(false, 'date of birth');
		}
	}, [value]);
	return required === true ? (
		<ThemeProvider theme={datePickerTheme}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<DatePicker
					disableFuture
					disableToolbar
					inputVariant='filled'
					minDate={minDate || '01/01/1901'}
					minDateMessage=''
					openTo='year'
					format='dd/MM/yyyy'
					label='Date of birth'
					views={['year', 'month', 'date']}
					value={value}
					onChange={onChange}
					KeyboardButtonProps={{
						'aria-label': 'Change date of birth',
					}}
					hintText='Date Of Birth'
					autoComplete='bday'
					style={{ flex: 1 }}
					required
					disabled={typeof disabled === 'undefined' ? false : disabled}
				/>
			</MuiPickersUtilsProvider>
		</ThemeProvider>
	) : (
		<ThemeProvider theme={datePickerTheme}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<DatePicker
					disableFuture
					disableToolbar
					inputVariant='filled'
					minDate={minDate || '01/01/1901'}
					minDateMessage=''
					openTo='year'
					format='dd/MM/yyyy'
					label='Date of birth'
					views={['year', 'month', 'date']}
					value={value}
					onChange={onChange}
					KeyboardButtonProps={{
						'aria-label': 'Change date of birth',
					}}
					hintText='Date Of Birth'
					autoComplete='bday'
					style={{ flex: 1 }}
					disabled={typeof disabled === 'undefined' ? false : disabled}
				/>
			</MuiPickersUtilsProvider>
		</ThemeProvider>
	);
};
export default DateOfBirth;
