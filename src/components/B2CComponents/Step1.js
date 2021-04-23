import React from 'react';
import { Field } from 'formik';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import { createMuiTheme, Box } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import bookingFormModel from './bookingFormModel';
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
				marginTop: '5px',
				marginBottom: '5px',
				color: 'var(--doc-black)',
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

const Step1 = () => {

	const {
        formField: {
            travelDate,
			travelTime,
        }
    } = bookingFormModel;

	return (
		<React.Fragment>
			<div className='no-margin col'>
				<ThemeProvider theme={datePickerTheme}>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<div className='row'>
							<div className='appointment-calendar-container'>
								<Field name={travelDate.name}>
									{({ field, form }) => (
										<DatePicker
											{...field}
											variant='static'
											disablePast
											label={travelDate.label}
											onChange={(value) => form.setFieldValue(field.name, value)}
										/>
									)}
								</Field>
							</div>
							<div className='appointment-calendar-container'>
								<Field name={travelTime.name}>
									{({ field, form }) => (
										<TimePicker
											autoOk
											{...field}
											openTo="hours"
											variant="static"
											label={travelTime.label}
											onChange={(value) => form.setFieldValue(field.name, value)}
										/>
									)}
								</Field>
							</div>
						</div>
					</MuiPickersUtilsProvider>
				</ThemeProvider>
			</div>
		</React.Fragment>
	);
};

export default Step1;
