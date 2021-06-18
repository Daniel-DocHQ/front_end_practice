import React from 'react';
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
import './BookingEngine.scss';

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

const Step2 = ({
    isEdit,
    defaultCountryCode,
    activePassenger,
}) => {
	const classes = useStyles();
    const pickerTheme = datePickerTheme();
    const {
        values: {
            passengers,
            bookingUsers,
        },
        touched,
    } = useFormikContext();
    const {
        formField: {
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
        }
    } = bookingFormModel;

	return (
		<React.Fragment>
            {(!!bookingUsers.length && !isEdit) && (
                <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                    <div style={{ maxWidth: '40%', minWidth: '320px' }}>
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
                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field name={`passengers[${activePassenger}].firstName`} validate={(value) => (!value && !!touched && !!touched.passengers) ? 'Input first name' : undefined}>
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
				<div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field name={`passengers[${activePassenger}].lastName`} validate={(value) => (!value && !!touched && !!touched.passengers) ? 'Input last name' : undefined}>
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
				<div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field
                        name={`passengers[${activePassenger}].email`}
                        validate={(value) => {
                            let error;
                            if (!!touched && !!touched.passengers) {
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
			<div className='row' style={{ flexWrap: 'wrap', width: '60%', alignItems: 'self-start' }}>
				<div style={{ maxWidth: '50%', marginRight: 30 }}>
                    <Field
                        name={`passengers[${activePassenger}].countryCode`}
						validate={(value) => {
                            let error;
                            if (!!touched && !!touched.passengers) {
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
                            if (!!touched && !!touched.passengers) {
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
                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <ThemeProvider theme={pickerTheme}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Field
                                name={`passengers[${activePassenger}].dateOfBirth`}
                                validate={(value) => {
                                    let error;
                                    if (!!touched && !!touched.passengers) {
                                        const date = moment(value);
                                        if ((!value && !!touched && !!touched.passengers)) {
                                            error = 'Input date of birth';
                                        } else if (!date.isValid()) {
                                            error = 'Invalid Date';
                                        }
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
                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field name={`passengers[${activePassenger}].ethnicity`} validate={(value) => (!value && !!touched && !!touched.passengers) ? 'Input ethnicity' : undefined}>
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
            <h4 style={{ margin: 0, paddingTop: 20 }}>
                {passportNumber.label}
            </h4>
			<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field name={`passengers[${activePassenger}].passportNumber`} validate={(value) => (!value && !!touched && !!touched.passengers) ? 'Input ID Document number' : undefined}>
                        {({ field, meta }) => (
                            <Input
                                onCopy={preventCopyPaste}
                                onDrag={preventCopyPaste}
                                onDrop={preventCopyPaste}
                                onPaste={preventCopyPaste}
                                error={!!meta.error}
                                touched={meta.touched}
                                helperText={(meta.error && meta.touched) && meta.error}
                                {...passportNumber}
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
                        <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                            <Field
                                name={`passengers[${activePassenger}].passportNumberConfirmation`}
                                validate={(value) => {
                                    let error;
                                    if (!value && !!touched && !!touched.passengers) {
                                        error = 'Input ID Document number confirmation';
                                    } else if (value !== passengers[activePassenger].passportNumber) {
                                        error = 'ID Document Numbers should match';
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
                        Please make sure you have entered the correct ID document number.<br />
                        After you submit this number, you will not be able to change it at any point.
                    </p>
                </>
            )}
		</React.Fragment>
	);
};

export default Step2;
