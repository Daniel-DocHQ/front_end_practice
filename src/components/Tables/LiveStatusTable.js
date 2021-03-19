import React from 'react';
import { format } from 'date-fns';
import { startCase } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import './Tables.scss';

const styles = {
	tableText: {
		fontSize: 16,
	},
	smallCol: {
		width: '15%',
		maxWidth: '15%',
		fontSize: 16,
	},
	medCol: { width: '25%', maxWidth: '25%' },
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

const LiveStatusTable = ({ user, appointments }) => (
    <div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
        <div style={styles.mainContainer}>
            <h3>Live status</h3>
        </div>
        <TableContainer
            style={{
                maxHeight: '500px',
                marginBottom: '40px',
            }}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align='left' style={styles.tableText}>Practitioner Name</TableCell>
                        <TableCell align='center' style={styles.tableText}>Patient Name</TableCell>
                        <TableCell align='center' style={styles.tableText}>Appointment Time</TableCell>
                        <TableCell align='center' style={styles.tableText}>Status</TableCell>
                        <TableCell align='center' style={styles.tableText}>Status</TableCell>
                        <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {typeof appointments !== 'undefined' &&
                        typeof appointments === 'object' &&
                        appointments.length > 0 &&
                        appointments.map(appointment => (
                            <TableRow key={appointment.id}>
                                <TableCell align='left' style={styles.tableText}>
                                    {user ? `${user.first_name} ${user.last_name}` : ''}
                                </TableCell>
                                <TableCell align='center' style={{ ...styles.medCol, ...styles.tableText }}>
                                    {`${appointment.booking_user.first_name} ${appointment.booking_user.last_name}`}
                                </TableCell>
                                <TableCell align='center' style={{ ...styles.medCol, ...styles.tableText }}>
                                    {format(new Date(appointment.start_time), 'p')}
                                </TableCell>
                                <TableCell align='center' className={`text-status-${appointment.status.toLowerCase()}`} style={{ ...styles.smallCol, ...styles.tableText }}>
                                    {startCase(appointment.status)}
                                </TableCell>
                                <TableCell align='center' style={{ ...styles.smallCol, ...styles.tableText }}>
                                    <div className={`circle status-${appointment.status.toLowerCase()}`}/>
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        ))}
                    {typeof appointments !== 'object' || appointments.length === 0 ? (
                        <TableRow>
                            <TableCell style={styles.tableText}>
                                <p>No appointments to display</p>
                            </TableCell>
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

export default LiveStatusTable;
