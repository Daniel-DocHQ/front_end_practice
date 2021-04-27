import React, { useEffect, memo, useState } from 'react';
import {format} from 'date-fns';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid, GridToolbar  } from '@material-ui/data-grid';
import OrderDetails from './OrderDetails/OrderDetails';

const orderUrl = process.env.REACT_APP_API_URL

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    data_grid: {
        marginTop: 30,
        height: 700,
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
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'billing_detail', headerName: 'Customer Email', width: 170, valueFormatter: ({value}) => value.email},
    { field: 'short_token', headerName: 'Short Token', width: 150 },
    { field: 'shipping_flag', headerName: 'Shipping status', width: 150 },
    { field: 'payment_flag', headerName: 'Payment status', width: 150 },
    { field: 'price', headerName: 'Amount', width: 90, ...price_format},
    { field: 'created_at', headerName: 'Order placed', ...date_format },
    { field: 'modified_at', headerName: 'Last order action', ...date_format },
    { field: 'source', headerName: 'Source'},
];


const OrderList = props => {
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(0)
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0)
    const [error, setError] = useState(<></>)
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [orderDetail, setOrderDetail] = useState({});
    const [dataTableLoading, setDataTableLoading] = useState(true);
    const apiCall = new Promise((res, rej) => {
        axios({
            method: 'get',
            url: `${orderUrl}/v1/order?page=${page}`,
        }).then(res)
            .catch(rej)
    })

    const clickedRow = (param, event) => {
        setOrderDetail(param);
        setDetailsOpen(true);
    }

    useEffect(() => {
        (async () => {
            setDataTableLoading(true)
            const res = await apiCall
            if (res.status === 200 && res.data.orders) {
                setPageSize(res.data.pagnation_page_size)
                setPageCount(res.data.total_count)
                setRows(res.data.orders)
            }
            setDataTableLoading(false);
        })();
    }, [page])

    const toggleDrawer = (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDetailsOpen(false)
    }

    return (
        <Container className={classes.root}>
            <Grid container spacing={3} direction="column">
                <Grid item></Grid>
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
