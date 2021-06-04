import React, { useEffect, memo, useState, useContext } from 'react';
import {format} from 'date-fns';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid, GridToolbar  } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import OrderDetails from './OrderDetails/OrderDetails';
import { AuthContext } from '../context/AuthContext';
import { ToastsStore } from 'react-toasts';

const orderUrl = process.env.REACT_APP_API_URL

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: 'unset',
    },
    data_grid: {
        marginTop: 30,
        height: 700,
        width: '100%',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '75ch',
    },
}));

const date_format = {
    type: 'dateTime',
    width: 200,
    valueFormatter: ({ value })  => value ? format(new Date(value * 1000), "P p") : '-',
};

const price_format = {
    valueFormatter: ({ value })  => {return "£" + value},
};
const columns = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'billing_detail', headerName: 'Customer Email', width: 250, valueFormatter: ({value}) => value.email},
    { field: 'short_token', headerName: 'Short Token', width: 200 },
    { field: 'shipping_flag', headerName: 'Shipping status', width: 150 },
    { field: 'payment_flag', headerName: 'Payment status', width: 150 },
    { field: 'price', headerName: 'Amount', width: 90, ...price_format},
    { field: 'created_at', headerName: 'Order placed', ...date_format },
    { field: 'modified_at', headerName: 'Last order action', ...date_format },
    { field: 'source', headerName: 'Source'},
];


const OrderList = props => {
    const classes = useStyles();
    const { token } = useContext(AuthContext);
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(0);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [error, setError] = useState(<></>);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [orderDetail, setOrderDetail] = useState({});
    const [dataTableLoading, setDataTableLoading] = useState(true);
    const [searchBox, setSearchBox] = useState("");
    const apiCall = new Promise((res, rej) => {
        axios({
            method: 'get',
            url: `${orderUrl}/v1/order?page=${page}`,
            headers: { Authorization: `Bearer ${token}` },
        }).then(res)
            .catch((err) => ToastsStore.error('Error fetching orders'))
    });

    const clickedRow = (param, event) => {
        setOrderDetail(param);
        setDetailsOpen(true);
    }

    useEffect(() => {
        (async () => {
            setDataTableLoading(true);
            const res = await apiCall;
            if (res.status === 200 && res.data.orders) {
                setPageSize(res.data.pagnation_page_size);
                setPageCount(res.data.total_count);
                setRows(res.data.orders);
            }
            setDataTableLoading(false);
        })();
    }, [page]);

    const toggleDrawer = (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDetailsOpen(false);
    }

    const searchButtonClick =() => {
        if (searchBox == "") {
            return 
        }

        setOrderDetail({id: searchBox});
        setDetailsOpen(true);
    }

    return (
        <Container className={classes.root}>
            <Grid container spacing={3} direction="column">
                <Grid item></Grid>
                <Grid item>
                    <TextField className={classes.textField} id="standard-basic" label="Search DocHQ order number" value={searchBox} onChange={(e) => setSearchBox(e.target.value)} />
                    <Button variant="contained" onClick={searchButtonClick}>Search</Button>
                </Grid>
                <Grid item className={classes.data_grid}>
                    <DataGrid
                        pagination
                        rows={rows}
                        columns={columns}
                        pageSize={pageSize}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        onRowClick={clickedRow}
                        paginationMode="server"
                        onPageChange={(params) => setPage(params.page)}
                        loading={dataTableLoading}
                        rowCount={pageCount}
                        getRowId={(row) => row.short_token}
                    />
                </Grid>
            </Grid>

            <Drawer anchor="right" open={detailsOpen} onClose={toggleDrawer}>
                <OrderDetails token={token} order={orderDetail} closeHandler={toggleDrawer}/>
            </Drawer>
        </Container>
    )
};

export default memo(OrderList);
