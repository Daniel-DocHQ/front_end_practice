import React, { useState, useEffect } from 'react';
import { Form, Field } from 'formik';
import { Box, Grid, InputLabel, Select, FormControl, MenuItem } from '@material-ui/core';
import LinkButton from '../DocButton/LinkButton';
import DocButton from '../DocButton/DocButton';
import Input from '../FormComponents/Input';
import adminService from '../../services/adminService';

const ProductForm = ({
    token,
    isView = false,
    isEdit,
    setIsEdit,
    ...restProps
}) => {
    const [tagsOptions, setTagsOptions] = useState([]);

    const getTagsOptions = async () => {
        await adminService.getTags(token)
        .then((result) => {
            if (result.success && result.tags)
                setTagsOptions(result.tags);
        }).catch((err) => console.log(err.error))
    }

    useEffect(() => {
        getTagsOptions();
    }, []);

	return (
        <Form {...restProps}>
            <Box p={8}>
                <Grid container justify="space-between" alignItems="flex-end" spacing={10}>
                    {isView && (
                        <div className='row space-between'>
                            <LinkButton
                                text="Back to Product list"
                                color="green"
                                linkSrc="/super_admin/product-management"
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
                            <Field name="country" >
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Country"
                                        id="country"
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
                            <Field name="description" >
                                {({ field, meta }) => (
                                    <Input
                                        error={!!meta.error}
                                        touched={meta.touched}
                                        helperText={(meta.error && meta.touched) && meta.error}
                                        label="Product Description"
                                        id="description"
                                        disabled={!isEdit}
                                        variant="standard"
                                        type="text"
                                        {...field}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="row">
                            <Field name="tags">
                                {({ field, meta }) => (
                                    <FormControl
                                        variant='filled'
                                        style={{ width: '100%' }}
                                    >
                                        <InputLabel
                                            htmlFor="grouped-select"
                                        >
                                            Tags
                                        </InputLabel>
                                        <Select
                                            multiple
                                            error={!!meta.error}
                                            touched={meta.touched}
                                            disabled={!isEdit}
                                            placeholder="Tags"
                                            helperText={(meta.error && meta.touched) && meta.error}
                                            {...field}
                                        >
                                            {tagsOptions.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
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
