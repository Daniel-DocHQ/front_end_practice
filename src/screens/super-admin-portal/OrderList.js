import React, { useEffect, memo, useState } from 'react';
import {format} from 'date-fns';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid, GridToolbar  } from '@material-ui/data-grid';
import OrderDetails from '../../components/OrderDetails/OrderDetails';

const orderUrl = process.env.REACT_APP_API_URL

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    data_grid: {
        marginTop: 30,
        height: 500,
        width: '100%',
    },
}));

const date_format = {
    type: 'dateTime',
    width: 150,
    valueFormatter: ({value})  => format(new Date(value), "P p"),
};

const price_format = {
    valueFormatter: ({value})  => {return "£" + value},
};
const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'short_token', headerName: 'Short Token', width: 150 },
    { field: 'shipping_flag', headerName: 'Shipping status', width: 150 },
    { field: 'payment_flag', headerName: 'Payment status', width: 150 },
    { field: 'price', headerName: 'Amount', width: 150, ...price_format},
    { field: 'created_at', headerName: 'Order placed', ...date_format },
    { field: 'modified_at', headerName: 'Last order action', ...date_format },
    { field: 'source', headerName: 'Source'},
];


const OrderList = props => {
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(<></>)
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [orderDetail, setOrderDetail] = useState({});

    const clickedRow = (param, event) => {
        setOrderDetail(param);
        setDetailsOpen(true);
    }

    useEffect(() =>{
        let apiCall = new Promise((res, rej) => {
            axios({
                method: 'get',
                url: `${orderUrl}/v1/order`,
            }).then(res)
            .catch(rej)
        })

        apiCall.then(res => {
            if (res.status === 200 && typeof res.data && res.data.orders) {
                setRows(res.data.orders)
            } else {
                setError(<>Something bad happened</>)
            }
            setLoading(false);
        })
        .catch(res => {
            setError(<>{res.message}</>)
        })
    }, [])

    const toggleDrawer = (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDetailsOpen(false)
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
        <Container className={classes.root}>
            <Grid container spacing={3} direction="column">
                <Grid item></Grid>
                <Grid item className={classes.data_grid}>
                    <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={20}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    onRowClick={clickedRow}
                />
                    </Grid>
                </Grid>

                <Drawer anchor="right" open={detailsOpen} onClose={toggleDrawer}>
                    <OrderDetails order={orderDetail} closeHandler={toggleDrawer}/>
                </Drawer>
            </Container>
    )
};

export default memo(OrderList);
