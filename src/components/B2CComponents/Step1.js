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
import PRODUCTS_WITH_ADDITIONAL_INFO from '../../helpers/productsWithAdditionalInfo';
import './BookingEngine.scss';

const ALLOW_PAST_DATE = [
	'Test to Release [England]',
	'Green Bundle',
	'Amber Short Stay',
	'Amber Bundle',
];

const Step1 = () => {
	const {
		formField: {
			vaccineType,
			vaccineNumber,
			vaccineTypeName,
			vaccineStatus,
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
				type,
				title,
			},
			vaccineStatus: vaccineStatusValue,
			vaccineType: vaccineTypeValue,
			transportType: transportTypeValue,
		},
		touched,
	} = useFormikContext();
	const pickerTheme = datePickerTheme();
	const isPCR = type === 'PCR' && title.includes('Fit to Travel');
	const isBundle = PRODUCTS_WITH_ADDITIONAL_INFO.includes(title);
	const allowPast = ALLOW_PAST_DATE.includes(title);
	const transportNumberLabel = `${transportTypeValue === 'Other' ? 'Transport' : transportTypeValue} Number`;

	return (
		<React.Fragment>
			{!isPCR && (
				<>
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
				</>
			)}
			<div className='no-margin col'>
				<ThemeProvider theme={pickerTheme}>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<div className='row'>
							<div className='appointment-calendar-container'>
								<h4 style={{ margin: 0, padding: "20px 0 10px 0" }}>
									Select Departure Date
								</h4>
								<Field name={travelDate.name}>
									{({ field, form }) => (
										<KeyboardDatePicker
											{...field}
											{...travelDate}
											disablePast={!allowPast}
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
						</div>
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
												disablePast={!allowPast}
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
					<div className='row' style={{ flexWrap: 'wrap', width: '60%', paddingTop: 20 }}>
						<div style={{ maxWidth: '40%', minWidth: '320px' }}>
							<Field
								name={vaccineStatus.name}
							>
								{({ field, form, meta }) => (
									<FormControl component='fieldset' style={{ width: '100%' }}>
										<FormLabel required={vaccineStatus.required} component='legend'>
											{vaccineStatus.label}
										</FormLabel>
										<RadioGroup
											error={!!meta.error}
											touched={meta.touched}
											helperText={(meta.error && meta.touched) && meta.error}
											aria-label={vaccineStatus.name}
											name={vaccineStatus.name}
											value={field.value}
											style={{ display: 'inline' }}
											{...vaccineStatus}
											{...field}
											onChange={(({ target: { value } }) => {
												form.setFieldValue(field.name, value);
											})}
										>
											<FormControlLabel value='yes' control={<Radio />} label="Yes" />
											<FormControlLabel value='no' control={<Radio />} label="No" />
										</RadioGroup>
									</FormControl>
								)}
							</Field>
						</div>
					</div>
					{vaccineStatusValue === 'yes' && (
						<>
							<div className='row' style={{ flexWrap: 'wrap', width: '60%', paddingTop: 20 }}>
								<div style={{ maxWidth: '40%', minWidth: '320px' }}>
									<Field
										name={vaccineType.name}
									>
										{({ field, form, meta }) => (
											<FormControl component='fieldset' style={{ width: '100%' }}>
												<FormLabel required={vaccineType.required} component='legend'>
													{vaccineType.label}
												</FormLabel>
												<RadioGroup
													error={!!meta.error}
													touched={meta.touched}
													helperText={(meta.error && meta.touched) && meta.error}
													aria-label={vaccineType.name}
													name={vaccineType.name}
													value={field.value}
													{...vaccineType}
													{...field}
													onChange={(({ target: { value } }) => {
														form.setFieldValue(field.name, value);
													})}
												>
													<FormControlLabel value="Pfizer" control={<Radio />} label="Pfizer/BioNTech" />
													<FormControlLabel value="Astrazeneca" control={<Radio />} label="Oxford/AstraZeneca" />
													<FormControlLabel value="Moderna" control={<Radio />} label="Moderna" />
													<FormControlLabel value="Johnson & Johnson" control={<Radio />} label="Johnson & Johnson" />
													<FormControlLabel value="Sputnik" control={<Radio />} label="Sputnik V" />
													<FormControlLabel value="Other" control={<Radio />} label="Other" />
												</RadioGroup>
											</FormControl>
										)}
									</Field>
								</div>
							</div>
							{vaccineTypeValue === 'Other' && (
								<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
									<div style={{ maxWidth: '40%', minWidth: '300px' }}>
										<h4 style={{ margin: 0, padding: "20px 0 10px 0" }}>
											{vaccineTypeName.label}
										</h4>
										<Field name={vaccineTypeName.name} validate={(value) => (!value && touched.vaccineTypeName) ? 'Input Vaccine Name' : undefined}>
											{({ field, meta }) => (
												<Input
													error={!!meta.error}
													touched={meta.touched}
													helperText={(meta.error && meta.touched) && meta.error}
													{...vaccineTypeName}
													{...field}
												/>
											)}
										</Field>
									</div>
								</div>
							)}
							<div className='row' style={{ flexWrap: 'wrap', width: '60%', paddingTop: 20 }}>
								<div style={{ maxWidth: '40%', minWidth: '320px' }}>
									<Field
										name={vaccineNumber.name}
									>
										{({ field, form, meta }) => (
											<FormControl component='fieldset' style={{ width: '100%' }}>
												<FormLabel required={vaccineNumber.required} component='legend'>
													{vaccineNumber.label}
												</FormLabel>
												<RadioGroup
													error={!!meta.error}
													touched={meta.touched}
													helperText={(meta.error && meta.touched) && meta.error}
													aria-label={vaccineNumber.name}
													name={vaccineNumber.name}
													value={field.value}
													{...vaccineNumber}
													{...field}
													onChange={(({ target: { value } }) => {
														form.setFieldValue(field.name, value);
													})}
												>
													<FormControlLabel value="One dose of vaccine" control={<Radio />} label="One dose of vaccine" />
													<FormControlLabel value="Two doses of vaccine" control={<Radio />} label="Two doses of vaccine" />
												</RadioGroup>
											</FormControl>
										)}
									</Field>
								</div>
							</div>
						</>
					)}
				</>
			)}
		</React.Fragment>
	);
};

export default Step1;
