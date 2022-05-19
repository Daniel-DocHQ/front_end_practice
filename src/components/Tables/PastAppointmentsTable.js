import React, { memo } from 'react';
import { get } from 'lodash';
import { format } from 'date-fns';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinkButton from '../DocButton/LinkButton';
import adminService from '../../services/adminService';
import { useServerDateFilter, DateFilter } from '../../helpers/hooks/useServerDateFilter';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './Tables.scss';

const styles = {
	smallCol: {
		width: '15%',
		maxWidth: '15%',
		fontSize: 16,
	},
	tableText: {
		fontSize: 16,
	},
	medCol: { width: '25%', maxWidth: '25%' },
	mainContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
};

const PastAppointmentsTable = ({
	token,
	userId,
}) => {
	const {
		filter,
		setFilter,
        isLoading,
        appointments,
        setEndTime,
        setStartTime,
		start_time,
		end_time,
    } = useServerDateFilter({
        token,
        query: adminService.getAppointmentsSearch,
        status: 'COMPLETED',
		userId,
		isLive: true,
    });

	return (
		<div className='doc-container tables' style={{ height: '100%', justifyContent: 'unset' }}>
			<div style={styles.mainContainer}>
				<h2>Past Appointments</h2>
				<DateFilter
					isPast
					filter={filter}
					setFilter={setFilter}
                    appointments={appointments}
                    setEndTime={setEndTime}
                    setStartTime={setStartTime}
					start_time={start_time}
					end_time={end_time}
                />
			</div>
			<TableContainer style={{ margin: 'auto' }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell align='left' style={styles.tableText}>Patient Name</TableCell>
							<TableCell align='center' style={styles.tableText}>Date</TableCell>
							<TableCell align='center' style={styles.tableText}>Time</TableCell>
							<TableCell align='center' style={styles.tableText}>Test</TableCell>
							<TableCell align='right' style={styles.tableText}>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<LoadingSpinner />
							</TableRow>
						) : ((typeof appointments === 'object' && !!appointments.length) ? appointments.map(appointment => {
							const appointmentStartTime = new Date(get(appointment, 'start_time', ''));

							return (
								<TableRow key={appointment.id}>
									<TableCell align='left' style={{ ...styles.tableText }}>
										{get(appointment, 'booking_user.first_name', '')} {get(appointment, 'booking_user.last_name', '')}
									</TableCell>
									<TableCell align='center' style={{ ...styles.tableText }}>
										{appointmentStartTime.toLocaleDateString()}
									</TableCell>
									<TableCell align='center' style={{ ...styles.tableText }}>
										{format(appointmentStartTime, 'p')}
									</TableCell>
									<TableCell align='center' style={{ ...styles.tableText }}>
										{get(appointment, 'booking_user.metadata.test_type', '')}
									</TableCell>
									<TableCell align='right' style={{ ...styles.tableText }}>
										<LinkButton
											text='View'
											color='green'
											linkSrc={`/practitioner/appointment?appointmentId=${appointment.id}`}
										/>
									</TableCell>
								</TableRow>
							);
						}) : (
							<TableRow>
								<TableCell style={styles.tableText}>
									<p>No appointments to display</p>
								</TableCell>
								<TableCell/>
								<TableCell/>
								<TableCell/>
								<TableCell/>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
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
		</div>
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

export default memo(PastAppointmentsTable);
