import React, { useEffect, memo, useState, useContext } from 'react';
import {format} from 'date-fns';
import { useDebounce } from 'react-use';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import { GridOverlay, DataGrid, GridToolbar  } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import OrderDetails from './OrderDetails/OrderDetails';
import { AuthContext } from '../context/AuthContext';
import { ToastsStore } from 'react-toasts';
import adminService from '../services/adminService';
import getURLParams from '../helpers/getURLParams';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: 'unset',
    },
    data_grid: {
        marginTop: 30,
        height: 2800,
        width: '100%',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '40ch',
    },
    formControl: {
        width: '30ch',
      },
}));

const SOURCE_STRING = {
    'ROCS': 'Rock',
}

const COLLECTION_STRING = {
    'bristol_airport': 'Bristol',
}
const date_format = {
    type: 'dateTime',
    width: 200,
    valueFormatter: ({ value })  => value ? format(new Date(value * 1000), "P p") : '-',
};

const price_format = {
    valueFormatter: ({ value })  => ("£" + value),
};
const source_format = {
    valueFormatter: ({ value })  => !!SOURCE_STRING[value] ? SOURCE_STRING[value] : value,
}
const collection_format = {
    valueFormatter: ({ value })  => !!COLLECTION_STRING[value] ? COLLECTION_STRING[value] : value,
}
const columns = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'billing_detail', headerName: 'Customer Email', width: 250, valueFormatter: ({value}) => value.email},
    { field: 'short_token', headerName: 'Short Token', width: 200 },
    { field: 'shipping_flag', headerName: 'Shipping status', width: 150 },
    { field: 'payment_flag', headerName: 'Payment status', width: 150 },
    { field: 'price', headerName: 'Amount', width: 90, ...price_format},
    { field: 'created_at', headerName: 'Order placed', ...date_format },
    { field: 'source', headerName: 'Source', ...source_format},
    { field: 'collection_point', headerName: 'Collection point', ...collection_format},
];


const OrderList = props => {
    const classes = useStyles();
    const params = getURLParams(window.location.href);
	const discount = params['discount'] || '';
    const { role, user, token } = useContext(AuthContext);
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(50);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [error, setError] = useState(<></>);
    const [search, setSearch] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [orderDetail, setOrderDetail] = useState();
    const [dataTableLoading, setDataTableLoading] = useState(true);
    const [searchBox, setSearchBox] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchDiscount, setSearchDiscount] = useState(discount);
    const [searchType, setSearchType] = useState(discount ? 3 : 2);
    const searchValues = {
        1: searchBox,
        2: searchEmail,
        3: searchDiscount,
    };
    const onChangeSearchValue = {
        1: setSearchBox,
        2: setSearchEmail,
        3: setSearchDiscount,
    };
    const clickedRow = (param, event) => {
        setOrderDetail(param);
        setDetailsOpen(true);
    }

    useEffect(() => {
        setDataTableLoading(true);
        adminService.getOrders(token, page, searchEmail, searchDiscount, pageSize)
            .then(res => {
                if (res.success && res.data) {
                    setPageCount(!!res.data.total_count ? res.data.total_count : !!res.data.orders ? pageCount : 0);
                    setRows(res.data.orders || []);
                }
            }).catch((err) => ToastsStore.error('Error fetching orders'));
        setDataTableLoading(false);
    }, [page, search, pageSize]);

    useDebounce(() => {
        setPage(0);
        setSearch(!search);
	}, 300, [searchEmail, searchDiscount]);

    const toggleDrawer = (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDetailsOpen(false);
    }

    const searchButtonClick =() => {
        if (searchBox === "") {
            return
        }

        setOrderDetail({id: searchBox});
        setDetailsOpen(true);
    }

    return (
        <Container className={classes.root}>
            <Grid container spacing={3} direction="column">
                <Grid container item xs={12} justify="space-between" alignItems="center">
                    <Grid item xs={1}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Search Type</InputLabel>
                            <Select
                                value={searchType}
                                onChange={(e) => {
                                    setSearchBox('');
                                    setSearchEmail('');
                                    setSearchDiscount('');
                                    setSearchType(e.target.value);
                                }}
                            >
                                <MenuItem value={1}>Short token</MenuItem>
                                <MenuItem value={2}>Email</MenuItem>
                                <MenuItem value={3}>Discount code</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={8} alignItems="center">
                        <TextField className={classes.textField} id="standard-basic" label="Search" value={searchValues[searchType]} onChange={(e) => onChangeSearchValue[searchType](e.target.value)} />
                        {searchType === 1 && (
                            <Button variant="contained" onClick={searchButtonClick}>Search</Button>
                        )}
                    </Grid>
                </Grid>
                <Grid item className={classes.data_grid}>
                    <DataGrid
                        pagination
                        rows={rows}
                        columns={columns}
                        pageSize={pageSize}
                        components={{
                            Toolbar: GridToolbar,
                            NoRowsOverlay: CustomNoRowsOverlay,
                        }}
                        onRowClick={clickedRow}
                        paginationMode="server"
                        onPageSizeChange={(params) => setPageSize(params.pageSize)}
                        onPageChange={(params) => setPage(params.page)}
                        loading={dataTableLoading}
                        rowCount={pageCount}
                        getRowId={(row) => row.short_token}
                    />
                </Grid>
            </Grid>

            <Drawer anchor="right" open={detailsOpen} onClose={toggleDrawer}>
                <OrderDetails role={!!role ? role.name : '' } user={user} token={token} order={orderDetail} closeHandler={toggleDrawer}/>
            </Drawer>
        </Container>
    )
};

function CustomNoRowsOverlay() {
    const classes = useStyles();
    return (
        <GridOverlay>
            <div className={classes.label}>No Orders Found</div>
        </GridOverlay>
    );
  }

export default memo(OrderList);
