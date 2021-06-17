import React from 'react';
import { Field } from 'formik';
import {
    Radio,
    FormLabel,
    RadioGroup,
    FormControlLabel,
	FormControl,
} from '@material-ui/core';
import Input from '../FormComponents/Input';
import bookingFormModel from './bookingFormModel';
import './BookingEngine.scss';

const ADDITIONAL_PRODUCT_TEXT = {
    'Fit to Travel [Antigen]': 'book an appointment within 24 hours of your travel',
    'Fit to Travel [PCR]': 'appointment available between 72 hours and 57 hours prior to your flight',
    'Day 2 PCR Test': 'book an appointment within 2 days of your arrival in the UK',
    'Day 8 PCR Test': 'book an appointment on the 8th day after your arrival in the UK',
    'Pre Departure Test [United Kingdom]': 'book an appointment with 48 hours of your travel',
    'Amber Short Stay': 'book an appointment within 2 days of your arrival in the UK',
    'Test to Release': 'book an appointment on the 5th day after your arrival in the UK',
};

const Step0 = ({
    isEdit,
    items = [],
    bookingUsersQuantity,
}) => {
    const {
        formField: {
            product: productField,
            numberOfPeople,
        }
    } = bookingFormModel;

    const filteredItems = items.filter(({ type }) => type !== 'Virtual');

	return (
		<React.Fragment>
            {!isEdit && (
                <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                    <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                        <Field
                            name={productField.name}
                        >
                            {({ field, form, meta }) => (
                                <FormControl component='fieldset' style={{ width: '100%' }}>
                                    <FormLabel required={productField.required} component='legend'>
                                        {productField.label}
                                    </FormLabel>
                                    <RadioGroup
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        aria-label={productField.name}
                                        name={productField.name}
                                        value={field.value}
                                        {...productField}
                                        {...field}
                                        onChange={(({ target: { value } }) => {
                                            const intValue = parseInt(value);
                                            const productObj = filteredItems.find(({ id }) => id === intValue);
                                            form.setFieldValue(field.name, intValue);
                                            form.setFieldValue('testType', productObj);
                                            form.setFieldValue(numberOfPeople.name, productObj.quantity);
                                        })}
                                    >
                                        {filteredItems.map(({ id, title, quantity }) => (
                                            <FormControlLabel
                                                value={id}
                                                key={id + title}
                                                control={<Radio />}
                                                disabled={quantity < 1}
                                                style={{ width: 'max-content', paddingTop: 10 }}
                                                label={
                                                    <>
                                                        {title}<br/>
                                                        <span className="additional-option-text">
                                                            {quantity < 1
                                                                ? 'you have booked all appointment for this product'
                                                                : !!ADDITIONAL_PRODUCT_TEXT[title]
                                                                    ? ADDITIONAL_PRODUCT_TEXT[title]
                                                                    : ''}
                                                        </span>
                                                    </>
                                                }
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )}
                        </Field>
                    </div>
                </div>
            )}
            {!isEdit && (
                <h4 style={{ margin: 0, paddingTop: 20 }}>
                    How many people will take the test?
                </h4>
            )}
            <div className='row space-between' style={{ flexWrap: 'wrap', width: '60%' }}>
                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field
                        name={numberOfPeople.name}
                        validate={(value) => isEdit ? ((parseFloat(value) < bookingUsersQuantity) ? 'You can\'t reduce quantity of booking users' : undefined) : undefined}
                    >
                        {({ field, meta }) => (
                            <Input
                                error={!!meta.error}
                                touched={meta.touched}
                                helperText={(meta.error && meta.touched) && meta.error}
                                {...numberOfPeople}
                                {...field}
                            />
                        )}
                    </Field>
                    <h4 style={{ margin: '0px', marginTop: '15px', textAlign: 'left', fontWeight: 'normal' }}>
                        Remember  that children under 18 years can only attend the online video appointment with an adult (18+) present from the same appointment booking.
                    </h4>
                </div>
		    </div>
		</React.Fragment>
	);
};

export default Step0;
