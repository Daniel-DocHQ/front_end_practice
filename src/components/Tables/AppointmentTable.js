import React, { memo, useState, useEffect } from 'react';
import { get } from 'lodash';
import clsx from 'clsx';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import LinkButton from '../DocButton/LinkButton';
import DocButton from '../DocButton/DocButton';
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

const AppointmentTable = ({releaseAppointment, appointments = [] }) => {
	const classes = useStyles();
	const [filter, setFilter] = useState('today');
	const [filteredAppointments, setFilteredAppointments] = useState([]);
	const today = new Date();
	const tomorrow = new Date(today);
	const currentMonth = new Date ().getMonth();
	today.setHours(0,0,0,0)
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(0,0,0,0);
	const todayTime = today.getTime();
	const tomorrowTime = tomorrow.getTime();
	const todayObj = new Date();
	const todayDate = todayObj.getDate();
	const todayDay = todayObj.getDay();
	const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));
	const lastDayOfWeek = new Date(firstDayOfWeek);
	lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

	useEffect(() => {
		switch (filter) {
			case 'today':
				setFilteredAppointments([...appointments].filter((appointment) =>
					new Date(appointment.start_time).setHours(0,0,0,0) === todayTime));
				break;
			case 'tomorrow':
				setFilteredAppointments([...appointments].filter((appointment) =>
					new Date(appointment.start_time).setHours(0,0,0,0) === tomorrowTime));
				break;
			case 'week':
				setFilteredAppointments([...appointments].filter((appointment) => {
					const appointmentDate = new Date(appointment.start_time);
					return appointmentDate >= firstDayOfWeek && appointmentDate <= lastDayOfWeek;
				}));
				break;
			case 'month':
				setFilteredAppointments([...appointments].filter((appointment) =>
					new Date(appointment.start_time).getMonth() === currentMonth));
				break;
			default:
				setFilteredAppointments([...appointments]);
		}
	}, [filter, appointments]);

	return (
		<div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
			<div style={styles.mainContainer}>
				<h2>Upcoming Appointments</h2>
				<ButtonGroup aria-label="outlined primary button group">
					<Button
						className={clsx(
							classes.btn,
							{[classes.activeBtn]: filter === 'today'},
						)}
						onClick={() => setFilter('today')}
					>
						Today
					</Button>
					<Button
						className={clsx(
							classes.btn,
							{[classes.activeBtn]: filter === 'tomorrow'},
						)}
						onClick={() => setFilter('tomorrow')}
					>
						Tomorrow
					</Button>
					<Button
						className={clsx(
							classes.btn,
							{[classes.activeBtn]: filter === 'week'},
						)}
						onClick={() => setFilter('week')}
					>
						Week
					</Button>
					<Button
						className={clsx(
							classes.btn,
							{[classes.activeBtn]: filter === 'month'},
						)}
						onClick={() => setFilter('month')}
					>
						Month
					</Button>
				</ButtonGroup>
			</div>
			<TableContainer
				style={{
					maxWidth: '1200px',
					marginBottom: '40px',
				}}
			>
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
						{filteredAppointments.length > 0 &&
							filteredAppointments.map(appointment => (
								<TableRow key={appointment.id}>
									<TableCell align='left' style={{ ...styles.medCol, ...styles.tableText }}>
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
									<TableCell align='center' style={{ ...styles.smallCol, ...styles.tableText }}>
										{get(appointment, 'booking_user.metadata.test_type', '')}
									</TableCell>
									<TableCell align='right' style={{ ...styles.medCol, ...styles.tableText }}>
										<div style={{ display: 'flex' }}>
											<LinkButton
												text='Join'
												color='green'
												linkSrc={`/practitioner/video-appointment?appointmentId=${appointment.id}`}
											/>
											<DocButton
												text='Release'
												color='pink'
												style={{ marginLeft: 10 }}
												onClick={() => releaseAppointment(appointment.id)}
											/>
										</div>
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
						{filteredAppointments.length === 0 ? (
							<TableRow>
								<TableCell style={styles.tableText}>
									<p>No appointments to display</p>
								</TableCell>
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
	);
};

export default memo(AppointmentTable);
