import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DocButton from '../DocButton/DocButton';
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

const ClaimableAppointments = ({ claimAppointment, appointments, refresh }) => {
	return (
		<div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
			<div style={styles.mainContainer}>
				<h3>Claimable Appointments</h3>
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
									<TableCell align='center' style={{ ...styles.medCol, ...styles.tableText }}>
										{new Date(appointment.start_time).toLocaleDateString()}
									</TableCell>
									<TableCell align='center' style={{ ...styles.medCol, ...styles.tableText }}>
										{new Date(appointment.start_time).toLocaleTimeString()}
									</TableCell>
									<TableCell align='right' style={{ ...styles.smallCol, ...styles.tableText }}>
										<DocButton
											text='Claim'
											color='green'
											onClick={() => claimAppointment(appointment.id)}
										/>
									</TableCell>
								</TableRow>
							))}
						{typeof appointments !== 'object' || appointments.length === 0 ? (
							<TableRow>
								<TableCell style={styles.tableText}>
									<p>No appointments to display</p>
								</TableCell>
								<TableCell/>
								<TableCell/>
							</TableRow>
						) : null}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default ClaimableAppointments;
