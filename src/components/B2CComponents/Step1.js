import React from 'react';
import { Field } from 'formik';
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

const Step1 = () => {
	const {
        formField: {
            travelDate,
			travelTime,
			city,
        }
    } = bookingFormModel;
	const pickerTheme = datePickerTheme();

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
