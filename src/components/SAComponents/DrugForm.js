import React from 'react';
import { Form, Field } from 'formik';
import {
    Box,
    Grid,
    FormControl,
	Checkbox,
	FormControlLabel,
	FormGroup,
} from '@material-ui/core';
import LinkButton from '../DocButton/LinkButton';
import DocButton from '../DocButton/DocButton';
import Input from '../FormComponents/Input';

const DrugForm = ({
    isView = false,
    isEdit,
    setIsEdit,
    ...restProps
}) => {
	return (
        <Form {...restProps}>
            <Box p={8}>
                <Grid container justify="space-between" alignItems="flex-end" spacing={10}>
                    {isView && (
                        <div className='row space-between'>
                            <LinkButton
                                text="Back to Drugs list"
                                color="green"
                                linkSrc="/super_admin/drugs-management"
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
                                        label="Drug Name"
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
                            <Field name="base_component" >
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Base Component"
                                        id="base_component"
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
                            <Field name="type" >
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Type"
                                        id="type"
                                        disabled={!isEdit}
                                        variant="standard"
                                        type="text"
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="row">
                            <Field name="class">
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Class"
                                        id="class"
                                        type="number"
                                        disabled={!isEdit}
                                        variant="standard"
                                        required
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className='row'>
                            <Field name="show_in_autocomplete">
                                {({ field, form, meta }) => (
                                    <FormControl
                                        component='fieldset'
                                    >
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        {...field}
                                                        error={!!meta.error}
                                                        touched={meta.touched}
                                                        disabled={!isEdit}
                                                        helperText={(meta.error && meta.touched) && meta.error}
                                                        onChange={event => form.setFieldValue("show_in_autocomplete", event.target.checked)}
                                                        checked={field.value}
                                                    />
                                                }
                                                label={
                                                    <p>
                                                        Show in Autocomplete
                                                    </p>
                                                }
                                            />
                                        </FormGroup>
                                    </FormControl>
                                )}
                            </Field>
                        </div>
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

export default DrugForm;
