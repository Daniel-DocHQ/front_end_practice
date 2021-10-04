import React, { useEffect } from 'react';
import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
    InputLabel,
    ListSubheader,
    Select,
    MenuItem,
	makeStyles,
    FormHelperText,
    Tooltip,
} from '@material-ui/core';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers';
import { get } from 'lodash';
import moment from 'moment';
import parsePhoneNumber, { isValidPhoneNumber } from 'libphonenumber-js'
import DateFnsUtils from '@date-io/date-fns';
import { ThemeProvider } from '@material-ui/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Field, useFormikContext } from 'formik';
import Input from '../FormComponents/Input';
import bookingFormModel from './bookingFormModel';
import COUNTRIES from '../../helpers/countries';
import datePickerTheme from '../../helpers/datePickerTheme';
import preventCopyPaste from '../../helpers/preventCopyPaste';
import { PRODUCTS_WITH_ADDITIONAL_INFO } from '../../helpers/productsWithAdditionalInfo';
import './BookingEngine.scss';

const passportIdImage = require('../../assets/images/passportId.webp');

const countryToFlag = (isoCode) => (
	typeof String.fromCodePoint !== 'undefined'
		? isoCode
			.toUpperCase()
			.replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
		: isoCode
);

const useStyles = makeStyles({
	option: {
	  fontSize: 15,
	  '& > span': {
		marginRight: 10,
		fontSize: 18,
	  },
	},
});

const Step3 = ({
    isEdit,
    isPharmacy,
    defaultCountryCode,
    activePassenger,
    isLufthansa = false,
}) => {
	const classes = useStyles();
    const pickerTheme = datePickerTheme();
    const {
        values: {
            passengers,
            bookingUsers,
            testType: {
				sku,
			},
        },
        touched,
    } = useFormikContext();
    const isBundle = PRODUCTS_WITH_ADDITIONAL_INFO.includes(sku);
    const {
        formField: {
            vaccineType,
			vaccineNumber,
			vaccineTypeName,
			vaccineStatus,
            firstName,
            lastName,
            email,
            phone,
            countryCode,
            dateOfBirth,
            ethnicity,
            sex,
            passportNumber,
            passportNumberConfirmation,
            fillWithBookingUser,
            postalCode,
            streetAddress,
            extendedAddress,
            locality,
            region,
            country,
        },
    } = bookingFormModel;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activePassenger]);

	return (
		<React.Fragment>
            {(!!bookingUsers.length && !isEdit) && (
                <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                    <div style={{ maxWidth: '40%', minWidth: '340px' }}>
                        <Field
                            name={`passengers[${activePassenger}].fillWithBookingUser`}
                        >
                            {({ field, form, meta }) => (
                                <FormControl component='fieldset' style={{ width: '100%' }}>
                                    <FormLabel component='legend'>
                                        {fillWithBookingUser.label}
                                    </FormLabel>
                                    <RadioGroup
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        value={field.value}
                                        aria-label={fillWithBookingUser.name}
								        name={fillWithBookingUser.name}
                                        {...fillWithBookingUser}
                                        {...field}
                                        onChange={(({ target: { value } }) => {
                                            form.setFieldValue(field.name, value);
                                            const bookingUser = bookingUsers[parseInt(value)];
                                            const { phone } = bookingUser;
                                            const parsedPhoneNumber = parsePhoneNumber(phone);
                                            form.setFieldValue(`passengers[${activePassenger}]`, {
                                                ...bookingUser,
                                                phone: !!parsedPhoneNumber ? parsedPhoneNumber.nationalNumber : phone,
								                countryCode: !!parsedPhoneNumber ? COUNTRIES.find(({ code, label }) => (code === parsedPhoneNumber.country && label === `+${parsedPhoneNumber.countryCallingCode}`)) : defaultCountryCode,
                                                fillWithBookingUser: value,
                                            });
                                        })}
                                    >
                                        {bookingUsers.map(({ firstName, lastName }, indx) => (
                                            <FormControlLabel
                                                disabled={!!passengers.find(({ fillWithBookingUser }, tmp) => (fillWithBookingUser === String(indx) && tmp !== activePassenger))}
                                                key={indx}
                                                value={String(indx)}
                                                control={<Radio />}
                                                label={`${firstName} ${lastName}`}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )}
                        </Field>
                    </div>
                </div>
            )}
            <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                <div style={{ maxWidth: '40%', minWidth: '340px' }}>
                    <Field name={`passengers[${activePassenger}].firstName`} validate={(value) => (!value && get(touched, `passengers[${activePassenger}].firstName`, false)) ? 'Input first name' : undefined}>
                        {({ field, meta }) => (
                            <Input
                                error={!!meta.error}
                                touched={meta.touched}
                                helperText={(meta.error && meta.touched) && meta.error}
                                {...firstName}
                                {...field}
                            />
                        )}
                    </Field>
                </div>
			</div>
			<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
				<div style={{ maxWidth: '40%', minWidth: '340px' }}>
                    <Field name={`passengers[${activePassenger}].lastName`} validate={(value) => (!value && get(touched, `passengers[${activePassenger}].lastName`, false)) ? 'Input last name' : undefined}>
                        {({ field, meta }) => (
                            <Input
                                error={!!meta.error}
                                touched={meta.touched}
                                helperText={(meta.error && meta.touched) && meta.error}
                                {...lastName}
                                {...field}
                            />
                        )}
                    </Field>
                </div>
			</div>
			<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
				<div style={{ maxWidth: '40%', minWidth: '340px' }}>
                    <Field
                        name={`passengers[${activePassenger}].email`}
                        validate={(value) => {
                            let error;
                            if (get(touched, `passengers[${activePassenger}].email`, false)) {
                                if (!value) {
                                    error = 'Input email';
                                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
                                    error = 'Invalid email address';
                                }
                            }
                            return error;
                        }}
                    >
                        {({ field, meta }) => (
                            <Input
                                error={!!meta.error}
                                touched={meta.touched}
                                helperText={(meta.error && meta.touched) && meta.error}
                                {...email}
                                {...field}
                            />
                        )}
                    </Field>
                </div>
			</div>
			<div className='row' style={{ flexWrap: 'wrap', alignItems: 'self-start' }}>
				<div style={{ maxWidth: '50%', marginRight: 30 }}>
                    <Field
                        name={`passengers[${activePassenger}].countryCode`}
						validate={(value) => {
                            let error;
                            if (get(touched, `passengers[${activePassenger}].countryCode`, false)) {
                                if (!value) {
                                    error = 'Select country code';
                                }
                            }
                            return error;
                        }}
                    >
						{({ field, form, meta }) => (
							<Autocomplete
								id="country-select-demo"
								style={{ width: 320 }}
								options={COUNTRIES}
								classes={{
									option: classes.option,
								}}
								disableClearable
								value={field.value}
								autoHighlight
								getOptionLabel={(option) => option.label}
								renderOption={(option) => (
									<React.Fragment>
                                        <span>{countryToFlag(option.code)}</span>
                                        {option.country} ({option.code}) {option.label}
									</React.Fragment>
								)}
								onChange={(event, newValue) => {
									form.setFieldValue(field.name, newValue);
								}}
								renderInput={(params) => (
									<Input
										{...field}
										{...params}
										{...countryCode}
										error={!!meta.error}
										touched={meta.touched}
										helperText={(meta.error && meta.touched) && meta.error}
										variant="filled"
										inputProps={{
											...params.inputProps,
										}}
									/>
								)}
							/>
						)}
					</Field>
				</div>
                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field
                        name={`passengers[${activePassenger}].phone`}
                        validate={(value) => {
                            let error;
                            const countryCode = get(passengers, `[${activePassenger}].countryCode.label`, '+44');
                            if (get(touched, `passengers[${activePassenger}].phone`, false)) {
                                if (!value) {
                                    error = 'Input phone';
                                } else if (!isValidPhoneNumber(countryCode + value)) {
                                    error = 'Invalid phone number. Input phone without country code';
                                }
                            }
                            return error;
                        }}
                    >
                        {({ field, meta }) => (
                            <Input
                                error={!!meta.error}
                                touched={meta.touched}
                                helperText={(meta.error && meta.touched) && meta.error}
                                {...phone}
                                {...field}
                            />
                        )}
                    </Field>
                </div>
		    </div>
            <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                <div style={{ maxWidth: '40%', minWidth: '340px' }}>
                    <ThemeProvider theme={pickerTheme}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Field
                                name={`passengers[${activePassenger}].dateOfBirth`}
                                validate={(value) => {
                                    let error;
                                    const date = moment(value);
                                    if (!value) {
                                        error = 'Input date of birth';
                                    } else if (!date.isValid()) {
                                        error = 'Invalid Date';
                                    }
                                    return error;
                                }}
                            >
                                {({ field, form, meta }) => (
                                    <KeyboardDatePicker
                                        {...field}
                                        {...dateOfBirth}
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        inputVariant='filled'
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        variant="filled"
                                        format="dd/MM/yyyy"
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        style={{ width: '100%' }}
                                        onChange={(value) => {
                                            form.setFieldValue(field.name, value);
                                        }}
                                    />
                                )}
                            </Field>
                        </MuiPickersUtilsProvider>
                    </ThemeProvider>
                </div>
            </div>
			<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                <div style={{ maxWidth: '40%', minWidth: '340px' }}>
                    <Field name={`passengers[${activePassenger}].ethnicity`} validate={(value) => (!value && get(touched, `passengers[${activePassenger}].ethnicity`, false)) ? 'Input ethnicity' : undefined}>
                        {({ field, meta }) => (
                            <FormControl variant='filled' style={{ width: '100%' }}>
                                <InputLabel
                                    required={ethnicity.required}
                                    htmlFor="grouped-select"
                                >
                                    {ethnicity.label}
                                </InputLabel>
                                <Select
                                    error={!!meta.error}
                                    touched={meta.touched}
                                    helperText={(meta.error && meta.touched) && meta.error}
                                    {...ethnicity}
                                    {...field}
                                >
                                    <ListSubheader className="list-title">White</ListSubheader>
                                    <MenuItem value="English, Welsh, Scottish, Northern Irish or British">English, Welsh, Scottish, Northern Irish or British</MenuItem>
                                    <MenuItem value="Irish">Irish</MenuItem>
                                    <MenuItem value="Gypsy or Irish Traveller">Gypsy or Irish Traveller</MenuItem>
                                    <MenuItem value="Any other White background">Any other White background</MenuItem>
                                    <ListSubheader className="list-title">Mixed or Multiple ethnic groups</ListSubheader>
                                    <MenuItem value="White and Black Caribbean">White and Black Caribbean</MenuItem>
                                    <MenuItem value="White and Black African">White and Black African</MenuItem>
                                    <MenuItem value="White and Asian">White and Asian</MenuItem>
                                    <MenuItem value="Any other Mixed or Multiple ethnic background">Any other Mixed or Multiple ethnic background</MenuItem>
                                    <ListSubheader className="list-title">Asian or Asian British</ListSubheader>
                                    <MenuItem value="Indian">Indian</MenuItem>
                                    <MenuItem value="Pakistani">Pakistani</MenuItem>
                                    <MenuItem value="Bangladeshi">Bangladeshi</MenuItem>
                                    <MenuItem value="Chinese">Chinese</MenuItem>
                                    <MenuItem value="Any other Asian background">Any other Asian background</MenuItem>
                                    <ListSubheader className="list-title">Black, African, Caribbean or Black British</ListSubheader>
                                    <MenuItem value="African">African</MenuItem>
                                    <MenuItem value="Caribbean">Caribbean</MenuItem>
                                    <MenuItem value="Any other Black, African or Caribbean background">Any other Black, African or Caribbean background</MenuItem>
                                    <ListSubheader className="list-title">Other ethnic group</ListSubheader>
                                    <MenuItem value="Arab">Arab</MenuItem>
                                    <MenuItem value="Any other ethnic group">Any other ethnic group</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </Field>
                </div>
		    </div>
			<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                <Field
                    name={`passengers[${activePassenger}].sex`}
                    validate={(value) => (!value && !!touched && !!touched.passengers) ? 'Select sex' : undefined}
                >
					{({ field, form, meta }) => (
						<FormControl
                            component='fieldset'
                            {...sex}
                            {...field}
                            error={!!meta.error}
                            touched={meta.touched}
                            helperText={(meta.error && meta.touched) && meta.error}
                        >
							<FormLabel
                                required
                                component='legend'
                            >
                                {sex.label}
                            </FormLabel>
							<RadioGroup
								style={{ display: 'inline' }}
								value={field.value}
                      			onChange={(({ target: { value } }) => form.setFieldValue(field.name, value))}
							>
								<FormControlLabel value='Female' control={<Radio />} label='Female' />
								<FormControlLabel value='Male' control={<Radio />} label='Male' />
								<FormControlLabel value='Other' control={<Radio />} label='Other' />
							</RadioGroup>
                            <FormHelperText>{(meta.error && meta.touched) && meta.error}</FormHelperText>
						</FormControl>
					)}
				</Field>
			</div>
            <h4 style={{ margin: 0, paddingTop: 20, width: 301, cursor: 'pointer' }}>
                <Tooltip
                    title={
                        <>
                            <img src={passportIdImage} />
                        </>
                    }
                    placement='right'
                    arrow
                >
                    <div>
                        {passportNumber.label}&nbsp;
                        <i className="fas fa-info-circle"></i>
                    </div>
                </Tooltip>
            </h4>
			<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                <div style={{ maxWidth: '40%', minWidth: '440px' }}>
                    <Field
                        name={`passengers[${activePassenger}].passportNumber`}
                        validate={(value) => (!value && get(touched, `passengers[${activePassenger}].passportNumber`, false) ? 'Input Passport/National identity card number' : undefined)}
                    >
                        {({ field, meta }) => (
                            <Input
                                {...passportNumber}
                                onCopy={preventCopyPaste}
                                onDrag={preventCopyPaste}
                                onDrop={preventCopyPaste}
                                onPaste={preventCopyPaste}
                                error={!!meta.error}
                                touched={meta.touched}
                                helperText={(meta.error && meta.touched) && meta.error}
                                {...field}
                            />
                        )}
                    </Field>
                </div>
		    </div>
            {!isEdit && (
                <>
                    <h4 style={{ margin: 0, paddingTop: 20 }}>
						{passportNumberConfirmation.label}
					</h4>
                    <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                        <div style={{ maxWidth: '40%', minWidth: '440px' }}>
                            <Field
                                name={`passengers[${activePassenger}].passportNumberConfirmation`}
                                validate={(value) => {
                                    let error;
                                    if (!value && get(touched, `passengers[${activePassenger}].passportNumberConfirmation`, false)) {
                                        error = 'Input Passport/National identity card number confirmation';
                                    } else if (value !== passengers[activePassenger].passportNumber) {
                                        error = 'Passport/Travel ID documents should match';
                                    }
                                    return error;
                                }}
                            >
                                {({ field, meta }) => (
                                    <Input
                                        onCopy={preventCopyPaste}
                                        onDrag={preventCopyPaste}
                                        onDrop={preventCopyPaste}
                                        onPaste={preventCopyPaste}
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        {...passportNumberConfirmation}
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                    </div>
                    <p style={{ maxWidth: '50%', fontWeight: 'bold' }} className="pink-text">
                        This document number will be shown on your test result certificate.<br />
                        Please enter the number of the document you will be using for travelling.<br />
                        Please make sure you have entered the correct Passport/National identity card number.<br />
                        After you submit this number, you will not be able to change it at any point.
                    </p>
                </>
            )}
            {isBundle && (
                <>
                    <div className='row' style={{ flexWrap: 'wrap', width: '60%', paddingTop: 20 }}>
                        <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                            <Field
                                name={`passengers[${activePassenger}].${vaccineStatus.name}`}
                                validate={(value) => (!value && get(touched, `passengers[${activePassenger}].${vaccineStatus.name}`, false)) ? `Select ${vaccineStatus.label}` : undefined}
                            >
                                {({ field, form, meta }) => (
                                    <FormControl
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        component='fieldset'
                                        style={{ width: '100%' }}
                                    >
                                        <FormLabel required={vaccineStatus.required} component='legend'>
                                            {vaccineStatus.label}
                                        </FormLabel>
                                        <RadioGroup
                                            aria-label={vaccineStatus.name}
                                            name={vaccineStatus.name}
                                            style={{ display: 'inline' }}
                                            {...vaccineStatus}
                                            {...field}
                                            onChange={(({ target: { value } }) => {
                                                form.setFieldValue(field.name, value);
                                            })}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                        <FormHelperText className="pink-text">{(meta.error && meta.touched) && meta.error}</FormHelperText>
                                    </FormControl>
                                )}
                            </Field>
                        </div>
                    </div>
                    {passengers[activePassenger].vaccineStatus === 'yes' && (
                        <>
                            <div className='row' style={{ flexWrap: 'wrap', width: '60%', paddingTop: 20 }}>
                                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                                    <Field
                                        name={`passengers[${activePassenger}].${vaccineType.name}`}
                                        validate={(value) => (!value && get(touched, `passengers[${activePassenger}].${vaccineType.name}`, false)) ? `Select ${vaccineType.label}` : undefined}
                                    >
                                        {({ field, form, meta }) => (
                                            <FormControl
                                                component='fieldset'
                                                style={{ width: '100%' }}
                                                error={!!meta.error && meta.touched}
                                                touched={meta.touched}
                                                helperText={(meta.error && meta.touched) && meta.error}
                                            >
                                                <FormLabel required={vaccineType.required} component='legend'>
                                                    {vaccineType.label}
                                                </FormLabel>
                                                <RadioGroup
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
                                                <FormHelperText className="pink-text">{(meta.error && meta.touched) && meta.error}</FormHelperText>
                                            </FormControl>
                                        )}
                                    </Field>
                                </div>
                            </div>
                            {passengers[activePassenger].vaccineType === 'Other' && (
                                <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                                    <div style={{ maxWidth: '40%', minWidth: '300px' }}>
                                        <h4 style={{ margin: 0, padding: "20px 0 10px 0" }}>
                                            {vaccineTypeName.label}
                                        </h4>
                                        <Field
                                            name={`passengers[${activePassenger}].${vaccineTypeName.name}`}
                                            validate={(value) => (!value && get(touched, `passengers[${activePassenger}].vaccineTypeName`, false)) ? 'Input Vaccine Name' : undefined}>
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
                                        name={`passengers[${activePassenger}].${vaccineNumber.name}`}
                                        validate={(value) => (!value && get(touched, `passengers[${activePassenger}].${vaccineNumber.name}`, false)) ? `Select ${vaccineNumber.label}` : undefined}
                                    >
                                        {({ field, form, meta }) => (
                                            <FormControl
                                                error={!!meta.error && meta.touched}
                                                touched={meta.touched}
                                                helperText={(meta.error && meta.touched) && meta.error}
                                                component='fieldset'
                                                style={{ width: '100%' }}
                                            >
                                                <FormLabel required={vaccineNumber.required} component='legend'>
                                                    {vaccineNumber.label}
                                                </FormLabel>
                                                <RadioGroup
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
                                                <FormHelperText className="pink-text">{(meta.error && meta.touched) && meta.error}</FormHelperText>
                                            </FormControl>
                                        )}
                                    </Field>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
            {(isPharmacy && activePassenger === 0) && (
                isLufthansa ? (
                    <>
                        <h4 style={{ margin: 0, paddingTop: 20 }}>
                            Address Information
                        </h4>
                        <h6 className="grey-text" style={{ margin: 0, fontSize: 12 }}>
                            Please enter your address at the time of the appointment.
                        </h6>
                        <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                            <div style={{ maxWidth: '40%', minWidth: '340px' }}>
                                <Field name={`passengers[${activePassenger}].street_address`} validate={(value) => (!value && get(touched, `passengers[${activePassenger}].street_address`, false)) ? 'Input address' : undefined}>
                                    {({ field, meta }) => (
                                        <Input
                                            error={!!meta.error}
                                            touched={meta.touched}
                                            helperText={(meta.error && meta.touched) && meta.error}
                                            {...streetAddress}
                                            {...field}
                                        />
                                    )}
                                </Field>
                            </div>
                        </div>
                        <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                            <div style={{ maxWidth: '40%', minWidth: '340px' }}>
                                <Field name={`passengers[${activePassenger}].extended_address`}>
                                    {({ field, meta }) => (
                                        <Input
                                            error={!!meta.error}
                                            touched={meta.touched}
                                            helperText={(meta.error && meta.touched) && meta.error}
                                            {...extendedAddress}
                                            {...field}
                                        />
                                    )}
                                </Field>
                            </div>
                        </div>
                        <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                            <div style={{ maxWidth: '40%', minWidth: '340px' }}>
                                <Field name={`passengers[${activePassenger}].locality`} validate={(value) => (!value && get(touched, `passengers[${activePassenger}].locality`, false)) ? 'Input city' : undefined}>
                                    {({ field, meta }) => (
                                        <Input
                                            error={!!meta.error}
                                            touched={meta.touched}
                                            helperText={(meta.error && meta.touched) && meta.error}
                                            {...locality}
                                            {...field}
                                        />
                                    )}
                                </Field>
                            </div>
                        </div>
                        <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                            <div style={{ maxWidth: '40%', minWidth: '340px' }}>
                                <Field name={`passengers[${activePassenger}].country`} validate={(value) => (!value && get(touched, `passengers[${activePassenger}].country`, false)) ? 'Input country' : undefined}>
                                    {({ field, meta }) => (
                                        <Input
                                            error={!!meta.error}
                                            touched={meta.touched}
                                            helperText={(meta.error && meta.touched) && meta.error}
                                            {...country}
                                            {...field}
                                        />
                                    )}
                                </Field>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h4 style={{ margin: 0, paddingTop: 20 }}>
                            Address Information
                        </h4>
                        <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                            <div style={{ maxWidth: '40%', minWidth: '340px' }}>
                                <Field name={`passengers[${activePassenger}].postal_code`} validate={(value) => (!value && get(touched, `passengers[${activePassenger}].postal_code`, false)) ? 'Input postcode' : undefined}>
                                    {({ field, meta }) => (
                                        <Input
                                            error={!!meta.error}
                                            touched={meta.touched}
                                            helperText={(meta.error && meta.touched) && meta.error}
                                            {...postalCode}
                                            {...field}
                                        />
                                    )}
                                </Field>
                            </div>
                        </div>
                        <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                            <div style={{ maxWidth: '40%', minWidth: '340px' }}>
                                <Field name={`passengers[${activePassenger}].street_address`} validate={(value) => (!value && get(touched, `passengers[${activePassenger}].street_address`, false)) ? 'Input address' : undefined}>
                                    {({ field, meta }) => (
                                        <Input
                                            error={!!meta.error}
                                            touched={meta.touched}
                                            helperText={(meta.error && meta.touched) && meta.error}
                                            {...streetAddress}
                                            {...field}
                                        />
                                    )}
                                </Field>
                            </div>
                        </div>
                        <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                            <div style={{ maxWidth: '40%', minWidth: '340px' }}>
                                <Field name={`passengers[${activePassenger}].extended_address`}>
                                    {({ field, meta }) => (
                                        <Input
                                            error={!!meta.error}
                                            touched={meta.touched}
                                            helperText={(meta.error && meta.touched) && meta.error}
                                            {...extendedAddress}
                                            {...field}
                                        />
                                    )}
                                </Field>
                            </div>
                        </div>
                        <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                            <div style={{ maxWidth: '40%', minWidth: '340px' }}>
                                <Field name={`passengers[${activePassenger}].locality`} validate={(value) => (!value && get(touched, `passengers[${activePassenger}].locality`, false)) ? 'Input city' : undefined}>
                                    {({ field, meta }) => (
                                        <Input
                                            error={!!meta.error}
                                            touched={meta.touched}
                                            helperText={(meta.error && meta.touched) && meta.error}
                                            {...locality}
                                            {...field}
                                        />
                                    )}
                                </Field>
                            </div>
                        </div>
                        <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                            <div style={{ maxWidth: '40%', minWidth: '340px' }}>
                                <Field name={`passengers[${activePassenger}].region`} validate={(value) => (!value && get(touched, `passengers[${activePassenger}].region`, false)) ? 'Input county' : undefined}>
                                    {({ field, meta }) => (
                                        <Input
                                            error={!!meta.error}
                                            touched={meta.touched}
                                            helperText={(meta.error && meta.touched) && meta.error}
                                            {...region}
                                            {...field}
                                        />
                                    )}
                                </Field>
                            </div>
                        </div>
                    </>
                )
            )}
		</React.Fragment>
	);
};

export default Step3;
