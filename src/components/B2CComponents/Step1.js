import React from 'react';
import { Field, useFormikContext } from 'formik';
import DateFnsUtils from '@date-io/date-fns';
import cityTimezones from 'city-timezones';
import {
	Radio,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	FormControl,
	FormHelperText,
	Grid,
} from '@material-ui/core';
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
import { PRODUCTS_WITH_ADDITIONAL_INFO, FIT_TO_FLY_PCR } from '../../helpers/productsWithAdditionalInfo';
// import CitiesAutocomplete from '../FormComponents/CitiesAutocomplete';
// import googleService from '../../services/googleService';
import './BookingEngine.scss';

const Step1 = ({ isPharmacy }) => {
	const {
		formField: {
			transportType,
			transportNumber,
			travelDate,
			travelTime,
			landingDate,
			landingTime,
			city,
		}
	} = bookingFormModel;
	const {
		values: {
			testType: {
				sku,
			},
			transportType: transportTypeValue,
		},
		touched,
	} = useFormikContext();
	const pickerTheme = datePickerTheme();
	const isPCR = sku === FIT_TO_FLY_PCR;
	const isBundle = PRODUCTS_WITH_ADDITIONAL_INFO.includes(sku);
	const transportNumberLabel = `${transportTypeValue === 'Other' ? 'Transport' : transportTypeValue} Number`;

	return (
		<React.Fragment>
			{/* {!isPCR && (
				<>
					<div className='row'>
						<div style={{ maxWidth: '40%', minWidth: '250px', zIndex: 3 }}>
							<h4 style={{ margin: 0, padding: "20px 0 10px 0" }}>
								Where are you travelling from?
							</h4>
							<Field name={city.name}>
								{({ field, meta, form }) => (
									<CitiesAutocomplete
										{...city}
										{...field}
										style={{ width: 300 }}
										onPlaceSelected={async (place) => {
											console.log(place);
											form.setFieldValue(field.name, place.formatted_address);
											form.setFieldValue('timezone', place.utc_offset_minutes);
											await googleService()
										}}
										error={!!meta.error}
										touched={meta.touched}
										helperText={(meta.error && meta.touched) && meta.error}
									/>
								)}
							</Field>
						</div>
					</div>
				</>
			)} */}
			{isPharmacy && (
				<h4 style={{ margin: 0, paddingTop: 10 }}>
					Book your appointment for one single trip.
				</h4>
			)}
			{!isPCR && (
				<div className='row'>
					<div style={{ maxWidth: '40%', minWidth: '250px', zIndex: 3 }}>
						<h4 style={{ margin: 0, padding: "20px 0 10px 0" }}>
							Where are you travelling from?
						</h4>
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
			)}
			<div className='no-margin col'>
				<ThemeProvider theme={pickerTheme}>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Grid container>
							<Grid item xs={12} md={3}>
								<div className='appointment-calendar-container'>
									<h4 style={{ margin: 0, padding: "20px 0 10px 0" }}>
										Select Departure Date
									</h4>
									<Field name={travelDate.name}>
										{({ field, form }) => (
											<KeyboardDatePicker
												{...field}
												{...travelDate}
												disablePast={!isBundle}
												inputVariant='filled'
												format="dd/MM/yyyy"
												KeyboardButtonProps={{
													'aria-label': 'change date',
												}}
												onChange={(value) => {
													form.setFieldValue(field.name, value);
													form.setFieldValue(landingDate.name, value);
												}}
											/>
										)}
									</Field>
								</div>
							</Grid>
							<Grid item xs={12} md={3}>
								<div className='appointment-calendar-container'>
									<h4 style={{ margin: 0, padding: "20px 0 10px 0" }}>
										Select Departure Time
									</h4>
									<Field name={travelTime.name}>
										{({ field, form }) => (
											<KeyboardTimePicker
												autoOk
												{...field}
												{...travelTime}
												inputVariant='filled'
												onChange={(value) => {
													form.setFieldValue(field.name, value);
													form.setFieldValue(landingTime.name, value);
												}}
												KeyboardButtonProps={{
													'aria-label': 'change time',
												}}
											/>
										)}
									</Field>
								</div>
							</Grid>
						</Grid>
					</MuiPickersUtilsProvider>
				</ThemeProvider>
			</div>
			{isBundle && (
				<>
					<div className='no-margin col'>
						<ThemeProvider theme={pickerTheme}>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<div className='row'>
									<div className='appointment-calendar-container'>
										<h4 style={{ margin: 0, padding: "20px 0 10px 0" }}>
											Select Arrival Date (UK)
										</h4>
										<Field name={landingDate.name}>
											{({ field, form }) => (
												<KeyboardDatePicker
												{...field}
												{...landingDate}
												disablePast={!isBundle}
												inputVariant='filled'
												format="dd/MM/yyyy"
												KeyboardButtonProps={{
													'aria-label': 'change date',
												}}
												onChange={(value) => {
													form.setFieldValue(field.name, value);
													form.setFieldValue('appointmentDate', value);
												}}
											/>
											)}
										</Field>
									</div>
									<div className='appointment-calendar-container'>
										<h4 style={{ margin: 0, padding: "20px 0 10px 0" }}>
											Select Arrival Time (UK)
										</h4>
										<Field name={landingTime.name}>
											{({ field, form }) => (
												<KeyboardTimePicker
												autoOk
												{...field}
												{...landingTime}
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
					<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
						<div style={{ maxWidth: '40%', minWidth: '320px' }}>
							<Field
								name={transportType.name}
							>
								{({ field, form, meta }) => (
									<FormControl component='fieldset' style={{ width: '100%' }}>
										<FormLabel required={transportType.required} component='legend'>
											{transportType.label}
										</FormLabel>
										<RadioGroup
											error={!!meta.error}
											touched={meta.touched}
											helperText={(meta.error && meta.touched) && meta.error}
											aria-label={transportType.name}
											name={transportType.name}
											value={field.value}
											{...transportType}
											{...field}
											onChange={(({ target: { value } }) => {
												form.setFieldValue(field.name, value);
											})}
										>
											<FormControlLabel value="Flight" control={<Radio />} label="Flight" />
											<FormControlLabel value="Train" control={<Radio />} label="Train" />
											<FormControlLabel value="Other" control={<Radio />} label="Other" />
										</RadioGroup>
									</FormControl>
								)}
							</Field>
						</div>
					</div>
					<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
						<div style={{ maxWidth: '40%', minWidth: '300px' }}>
							<h4 style={{ margin: 0, padding: "20px 0 10px 0" }}>
								{transportNumberLabel}
							</h4>
							<Field name={transportNumber.name} validate={(value) => (!value && touched.transportNumber) ? `Input ${transportNumberLabel}` : undefined}>
								{({ field, meta }) => (
									<Input
										{...field}
										{...transportNumber}
										label={transportNumberLabel}
										error={!!meta.error}
										touched={meta.touched}
										helperText={(meta.error && meta.touched) && meta.error}
									/>
								)}
							</Field>
						</div>
					</div>
				</>
			)}
		</React.Fragment>
	);
};

export default Step1;
