import React from 'react';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers';
import { Field, Form } from 'formik';
import DateFnsUtils from '@date-io/date-fns';
import {
    Box,
    Grid,
    Radio,
    FormLabel,
    RadioGroup,
    FormControlLabel,
	FormControl,
    FormHelperText,
    ThemeProvider,
} from '@material-ui/core';
import DocButton from '../DocButton/DocButton';
import Input from '../FormComponents/Input';
import datePickerTheme from '../../helpers/datePickerTheme';
import { Alert } from '@material-ui/lab';

const DiscountForm = ({
    status,
    ...restProps
}) => {
    const pickerTheme = datePickerTheme();

    return (
        <Form {...restProps}>
            <Box p={8}>
                <Grid container justify="space-between" spacing={10}>
                    <Grid item xs={6}>
                        <div className="row">
                            <Field name="code" >
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error && meta.touched}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Enter unique discount"
                                        id="dropbox-name"
                                        required
                                        variant="standard"
                                        type="text"
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className='row'>
                            <Field name="type">
                                {({ field, form, meta }) => (
                                    <FormControl
                                        {...field}
                                        component='fieldset'
                                        error={!!meta.error && meta.touched}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                    >
                                        <FormLabel
                                            required
                                            component='legend'
                                        >
                                            Discount Type:
                                        </FormLabel>
                                        <RadioGroup
                                            value={field.value}
                                            style={{ display: 'inline' }}
                                            onChange={(({ target: { value } }) => form.setFieldValue(field.name, value))}
                                        >
                                            <FormControlLabel value='percentage' control={<Radio />} label='Percentage' />
                                            <FormControlLabel value='value' control={<Radio />} label='Value' />
                                        </RadioGroup>
                                        <FormHelperText>{(meta.error && meta.touched) && meta.error}</FormHelperText>
                                    </FormControl>
                                )}
                            </Field>
                        </div>
                        <div className="row">
                            <Field name="value">
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error && meta.touched}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Discount Value"
                                        id="discount-value"
                                        type="number"
                                        variant="standard"
                                        required
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <ThemeProvider theme={pickerTheme}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <div className='row center'>
                                    <div className='appointment-calendar-container'>
                                        <h4 style={{ margin: 0, padding: "20px 0 10px 0" }}>
                                           Active from
                                        </h4>
                                        <Field name="active_from">
                                            {({ field, form }) => (
                                                <KeyboardDatePicker
                                                    {...field}
                                                    label="From"
                                                    placeholder="DD/MM/YYYY"
                                                    required
                                                    inputVariant='filled'
                                                    format="dd/MM/yyyy"
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    onChange={(value) => {
                                                        form.setFieldValue(field.name, value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <div className='appointment-calendar-container'>
                                        <h4 style={{ margin: 0, padding: "20px 0 10px 0" }}>
                                            to
                                        </h4>
                                        <Field name="active_to">
                                            {({ field, form }) => (
                                                <KeyboardDatePicker
                                                    {...field}
                                                    label="To"
                                                    placeholder="DD/MM/YYYY"
                                                    required
                                                    inputVariant='filled'
                                                    format="dd/MM/yyyy"
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    onChange={(value) => {
                                                        form.setFieldValue(field.name, value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </div>
                                </div>
                            </MuiPickersUtilsProvider>
                        </ThemeProvider>
                        <div className="row">
                            <Field name="uses">
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error && meta.touched}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Uses"
                                        id="city"
                                        variant="standard"
                                        type="number"
                                        required
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        {typeof status !== 'undefined' && (
                            <div className='row center'>
                                <Alert severity={status.severity} variant='outlined'>
                                    {status.message}
                                </Alert>
                            </div>
                        )}
                    </Grid>
                </Grid>
                <div className='row flex-end'>
                    <DocButton
                        text='Save'
                        color='green'
                        type="submit"
                    />
                </div>
            </Box>
        </Form>
    );
};

export default DiscountForm;
