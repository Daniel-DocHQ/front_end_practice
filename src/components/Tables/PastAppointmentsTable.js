import React, { memo } from 'react';
import { get } from 'lodash';
import clsx from 'clsx';
import { format } from 'date-fns';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import LinkButton from '../DocButton/LinkButton';
import useDateFilter from '../../helpers/hooks/useDateFilter';
import './Tables.scss';

const useStyles = makeStyles(() => ({
	btn: {
		fontSize: 14,
		border: '1px solid #EFEFF0',
		textTransform: 'none',
	},
	activeBtn: {
		fontWeight: 500,
		color: 'white',
		background: '#00BDAF',
	},
}));

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

const PastAppointmentsTable = ({ appointments = [] }) => {
	const classes = useStyles();
    const { filteredAppointments, filter, setFilter } = useDateFilter(appointments);

	return (
		<div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
			<div style={styles.mainContainer}>
				<h2>Past Appointments</h2>
				<ButtonGroup aria-label="outlined primary button group">
					<Button
						className={clsx(
							classes.btn,
							{[classes.activeBtn]: filter === 'last month'},
						)}
						onClick={() => setFilter('last month')}
					>
						Month
					</Button>
					<Button
						className={clsx(
							classes.btn,
							{[classes.activeBtn]: filter === 'last week'},
						)}
						onClick={() => setFilter('last week')}
					>
						Week
					</Button>
					<Button
						className={clsx(
							classes.btn,
							{[classes.activeBtn]: filter === 'yesterday'},
						)}
						onClick={() => setFilter('yesterday')}
					>
						Yesterday
					</Button>
					<Button
						className={clsx(
							classes.btn,
							{[classes.activeBtn]: filter === 'today'},
						)}
						onClick={() => setFilter('today')}
					>
						Today
					</Button>
				</ButtonGroup>
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
						{(typeof filteredAppointments === 'object' && !!filteredAppointments.length) ? filteredAppointments.map(appointment => {
							const appointmentStartTime = new Date(get(appointment, 'start_time', ''));

							return (
								<TableRow key={appointment.id}>
									<TableCell align='left' style={{ ...styles.medCol, ...styles.tableText }}>
										{get(appointment, 'booking_user.first_name', '')} {get(appointment, 'booking_user.last_name', '')}
									</TableCell>
									<TableCell align='center' style={{ ...styles.medCol, ...styles.tableText }}>
										{appointmentStartTime.toLocaleDateString()}
									</TableCell>
									<TableCell align='center' style={{ ...styles.medCol, ...styles.tableText }}>
										{format(appointmentStartTime, 'p')}
									</TableCell>
									<TableCell align='center' style={{ ...styles.smallCol, ...styles.tableText }}>
										{get(appointment, 'booking_user.metadata.test_type', '')}
									</TableCell>
									<TableCell align='right' style={{ ...styles.smallCol, ...styles.tableText }}>
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
						)}
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
