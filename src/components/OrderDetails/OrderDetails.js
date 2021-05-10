import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { makeStyles } from '@material-ui/core/styles';
import DocButton from '../DocButton/DocButton';

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

const OrderDetails = ({order, closeHandler}) => {
    const classes = useStyles();
    const [orderDetail, setOrderDetail] = useState({});
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(<></>)
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    useEffect(() =>{
        let apiCall = new Promise((res, rej) => {
            axios({
                method: 'get',
                url: `${orderUrl}/v1/order/${order.id}`,
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
                    <Grid item></Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6" className={classes.title}>
                            Billing Details
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText>Customer name: {orderDetail.billing_detail.first_name} {orderDetail.billing_detail.last_name}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>Email: {orderDetail.billing_detail.email}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>Phone: {orderDetail.billing_address.telephone}</ListItemText>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant="h6" className={classes.title}>
                            Shipping Address
                        </Typography>
                        <p>
                            {orderDetail.shipping_address.address_1},<br />
                            {orderDetail.shipping_address.address_2}, <br />
                            {orderDetail.shipping_address.town}, <br />
                            {orderDetail.shipping_address.county}, <br />
                            {orderDetail.shipping_address.postcode},
                        </p>
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
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Description</TableCell>
                                        <TableCell align="right">type</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderDetail.items.map((row) => (
                                        <TableRow key={row.order_id + row.product_id}>
                                            <TableCell component="th" scope="row">{row.product.title}</TableCell>
                                            <TableCell align="right">{row.quantity}</TableCell>
                                            <TableCell align="right">{row.product.price}</TableCell>
                                            <TableCell align="right">{row.product.description}</TableCell>
                                            <TableCell align="right">{row.product.type}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" className={classes.title}>
                                Actions
                            </Typography>
                            <DocButton
                                className="pink"
                                onClick={handleCancelDialogToggle}
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
                    </Container>
                </div>
    )
}

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
                console.log(res)
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


