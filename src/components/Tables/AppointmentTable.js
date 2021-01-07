import React, { useState, useEffect, memo } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DocButton from '../DocButton/DocButton';
import './Tables.scss';
import { useHistory } from 'react-router-dom';
import LinkButton from '../DocButton/LinkButton';
const styles = {
	smallCol: {
		width: '15%',
		maxWidth: '15%',
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
		margin: 'auto',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
};
const AppointmentTable = ({releaseAppointment, appointments, refresh }) => {
	const [redirectDetails, setRedirectDetails] = useState();
	let history = useHistory();
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
		<React.Fragment>
			<div>
				<div style={styles.mainContainer}>
					<h1>Upcoming Appointments</h1>
					<DocButton color='pink' text='Update' onClick={refresh} />
				</div>
				<TableContainer
					style={{
						maxWidth: '1200px',
						margin: 'auto',
						maxHeight: '500px',
						marginBottom: '40px',
					}}
				>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell align='left'>Patient Name</TableCell>
								{/* <TableCell align='center'>Type</TableCell> */}
								<TableCell align='center'>Date - Time</TableCell>
								<TableCell align='center'>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{typeof appointments !== 'undefined' &&
								typeof appointments === 'object' &&
								appointments.length > 0 &&
								appointments.map(appointment => (
									<TableRow key={appointment.id}>
										<TableCell align='left'>
											{`${appointment.booking_user.first_name} ${appointment.booking_user.last_name}`}
										</TableCell>
										{/* <TableCell align='center' style={styles.smallCol}>
											{appointment.type}
										</TableCell> */}
										<TableCell align='center' style={styles.medCol}>
											{`${new Date(appointment.start_time).toLocaleDateString()} - ${new Date(
												appointment.start_time
											).toLocaleTimeString()}`}
										</TableCell>
										<TableCell align='center' style={styles.smallCol}>
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
									<TableCell>
										<p>No appointments to display</p>
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</React.Fragment>
	);
};

export default memo(AppointmentTable);
