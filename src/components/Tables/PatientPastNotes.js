import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import './Tables.scss';

const styles = {
	smallCol: {
		width: '15%',
		maxWidth: '15%',
	},
	medCol: { width: '25%', maxWidth: '25%' },
	largeCol: { width: '50%', maxWidth: '50%' },
};
const PastPatientNotes = ({ appointments }) => {
	// get appointments
	// load appointments into table row with data
	// go to appointment
	// add more notes to appointment
	// potentially cancel appointment

	return (
		<React.Fragment>
			<div>
				<TableContainer style={{ margin: 'auto', maxHeight: '500px' }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow key={'head'}>
								<TableCell align='left'>Notes</TableCell>
								<TableCell align='center'>Appointment Date</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{typeof appointments === 'object' &&
								appointments.map(appointment =>
									typeof appointment.notes === 'object'
										? appointment.notes.map(note =>
												note.content &&
												note.content.includes &&
												note.content.includes('File added:') ? (
													<TableRow key={new Date(note.created_at).getTime()}>
														<TableCell align='left' style={styles.largeCol}>
															<a
																href={note.content.replace('File added: ', '')}
																target='_blank'
																rel='noopener noreferrer'
															>
																File Added
															</a>
														</TableCell>
														<TableCell align='center' style={styles.medCol}>
															{new Date(note.created_at).toLocaleDateString()}
														</TableCell>
													</TableRow>
												) : (
													<TableRow key={note.created_at}>
														<TableCell align='left' style={styles.largeCol}>
															{note.content}
														</TableCell>
														<TableCell align='center' style={styles.medCol}>
															{new Date(note.created_at).toLocaleDateString()}
														</TableCell>
													</TableRow>
												)
										  )
										: null
								)}
							{typeof appointments === 'undefined' && (
								<TableRow key={'no-display'}>
									<TableCell>
										<p>No past appointment notes to display</p>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</React.Fragment>
	);
};

export default PastPatientNotes;
