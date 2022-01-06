import React from 'react';
import { FieldArray, Form, Field, useFormikContext } from 'formik';
import { Box, Divider, Grid, Typography } from '@material-ui/core';
import LinkButton from '../DocButton/LinkButton';
import DocButton from '../DocButton/DocButton';
import Input from '../FormComponents/Input';

const CountryForm = ({
    isView = false,
    isEdit,
    setIsEdit,
    ...restProps
}) => {
    const {
        values: {
            recommendations,
            prohibited_schedule_narcotics,
            prohibited_schedule_psychotropics,
        },
    } = useFormikContext();
	return (
        <Form {...restProps}>
            <Box p={8}>
                <Grid container justify="space-between" alignItems="flex-end" spacing={10}>
                    {isView && (
                        <div className='row space-between'>
                            <LinkButton
                                text="Back to Counties list"
                                color="green"
                                linkSrc="/super_admin/countries-management"
                            />
                            <DocButton
                                text={isEdit ? 'Cancel' :'Edit'}
                                color={isEdit ? 'pink' : 'green'}
                                onClick={() => setIsEdit(!isEdit)}
                            />
                        </div>
                    )}
                    <Grid item xs={6}>
                        <div className="row">
                            <Field name="name" >
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Name"
                                        id="name"
                                        required
                                        disabled={!isEdit}
                                        variant="standard"
                                        type="text"
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="row">
                            <Field name="address_5" >
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Address"
                                        id="address_5"
                                        required
                                        disabled={!isEdit}
                                        variant="standard"
                                        type="text"
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="row">
                            <Field name="email" >
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Email"
                                        id="email"
                                        disabled={!isEdit}
                                        variant="standard"
                                        type="text"
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="row">
                            <Field name="prohibited_schedule">
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Prohibited Schedule"
                                        id="prohibited_schedule"
                                        type="number"
                                        disabled={!isEdit}
                                        variant="standard"
                                        required
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <FieldArray name="prohibited_schedule_narcotics">
                            {(arrayHelpers) => (
                                <>
                                    <div className="row space-between">
                                        <Typography component="h3">
                                            Prohibited Schedule Narcotics
                                        </Typography>
                                        {isEdit && (
                                            <DocButton text="Add item" color="green" onClick={() => arrayHelpers.push('')} />
                                        )}
                                    </div>
                                    {prohibited_schedule_narcotics.map((_, indx) => (
                                        <div className='row space-between' style={{ flexWrap: 'wrap', width: '60%' }}>
                                            <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                                                <Field name={`prohibited_schedule_narcotics[${indx}]`}>
                                                    {({ field, form, meta }) => (
                                                        <Input
                                                            {...field}
                                                            error={!!meta.error && meta.touched}
                                                            touched={meta.touched}
                                                            helperText={(meta.error && meta.touched) && meta.error}
                                                            type="number"
                                                            disabled={!isEdit}
                                                            onChange={(({ target: { value } }) => form.setFieldValue(field.name, value.toUpperCase()))}
                                                            label="Prohibited Schedule Narcotics"
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </FieldArray>
                        <Divider />
                        <FieldArray name="prohibited_schedule_psychotropics">
                            {(arrayHelpers) => (
                                <>
                                    <div className="row space-between">
                                        <Typography component="h3">
                                            Prohibited Schedule Psychotropics
                                        </Typography>
                                        {isEdit && (
                                            <DocButton text="Add item" color="green" onClick={() => arrayHelpers.push('')} />
                                        )}
                                    </div>
                                    {prohibited_schedule_psychotropics.map((_, indx) => (
                                        <div className='row space-between' style={{ flexWrap: 'wrap', width: '60%' }}>
                                            <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                                                <Field name={`prohibited_schedule_psychotropics[${indx}]`}>
                                                    {({ field, form, meta }) => (
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            error={!!meta.error && meta.touched}
                                                            touched={meta.touched}
                                                            disabled={!isEdit}
                                                            helperText={(meta.error && meta.touched) && meta.error}
                                                            onChange={(({ target: { value } }) => form.setFieldValue(field.name, value.toUpperCase()))}
                                                            label="Prohibited Schedule Psychotropics"
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </FieldArray>
                        <Divider />
                        <FieldArray name="recommendations">
                            {(arrayHelpers) => (
                                <>
                                    <div className="row space-between">
                                        <Typography component="h3">
                                            Recommendations
                                        </Typography>
                                        {isEdit && (
                                            <DocButton text="Add item" color="green" onClick={() => arrayHelpers.push('')} />
                                        )}
                                    </div>
                                    {recommendations.map((_, indx) => (
                                        <div className='row space-between' style={{ flexWrap: 'wrap', width: '60%' }}>
                                            <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                                                <Field name={`recommendations[${indx}].recommendation`}>
                                                    {({ field, form, meta }) => (
                                                        <Input
                                                            {...field}
                                                            error={!!meta.error && meta.touched}
                                                            touched={meta.touched}
                                                            disabled={!isEdit}
                                                            helperText={(meta.error && meta.touched) && meta.error}
                                                            onChange={(({ target: { value } }) => form.setFieldValue(field.name, value.toUpperCase()))}
                                                            label="Recommendations"
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </FieldArray>
                    </Grid>
                </Grid>
                {isEdit && (
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

export default CountryForm;
