import React from 'react';
import { format, differenceInHours } from 'date-fns';
import { get } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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
};

const PcrTestsTable = ({ results = [] }) => {
    const today = new Date();

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
                            <TableCell align='center' style={styles.tableText}>Sampling Time</TableCell>
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
                                let dateSampled = get(result, 'metadata.date_sampled');
                                dateSampled = !!dateSampled ? new Date(dateSampled) : '';
                                const isTestInLab = !!get(result, 'metadata.receipt_id');
                                const sinceDateSampled = !!dateSampled ? differenceInHours(today, dateSampled) : 0;
                                const kitIdStatus = (sinceDateSampled >= 48 && !isTestInLab) ? 'red-bold-text' : (sinceDateSampled >= 24 && !isTestInLab) ? 'orange-bold-text' : '';
                                return (
                                    <TableRow key={result.id}>
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
                                            {dateSampled ? format(dateSampled, 'dd-MM-yyyy') : ''}
                                        </TableCell>
                                        <TableCell align='center' style={{ ...styles.tableText }}>
                                            {dateSampled ? format(dateSampled, 'p') : ''}
                                        </TableCell>
                                        <TableCell align='center' className={kitIdStatus} style={{ ...styles.tableText }}>
                                            {result.kit_id}
                                        </TableCell>
                                        <TableCell align='center' style={{ ...styles.tableText }}>
                                            {isTestInLab ? 'Yes' : 'No'}
                                        </TableCell>
                                        <TableCell align='center' className={result.result === 'Positive' && 'red-bold-text'} style={{ ...styles.tableText }}>
                                            {result.result}
                                        </TableCell>
                                        <TableCell align='right' style={{ ...styles.tableText }}>
                                            <DocButton
                                                text='View'
                                                color='green'
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
        </div>
    );
};


export default PcrTestsTable;
