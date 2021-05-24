import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { get } from 'lodash';
import { format } from 'date-fns';
import {
    AppBar,
    Box,
	Grid,
    Paper,
    Container,
	Typography,
	Tooltip,
	Divider,
    CircularProgress,
    Toolbar,
    IconButton,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    List,
    ListItem,
    ListItemText,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import DocButton from '../DocButton/DocButton';
import LinkButton from '../DocButton/LinkButton';
import bookingService from '../../services/bookingService';
import copyToClipboard from '../../helpers/copyToClipboard';

const orderUrl = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    table: {
        minWidth: 650,
    },
    container: {
        marginTop: 10,
    },
}));

const OrderDetails = ({ token, order, closeHandler}) => {
    const classes = useStyles();
    const linkRef = useRef(null);
    const [orderDetail, setOrderDetail] = useState({});
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(<></>);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    useEffect(() =>{
        let apiCall = new Promise((res, rej) => {
            axios({
                method: 'get',
                url: `${orderUrl}/v1/order/${order.id}`,
                headers: { Authorization: `Bearer ${token}` },
            }).then(res)
            .catch(rej)
        })

        apiCall.then(res => {
            console.log(res)
            if (res.status === 200 && typeof res.data) {
                setOrderDetail(res.data)
                setLoading(false)
            } else {
                setError(<>Something bad happened</>)
            }
        })
        .catch(res => {
            setError(<>{res.message}</>)
        })

        bookingService.getAppointmentsByShortToken(order.id)
        .then(result => {
            if (result.success && result.appointments) {
                setAppointments(result.appointments);
            }
        })
    }, [order])

    const handleCancelDialogToggle = () => {
        setCancelDialogOpen(!cancelDialogOpen);
    }
    return loading ? (
        <div className={classes.root}>
            <Grid container spacing={10} direction="column" justify="center" alignItems="center">
                <Grid item></Grid>
                <Grid item>
                    <CircularProgress />
                </Grid>
                {error}
            </Grid>
        </div>
    ) : (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={closeHandler}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Order Details for {orderDetail.billing_detail.first_name} {orderDetail.billing_detail.last_name}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6" className={classes.title}>
                            Purchase Details
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText>
                                    <b>Purchase Date</b>: {format(new Date(orderDetail.created_at), 'dd/MM/yyyy p')}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <b>Order number</b>: {orderDetail.short_token}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <b>Payment status</b>: {orderDetail.payment_flag}
                                </ListItemText>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" className={classes.title}>
                            Products
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">Description</TableCell>
                                        <TableCell align="right">Type</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderDetail.items.map((row) => (
                                        <TableRow key={row.order_id + row.product_id}>
                                            <TableCell component="th" scope="row">{row.product.title}</TableCell>
                                            <TableCell align="right">{row.product.description}</TableCell>
                                            <TableCell align="right">{row.product.type}</TableCell>
                                            <TableCell align="right">{row.quantity}</TableCell>
                                            <TableCell align="right">£{row.product.price}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell align="left">Total</TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right">{orderDetail.items.reduce((sum, { quantity }) => (sum + quantity), 0)}</TableCell>
                                        <TableCell align="right">£{orderDetail.items.reduce((sum, { quantity, product: { price } }) => (sum + price * quantity), 0)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6" className={classes.title}>
                            Billing Details
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText>
                                    <b>Customer name</b>: {orderDetail.billing_detail.first_name} {orderDetail.billing_detail.last_name}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <b>Email</b>: {orderDetail.billing_detail.email}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <b>Phone</b>: {orderDetail.billing_address.telephone}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <b>Address Line 1</b>: {orderDetail.billing_address.address_1}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <b>Address Line 2</b>: {!!orderDetail.billing_address.address_2 ? orderDetail.billing_address.address_2 : '-'}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <b>Post Code</b>: {orderDetail.billing_address.postcode}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <b>County</b>: {orderDetail.billing_address.county}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <b>Town</b>: {orderDetail.billing_address.town}
                                </ListItemText>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6" className={classes.title}>
                            Shipping Address
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText>
                                    <b>Address Line 1</b>: {orderDetail.shipping_address.address_1}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <b>Address Line 2</b>: {!!orderDetail.shipping_address.address_2 ? orderDetail.shipping_address.address_2 : '-'}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <b>Post Code</b>: {orderDetail.shipping_address.postcode}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <b>County</b>: {orderDetail.shipping_address.county}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <b>Town</b>: {orderDetail.shipping_address.town}
                                </ListItemText>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" className={classes.title}>
                            <b>Shipping status</b>: {orderDetail.shipping_flag}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <DocButton
                            className="pink"
                            style={{ marginRight: 10 }}
                            text="Edit order"
                        />
                        <DocButton
                            className="pink"
                            onClick={handleCancelDialogToggle}
                            style={{ marginRight: 10 }}
                            text="Cancel order"
                        />
                        <CancelOrder
                            order={orderDetail}
                            open={cancelDialogOpen}
                            onClose={handleCancelDialogToggle}
                            loading={loading}
                            setLoading={setLoading}
                        />
                        </Grid>
                    </Grid>
                    {!!appointments.length && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Divider style={{ margin: '20px 0' }} />
                                <Typography variant="h6" className={classes.title}>
                                    Appointments Details
                                </Typography>
                                {appointments.map((row, appointmentIndx) => (
                                    <div key={row.id}>
                                        <List>
                                            <ListItemText>
                                                <b>Appointment {appointmentIndx + 1}</b>:
                                            </ListItemText>
                                            <ListItem>
                                                <ListItemText>
                                                    <b>Date</b>: {format(new Date(row.start_time), 'dd/MM/yyyy p')}
                                                </ListItemText>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText>
                                                    <Tooltip title="Click to copy">
                                                        <Typography
                                                            noWrap
                                                            ref={linkRef}
                                                            onClick={() => copyToClipboard(linkRef)}
                                                            className='tab-row-text patient-link-text'
                                                        >
                                                            <b>Appointment Joining link</b>: https://{process.env.REACT_APP_JOIN_LINK_PREFIX}.dochq.co.uk/appointment?appointmentId={row.id}
                                                        </Typography>
                                                    </Tooltip>
                                                </ListItemText>
                                            </ListItem>
                                            {row.booking_users.map((patient, indx) => (
                                                <div key={indx}>
                                                    <ListItemText>
                                                        <b>Details of Passenger {indx + 1}</b>:
                                                    </ListItemText>
                                                    <PatientDetails patient={patient} />
                                                </div>
                                            ))}
                                            <ListItemText>
                                                <b>Appointment Status</b>: {row.status}
                                            </ListItemText>
                                        </List>
                                        <LinkButton
                                            className="pink"
                                            linkSrc={`/customer_services/booking/edit?appointmentId=${row.id}&service=video_gp_dochq`}
                                            text="Edit"
                                        />
                                        <Divider style={{ margin: '20px 0' }} />
                                    </div>
                                ))}
                            </Grid>
                        </Grid>
                    )}
            </Container>
        </div>
    )
}

const PatientDetails = ({ patient }) => {
    const firstName = get(patient, 'first_name', '');
    const lastName = get(patient, 'last_name', '');
    const email = get(patient, 'email', '');
    const phone = get(patient, 'phone', '');
    const date_of_birth = get(patient, 'date_of_birth', '') || get(patient, 'metadata.date_of_birth', '');
    const sex = get(patient, 'sex', '');
    const ethnicity = get(patient, 'ethnicity', '');
    const passportNumber = get(patient, 'metadata.passport_number', '') || get(patient, 'metadata.passportId', '');
    const result = get(patient, 'metadata.result', '');
    const rejectedNotes = get(patient, 'metadata.reject_notes', '');
    const invalidNotes = get(patient, 'metadata.invalid_notes', '');
    const sampleTaken = get(patient, 'metadata.sample_taken', '');
    const kitProvider = get(patient, 'metadata.kitProvider', '');
    const samplingDate = get(patient, 'metadata.date_sampled', '');
    const reportedDate = get(patient, 'metadata.date_reported', '');

    return (
        <List component="div" disablePadding>
            <ListItem>
                <ListItemText>
                    <b>Name</b>: {firstName} {lastName}
                </ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText>
                    <b>Email</b>: {email}
                </ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText>
                    <b>Phone Number</b>: {phone}
                </ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText>
                    <b>Date of Birth</b>: {format(new Date(date_of_birth), 'dd/MM/yyyy')}
                </ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText>
                    <b>Ethnicity</b>: {ethnicity}
                </ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText>
                    <b>Sex</b>: {sex}
                </ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText>
                    <b>Passport Number</b>: {passportNumber}
                </ListItemText>
            </ListItem>
            {samplingDate && (
                <ListItem>
                    <ListItemText>
                        <b>Sampling Date and Time: </b>{new Date(samplingDate).toUTCString()}
                    </ListItemText>
                </ListItem>
            )}
            {reportedDate && (
                <ListItem>
                    <ListItemText>
                        <b>Reported Date and Time: </b>{new Date(reportedDate).toUTCString()}
                    </ListItemText>
                </ListItem>
            )}
            <Box pt={2}>
                {kitProvider && (
                    <ListItem>
                        <ListItemText>
                            <b>KIT provider</b>: {kitProvider}
                        </ListItemText>
                    </ListItem>
                )}
                {sampleTaken && (
                    <ListItem>
                        <ListItemText>
                            <b>Sample: </b>
                            <span className={sampleTaken.toLowerCase()}>{sampleTaken}</span>
                        </ListItemText>
                    </ListItem>
                )}
                {result && (
                    <ListItem>
                        <ListItemText>
                            <b>Test Result: </b>
                            <span className={result.toLowerCase()}>{result}</span>
                        </ListItemText>
                    </ListItem>
                )}
                {rejectedNotes && (
                    <ListItem>
                        <ListItemText>
                            <b>Rejection Notes: </b>{rejectedNotes}
                        </ListItemText>
                    </ListItem>
                )}
                {invalidNotes && (
                    <ListItem>
                        <ListItemText>
                            <b>Invalid Notes: </b>{invalidNotes}
                        </ListItemText>
                </ListItem>
                )}
            </Box>
        </List>
    );
};

const CancelOrder = ({order, open, onClose, loading, setLoading}) => {
    const classes = useStyles();
    const [emailAddress, setEmailAddress] = useState("")
    const [error, setError] = useState(<></>)

    const cancelOrder = () => {
        if (emailAddress === order.billing_detail.email) {
            setLoading(true)
            let apiCall = new Promise((res, rej) => {
                axios({
                    method: 'delete',
                    url: `${orderUrl}/v1/order/${order.id}`,
                }).then(res)
                .catch(rej)
            })
            apiCall.then(res => {
                if (res.status === 200 && typeof res.data) {
                    setLoading(false)
                    window.location.reload(false);
                } else {
                    setError(<>Something bad happened</>)
                    setLoading(false)
                }
            })
            .catch(res => {
                setError(<>{res.message}</>)
                setLoading(false)
            })
        }
    }

    return loading ? (
        <div className={classes.root}>
            <Grid container spacing={10} direction="column" justify="center" alignItems="center">
                <Grid item></Grid>
                <Grid item>
                    <CircularProgress />
                </Grid>
                {error}
            </Grid>
        </div>
    ) : (
        <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
            <DialogTitle id="alert-dialog-title">{"Cancel order?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Upon canceling an order a refund will be issued to the customer for the amount on the order
                    any shipping manifests will be called off and the order will not ship.
                    If you are certain you want to cancel the order, please enter the order's email address ({order.billing_detail.email})
                </DialogContentText>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                value={emailAddress}
                onChange={(e)=>setEmailAddress(e.target.value)}
                fullWidth
            />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Close
                    </Button>
                    <Button onClick={cancelOrder} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
    )
}

export default OrderDetails;


