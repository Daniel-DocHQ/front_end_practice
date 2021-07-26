import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { get } from 'lodash';
import * as Yup from 'yup';
import moment from 'moment';
import { Formik } from 'formik';
import clsx from 'clsx';
import {
    Grid,
    Card,
    CardContent,
    makeStyles,
    CircularProgress,
    Typography,
} from '@material-ui/core';
import service from '../services/nurseService';
import adminService from '../services/adminService';
import RegisterKitForm from '../components/RegisterKitForm/RegisterKitForm';
import Contain from '../components/Contain/Contain';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
  },
  largeCard: {
    maxWidth: 700,
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

const RegisterKit = () => {
    const classes = useStyles();
    const { id } = useParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataSending, setDataSending] = useState(false);
    const [error, setError] = useState(false);
    const [booking, setBooking] = useState({});
    const [order, setOrder] = useState({});
    const [status, setStatus] = useState(); // { severity, message }
    const orderNumber = get(booking, 'booking_user.metadata.short_token');
    const productId = get(booking, 'booking_user.product_id', '');
    const kitType = get(items.find(({ id }) => id === productId), 'title', '');
    const virtualProduct = items.find(({ type }) => type === 'Virtual')
    const isHotelSwabMethod = get(virtualProduct, 'sku', '') === 'FACE-2-FACE-HOTEL';
    const allSubmitted = !!(booking.booking_users || []).find((usr) => !!get(usr, 'metadata.date_sampled'));

    const handleSubmit = async ({
        kitId,
        dateSampled,
        userId,
        first_name,
        last_name,
    }) => {
        setDataSending(true);
        await service.putBookingUserMetadata(booking.id, userId, {
            metadata: {
                kit_id: kitId,
                sample_taken: "valid",
                date_sampled: dateSampled,
                first_name,
                last_name,
            }
        }).then(res => {
            setStatus({
                severity: 'success',
                message: 'Data submitted successfully! Please submit data for other users as well',
            });
        }).catch((err) => {
            setStatus({
                severity: 'error',
                message: 'Something went wrong!',
            });
            setError(true);
        });
        setDataSending(false);
    };

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
                            setError(true);
                        }
                    })
                    .catch(err => console.log(err));
                adminService.getOrderInfo(short_token)
                    .then(data => {
                        if (data.success) {
                            setOrder(data.order);
                        } else {
                            setError(true);
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
        );
    };

    return error ? (
        <Contain>
            <Grid item xs={12}>
                <Typography className={classes.text}>
                    There was an error loading your kit registration, please close the page and try again.
                </Typography>
            </Grid>
        </Contain>
    ) : allSubmitted ? (
        <Grid container alignContent="center" direction="column">
            <Grid item style={{ paddingTop: 20 }}>
                <Card className={clsx(classes.card, classes.largeCard)} variant="outlined">
                    <CardContent>
                        <h3 className='no-margin'>
                            Thank you for submission<br /><br />
                        </h3>
                        <Typography className={classes.text}>
                            Your kits is now on the way to our laboratory.<br />
                            Your certificate will be emailed to you once the sample has been analysed by the laboratory and the results supervised by a GMC registered doctor.<br /><br />
                            If you have any questions, please contact us at <span className={classes.redText}>covidtesthelp@dochq.co.uk</span> 9-5 pm 7 days per week.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    ) : (
        <Formik
            initialValues={{
                kitId: '',
                userId: '',
                user: '',
                confirmKitId: '',
                dateSampled: new Date(),
                timeSampled: new Date(),
                checkbox: false,
            }}
            onSubmit={async (values, action) => {
                const {
                    kitId,
                    dateSampled,
                    timeSampled,
                    user,
                    userId,
                } = values;
                await handleSubmit({
                    kitId,
                    userId,
                    first_name: user.first_name,
                    last_name: user.last_name,
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
                userId: Yup.string().required('Select user'),
                kitId: Yup.string().required('Input Kit ID'),
                confirmKitId: Yup.string()
                    .oneOf([Yup.ref('kitId'), null], 'Kit IDs should match')
                    .required('Repeat your Kit ID'),
                dateSampled: Yup.date().required('Choose Sample Date and Time'),
                timeSampled: Yup.date().required('Choose Sample Time'),
                checkbox: Yup.bool().oneOf([true], 'Field must be checked'),
            })}
        >
            <RegisterKitForm
                kitType={kitType}
                status={status}
                setStatus={setStatus}
                dataSending={dataSending}
                bookingUsers={booking.booking_users}
                orderNumber={orderNumber}
                hotel={get(order, 'shipping_address.address_1', '')}
                isHotelSwabMethod={isHotelSwabMethod}
                orderNumber={orderNumber}
            />
        </Formik>
    );
};

export default RegisterKit;
