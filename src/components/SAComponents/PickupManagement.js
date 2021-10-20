import React, { memo, useEffect, useState, useContext } from 'react';
// import { format } from 'date-fns';
import { ToastsStore } from 'react-toasts';
// import { useDebounce } from 'react-use';
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
// import { GridOverlay, DataGrid, GridToolbar  } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import OrderDetails from '../OrderDetails/OrderDetails';
import { AuthContext } from '../../context/AuthContext';
import getURLParams from '../../helpers/getURLParams';
import adminService from '../../services/adminService';

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

// const SOURCE_STRING = {
//     'ROCS': 'Rock',
// }

// const COLLECTION_STRING = {
//     'bristol_airport': 'Bristol',
// }
// const date_format = {
//     type: 'dateTime',
//     width: 200,
//     valueFormatter: ({ value })  => value ? format(new Date(value * 1000), "P p") : '-',
// };

// const price_format = {
//     valueFormatter: ({ value })  => ("£" + value),
// };
// const source_format = {
//     valueFormatter: ({ value })  => !!SOURCE_STRING[value] ? SOURCE_STRING[value] : value,
// }
// const collection_format = {
//     valueFormatter: ({ value })  => !!COLLECTION_STRING[value] ? COLLECTION_STRING[value] : value,
// }
// const columns = [
//     { field: 'id', headerName: 'ID', width: 60 },
//     { field: 'billing_detail', headerName: 'Customer Email', width: 250, valueFormatter: ({value}) => value.email},
//     { field: 'short_token', headerName: 'Short Token', width: 200 },
//     { field: 'shipping_flag', headerName: 'Shipping status', width: 150 },
//     { field: 'payment_flag', headerName: 'Payment status', width: 150 },
//     { field: 'price', headerName: 'Amount', width: 90, ...price_format},
//     { field: 'created_at', headerName: 'Order placed', ...date_format },
//     { field: 'source', headerName: 'Source', ...source_format},
//     { field: 'collection_point', headerName: 'Collection point', ...collection_format},
// ];

const PickupManagement = () => {
    const classes = useStyles();
    const params = getURLParams(window.location.href);
	const short_token = params['short_token'];
    const { user, token } = useContext(AuthContext);
    const [collected, setCollected] = useState(false);
    const [collectionInfo, setCollectionInfo] = useState();
    // const [rows, setRows] = useState([]);
    // const [pageSize, setPageSize] = useState(50);
    // const [page, setPage] = useState(0);
    // const [pageCount, setPageCount] = useState(0);
    // const [error, setError] = useState(<></>);
    // const [search, setSearch] = useState(false);
    const [orderDetail, setOrderDetail] = useState();
    // const [dataTableLoading, setDataTableLoading] = useState(true);
    const [searchBox, setSearchBox] = useState("");

    const updateCollected = async (value) => {
        await adminService.switchCollectionInfo(collectionInfo.id, token, {...collectionInfo, collected: value }).then(res => {
            if (res.success && res.data) {
                setCollected(value);
                ToastsStore.success('Order collection status has been changed successfully');
            } else {
                ToastsStore.error(res.error)
            }
            }).catch(res => {
                ToastsStore.error(res.error)
            });
    }

    // const clickedRow = (param, event) => {
    //     setOrderDetail(param);
    // }

    // useEffect(() => {
    //     setDataTableLoading(true);
    //     adminService.getOrders(token, page, '', '', pageSize)
    //         .then(res => {
    //             if (res.success && res.data) {
    //                 setPageCount(!!res.data.total_count ? res.data.total_count : !!res.data.orders ? pageCount : 0);
    //                 setRows(res.data.orders || []);
    //             }
    //         }).catch((err) => ToastsStore.error('Error fetching orders'));
    //     setDataTableLoading(false);
    // }, [page, search, pageSize]);

    // useDebounce(() => {
    //     setPage(0);
    //     setSearch(!search);
	// }, 300, [searchEmail, searchDiscount]);

    const fetchCollectionInfoData = async () => {
		if (!!orderDetail && !!orderDetail.id) {
			await adminService.getCollectionInfo(orderDetail.id, token).then(res => {
				if (res.success && res.data) {
					setCollectionInfo(res.data);
				} else {
                    ToastsStore.error(res.error)
				}
				}).catch(res => {
                    ToastsStore.error(res.error)
				});
		}
	};

    const searchButtonClick = ({ orderId }) => {
        const newOrderId = searchBox || orderId;
        if (newOrderId === "") return

        if (searchBox !== newOrderId)
            setSearchBox(newOrderId);
        setOrderDetail({ id: newOrderId });
    }

    useEffect(() => {
        if (!!orderDetail)
            fetchCollectionInfoData()
    }, [orderDetail]);

    useEffect(() => {
        if (!!orderDetail && !!collectionInfo)
            updateCollected(true);
    }, [collectionInfo]);

    useEffect(() => {
        if (short_token)

            searchButtonClick({ orderId: short_token });
    }, []);

    return (
        <Container className={classes.root}>
            <Grid container spacing={3} direction="column">
                <Grid container item xs={12} justify="space-between" alignItems="center">
                    <Grid item xs={12} container alignItems="center" justify="center">
                        <div className="row center">
                            <TextField className={classes.textField} id="standard-basic" label="Search" value={searchBox} onChange={(e) => setSearchBox(e.target.value)} />
                            <Button variant="contained" onClick={searchButtonClick}>Search</Button>
                        </div>
                    </Grid>
                </Grid>
                {/* <Grid item className={classes.data_grid}>
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
                </Grid> */}
            </Grid>
            {(!!orderDetail && !!collectionInfo) && (
                <>
                    <div className='row center'>
                        <FormControl
                            component='fieldset'
                        >
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={event => {
                                                updateCollected(event.target.checked);
                                            }}
                                            checked={collected}
                                        />
                                    }
                                    label="This order has been collected"
                                />
                            </FormGroup>
                        </FormControl>
                    </div>
                    <OrderDetails
                        shortInfo
                        user={user}
                        token={token}
                        order={orderDetail}
                        closeHandler={() => {
                            setOrderDetail();
                            setCollectionInfo();
                            setCollected(false);
                            setSearchBox('');
                        }}
                    />
                </>
            )}
        </Container>
    )
};

// function CustomNoRowsOverlay() {
//     const classes = useStyles();
//     return (
//         <GridOverlay>
//             <div className={classes.label}>No Orders Found</div>
//         </GridOverlay>
//     );
//   }

export default memo(PickupManagement);
