import React, { memo } from 'react';
import { get } from 'lodash';
import { format } from 'date-fns';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DocButton from '../DocButton/DocButton';
import useDateFilter from '../../helpers/hooks/useDateFilter';
import Timer from '../Timer/Timer';
import './Tables.scss';

const styles = {
	smallCol: {
		width: '15%',
		maxWidth: '15%',
	},
	medCol: {
        width: '25%',
        maxWidth: '25%',
    },
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

const NextAppointmentsTable = ({
    join,
    appointmentId,
    nextAppointments = [],
    holdAppointments = [],
}) => {
    const { filteredAppointments: appointmentToFilter } = useDateFilter(nextAppointments);
    const filteredAppointments = appointmentToFilter.filter(({ id }) => id !== appointmentId);
    const filteredHoldAppointments = holdAppointments.filter(({ id }) => id !== appointmentId).sort(({ status_last_updated: aStartTime }, { status_last_updated: bStartTime }) => new Date(aStartTime).getTime() - new Date(bStartTime).getTime());

    return (
       <div className='doc-container tables' style={{ justifyContent: 'unset' }}>
            {!!filteredHoldAppointments.length && (
                <div style={{ paddingBottom: 70 }}>
                    <div style={styles.mainContainer}>
                        <h2>Waiting Rooms</h2>
                    </div>
                    <TableContainer
                        style={{
                            maxWidth: '1200px',
                            maxHeight: '500px',
                            marginBottom: '40px',
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center' style={styles.tableText}>Test</TableCell>
                                    <TableCell align='center' style={styles.tableText}>Timer</TableCell>
                                    <TableCell align='center' style={styles.tableText}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {typeof filteredHoldAppointments !== 'undefined' &&
                                    typeof filteredHoldAppointments === 'object' &&
                                    filteredHoldAppointments.length > 0 &&
                                    filteredHoldAppointments.map(appointment => {
                                        const statusLastUpdated = get(appointment, 'status_last_updated', '');

                                        return (
                                            <TableRow key={appointment.id}>
                                                <TableCell align='center' style={{ ...styles.tableText }}>
                                                    {get(appointment, 'booking_user.metadata.test_type', '')}
                                                </TableCell>
                                                <TableCell align='center' style={{ ...styles.tableText }}>
                                                    {!!statusLastUpdated && <Timer statusLastUpdated={new Date(statusLastUpdated).getTime()} paused />}
                                                </TableCell>
                                                <TableCell align='center' style={{ ...styles.tableText }}>
                                                    <DocButton
                                                        text='Join'
                                                        color='green'
                                                        onClick={() => join(appointment.id)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
            <div style={styles.mainContainer}>
                <h2>Next Appointments</h2>
            </div>
            <TableContainer
                style={{
                    maxWidth: '1200px',
                    maxHeight: '500px',
                    marginBottom: '40px',
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align='left' style={styles.tableText}>Test</TableCell>
                            <TableCell align='left' style={styles.tableText}>Time</TableCell>
                            <TableCell align='left' style={styles.tableText}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {typeof filteredAppointments !== 'undefined' &&
                            typeof filteredAppointments === 'object' &&
                            filteredAppointments.length > 0 &&
                            filteredAppointments.map(appointment => (
                                <TableRow key={appointment.id}>
                                    <TableCell align='left' style={{ ...styles.tableText }}>
                                        {get(appointment, 'booking_user.metadata.test_type', '')}
                                    </TableCell>
                                    <TableCell align='left' style={{ ...styles.tableText }}>
                                        {format(new Date(appointment.start_time), 'p')}
                                    </TableCell>
                                    <TableCell align='left' style={{ ...styles.tableText }}>
                                        <DocButton
                                            text='Join'
                                            color='green'
                                            onClick={() => join(appointment.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        {typeof filteredAppointments !== 'object' || filteredAppointments.length === 0 ? (
                            <TableRow>
                                <TableCell style={styles.tableText}>
                                    <p>No appointments to display</p>
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
};

export default memo(NextAppointmentsTable);
