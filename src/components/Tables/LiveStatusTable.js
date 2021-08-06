import React, { useState } from 'react';
import { format } from 'date-fns';
import { get, camelCase } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Timer from '../Timer/Timer';
import LinkButton from '../DocButton/LinkButton';
import DocButton from '../DocButton/DocButton';
import DocModal from '../DocModal/DocModal';
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

const APPOINTMENT_STATUSES = {
    onHold: 'onHold',
    inProgress: 'inProgress',
    patientAttended: 'patientAttended',
    practitionerAttended: 'practitionerAttended',
};

const HUMAN_STATUSES = {
    onHold: 'On Hold',
    inProgress: 'Ongoing',
    waiting: 'Not Started',
    patientAttended: 'Patient Waiting',
    practitionerAttended: 'Doctor Waiting',
    practitionerLeft: 'Doctor Left',
    patientLeft: 'Patient Left',
};

const LiveStatusTable = ({ appointments = [], releaseAppointment }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [appId, setAppId] = useState();

    const closeModal = () => {
        setAppId();
        setIsVisible(false);
    };

    return (
        <>
            <DocModal
                isVisible={isVisible}
                onClose={closeModal}
                content={
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <p>
                            Are you sure you want to release this appointment?
                        </p>
                        <div className="row space-between">
                            <DocButton
                                color='green'
                                text='No'
                                onClick={closeModal}
                            />
                            <DocButton
                                color='pink'
                                text='Yes'
                                onClick={() => {
                                    releaseAppointment(appId);
                                    closeModal();
                                }}
                            />
                        </div>
                    </div>
                }
            />
            <div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
                <div style={styles.mainContainer}>
                    <h2>Live status</h2>
                </div>
                <TableContainer
                    style={{
                        marginBottom: '40px',
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align='left' style={styles.tableText}>Practitioner Name</TableCell>
                                <TableCell align='center' style={styles.tableText}>Patient Name</TableCell>
                                <TableCell align='center' style={styles.tableText}>Test</TableCell>
                                <TableCell align='center' style={styles.tableText}>Appointment Time</TableCell>
                                <TableCell align='center' style={styles.tableText}>Timer</TableCell>
                                <TableCell align='center' style={styles.tableText}>Status</TableCell>
                                <TableCell align='center' style={styles.tableText}>Status</TableCell>
                                <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {typeof appointments !== 'undefined' &&
                                typeof appointments === 'object' &&
                                appointments.length > 0 &&
                                appointments.map(appointment => {
                                    const appointmentStatus = camelCase(get(appointment, 'status', ''));
                                    const statusLastUpdated = get(appointment, 'status_last_updated', '');
                                    const appointmentStartTime = new Date(get(appointment, 'start_time', ''));

                                    return (
                                        <TableRow key={appointment.id}>
                                            <TableCell
                                                align='left'
                                                style={{ ...styles.tableText }}
                                                className={appointmentStatus === APPOINTMENT_STATUSES.patientAttended && 'red-bold-text'}
                                            >
                                                {get(appointment, 'user_name', '')}
                                            </TableCell>
                                            <TableCell
                                                align='center'
                                                className={`text-status-${appointmentStatus}`}
                                                style={{ ...styles.tableText }}
                                                className={appointmentStatus === APPOINTMENT_STATUSES.practitionerAttended && 'red-bold-text'}
                                            >
                                                {get(appointment, 'booking_user.first_name', '')} {get(appointment, 'booking_user.last_name', '')}
                                            </TableCell>
                                            <TableCell align='center' style={{ ...styles.tableText }}>
                                                {get(appointment, 'booking_user.metadata.test_type', '')}
                                            </TableCell>
                                            <TableCell align='center' style={{ ...styles.tableText }}>
                                                {format(appointmentStartTime, 'p')}
                                            </TableCell>
                                            <TableCell align='center' style={{ ...styles.tableText }}>
                                                <Timer
                                                    statusLastUpdated={statusLastUpdated ? new Date(statusLastUpdated).getTime() : appointmentStartTime.getTime()}
                                                />
                                            </TableCell>
                                            <TableCell align='center' className={`text-status-${appointmentStatus}`} style={{ ...styles.tableText }}>
                                                {HUMAN_STATUSES[appointmentStatus] || ''}
                                            </TableCell>
                                            <TableCell align='center' style={{ ...styles.tableText }}>
                                                <div className={`circle status-${appointmentStatus}`}/>
                                            </TableCell>
                                            <TableCell align='right' style={{ ...styles.tableText }}>
                                                <div className="row flex-end">
                                                    <LinkButton
                                                        text='View'
                                                        color='green'
                                                        linkSrc={`/practitioner/appointment?appointmentId=${appointment.id}`}
                                                    />
                                                    <div style={{ margin: '0 10px' }}>
                                                        <LinkButton
                                                            newTab
                                                            text='Join'
                                                            color='pink'
                                                            linkSrc={`/practitioner/video-appointment?appointmentId=${appointment.id}`}
                                                        />
                                                    </div>
                                                    <DocButton
                                                        color="pink"
                                                        text="Release"
                                                        onClick={() => {
                                                            setAppId(appointment.id);
                                                            setIsVisible(true);
                                                        }}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
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
                                    <TableCell/>
                                    <TableCell />
                                </TableRow>
                            ) : null}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};


export default LiveStatusTable;
