import React, { memo} from 'react';
import { get } from 'lodash';
import { format } from 'date-fns';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinkButton from '../DocButton/LinkButton';
import DocButton from '../DocButton/DocButton';
import './Tables.scss';
import adminService from '../../services/adminService';
import { ToastsStore } from 'react-toasts';

const styles = {
	smallCol: {
		width: '15%',
		maxWidth: '15%',
	},
	medCol: { width: '25%', maxWidth: '25%' },
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
};

const UploadedPositiveResultsTable = ({ results = [], back, token }) => (
    <div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
        <div style={styles.mainContainer}>
            <h2>Uploaded/Positive Results</h2>
            <DocButton
                text='Back'
                color='pink'
                onClick={back}
                style={{ width: 'max-content' }}
            />
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
                        <TableCell align='center' style={styles.tableText}>Test Date</TableCell>
                        <TableCell align='center' style={styles.tableText}>Test Type</TableCell>
                        <TableCell align='center' style={styles.tableText}>Test Result</TableCell>
                        <TableCell align='center' style={styles.tableText}>Sent on</TableCell>
                        <TableCell align='center' style={styles.tableText}>Time</TableCell>
                        <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {results.length > 0 &&
                        results.map(result => {
                            const testResult = get(result, 'meta_data.result', '');
                            let sampledDate = get(result, 'meta_data.date_sampled', '');
                            let reportedDate = get(result, 'meta_data.date_reported');
                            reportedDate = !!reportedDate ? new Date(reportedDate) : '';
                            sampledDate = !!sampledDate ? format(new Date(sampledDate), 'dd/MM/yyyy p') : '';

                            return (
                                <TableRow key={result.id}>
                                    <TableCell align='left' style={{ ...styles.tableText }}>
                                        {get(result, 'meta_data.first_name', '')}
                                    </TableCell>
                                    <TableCell align='center' style={{ ...styles.tableText }}>
                                        {get(result, 'meta_data.last_name', '')}
                                    </TableCell>
                                    <TableCell align='center' style={{ ...styles.tableText }}>
                                        {sampledDate}
                                    </TableCell>
                                    <TableCell align='center' style={{ ...styles.tableText }}>
                                        {get(result, 'meta_data.sample_type', '')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                        className={testResult === 'Positive' && 'red-bold-text'}
                                    >
                                        {testResult}
                                    </TableCell>
                                    <TableCell align='center' style={{ ...styles.tableText }}>
                                    </TableCell>
                                    <TableCell align='center' style={{ ...styles.tableText }}>
                                    </TableCell>
                                    <TableCell align='right' style={{ ...styles.tableText }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <LinkButton
                                                text='View'
                                                color='green'
                                                linkSrc={`/`}
                                            />
                                            <DocButton
                                                text='Send certificate'
                                                color='pink'
                                                onClick={() => {
                                                   adminService.sendCertificateEmail(result.id, token)
                                                   .then(data => {
                                                        if (data.success) {
                                                            ToastsStore.success('Email has been sent successfully!');
                                                        } else {
                                                            ToastsStore.success('Something went wrong!');
                                                        }
                                                    })
                                                    .catch(err => ToastsStore.error('Something went wrong!'))
                                                }}
                                                style={{ marginLeft: 10, width: 'max-content' }}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    {results.length === 0 ? (
                        <TableRow>
                            <TableCell style={styles.tableText}>
                                <p>No appointments to display</p>
                            </TableCell>
                            <TableCell />
                            <TableCell />
                            <TableCell />
                            <TableCell />
                            <TableCell />
                            <TableCell />
                            <TableCell />
                        </TableRow>
                    ) : null}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
);

export default memo(UploadedPositiveResultsTable);
