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

const Step0 = ({
    items = [],
    bookingUsersQuantity,
    isEdit,
}) => {
    const {
        formField: {
            product: productField,
            numberOfPeople,
        }
    } = bookingFormModel;

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
                                            const productObj = items.find(({ ID }) => ID === intValue);
                                            form.setFieldValue(field.name, intValue);
                                            form.setFieldValue('testType', productObj);
                                            form.setFieldValue(numberOfPeople.name, productObj.Quantity);
                                        })}
                                    >
                                        {items.map(({ ID, Title, Quantity }) => (
                                            <FormControlLabel disabled={Quantity <= 0} key={ID + Title} value={ID} control={<Radio />} label={Title} />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )}
                        </Field>
                    </div>
                </div>
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
