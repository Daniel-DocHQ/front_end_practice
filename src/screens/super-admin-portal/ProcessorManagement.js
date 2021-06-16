import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import CreateNewTask from '../../components/Processor/CreateNewTask/CreateNewTask.js';

const processor = process.env.REACT_APP_PROCESSOR_URL;
const processor_new = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    rightAlign: {
        align:'right',
    },
    modalTitle: {
        fontSize: 14,
    },
    editBtn: {
        marginRight: theme.spacing(1),
    },
    modalRoot: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const ProcessorManagement = () => {
    const [orgList, setOrgList] = useState([]);
    const [eventList, setEventList] = useState([]);
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState(null);

    const handleDeleteOpen = v => {
        setDeleteRecord(v)
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteRecord(null)
        setDeleteOpen(false);
    };
    const handleDeleteTask = () => {
        new Promise((res, rej) => {
            axios({
                url: `${processor}/task/${deleteRecord}`,
                method: "DELETE",
            })
            .then(response => {
                if (response.status === 200) res(response)
                else rej(response)
            })
            .catch(console.error)
        })
        .then(res => {
            if(res.status === 200 && res.data !== 'undefined') {
                taskList()
                handleDeleteClose()
            } else {
                console.error(res)
            }
        })
    }

    const taskList = () => {
        return new Promise((res, rej) => {
            axios({
                url: `${processor}/task`,
                method: "GET",
            })
            .then(response => {
                if (response.status === 200) res(response)
                else rej(response)
            })
            .catch(console.error)
        })
        .then(res => {
            if(res.status === 200 && res.data !== 'undefined') {
                setRows(res.data)
            } else {
                console.error(res)
            }
        })
    }

    const handleChange = (event) => {
        new Promise((res, rej) => {
            axios({
                url: `${processor}/task/${event.target.getAttribute('data-id')}`,
                method: "PUT",
                data:{
                    enabled: event.target.checked
                }
            })
            .then(response => {
                if (response.status === 200) res(response)
                else rej(response)
            })
            .catch(console.error)
        })
        .then(res => {
            if(res.status === 200 && res.data !== 'undefined') {
                console.log(res.data)
                taskList();
            } else {
                console.error(res)
            }
        })
    }


    useEffect(() => {
        Promise.all([
            taskList(),
            new Promise((res, rej) => {
                axios({url: `${processor}/organisation`,method: "GET"})
                .then(response => {
                    if (response.status === 200) res(response)
                    else rej(response)
                })
                .catch(console.error)
            })
            .then(res => {
                if(res.status === 200 && res.data !== 'undefined') setOrgList(res.data)
                else console.error(res)
            }),
            // Get events
            new Promise((res, rej) => {
                axios({url: `${processor_new}/v1/processor/event`,method: "GET"})
                .then(response => {
                    if (response.status === 200) res(response)
                    else rej(response)
                })
                .catch(console.error)
            })
            .then(res => {
                if(res.status === 200 && res.data !== 'undefined') setEventList(res.data.events)
                else console.error(res)
            }),
        ])
        .then(() => {
            setLoading(false);
        })
        .catch(console.error) 
    }, [])

    const getOrgName = (id) => {
        var ele = orgList.find(e => e.id === id)
        return (typeof ele != 'undefined' ? ele.name : "Unknown")
    }

    if (loading) {
        return (
            <div className={classes.root}>
                <Grid container spacing={3} justify="center" alignItems="center">
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                </Grid>
            </div>
        )
    }

    const DeleteButton = props => {
        const handleClick = () => {
            if (props.onClick) {
                props.onClick(props.value)
            }
        }
        return <Button variant="contained" onClick={handleClick} color="secondary">Delete</Button>
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12} className={classes.rightAlign}>
                    <CreateNewTask
                    baseURL={processor}
                    orgList={orgList}
                    eventList={eventList}
                />
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                    {(typeof rows !== 'undefined' && rows !== null && rows.length >0 &&
                      <Table  aria-label="simple table">
                        <TableHead>
                          <TableRow>
                           <TableCell>Event</TableCell>
                            <TableCell align="right">Organisation</TableCell>
                            <TableCell align="right">Description</TableCell>
                            <TableCell align="right">Enabled</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell component="th" scope="row">{row.event}</TableCell>
                              <TableCell align="right">{getOrgName(row.organisation_id)}</TableCell>
                              <TableCell align="right">{row.description}</TableCell>
                              <TableCell align="right">
                                <Switch
                                    checked={row.enabled}
                                    onChange={handleChange}
                                    name="checked"
                                    inputProps={{ 'aria-label': 'secondary checkbox', 'data-id': row.id }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                  <Button variant="contained" className={classes.editBtn}component={ Link } to={`/super_admin/processor/edit/${row.id}`}>Edit</Button>
                                  <DeleteButton value={row.id} onClick={handleDeleteOpen}/>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                    </TableContainer>
                </Grid>
            </Grid>
            <DeleteModal deleteOpen={deleteOpen} handleNoAction={handleDeleteClose} handleYesAction={handleDeleteTask}/>
        </div>
    )
}

const DeleteModal = ({deleteOpen, handleYesAction, handleNoAction}) => {
    return (
        <Dialog
            open={deleteOpen}
            onClose={handleNoAction}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Really delete this action?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This action cannot be recovered, once it's gone, its gone forever.
                    Are you 100% sure you want to delete this action
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleNoAction} color="primary">
                    No
                </Button>
                <Button onClick={handleYesAction} color="primary" autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ProcessorManagement;
