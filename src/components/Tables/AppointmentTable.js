import React, { memo } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DocButton from '../DocButton/DocButton';
import './Tables.scss';
import LinkButton from '../DocButton/LinkButton';
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
const AppointmentTable = ({releaseAppointment, appointments, refresh }) => {
	// get appointments
	// load appointments into table row with data
	// go to appointment
	// add more notes to appointment
	// potentially cancel appointment
	// useEffect(() => {
	// 	if (typeof redirectDetails !== 'undefined' && redirectDetails.type && redirectDetails.id) {
	// 		history.push(
	// 			`/practitioner/${
	// 				redirectDetails.type === 'video_gp' ? 'video' : 'face-to-face'
	// 			}-appointment?appointmentId=${redirectDetails.id}`
	// 		);
	// 		// history.push(`/nurse-appointment?appointmentId=${redirectDetails.id}`);
	// 	}
	// }, [redirectDetails, history]);

	return (
		<div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
			<div style={styles.mainContainer}>
				<h3>Upcoming Appointments</h3>
				<DocButton color='green' text='Update' onClick={refresh} />
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
							<TableCell align='left' style={styles.tableText}>Patient Name</TableCell>
							<TableCell align='center' style={styles.tableText}>Date</TableCell>
							<TableCell align='center' style={styles.tableText}>Time</TableCell>
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
										{`${appointment.booking_user.first_name} ${appointment.booking_user.last_name}`}
									</TableCell>
									{/* <TableCell align='center' style={styles.smallCol}>
										{appointment.type}
									</TableCell> */}
									<TableCell align='center' style={{ ...styles.medCol, ...styles.tableText }}>
										{new Date(appointment.start_time).toLocaleDateString()}
									</TableCell>
									<TableCell align='center' style={{ ...styles.medCol, ...styles.tableText }}>
										{new Date(appointment.start_time).toLocaleTimeString()}
									</TableCell>
									<TableCell align='right' style={{ ...styles.smallCol, ...styles.tableText }}>
										<LinkButton
											text='Join'
											color='green'
											linkSrc={`/practitioner/video-appointment?appointmentId=${appointment.id}`}
										/>
										<DocButton
											text='Release'
											color='pink'
											onClick={() => releaseAppointment(appointment.id)}
										/>
										{/* <DocButton
											text='Join'
											color='green'
											style={styles.bntStyles}
											onClick={() =>
												setRedirectDetails({ id: appointment.id, type: appointment.type })
											}
										/> */}
										{/* <DocButton text='Cancel' color='pink' style={styles.bntStyles} /> */}
									</TableCell>
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
							</TableRow>
						) : null}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default memo(AppointmentTable);
