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
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Field, useFormikContext } from 'formik';
import Input from '../FormComponents/Input';
import bookingFormModel from './bookingFormModel';
import './BookingEngine.scss';

const Step2 = ({
    activePassenger,
}) => {
    const { touched } = useFormikContext();
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

	return (
		<React.Fragment>
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
			<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field
                        name={`passengers[${activePassenger}].phone`}
                        validate={(value) => {
                            let error;
                            if (!!touched && !!touched.passengers) {
                                if (!value) {
                                    error = 'Input phone';
                                } else if (value.length < 5) {
                                    error = 'Invalid phone number';
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
                    <Field
                        name={`passengers[${activePassenger}].dateOfBirth`}
                        validate={(value) => {
                            let error;
                            if (!!touched && !!touched.passengers) {
                                if ((!value && !!touched && !!touched.passengers)) {
                                    error = 'Input date of birth';
                                } else if (!/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.test(value)) {
                                    error = 'Invalid date of birth';
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
                                {...dateOfBirth}
                                {...field}
                            />
                        )}
                    </Field>
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
                                    <ListSubheader><b>White</b></ListSubheader>
                                    <MenuItem value="English, Welsh, Scottish, Northern Irish or British">English, Welsh, Scottish, Northern Irish or British</MenuItem>
                                    <MenuItem value="Irish">Irish</MenuItem>
                                    <MenuItem value="Gypsy or Irish Traveller">Gypsy or Irish Traveller</MenuItem>
                                    <MenuItem value="Any other White background">Any other White background</MenuItem>
                                    <ListSubheader><b>Mixed or Multiple ethnic groups</b></ListSubheader>
                                    <MenuItem value="White and Black Caribbean">White and Black Caribbean</MenuItem>
                                    <MenuItem value="White and Black African">White and Black African</MenuItem>
                                    <MenuItem value="White and Asian">White and Asian</MenuItem>
                                    <MenuItem value="Any other Mixed or Multiple ethnic background">Any other Mixed or Multiple ethnic background</MenuItem>
                                    <ListSubheader><b>Asian or Asian British</b></ListSubheader>
                                    <MenuItem value="Indian">Indian</MenuItem>
                                    <MenuItem value="Pakistani">Pakistani</MenuItem>
                                    <MenuItem value="Bangladeshi">Bangladeshi</MenuItem>
                                    <MenuItem value="Chinese">Chinese</MenuItem>
                                    <MenuItem value="Any other Asian background">Any other Asian background</MenuItem>
                                    <ListSubheader><b>Black, African, Caribbean or Black British</b></ListSubheader>
                                    <MenuItem value="African">African</MenuItem>
                                    <MenuItem value="Caribbean">Caribbean</MenuItem>
                                    <MenuItem value="Any other Black, African or Caribbean background">Any other Black, African or Caribbean background</MenuItem>
                                    <ListSubheader><b>Other ethnic group</b></ListSubheader>
                                    <MenuItem value="Arab">Arab</MenuItem>
                                    <MenuItem value="Any other ethnic group">Any other ethnic group</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </Field>
                </div>
		    </div>
			<div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                <Field name={`passengers[${activePassenger}].sex`}>
					{({ field, form }) => (
						<FormControl component='fieldset' validate={(value) => (!value && !!touched && !!touched.passengers) ? 'Select sex' : undefined}>
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
                    <Field name={`passengers[${activePassenger}].passportNumber`} validate={(value) => (!value && !!touched && !!touched.passengers) ? 'Input passport number' : undefined}>
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
