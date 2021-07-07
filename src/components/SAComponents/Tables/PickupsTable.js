import React  from 'react';
import { get } from 'lodash';
import { format } from 'date-fns';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { ThemeProvider } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinkButton from '../../DocButton/LinkButton';
import DocButton from '../../DocButton/DocButton';
import datePickerTheme from '../../../helpers/datePickerTheme';
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

const PickupsTable = ({ date, setDate, dropboxes = [] }) => {
    const pickerTheme = datePickerTheme();

    return (
        <div className='doc-container' style={{ justifyContent: 'unset' }}>
            <div style={styles.mainContainer}>
                <h2>Pickups Table</h2>
                <div>
                    <ThemeProvider theme={pickerTheme}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <div className='row'>
                                <div className='appointment-calendar-container' style={{ alignItems: 'flex-end' }}>
                                    <KeyboardDatePicker
                                        label="Select Date"
                                        placeholder="DD/MM/YYYY"
                                        inputVariant='filled'
                                        format="dd/MM/yyyy"
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        value={date}
                                        onChange={(value) => {
                                            setDate(value);
                                        }}
                                    />
                                </div>
                            </div>
                        </MuiPickersUtilsProvider>
                    </ThemeProvider>
                </div>
            </div>
            <TableContainer
                style={{
                    marginBottom: '40px',
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align='left' style={styles.tableText}>Dropbox name</TableCell>
                            <TableCell align='center' style={styles.tableText}>City</TableCell>
                            <TableCell align='center' style={styles.tableText}>Date</TableCell>
                            <TableCell align='center' style={styles.tableText}>Expected Samples</TableCell>
                            <TableCell align='center' style={styles.tableText}>Collected Samples</TableCell>
                            <TableCell align='center' style={styles.tableText}>Collection Time</TableCell>
                            <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {typeof dropboxes !== 'undefined' &&
                            typeof dropboxes === 'object' &&
                            dropboxes.length > 0 &&
                            dropboxes.map(dropbox => {
                                let collectionTime = get(dropbox, 'collection_time', '');
                                let expectedDropoffDate = get(dropbox, 'expected_dropoff_date', '');
                                collectionTime = !!collectionTime ? new Date(collectionTime) : '';
                                expectedDropoffDate = !!expectedDropoffDate ? new Date(expectedDropoffDate) : '';
                                const expectedCount =  get(dropbox, 'expected_count', 0);
                                const foundCount =  get(dropbox, 'found_count', 0);

                                return (
                                    <TableRow key={dropbox.id}>
                                        <TableCell
                                            align='left'
                                            style={{ ...styles.tableText }}
                                        >
                                            {get(dropbox, 'facility.name', '')}
                                        </TableCell>
                                        <TableCell
                                            align='center'
                                            style={{ ...styles.tableText }}
                                        >
                                            {get(dropbox, 'facility.city', '')}
                                        </TableCell>
                                        <TableCell
                                            align='center'
                                            style={{ ...styles.tableText }}
                                        >
                                            {!!expectedDropoffDate ? format(expectedDropoffDate, 'dd/MM/yyyy') : expectedDropoffDate}
                                        </TableCell>
                                        <TableCell
                                            align='center'
                                            style={{ ...styles.tableText }}
                                        >
                                            {expectedCount}
                                        </TableCell>
                                        <TableCell
                                            align='center'
                                            className={foundCount < expectedCount && 'red-bold-text'}
                                            style={{ ...styles.tableText }}
                                        >
                                            {foundCount}
                                        </TableCell>
                                        <TableCell
                                            align='center'
                                            style={{ ...styles.tableText }}
                                        >
                                            {!!collectionTime ? format(collectionTime, 'p') : collectionTime}
                                        </TableCell>
                                        <TableCell align='right' style={{ ...styles.tableText }}>
                                            <LinkButton
                                                text='View'
                                                color='green'
                                                linkSrc={`/super_admin/dropbox/${dropbox.id}`}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        {typeof dropboxes !== 'object' || dropboxes.length === 0 ? (
                            <TableRow>
                                <TableCell style={styles.tableText}>
                                    <p>No dropboxes to display</p>
                                </TableCell>
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
};


export default PickupsTable;
