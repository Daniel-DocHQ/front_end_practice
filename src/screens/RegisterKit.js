import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { get } from 'lodash';
import * as Yup from 'yup';
import moment from 'moment';
import { Field, Form, Formik } from 'formik';
import Alert from '@material-ui/lab/Alert';
import DateFnsUtils from '@date-io/date-fns';
import {
    Grid,
    Card,
    CardContent,
    Container,
    FormControl,
	Checkbox,
	FormControlLabel,
	FormGroup,
    ListItemText,
    List,
    ListItem,
    makeStyles,
    CircularProgress,
    Typography,
} from '@material-ui/core';
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/styles';
import service from '../services/nurseService';
import Input from '../components/FormComponents/Input';
import adminService from '../services/adminService';
import DocButton from '../components/DocButton/DocButton';
import datePickerTheme from '../helpers/datePickerTheme';
import preventCopyPaste from '../helpers/preventCopyPaste';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    width: '100%',
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

const Contain = ({ children }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Container maxWidth="sm">
                <Grid container>
                    {children}
                </Grid>
            </Container>
        </div>
    )
}

const RegisterKit = () => {
    const classes = useStyles();
    const { id } = useParams();
    const pickerTheme = datePickerTheme();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [booking, setBooking] = useState({});
    const [status, setStatus] = useState(); // { severity, message }
    const dateOfBirth = get(booking, 'booking_user.date_of_birth', '') || get(booking, 'booking_user.metadata.date_of_birth', '');
    const passportNumber = get(booking, 'booking_user.metadata.passport_number', '') || get(booking, 'booking_user.metadata.passportId', '');
    const email = get(booking, 'booking_user.email', '');
    const productId = get(booking, 'booking_user.metadata.product_id', '');
    const kitType = get(items.find(({ id }) => id === productId), 'title', '');
    const swabMethod = get(items.find(({ type }) => type === 'Virtual'), 'title', '');

    const handleSubmit = ({
        kitId,
        dateSampled,
    }) => {
        service.putBookingUserMetadata(booking.id, booking.booking_user.id, {
            metadata: {
                kit_id: kitId,
                sample_taken: "valid",
                date_sampled: dateSampled,
                first_name: booking.booking_user.first_name,
                last_name: booking.booking_user.last_name,
            }
        }).then(res => {
            setStatus({
                severity: 'success',
                message: 'Data saved successfully!',
            });
        }).catch((err) => setStatus({
            severity: 'error',
            message: 'Something went wrong!',
        }));
    }

    const getData = async () => {
        await service.getAppointmentDetails(id, "").then(res => {
            if (res.success && res.appointment) {
                setBooking(res.appointment);
                const short_token = res.appointment.booking_user.metadata.short_token;
                adminService.getOrderProducts(short_token)
                    .then(data => {
                        if (data.success) {
                            setItems(data.order);
                        } else {
                            setError(true)
                        }
                    })
                    .catch(err => console.log(err));
            }
        }).catch((err) => console.log(err));
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    if (loading) {
        return (
            <Contain>
                <Grid item xs={12}>
                    <CircularProgress color="secondary" />
                </Grid>
            </Contain>
        )
    }

    return error ? (
        <Contain>
            <Grid item xs={12}>
                <Typography className={classes.text}>
                    There was an error loading your kit registration, please close the page and try again.
                </Typography>
            </Grid>
        </Contain>
    ): (
        <Contain>
            <Grid container alignContent="center" direction="column">
                <Grid item>
                    <Card className={classes.card} variant="outlined">
                        <CardContent>
                            <h3 className='no-margin'>
                                {booking.booking_user.first_name} {booking.booking_user.last_name}
                            </h3>
                            <List>
                                <ListItem>
                                    <ListItemText>
                                        <b>Order number</b>: {booking.booking_user.metadata.short_token}
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        <b>Date of Birth</b>: {format(new Date(dateOfBirth), 'dd-MM-yyyy')}
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        <b>ID Document Number</b>: {passportNumber}
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        <b>Email address</b>: {email}
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item style={{ paddingTop: 20 }}>
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
                                        <b>Swab method</b>: {swabMethod}
                                    </ListItemText>
                                </ListItem>
                            </List>
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
                <Grid item style={{ paddingTop: 20 }}>
                    <Card className={classes.card} variant="outlined">
                        <CardContent>
                            <h3 className='no-margin'>
                                Register Kit
                            </h3>
                            <Formik
								initialValues={{
									kitId: '',
                                    confirmKitId: '',
                                    dateSampled: new Date(),
                                    timeSampled: new Date(),
                                    checkbox: false,
								}}
								onSubmit={async (values) => {
                                    const {
                                        kitId,
                                        dateSampled,
                                        timeSampled,
                                    } = values;
									await handleSubmit({
                                        kitId,
                                        dateSampled: moment(
                                            new Date(
                                                dateSampled.getFullYear(),
                                                dateSampled.getMonth(),
                                                dateSampled.getDate(),
                                                timeSampled.getHours(),
                                                timeSampled.getMinutes(),
                                                0,
                                            )).format(),
                                    });
								}}
								validationSchema={Yup.object().shape({
                                    kitId: Yup.string().required('Input Kit ID'),
                                    confirmKitId: Yup.string()
                                        .oneOf([Yup.ref('kitId'), null], 'Kit IDs should match')
                                        .required('Repeat your Kit ID'),
                                    dateSampled: Yup.date().required('Choose Sample Date and Time'),
                                    timeSampled: Yup.date().required('Choose Sample Time'),
                                    checkbox: Yup.bool().oneOf([true], 'Field must be checked'),
                                })}
							>
                                <Form>
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
                                                    error={!!meta.error}
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
                                                    error={!!meta.error}
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
                                    <div className='row flex-end'>
                                        <DocButton
                                            text='Submit'
                                            color='green'
                                            type="submit"
                                        />
                                    </div>
                                </Form>
                            </Formik>
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
            </Grid>
        </Contain>
    )
}


export default RegisterKit;
