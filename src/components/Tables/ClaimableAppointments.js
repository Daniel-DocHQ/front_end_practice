import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DocButton from '../DocButton/DocButton';
import './Tables.scss';
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

const ClaimableAppointments = ({ claimAppointment, appointments, refresh }) => {
	return (
		<React.Fragment>
			<div className='doc-container' style={{ width: '1000px', maxWidth: '90%' }}>
				<div style={styles.mainContainer}>
					<h1>Claimable Appointments</h1>
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
										<TableCell align='center' style={styles.medCol}>
											{`${new Date(appointment.start_time).toLocaleDateString()} - ${new Date(
												appointment.start_time
											).toLocaleTimeString()}`}
										</TableCell>
										<TableCell align='center' style={styles.smallCol}>
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

export default ClaimableAppointments;
