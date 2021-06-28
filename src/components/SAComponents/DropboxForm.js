import React from 'react';
import { Form, Field, FieldArray } from 'formik';
import { Box, Grid } from '@material-ui/core';
import DocButton from '../DocButton/DocButton';
import Input from '../FormComponents/Input';
import ScheduleTable from './Tables/ScheduleTable';

const DropboxForm = ({
    isView = false,
    isEdit = false,
    ...restProps
}) => {
	return (
        <Form {...restProps}>
            <Box p={8}>
                <Grid container justify="space-between" alignItems="flex-end" spacing={10}>
                    <Grid item xs={6}>
                        <div className="row">
                            <Field name="name" >
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Dropbox Name"
                                        id="dropbox-name"
                                        required
                                        disabled={isView}
                                        variant="standard"
                                        type="text"
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="row">
                            <Field name="postcode">
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Postal Code"
                                        id="postal-code"
                                        type="text"
                                        disabled={isView}
                                        variant="standard"
                                        required
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="row">
                            <Field name="address_1">
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Address Line 1"
                                        id="address-line-1"
                                        type="text"
                                        disabled={isView}
                                        variant="standard"
                                        required
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="row">
                            <Field name="city">
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="City"
                                        id="city"
                                        disabled={isView}
                                        variant="standard"
                                        type="text"
                                        required
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="row">
                            <Field name="address_2">
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Address Line 2"
                                        id="address-line-2"
                                        type="text"
                                        disabled={isView}
                                        variant="standard"
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="row">
                            <Field name="county">
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="County"
                                        id="county"
                                        disabled={isView}
                                        variant="standard"
                                        type="text"
                                        required
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                    </Grid>
                </Grid>
                <h3>Schedule</h3>
                <FieldArray name="opening_times">
                    <ScheduleTable isView={isView} name="opening_times" />
                </FieldArray>
                <h3>
                    Contact Details
                </h3>
                <Grid container justify="space-between" alignItems="flex-end" spacing={10}>
                    <Grid item xs={6}>
                        <div className="row">
                            <Field name="first_name" >
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="First Name"
                                        id="first-name"
                                        disabled={isView}
                                        variant="standard"
                                        type="text"
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="row">
                            <Field name="email">
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Email"
                                        id="email"
                                        disabled={isView}
                                        type="email"
                                        variant="standard"
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="row">
                            <Field name="last_name">
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Last Name"
                                        id="last-name"
                                        type="text"
                                        disabled={isView}
                                        variant="standard"
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="row">
                            <Field name="phone">
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Telephone Number"
                                        id="phone"
                                        disabled={isView}
                                        variant="standard"
                                        type="text"
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                    </Grid>
                </Grid>
                {!isView && (
                    <div className='row flex-end'>
                        <DocButton
                            text='Save'
                            color='green'
                            type="submit"
                        />
                    </div>
                )}
            </Box>
        </Form>
	);
};

export default DropboxForm;
