import React, { useEffect, useState, useContext} from 'react';
import axios from 'axios';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MuiAlert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import bookingUserDataService from '../../../services/bookingUserDataService';
import { AuthContext } from '../../../context/AuthContext';
import Snackbar from '@material-ui/core/Snackbar';

const baseURL = process.env.REACT_APP_BOOKING_USER_DATA_URL || `https://services-booking-user-data-staging.dochq.co.uk`;

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'left',
    },
}));

const TestResults = props => {
	const { role_profile, setRoleProfile, token, organisation_profile } = useContext(AuthContext);
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [error, setError] = useState();
    const [openError, setOpenError] = useState(false);
    
    function Alert(props) {
          return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    useEffect(() => {
        const testResults = new Promise((res, rej) =>{
			axios({
				url: `${baseURL}/roles/results?id=${role_profile.id}`,
				method: 'get',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${token}` },
			})
            .then(response => {
                if (response.status === 200) res(response)
                else rej(response)
            })
            .catch(err => {
                setError("Malformed request")
                setOpenError(true)
            })
        })

        testResults
            .then(res => {
                if (res.status === 200 && res.data !== 'undefined') {
                        setRows(res.data)
                    } else {
                        setError("Malformed response")
                        setOpenError(true)
                    }
            })
    }, []);

    const handleClick = () => {
        setOpenError(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenError(false);
    };

    const FormatResult = ({result}) => {
        let color = (result == 'Positive') ?'pink' : 'black'
        return <Typography color={color}>{ result }</Typography>
    }

    return (
        <React.Fragment>
            <Snackbar open={openError} autoHideDuration={6000}>
                <Alert onClose={handleClose} severity="error">{error}</Alert>
            </Snackbar>
            <Typography variant="h4" className={classes.title}>Test Results</Typography>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Test Date</TableCell>
                        <TableCell align="right">Results</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                        {moment.unix(row.sample_date).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="right">
                        <FormatResult result={row.result} />
                    </TableCell>
                    <TableCell align="right">
                        <Button variant="contained" color="secondary" href={row.file_url} target="_blank">Download</Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}

export default TestResults;
