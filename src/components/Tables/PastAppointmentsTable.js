import React, { memo, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DocButton from '../DocButton/DocButton';
import './Tables.scss';
import DocModal from '../DocModal/DocModal';
import LinkButton from '../DocButton/LinkButton';
const styles = {
	smallCol: {
		width: '15%',
		maxWidth: '15%',
	},
	medCol: { width: '25%', maxWidth: '25%' },
};
const PastAppointmentTable = ({ appointments, refresh }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [visibleId, setVisibleId] = useState();

	return (
		<React.Fragment>
			<div>
				<div
					style={{
						width: '100%',
						margin: 'auto',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<h1>Past Appointments</h1>
					<DocButton color='pink' text='Update' onClick={refresh} />
				</div>
				<TableContainer style={{ maxWidth: '1200px', margin: 'auto', maxHeight: '500px' }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell align='left'>Patient Name</TableCell>
								<TableCell align='center'>Type</TableCell>
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
										<TableCell align='center' style={styles.smallCol}>
											{appointment.type}
										</TableCell>
										<TableCell align='center' style={styles.medCol}>
											{new Date(appointment.start_time).toLocaleDateString()}
										</TableCell>
										<TableCell align='center' style={styles.smallCol}>
											<LinkButton
												text='Join'
												color='green'
												linkSrc={`/practitioner/video-appointment?appointmentId=${appointment.id}`}
											/>
											{/* {appointment && typeof appointment.notes !== 'undefined' ? (
												<DocButton
													text='View'
													color='green'
													style={{
														marginLeft: '10px',
														marginTop: '0px',
														marginRight: '10px',
														boxSizing: 'border-box',
														maxWidth: '40%',
													}}
													onClick={() => {
														setVisibleId(appointment.id);
														setIsVisible(true);
													}}
												/>
											) : (
												<p>No Notes</p>
											)} */}
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
			{/* {typeof appointments !== 'undefined' && typeof appointments === 'object' && (
				<DocModal
					isVisible={isVisible}
					onClose={() => setIsVisible(false)}
					title='Patient Notes'
					content={
						<PatientNotesContent
							appointment={appointments.filter(appointment => appointment.id === visibleId)}
						/>
					}
				/>
			)} */}
		</React.Fragment>
	);
};
// TODO shape patient notes modal content container

const PatientNotesContent = ({ appointment }) => {
	return typeof appointment[0].notes !== 'undefined' ? (
		<React.Fragment>
			<div className='note-parent-container'>
				{appointment[0].notes.map(note => {
					return (
						<div className='note-container'>
							<p className='note-date'>Date: {new Date(note.created_at).toLocaleDateString()}</p>
							{note.content && note.content.includes && note.content.includes('File added:') ? (
								<a
									href={note.content.replace('File added: ', '')}
									target='_blank'
									rel='noopener noreferrer'
								>
									File Added
								</a>
							) : (
								<p>{note.content}</p>
							)}
						</div>
					);
				})}
			</div>
		</React.Fragment>
	) : null;
};

export default memo(PastAppointmentTable);
