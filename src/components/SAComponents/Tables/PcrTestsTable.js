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

const PcrTestsTable = ({ results = [] }) => {
    const today = new Date();
    const auth = useContext(AuthContext);
    const [retriggerMsg, setRetriggerMsg] = useState(null);
    const [retriggerMsgOpen, setRetriggerMsgOpen] = useState(false);
    const sortedResults = results.sort(({ sample_date: aSampleDate }, { sample_date: bSampleDate }) => new Date(bSampleDate).getTime() - new Date(aSampleDate).getTime())
    const retriggerImport = (id, bid) => {
        svc.resendMessages({
            event:"booking_user.metadata.updated",
            organisation_id: "0",
            context: {
                appointment_id: id,
                booking_user_id: bid,
            }
        }, auth.token).then(res => {
            setRetriggerMsg(res.data.response)
            setRetriggerMsgOpen(true)
        }).catch(res => {
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
                            <TableCell align='left' style={styles.tableText}>Last Name</TableCell>
                            <TableCell align='left' style={styles.tableText}>Sampling date</TableCell>
                            <TableCell align='left' style={styles.tableText}>Kit ID</TableCell>
                            <TableCell align='left' style={styles.tableText}>In lab</TableCell>
                            <TableCell align='left' style={styles.tableText}>Test Result</TableCell>
                            <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {typeof sortedResults !== 'undefined' &&
                            typeof sortedResults === 'object' &&
                            sortedResults.length > 0 &&
                            sortedResults.map(result => {
                                let dateSampled = get(result, 'sample_date');
                                dateSampled = !!dateSampled ? new Date(dateSampled) : '';
                                let date_of_receipt = get(result, 'receipt_date');
                                date_of_receipt = !!date_of_receipt ? new Date(date_of_receipt) : '';
                                const isTestInLab = !!date_of_receipt;
                                const resultResult = get(result, 'test_result', '');
                                const sinceDateSampled = !!dateSampled ? differenceInHours(today, dateSampled) : 0;
                                const kitIdStatus = !!resultResult ? '' : ((sinceDateSampled >= 48 ) ? 'red-bold-text' : (sinceDateSampled >= 24) ? 'orange-bold-text' : '');
                                const appointmentId = get(result, 'booking_id', '');
                                const bookingUserId = get(result, 'booking_user_id');

                                return (
                                    <TableRow key={result.booking_id}>
                                        <TableCell
                                            align='left'
                                            style={{ ...styles.tableText }}
                                        >
                                            {result.first_name}
                                        </TableCell>
                                        <TableCell
                                            align='left'
                                            style={{ ...styles.tableText }}
                                        >
                                            {result.last_name}
                                        </TableCell>
                                        <TableCell align='left' style={{ ...styles.tableText }}>
                                            {dateSampled ? format(dateSampled, 'dd/MM/yyyy p'): ''}
                                        </TableCell>
                                        <TableCell align='left' className={kitIdStatus} style={{ ...styles.tableText }}>
                                            {result.kit_id}
                                        </TableCell>
                                        <TableCell align='left' style={{ ...styles.tableText }}>
                                            {date_of_receipt ? format(date_of_receipt, 'dd/MM/yyyy p'): ''}
                                        </TableCell>
                                        <TableCell align='left' className={(resultResult.toLowerCase() === 'detected' && 'red-bold-text')} style={{ ...styles.tableText }}>
                                            {resultResult}
                                        </TableCell>
                                        <TableCell align='right' style={{ ...styles.tableText }}>
                                            {appointmentId && (
                                                <LinkButton
                                                    text='View'
                                                    color='green'
                                                    linkSrc={`/practitioner/appointment?appointmentId=${appointmentId}`}
                                                />
                                            )}
                                            {!!resultResult && (
                                                <DocButton
                                                    color='pink'
                                                    text="Send Certificate"
                                                    style={{ marginLeft: 10 }}
                                                    onClick={() => {retriggerImport(appointmentId,bookingUserId)}}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        {typeof sortedResults !== 'object' || sortedResults.length === 0 ? (
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
