import React from 'react';
import { FieldArray, Field, useFormikContext } from 'formik';
import {
    IconButton,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Input from '../FormComponents/Input';
import bookingFormModel from './bookingFormModel';
import { FIT_TO_FLY_ANTIGEN, PRE_DEPARTURE_ANTIGEN } from '../../helpers/productsWithAdditionalInfo';
import './BookingEngine.scss';

const OFLStep0 = ({
    products = [],
}) => {
    const {
        formField: {
            product: productField,
            numberOfPeople,
            purchaseCode,
        }
    } = bookingFormModel;
    const {
        values: {
            purchaseCode: purchaseCodeValue,
            product,
        },
    } = useFormikContext();

	return (
        <>
            {/* <h4 style={{ margin: 0, paddingTop: 20 }}>
                What test are you booking?
            </h4>
            <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field
                        name={productField.name}
                    >
                        {({ field, form, meta }) => (
                            <FormControl
                                error={!!meta.error && meta.touched}
                                touched={meta.touched}
                                component='fieldset' style={{ width: '100%' }}
                            >
                                <FormLabel
                                    required={productField.required} component='legend'>
                                    {productField.label}
                                </FormLabel>
                                <RadioGroup
                                    style={{ display: 'inline' }}
                                    aria-label={productField.name}
                                    name={productField.name}
                                    value={field.value}
                                    {...productField}
                                    {...field}
                                    onChange={(({ target: { value } }) => {
                                        const product = products.find(({ sku }) => sku === value);
                                        form.setFieldValue(field.name, value);
                                        form.setFieldValue('testType', product);
                                    })}
                                >
                                    <FormControlLabel value={FIT_TO_FLY_ANTIGEN} control={<Radio />} label="Fit to fly Antigen" />
                                    <FormControlLabel value={PRE_DEPARTURE_ANTIGEN} control={<Radio />} label="Pre-departure Antigen Test" />
                                </RadioGroup>
                                <FormHelperText>{(meta.error && meta.touched) && meta.error}</FormHelperText>
                            </FormControl>
                        )}
                    </Field>
                </div>
            </div> */}
            {/* <Divider style={{ width: '22%' }} /> */}
            {!!product && (
                <>
                    <h4 style={{ margin: 0, paddingTop: 20 }}>
                        Number of people
                    </h4>
                    <div className='row' style={{ flexWrap: 'wrap', width: '15%' }}>
                        <Field
                            name={numberOfPeople.name}
                        >
                        {({ field, form }) => (
                            <div className='row space-between no-margin'>
                                <IconButton onClick={() => {
                                    if (field.value > 1) {
                                        const newValue = [...purchaseCodeValue];
                                        newValue.pop();
                                        form.setFieldValue(numberOfPeople.name, field.value - 1);
                                        form.setFieldValue(purchaseCode.name, newValue);
                                    }
                                }}>
                                    <RemoveIcon  />
                                </IconButton>
                                <h3>
                                    {field.value}
                                </h3>
                                <IconButton onClick={() => {
                                    if (field.value < 4) {
                                        const newValue = [...purchaseCodeValue, { code: '' }];
                                        form.setFieldValue(numberOfPeople.name, field.value + 1);
                                        form.setFieldValue(purchaseCode.name, newValue);
                                    }
                                }}>
                                    <AddIcon />
                                </IconButton>
                            </div>
                        )}
                        </Field>
                    </div>
                    <p className="MuiFormLabel-root no-margin">
                        Maximum 4 people per appointment
                    </p>
                    <h4 style={{ margin: 0, paddingTop: 30 }}>
                        Please enter one purchase code per person.
                    </h4>
                    <h4 style={{ margin: 0, paddingTop: 20 }}>
                        Purchase Code
                    </h4>
                    <FieldArray name={purchaseCode.name}>
                        {(arrayHelpers) => (
                            purchaseCodeValue.map((_, indx) => (
                                <div className='row space-between' style={{ flexWrap: 'wrap', width: '60%' }}>
                                    <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                                        <Field name={`${purchaseCode.name}[${indx}].code`}>
                                            {({ field, meta }) => (
                                                <Input
                                                    error={!!meta.error && meta.touched}
                                                    touched={meta.touched}
                                                    placeholder={product === PRE_DEPARTURE_ANTIGEN ? purchaseCode.predeparturePlaceholder : purchaseCode.fitToFlyPlaceholder}
                                                    helperText={(meta.error && meta.touched) && meta.error}
                                                    {...purchaseCode}
                                                    {...field}
                                                    label={`${purchaseCode.label} ${indx + 1}`}
                                                />
                                            )}
                                        </Field>
                                    </div>
                                </div>
                            ))
                        )}
                    </FieldArray>
                    {/* {!!purchaseCodeError && (
                        <div className='row space-between' style={{ flexWrap: 'wrap', width: '60%' }}>
                            <div style={{ minWidth: '320px' }}>
                                <Alert severity={purchaseCodeError.severity} variant='outlined'>
                                    {purchaseCodeError.message}
                                </Alert>
                            </div>
                        </div>
                    )} */}
                </>
            )}
        </>
    );
};

export default OFLStep0;
