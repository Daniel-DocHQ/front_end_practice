import React from 'react';
import { get } from 'lodash';
import { format } from 'date-fns';
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

const UrgentClaimable = ({ claimAppointment, appointments }) => {
	return (
		<div className='doc-container' style={{ justifyContent: 'unset' }}>
			<div style={styles.mainContainer}>
				<h2>Urgent Claimable</h2>
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
							<TableCell align='center' style={styles.tableText}>Patients</TableCell>
							<TableCell align='center' style={styles.tableText}>Test</TableCell>
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
									<TableCell align='center' style={{ ...styles.tableText }}>
										{get(appointment, 'booking_users.length', '')}
									</TableCell>
									<TableCell align='center' style={{ ...styles.tableText }}>
                                        {get(appointment, 'booking_user.metadata.test_type', '')}
									</TableCell>
									<TableCell align='center' style={{ ...styles.tableText }}>
                                        {format(new Date(get(appointment, 'start_time', '')), 'p')}
									</TableCell>
									<TableCell align='right' style={{ ...styles.tableText }}>
										<DocButton
											text='Claim'
											color='pink'
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
								<TableCell/>
							</TableRow>
						) : null}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default UrgentClaimable;
