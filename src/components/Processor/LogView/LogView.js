import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import LogDetail from '../LogDetail/LogDetail.js';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const processor = process.env.REACT_APP_PROCESSOR_URL || "https://processor-service-staging.dochq.co.uk";
const processor_new = process.env.REACT_APP_JSON_API_URL || "https://api-staging.dochq.co.uk/v1";

const LogView = ({task}) => {
    const [logs, setLogs] = useState();
    const [loading, setLoading] = useState(true);
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState();
    const [reRunContent, setReRunContent] = useState({});
    const [reRun, setReRun] = useState(false);

    useEffect(() => {
        new Promise((res, rej) => {
            axios({
                url: `${processor}/task/${task}/log`,
                method: "GET",
            })
            .then(response => {
                if (response.status === 200) res(response)
                else rej(response)
            })
        })
            .then(res => {
                setLogs(res.data)
                setLoading(false);
            })
        .catch(console.error)
    }, [task])

    const openDetail = (log) => {
        new Promise((res, rej) => {
            axios({
                url: `${processor}/task/${task}/log/${log}`,
                method: "GET",
            })
            .then(response => {
                if (response.status === 200) res(response)
                else rej(response)
            })
        })
        .then(res => {
            setDetailData(res.data)
            setDetailOpen(true);
        })
        .catch(console.error)
    }
    const reRunAction = (log) => {
        Promise.all([
            new Promise((res, rej) => {
                axios({
                    url: `${processor}/task/${task}/log/${log}`,
                    method: "GET",
                })
                .then(response => {
                    if (response.status === 200) res(response.data)
                    else rej(response)
                })
            }),
            new Promise((res, rej) => {
                axios({
                    url: `${processor}/task/${task}`,
                    method: "GET",
                })
                .then(response => {
                    if (response.status === 200) res(response.data)
                    else rej(response)
                })
            })
        ])
        .then(res => {
            let data = res.reduce(function(acc, x) {
                for (var key in x) acc[key] = x[key];
                return acc;
            }, {});
            console.log(data)
            axios({
                url: `${processor_new}/processor/event/run`,
                method: "POST",
                data: {
                    organisation_id: data.organisation_id,
                    event: data.event,
                    context: JSON.parse(data.init_data),
                },
                headers: {
                    'Authorization': localStorage.getItem('auth_token'),
                }
            })
            .then(response => {
                setReRunContent(response.data)
                setReRun(true)
            }, res => {
                setReRunContent({message: "Content failed to load"})
                setReRun(true)
            })
        })
        .catch(console.error)
    }

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setReRun(false);
    };

    if (loading || logs === null) {
        return  null
    }

    return (
        <React.Fragment>
            <Typography variant="h4" gutterBottom>Logs</Typography>
            <TableContainer component={Paper}>
                <Table size="small" >
                    <TableHead>
                        <TableCell>Date</TableCell>
                        <TableCell>Result</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableHead>
                    <TableBody>
                        {logs.map(row => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {format(new Date(row.created_at), "Pp")} {row.init_data}
                                </TableCell>
                                <TableCell>{row.result}</TableCell>
                                <TableCell align="right">
                                    <Button size="small" onClick={()=> {reRunAction(row.id)}}>
                                        Rerun
                                    </Button>
                                    <Button size="small" onClick={()=> {openDetail(row.id)}}>
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <LogDetail open={detailOpen} setOpen={setDetailOpen} data={detailData}/>
            <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                onClose={handleSnackBarClose}
                open={reRun}
                autoHideDuration={6000}
                message={reRunContent.response}
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackBarClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                  </React.Fragment>
                }
            />
        </React.Fragment>
    )
}

export default LogView;
