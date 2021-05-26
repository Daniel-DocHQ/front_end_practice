import React, { useEffect } from 'react';
import { Field, useFormikContext } from 'formik';
import DateFnsUtils from '@date-io/date-fns';
import cityTimezones from 'city-timezones';
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ThemeProvider } from '@material-ui/styles';
import bookingFormModel from './bookingFormModel';
import Input from '../FormComponents/Input';
import datePickerTheme from '../../helpers/datePickerTheme';
import './BookingEngine.scss';

const Step1 = ({ defaultTimezone }) => {
	const {
        formField: {
            travelDate,
			travelTime,
			city,
        }
    } = bookingFormModel;
	const { values: { testType: { Type } }, setFieldValue} = useFormikContext();
	const pickerTheme = datePickerTheme();
	const isPCR = Type === 'PCR';

	useEffect(() => {
		if (isPCR) {
			setFieldValue('timezone', defaultTimezone);
		}
	}, []);

	return (
		<React.Fragment>
			{!isPCR && (
				<>
					<h4 style={{ margin: 0, paddingTop: 20 }}>
						Where are you flying from?
					</h4>
					<div className='row'>
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
											if (!!newValue && !!newValue.timezone) {
												form.setFieldValue('timezone', newValue.timezone);
											}
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
				</>
			)}
			<h4 style={{ margin: 0, paddingTop: 20 }}>
				Select Departure Date
			</h4>
			<div className='no-margin col'>
				<ThemeProvider theme={pickerTheme}>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<div className='row'>
							<div className='appointment-calendar-container'>
								<Field name={travelDate.name}>
									{({ field, form }) => (
										<KeyboardDatePicker
											{...field}
											{...travelDate}
											disablePast
											inputVariant='filled'
											format="dd/MM/yyyy"
											KeyboardButtonProps={{
												'aria-label': 'change date',
											}}
											onChange={(value) => {
												form.setFieldValue(field.name, value);
											}}
										/>
									)}
								</Field>
							</div>
							<div className='appointment-calendar-container'>
								<Field name={travelTime.name}>
									{({ field, form }) => (
										<KeyboardTimePicker
											autoOk
											{...field}
											{...travelTime}
											inputVariant='filled'
											onChange={(value) => form.setFieldValue(field.name, value)}
											KeyboardButtonProps={{
												'aria-label': 'change time',
											}}
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
