import React from 'react';
import { FieldArray, Field, useFormikContext } from 'formik';
import {
    Radio,
    FormLabel,
    RadioGroup,
    FormControlLabel,
	FormControl,
    IconButton,
    FormHelperText,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Input from '../FormComponents/Input';
import bookingFormModel from './bookingFormModel';
import { Alert } from '@material-ui/lab';
import { FIT_TO_FLY_ANTIGEN, FIT_TO_FLY_PCR } from '../../helpers/productsWithAdditionalInfo';
import './BookingEngine.scss';

const LufthansaStep0 = ({
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
            purchaseCodeError,
            purchaseCode: purchaseCodeValue,
            product,
        },
        setFieldValue,
    } = useFormikContext();

	return (
        <>
            <h4 style={{ margin: 0, paddingTop: 20 }}>
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
                                    <FormControlLabel value={FIT_TO_FLY_ANTIGEN} control={<Radio />} label="Antigen" />
                                    <FormControlLabel value={FIT_TO_FLY_PCR} control={<Radio />} label="PCR" />
                                </RadioGroup>
                                <FormHelperText>{(meta.error && meta.touched) && meta.error}</FormHelperText>
                            </FormControl>
                        )}
                    </Field>
                </div>
            </div>
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
                                                    placeholder={product === FIT_TO_FLY_PCR ? purchaseCode.pcrPlaceholder : purchaseCode.antigenPlaceholder}
                                                    helperText={(meta.error && meta.touched) && meta.error}
                                                    {...purchaseCode}
                                                    {...field}
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

export default LufthansaStep0;
