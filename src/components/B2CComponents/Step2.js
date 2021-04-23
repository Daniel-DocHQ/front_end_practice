import React, { useEffect } from 'react';
import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
} from '@material-ui/core';
import { get } from 'lodash';
import { Field, useFormikContext } from 'formik';
import Input from '../FormComponents/Input';
import bookingFormModel from './bookingFormModel';
import './BookingEngine.scss';

const Step2 = ({
    passengers,
    activePassenger,
}) => {
    const { setFieldValue, setTouched, setErrors } = useFormikContext();
    const {
        formField: {
			firstName,
			lastName,
			email,
			phone,
			dateOfBirth,
			ethnicity,
			sex,
			passportNumber,
        }
    } = bookingFormModel;

    useEffect(() => {
        if (get(passengers, `[${activePassenger}].${firstName.name}`, '')) {
            setFieldValue(firstName.name, passengers[activePassenger][firstName.name]);
            setFieldValue(lastName.name, passengers[activePassenger][lastName.name]);
            setFieldValue(email.name, passengers[activePassenger][email.name]);
            setFieldValue(phone.name, passengers[activePassenger][phone.name]);
            setFieldValue(dateOfBirth.name, passengers[activePassenger][dateOfBirth.name]);
            setFieldValue(ethnicity.name, passengers[activePassenger][ethnicity.name]);
            setFieldValue(sex.name, passengers[activePassenger][sex.name]);
            setFieldValue(passportNumber.name, passengers[activePassenger][passportNumber.name]);
            setTouched({});
            setErrors({});
        }
    }, [activePassenger])

	return (
		<React.Fragment>
            <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field name={firstName.name}>
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
                    <Field name={lastName.name}>
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
                    <Field name={email.name}>
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
			<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field name={phone.name}>
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
                    <Field name={dateOfBirth.name}>
                        {({ field, meta }) => (
                            <Input
                                error={!!meta.error}
                                touched={meta.touched}
                                helperText={(meta.error && meta.touched) && meta.error}
                                {...dateOfBirth}
                                {...field}
                            />
                        )}
                    </Field>
                </div>
		    </div>
			<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field name={ethnicity.name}>
                        {({ field, meta }) => (
                            <Input
                                error={!!meta.error}
                                touched={meta.touched}
                                helperText={(meta.error && meta.touched) && meta.error}
                                {...ethnicity}
                                {...field}
                            />
                        )}
                    </Field>
                </div>
		    </div>
			<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
				<Field name={sex.name}>
					{({ field, form }) => (
						<FormControl component='fieldset'>
							<FormLabel component='legend'>{sex.label} *</FormLabel>
							<RadioGroup
								style={{ display: 'inline' }}
								aria-label={sex.name}
								name={sex.name}
								value={field.value}
                      			onChange={(({ target: { value } }) => form.setFieldValue(field.name, value))}
							>
								<FormControlLabel value='Female' control={<Radio />} label='Female' />
								<FormControlLabel value='Male' control={<Radio />} label='Male' />
								<FormControlLabel value='Other' control={<Radio />} label='Other' />
							</RadioGroup>
						</FormControl>
					)}
				</Field>
			</div>
			<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field name={passportNumber.name}>
                        {({ field, meta }) => (
                            <Input
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
		</React.Fragment>
	);
};

export default Step2;
