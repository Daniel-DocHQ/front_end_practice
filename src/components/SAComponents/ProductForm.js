import React from 'react';
import { Form, Field } from 'formik';
import { Box, Grid } from '@material-ui/core';
import DocButton from '../DocButton/DocButton';
import Input from '../FormComponents/Input';

const ProductForm = ({
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
                        <div className='row flex-end'>
                            <DocButton
                                text={isEdit ? 'Cancel' :'Edit'}
                                color={isEdit ? 'pink' : 'green'}
                                onClick={() => setIsEdit(!isEdit)}
                            />
                        </div>
                    )}
                    <Grid item xs={6}>
                        <div className="row">
                            <Field name="title" >
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Product Title"
                                        id="title"
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
                            <Field name="sku">
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="SKU"
                                        id="sku"
                                        type="text"
                                        disabled={!isEdit}
                                        variant="standard"
                                        required
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="row">
                            <Field name="price">
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Price"
                                        id="price"
                                        type="number"
                                        disabled={!isEdit}
                                        variant="standard"
                                        required
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="row">
                            <Field name="type">
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
                                        required
                                        {...field}
                                    />
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

export default ProductForm;
