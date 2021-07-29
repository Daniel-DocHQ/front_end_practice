import React from 'react';
import { useDebounce } from 'react-use';
import { Field, useFormikContext } from 'formik';
import {
    Radio,
    FormLabel,
    RadioGroup,
    FormControlLabel,
	FormControl,
} from '@material-ui/core';
import Input from '../FormComponents/Input';
import bookingFormModel from './bookingFormModel';
import ADDITIONAL_PRODUCT_TEXT from './additionalProductText';
import './BookingEngine.scss';
import { Alert } from '@material-ui/lab';
import adminService from '../../services/adminService';

const Step0 = ({
    isEdit,
    items = [],
    isPharmacy,
    bookingUsersQuantity,
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
        },
        setFieldValue,
    } = useFormikContext();

    const filteredItems = items.filter(({ type }) => type !== 'Virtual');

    const checkPurchaseCodeInfo = async () => {
        await adminService.checkPurchaseCodeInfo(purchaseCodeValue)
            .then(result => {
                if (result.success && result.data && result.data.value) {
                    if (!!result.data.uses) {
                        setFieldValue('purchaseCodeError', { severity: 'success', message: 'Valid purchase code' })
                    } else {
                        setFieldValue('purchaseCodeError', { severity: 'error', message: 'Your code is expired' });
                    }
                } else {
                   setFieldValue('purchaseCodeError', { severity: 'error', message: 'Your code is invalid' });
                }
            }).catch((error) => setFieldValue('purchaseCodeError', { severity: 'error', message: 'Your code is invalid' }));
    }

    useDebounce(async () => {
        if (!!purchaseCodeValue && purchaseCodeValue.match(new RegExp(/^(ANT|PFF|ATE)*/))) {
            checkPurchaseCodeInfo();
        }
    }, 300, [purchaseCodeValue]);

	return (isPharmacy ? (
        <>
            <h4 style={{ margin: 0, paddingTop: 20 }}>
                Purchase Code
            </h4>
            <div className='row space-between' style={{ flexWrap: 'wrap', width: '60%' }}>
                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field
                        name={purchaseCode.name}
                    >
                        {({ field, meta }) => (
                            <Input
                                error={!!meta.error}
                                touched={meta.touched}
                                helperText={(meta.error && meta.touched) && meta.error}
                                {...purchaseCode}
                                {...field}
                            />
                        )}
                    </Field>
                </div>
            </div>
            {!!purchaseCodeError && (
                <div className='row space-between' style={{ flexWrap: 'wrap', width: '60%' }}>
                    <div style={{ minWidth: '320px' }}>
                        <Alert severity={purchaseCodeError.severity} variant='outlined'>
                            {purchaseCodeError.message}
                        </Alert>
                    </div>
                </div>
            )}
        </>
    ) : (
        <>
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
                                    {filteredItems.map(({ id, sku, title, quantity }) => (
                                        <FormControlLabel
                                            value={id}
                                            key={id + title}
                                            control={<Radio />}
                                            disabled={quantity < 1 || isEdit}
                                            style={{ width: 'max-content', paddingTop: 10 }}
                                            label={
                                                <>
                                                    {title}<br/>
                                                    <span className="additional-option-text">
                                                        {quantity < 1
                                                            ? 'you have booked all appointment for this product'
                                                            : !!ADDITIONAL_PRODUCT_TEXT[sku]
                                                                ? ADDITIONAL_PRODUCT_TEXT[sku]
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
            <h4 style={{ margin: 0, paddingTop: 20 }}>
                How many people will take the test?
            </h4>
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
                                inputProps={{ min: 1 }}
                                {...numberOfPeople}
                                {...field}
                            />
                        )}
                    </Field>
                    <h4 style={{ margin: '0px', marginTop: '15px', textAlign: 'left', fontWeight: 'normal' }}>
                        Remember that children under 16 years can only attend the online video appointment with a legal guardian (18+) present during the video consultation.
                    </h4>
                </div>
            </div>
        </>
	));
};

export default Step0;
