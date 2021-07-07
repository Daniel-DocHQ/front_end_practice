import React  from 'react';
import { get } from 'lodash';
import { format } from 'date-fns';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DateFilter from '../../FormComponents/DateFilter';
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

const ReceiptsTable = ({ date, setDate, receipts = [], dropboxName }) => (
    <div className='doc-container' style={{ justifyContent: 'unset' }}>
        <div style={styles.mainContainer}>
            <h2>{dropboxName}</h2>
            <DateFilter date={date} setDate={setDate} />
        </div>
        <TableContainer
            style={{
                marginBottom: '40px',
            }}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align='left' style={styles.tableText}>Order Reference No.</TableCell>
                        <TableCell align='center' style={styles.tableText}>Kit ID</TableCell>
                        <TableCell align='center' style={styles.tableText}>Collection Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {typeof receipts !== 'undefined' &&
                        typeof receipts === 'object' &&
                        receipts.length > 0 &&
                        receipts.map(receipt => {
                            let expectedDropoffTime = get(receipt, 'expected_dropoff_time', '');
                            expectedDropoffTime = !!expectedDropoffTime ? new Date(expectedDropoffTime) : '';

                            return (
                                <TableRow key={receipt.id}>
                                    <TableCell
                                        align='left'
                                        style={{ ...styles.tableText }}
                                    >
                                        {receipt.short_token}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(receipt, 'kit_id', '')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {!!expectedDropoffTime ? format(expectedDropoffTime, 'p') : expectedDropoffTime}
                                    </TableCell>
                                </TableRow>
                            );
                    })}
                    {typeof receipts !== 'object' || receipts.length === 0 ? (
                        <TableRow>
                            <TableCell style={styles.tableText}>
                                <p>No receipts to display</p>
                            </TableCell>
                            <TableCell />
                            <TableCell />
                        </TableRow>
                    ) : null}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
);

export default ReceiptsTable;
