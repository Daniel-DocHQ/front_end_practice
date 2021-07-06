import React, {useState, useContext} from 'react';
import { format, differenceInHours } from 'date-fns';
import { get } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinkButton from '../../DocButton/LinkButton';
import svc from  '../../../services/adminService';
import {AuthContext} from '../../../context/AuthContext';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import DocButton from '../../DocButton/DocButton';
import '../../Tables/Tables.scss';

const styles = {
	tableText: {
		fontSize: 16,
	},
	bntStyles: {
		marginLeft: '10px',
		marginTop: '0px',
		marginRight: '10px',
		boxSizing: 'border-box',
		maxWidth: '40%',
	},
	mainContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
    },
    snackbar: {
        color: '#FFF',
    }
};

const RESULT_STATUS = {
    ND: 'Non Detected',
    DE: 'Detected',
    IDT: 'Indetermined',
};

const PcrTestsTable = ({ results = [] }) => {
    const today = new Date();
    const auth = useContext(AuthContext);
    const [retriggerMsg, setRetriggerMsg] = useState(null);
    const [retriggerMsgOpen, setRetriggerMsgOpen] = useState(false);

    const retriggerImport = (id) => {
        svc.resendMessages({
            event:"synlab.result.created",
            organisation_id: "0",
            context: {
                result_id: id
            }
        }, auth.token).then(res => {
            console.log(res)
            setRetriggerMsg(res.data.response)
            setRetriggerMsgOpen(true)
        }).catch(res => {
            console.log(res)
            setRetriggerMsg(res.data.response)
            setRetriggerMsgOpen(true)
        })
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setRetriggerMsgOpen(false);
    };

    return (
        <div className='doc-container' style={{ justifyContent: 'unset' }}>
            <div style={styles.mainContainer}>
                <h2>PCR Tests Management</h2>
            </div>
            <TableContainer
                style={{
                    marginBottom: '40px',
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align='left' style={styles.tableText}>First Name</TableCell>
                            <TableCell align='center' style={styles.tableText}>Last Name</TableCell>
                            <TableCell align='center' style={styles.tableText}>Sampling date</TableCell>
                            <TableCell align='center' style={styles.tableText}>Kit ID</TableCell>
                            <TableCell align='center' style={styles.tableText}>In lab</TableCell>
                            <TableCell align='center' style={styles.tableText}>Test Result</TableCell>
                            <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {typeof results !== 'undefined' &&
                            typeof results === 'object' &&
                            results.length > 0 &&
                            results.map(result => {
                                let dateSampled = get(result, 'sample_date');
                                dateSampled = !!dateSampled ? new Date(dateSampled) : '';
                                let date_of_receipt = get(result, 'date_of_receipt');
                                date_of_receipt = !!date_of_receipt ? new Date(date_of_receipt) : '';
                                const isTestInLab = !!get(result, 'receipt_id') && date_of_receipt;
                                const sinceDateSampled = !!dateSampled ? differenceInHours(today, dateSampled) : 0;
                                const kitIdStatus = (sinceDateSampled >= 48 && !isTestInLab) ? 'red-bold-text' : (sinceDateSampled >= 24 && !isTestInLab) ? 'orange-bold-text' : '';
                                const appointmentId = get(result, 'booking_id', '');
                                const resultResult = get(result, 'result', '')
                                return (
                                    <TableRow key={result.booking_id}>
                                        <TableCell
                                            align='left'
                                            style={{ ...styles.tableText }}
                                        >
                                            {result.first_name}
                                        </TableCell>
                                        <TableCell
                                            align='center'
                                            style={{ ...styles.tableText }}
                                        >
                                            {result.last_name}
                                        </TableCell>
                                        <TableCell align='center' style={{ ...styles.tableText }}>
                                            {dateSampled ? format(dateSampled, 'dd/MM/yyyy p'): ''}
                                        </TableCell>
                                        <TableCell align='center' className={kitIdStatus} style={{ ...styles.tableText }}>
                                            {result.kit_id}
                                        </TableCell>
                                        <TableCell align='center' style={{ ...styles.tableText }}>
                                            {date_of_receipt ? format(date_of_receipt, 'dd/MM/yyyy p'): ''}
                                        </TableCell>
                                        <TableCell align='center' className={(resultResult === 'Positive' && 'red-bold-text')} style={{ ...styles.tableText }}>
                                            {RESULT_STATUS[result.result]}
                                        </TableCell>
                                        <TableCell align='right' style={{ ...styles.tableText }}>
                                            {appointmentId && (
                                                <LinkButton
                                                    text='View'
                                                    color='green'
                                                    linkSrc={`/practitioner/appointment?appointmentId=${appointmentId}`}
                                                />
                                            )}
                                            <DocButton
                                                color='pink'
                                                text="Reimport"
                                                style={{ marginLeft: 10 }}
                                                onClick={() => {retriggerImport(result.booking_id.toString())}}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        {typeof results !== 'object' || results.length === 0 ? (
                            <TableRow>
                                <TableCell style={styles.tableText}>
                                    <p>No results to display</p>
                                </TableCell>
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell/>
                            </TableRow>
                        ) : null}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={retriggerMsgOpen}
            className={styles.snackbar}
            autoHideDuration={6000}
            onClose={handleClose}
            message={retriggerMsg}
            action={
                <React.Fragment>
                    <Button color="secondary" size="small" onClick={handleClose}>
                        UNDO
                    </Button>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }
            />
        </div>
    );
};


export default PcrTestsTable;
