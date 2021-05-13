import React from 'react';
import { Field, useFormikContext } from 'formik';
import DateFnsUtils from '@date-io/date-fns';
import cityTimezones from 'city-timezones';
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import { createMuiTheme } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ThemeProvider } from '@material-ui/styles';
import bookingFormModel from './bookingFormModel';
import { ddMMyyyy, formatTimeSlot } from '../../helpers/formatDate';
import './BookingEngine.scss';
import Input from '../FormComponents/Input';

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
			hidden: {
				opacity: '0 !important',
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
			city,
        }
    } = bookingFormModel;

	const { values: {
		travelDate: selectedDate,
		travelTime: selectedTime,
	} } = useFormikContext();

	return (
		<React.Fragment>
			<div className='row'>
				<div style={{ paddingRight: 50 }}>
					<p>
						Where are you flying from?
					</p>
				</div>
				<div style={{ maxWidth: '40%', minWidth: '250px', zIndex: 3 }}>
					<Field name={city.name}>
						{({ field, meta, form }) => (
							<Autocomplete
								{...field}
								options={cityTimezones.cityMapping}
								getOptionLabel={({city, country}) => city ? `${city}, ${country}` : ''}
								style={{ width: 300 }}
								onChange={(event, newValue) => {
									form.setFieldValue(city.name, newValue);
									form.setFieldValue('timezone', newValue.timezone);
								}}
								renderInput={(params) => <Input
									{...params}
									{...city}
									error={!!meta.error}
									touched={meta.touched}
									helperText={(meta.error && meta.touched) && meta.error}
								/>}
							/>
						)}
					</Field>
				</div>
			</div>
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
											onChange={(value) => {
												const appointmentDate = new Date(value).setDate(value.getDate() - 1);
												form.setFieldValue(field.name, value);
												form.setFieldValue('appointmentDate', new Date(appointmentDate));
											}}
										/>
									)}
								</Field>
								<div className='row'>
									<p>
										<strong>Selected Date:&nbsp;</strong>
										{ddMMyyyy(selectedDate)}
									</p>
								</div>
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
								<div className='row'>
									<p>
										<strong>Selected Time:&nbsp;</strong>
										{formatTimeSlot(selectedTime)}
									</p>
								</div>
							</div>
						</div>
					</MuiPickersUtilsProvider>
				</ThemeProvider>
			</div>
		</React.Fragment>
	);
};

export default Step1;
