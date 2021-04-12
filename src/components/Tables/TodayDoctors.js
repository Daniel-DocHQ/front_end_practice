import React from 'react';
import { format, differenceInMilliseconds  } from 'date-fns';
import { lowerCase } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinkButton from '../DocButton/LinkButton';
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

const timeDifference = (now, start_time, status) => {
    if (start_time.getTime() > now.getTime()) {
        // Future
        return format(new Date(differenceInMilliseconds(start_time, now)), "hh:mm:ss")
    } else {
        // Past
        if (status == "Offline") {
            return format(new Date(differenceInMilliseconds(now, start_time)), "hh:mm:ss") + " Ago"
        }
    }
}


const TodayDoctors = ({ doctors }) => (
    <div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
        <div style={styles.mainContainer}>
            <h2>Today Doctors</h2>
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
                        <TableCell align='center' style={styles.tableText}>Start Time</TableCell>
                        <TableCell align='center' style={styles.tableText}>End Time</TableCell>
                        <TableCell align='center' style={styles.tableText}>Start in</TableCell>
                        <TableCell align='center' style={styles.tableText}>1st App Time</TableCell>
                        <TableCell align='center' style={styles.tableText}>Status</TableCell>
                        <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {typeof doctors !== 'undefined' &&
                        typeof doctors === 'object' &&
                        doctors.length > 0 &&
                        doctors
                            .map(doctor => {
                            {/* const start = new Date(doctor.start_in).getTime();
                            const duration = intervalToDuration({ start, end: (new Date().getTime()) })
                            const formatted = `${duration.minutes}:${duration.seconds}`
                            const isDoctorOffline = doctor.status === 'offline';
                            const isAppointmentSoon = duration.minutes <= 5 && isDoctorOffline; */}

                            {/* const { minutes, seconds } = doctor.start_in; */}
                            {/* const formatted = `${minutes}:${seconds}` */}
                            const isDoctorOffline = doctor.status === 'Offline';
                            {/* const isAppointmentSoon = minutes <= 5 && isDoctorOffline; */}
                            var isAppointmentSoon = false;

                            var now = new Date()
                            var start_time = new Date(doctor.start_time)

                            now.setMinutes(now.getMinutes() - 10);

                            if (start_time.getTime() < now.getTime()) {
                                if (doctor.status == "Offline") {
                                    isAppointmentSoon = true;
                                }
                            }

                            return (
                                <TableRow key={doctor.id}>
                                    <TableCell align='left' className={isAppointmentSoon && 'red-bold-text'} style={{ ...styles.medCol, ...styles.tableText }}>
                                        {doctor.name}
                                    </TableCell>
                                    <TableCell align='center' style={{ ...styles.smallCol, ...styles.tableText }}>
                                        {format(new Date(doctor.start_time), 'p')}
                                    </TableCell>
                                    <TableCell align='center' style={{ ...styles.smallCol, ...styles.tableText }}>
                                        {format(new Date(doctor.end_time), 'p')}
                                    </TableCell>
                                    <TableCell align='center' className={isAppointmentSoon && 'red-bold-text'} style={{ ...styles.smallCol, ...styles.tableText }}>
                                        {timeDifference(now, start_time, doctor.status)}
                                    </TableCell>
                                    <TableCell align='center' style={{ ...styles.smallCol, ...styles.tableText }}>
                                        {!!doctor.next_appointment ? format(new Date(doctor.next_appointment), 'p') : ''}
                                    </TableCell>
                                    <TableCell align='center' className={isAppointmentSoon ? 'red-bold-text' : `text-status-${lowerCase(doctor.status)}`} style={{ ...styles.smallCol, ...styles.tableText }}>
                                        {doctor.status}
                                    </TableCell>
                                    <TableCell align='right' style={{ ...styles.smallCol, ...styles.tableText }}>
                                        {isDoctorOffline && (
                                            <div style={{ ...styles.mainContainer }}>
                                                <LinkButton
                                                    text='Release'
                                                    color='pink'
                                                    linkSrc='/'
                                                />
                                                <div style={{ margin: '0 10px' }}>
                                                    <LinkButton
                                                        text='Text'
                                                        color='green'
                                                        linkSrc='/'
                                                    />
                                                </div>
                                                <LinkButton
                                                    text='Call'
                                                    color='green'
                                                    linkSrc='/'
                                                />
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    {typeof doctors !== 'object' || doctors.length === 0 ? (
                        <TableRow>
                            <TableCell style={styles.tableText}>
                                <p>No doctors to display</p>
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

export default TodayDoctors;
