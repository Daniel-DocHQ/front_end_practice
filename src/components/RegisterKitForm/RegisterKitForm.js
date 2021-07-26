import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { get } from 'lodash';
import { Field, Form, useFormikContext } from 'formik';
import Alert from '@material-ui/lab/Alert';
import DateFnsUtils from '@date-io/date-fns';
import {
    Grid,
    Card,
    CardContent,
    FormControl,
	Checkbox,
	FormControlLabel,
	FormGroup,
    ListItemText,
    List,
    ListItem,
    makeStyles,
    Typography,
    Radio,
    FormLabel,
    RadioGroup,
    FormHelperText,
} from '@material-ui/core';
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/styles';
import Input from '../FormComponents/Input';
import DocButton from '../DocButton/DocButton';
import datePickerTheme from '../../helpers/datePickerTheme';
import preventCopyPaste from '../../helpers/preventCopyPaste';
import Contain from '../Contain/Contain';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const useStyles = makeStyles(() => ({
    card: {
      width: '100%',
    },
    largeCard: {
      minWidth: 800,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    text: {
      fontSize: 16,
    },
    redText: {
      color: 'var(--doc-pink)',
    },
}));

const RegisterKitForm = ({
    isHotelSwabMethod,
    hotel,
    kitType,
    orderNumber,
    status,
    setStatus,
    dataSending,
    bookingUsers = [],
    ...restProps
}) => {
    const classes = useStyles();
    const { values: { user }, resetForm } = useFormikContext();
    const pickerTheme = datePickerTheme();

    useEffect(() => {
		if (status && status.severity === 'success') {
			const timer = setTimeout(() => {
                setStatus();
                resetForm();
            }, 5000);
			return () => clearTimeout(timer);
		}
	}, [status]);

    return (
        <Form {...restProps}>
            <Contain>
                <Grid container alignContent="center" direction="column">
                    <Grid item style={{ paddingTop: 10 }}>
                        <Card className={classes.card} variant="outlined">
                            <CardContent>
                                <h3 className='no-margin'>
                                Test Details
                                </h3>
                                <List>
                                    <ListItem>
                                        <ListItemText>
                                            <b>Test</b>: {kitType}
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText>
                                            <b>Swab method</b>: Self swab
                                        </ListItemText>
                                    </ListItem>
                                    {isHotelSwabMethod && (
                                        <ListItem>
                                            <ListItemText>
                                                <b>Hotel</b>: {hotel}
                                            </ListItemText>
                                        </ListItem>
                                    )}
                                    <ListItem>
                                        <ListItemText>
                                            <b>Order number</b>: {orderNumber}
                                        </ListItemText>
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item style={{ paddingTop: 20 }}>
                        <Card className={classes.card} variant="outlined">
                            <CardContent>
                                <div className='row' style={{ flexWrap: 'wrap', width: '60%' }}>
                                    <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                                        <Field name="userId">
                                            {({ field, form, meta }) => (
                                                <FormControl
                                                    component='fieldset'
                                                    style={{ width: '100%' }}
                                                    error={!!meta.error && meta.touched}
                                                    touched={meta.touched}
                                                    helperText={(meta.error && meta.touched) && meta.error}
                                                >
                                                    <FormLabel required component='legend'>
                                                        Select user
                                                    </FormLabel>
                                                    <RadioGroup
                                                        value={field.value}
                                                        label="Select user"
                                                        {...field}
                                                        onChange={(({ target: { value } }) => {
                                                            const user = bookingUsers.find(({ id }) => id === value);
                                                            form.setFieldValue(field.name, value);
                                                            form.setFieldValue('user', user);
                                                        })}
                                                    >
                                                        {bookingUsers.map((bookingUser) => (
                                                            <FormControlLabel
                                                                value={bookingUser.id}
                                                                key={bookingUser.id}
                                                                control={<Radio />}
                                                                disabled={!!get(bookingUser, 'metadata.date_sampled')}
                                                                style={{ width: 'max-content', paddingTop: 10 }}
                                                                label={`${bookingUser.first_name} ${bookingUser.last_name}`}
                                                            />
                                                        ))}
                                                    </RadioGroup>
                                                    <FormHelperText>{(meta.error && meta.touched) && meta.error}</FormHelperText>
                                                </FormControl>
                                            )}
                                        </Field>
                                    </div>
                                </div>
                                {!!user && (
                                    <>
                                        <h3 className='no-margin'>
                                            {user.first_name} {user.last_name}
                                        </h3>
                                        <List>
                                            <ListItem>
                                                <ListItemText>
                                                    <b>Date of Birth</b>: {format(new Date(get(user, 'date_of_birth', '') || get(user, 'metadata.date_of_birth', '')), 'dd-MM-yyyy')}
                                                </ListItemText>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText>
                                                    <b>ID Document Number</b>: {get(user, 'metadata.passport_number', '') || get(user, 'metadata.passportId', '')}
                                                </ListItemText>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText>
                                                    <b>Email address</b>: {get(user, 'email', '')}
                                                </ListItemText>
                                            </ListItem>
                                        </List>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item style={{ paddingTop: 20 }}>
                        <Card className={classes.card} variant="outlined">
                            <CardContent>
                                <Typography className={classes.text}>
                                    Please ensure the kit is registered as soon as possible <span className={classes.redText}>AFTER</span> the sample has been taken. Delaying registering your kit may lead to delays and possible disruptions to your journey.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    {!!user && (
                        <Grid item>
                            <Card className={classes.card} variant="outlined">
                                <CardContent>
                                    <h3 className='no-margin'>
                                        Register Kit
                                    </h3>
                                    <ThemeProvider theme={pickerTheme}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <div className='row center'>
                                                <div className='appointment-calendar-container'>
                                                    <h4 style={{ margin: 0, padding: "20px 0 10px 0" }}>
                                                        Select Sampled Date
                                                    </h4>
                                                    <Field name="dateSampled">
                                                        {({ field, form }) => (
                                                            <KeyboardDatePicker
                                                                {...field}
                                                                label="Select Sampled Date"
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
                                                        Select Sampled Time
                                                    </h4>
                                                    <Field name="timeSampled">
                                                        {({ field, form }) => (
                                                            <KeyboardTimePicker
                                                                autoOk
                                                                {...field}
                                                                required
                                                                label="Select Sampled Time"
                                                                placeholder="DD/MM/YYYY"
                                                                inputVariant='filled'
                                                                onChange={(value) => {
                                                                    form.setFieldValue(field.name, value);
                                                                }}
                                                                KeyboardButtonProps={{
                                                                    'aria-label': 'change time',
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </div>
                                            </div>
                                        </MuiPickersUtilsProvider>
                                    </ThemeProvider>
                                    <h4 style={{ margin: 0 }}>
                                        Enter your kit ID
                                    </h4>
                                    <div className="row">
                                        <Field name="kitId">
                                            {({ field, meta }) => (
                                                <Input
                                                    required
                                                    id="kit-id"
                                                    label="Kit ID"
                                                    placeholder="Eg: 20P456632"
                                                    onCopy={preventCopyPaste}
                                                    onDrag={preventCopyPaste}
                                                    onDrop={preventCopyPaste}
                                                    onPaste={preventCopyPaste}
                                                    error={!!meta.error && meta.touched}
                                                    touched={meta.touched}
                                                    helperText={((meta.error && meta.touched) && meta.error) || ((!!field.value && field.value.replace(/[0-9]/g,"").length > 1) && 'Kit ID usually contains only one letter. Please double check your kit ID if you have entered "O" letter instead of zero.')}
                                                    {...field}
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <h4 style={{ margin: 0 }}>
                                        Kit ID confirmation
                                    </h4>
                                    <div className="row">
                                        <Field name="confirmKitId">
                                            {({ field, meta }) => (
                                                <Input
                                                    required
                                                    id="confirm-kit-id"
                                                    label="Confirm Kit ID"
                                                    onCopy={preventCopyPaste}
                                                    onDrag={preventCopyPaste}
                                                    onDrop={preventCopyPaste}
                                                    onPaste={preventCopyPaste}
                                                    placeholder="Eg: 20P456632"
                                                    error={!!meta.error && meta.touched}
                                                    touched={meta.touched}
                                                    helperText={(meta.error && meta.touched) && meta.error}
                                                    {...field}
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <div className='row'>
                                        <Field name="checkbox">
                                            {({ field, form, meta }) => (
                                                <FormControl
                                                    component='fieldset'
                                                >
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    {...field}
                                                                    required
                                                                    error={!!meta.error}
                                                                    touched={meta.touched}
                                                                    helperText={(meta.error && meta.touched) && meta.error}
                                                                    onChange={event => form.setFieldValue("checkbox", event.target.checked)}
                                                                    value={field.value}
                                                                />
                                                            }
                                                            label={
                                                                <p>
                                                                    I confirm all details stated above have been validated and are correct at the time of submission
                                                                </p>
                                                            }
                                                        />
                                                    </FormGroup>
                                                </FormControl>
                                            )}
                                        </Field>
                                    </div>
                                    {dataSending ? (
                                        <div className='row center'>
                                            <LoadingSpinner />
                                        </div>
                                    ) : (
                                        <div className='row flex-end'>
                                            <DocButton
                                                text='Submit'
                                                color='green'
                                                type="submit"
                                            />
                                        </div>
                                    )}
                                    {typeof status !== 'undefined' && (
                                        <div className='row center'>
                                            <Alert severity={status.severity} variant='outlined'>
                                                {status.message}
                                            </Alert>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Contain>
        </Form>
	);
};

export default RegisterKitForm;
