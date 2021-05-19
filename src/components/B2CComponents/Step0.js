import React from 'react';
import { Field } from 'formik';
import {
	FormControl,
    InputLabel,
    Select,
    MenuItem,
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
                                <FormControl variant='filled' style={{ width: '100%' }}>
                                    <InputLabel
                                        required={productField.required}
                                        htmlFor="grouped-select"
                                    >
                                        {productField.label}
                                    </InputLabel>
                                    <Select
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        {...productField}
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const productObj = items.find(({ product_id }) => product_id === value);
                                            form.setFieldValue(field.name, value);
                                            form.setFieldValue('testType', productObj);
                                            form.setFieldValue(numberOfPeople.name, productObj.quantity);
                                        }}
                                    >
                                        {items.map(({ product_id, product: { title } }) => (
                                            <MenuItem value={product_id}>{title}</MenuItem>
                                        ))}
                                    </Select>
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
                </div>
		    </div>
            <h4 style={{ margin: '0px', marginTop: '10px', textAlign: 'left', width: 'max-content' }}>
                Remember  that children under 18 years can only attend the online video appointment with an adult (18+) present from the same appointment booking.
            </h4>
		</React.Fragment>
	);
};

export default Step0;
