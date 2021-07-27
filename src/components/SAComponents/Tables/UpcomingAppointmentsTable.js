import React, { memo, useEffect, useState } from 'react';
import { get } from 'lodash';
import clsx from 'clsx';
import moment from 'moment';
import { format } from 'date-fns';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import LinkButton from '../../DocButton/LinkButton';
import adminService from '../../../services/adminService';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import DateRangeFilter from '../../DateRangeFilter/DateRangeFilter';
import '../../Tables/Tables.scss';

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
	container: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
};

const UpcomingAppointmentsTable = ({ token }) => {
	const today = moment();
	const tomorrow = moment().add(1, 'day');
	const week = moment().add(7, 'day');
	const month = moment().add(30, 'day');
	const classes = useStyles();
	const [isLoading, setIsLoading] = useState(true);
	const [appointments, setAppointments] = useState([]);
	const [filter, setFilter] = useState('today');
	const [start_time, setStartTime] = useState(today);
	const [end_time, setEndTime] = useState(today);

	useEffect(() => {
        (async () => {
			setIsLoading(true);
			await adminService
				.getAllAppointments({
					start_time: start_time.utc(0).startOf('day').format(),
					end_time: end_time.utc(0).endOf('day').format(),
				}, token)
				.then(data => {
					if (data.success) {
						setAppointments(data.appointments.filter(({ status }) => {
							const appStatus = status.toLowerCase();
							return appStatus !== 'canceled' && appStatus !== 'completed' && appStatus !== 'available';
						}));
					} else setAppointments([]);
				})
				.catch(err => {
					setAppointments([]);
					console.log(err);
				});
			setIsLoading(false);
		})();
	}, [start_time, end_time]);

	return (
		<div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
			<div style={styles.mainContainer}>
				<h2>Upcoming Appointments</h2>
				<div style={styles.container}>
					<ButtonGroup aria-label="outlined primary button group">
						<Button
							className={clsx(
								classes.btn,
								{[classes.activeBtn]: filter === 'today'},
							)}
							onClick={() => {
								setFilter('today');
								setStartTime(today);
								setEndTime(today);
							}}
						>
							Today
						</Button>
						<Button
							className={clsx(
								classes.btn,
								{[classes.activeBtn]: filter === 'tomorrow'},
							)}
							onClick={() => {
								setFilter('tomorrow');
								setStartTime(tomorrow);
								setEndTime(tomorrow);
							}}
						>
							Tomorrow
						</Button>
						<Button
							className={clsx(
								classes.btn,
								{[classes.activeBtn]: filter === 'week'},
							)}
							onClick={() => {
								setFilter('week');
								setStartTime(today);
								setEndTime(week);
							}}
						>
							Week
						</Button>
						<Button
							className={clsx(
								classes.btn,
								{[classes.activeBtn]: filter === 'month'},
							)}
							onClick={() => {
								setFilter('month');
								setStartTime(today);
								setEndTime(month);
							}}
						>
							Month
						</Button>
						<Button
							className={clsx(
								classes.btn,
								{[classes.activeBtn]: filter === 'customize'},
							)}
							onClick={() => {
								setFilter('customize');
								setStartTime(today);
								setEndTime(today);
							}}
						>
							Customize
						</Button>
					</ButtonGroup>
					{filter === 'customize' && (
						<div style={{ marginLeft: 20 }}>
							<DateRangeFilter
								startTime={new Date(start_time)}
								setStartTime={(date) => setStartTime(moment(date))}
								endTime={new Date(end_time)}
								setEndTime={(date) => setEndTime(moment(date))}
							/>
							{appointments.length >= 1000 && (
								<p className="no-margin red-bold-text">
									Too many appointments available.<br />
									Please reduce the selected time frame.
								</p>
							)}
						</div>
					)}
				</div>
			</div>
			<TableContainer
				style={{
					marginBottom: '40px',
				}}
			>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell align='left' style={styles.tableText}>Practitioner Name</TableCell>
							<TableCell align='center' style={styles.tableText}>Patient Name</TableCell>
							<TableCell align='center' style={styles.tableText}>Date</TableCell>
							<TableCell align='center' style={styles.tableText}>Time</TableCell>
							<TableCell align='center' style={styles.tableText}>Project</TableCell>
                            <TableCell align='center' style={styles.tableText}>People</TableCell>
							<TableCell align='center' style={styles.tableText}>Test</TableCell>
							<TableCell align='right' style={styles.tableText}>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<LoadingSpinner />
							</TableRow>
						) : (
							appointments.length > 0 && appointments.map(appointment => {
								const appointmentStartTime = new Date(get(appointment, 'start_time', ''));
								const type = get(appointment, 'type', '');
								const source = get(appointment, 'booking_user.metadata.source', '');

								return (
									<TableRow key={appointment.id}>
										<TableCell align='left' style={{ ...styles.tableText }}>
											{get(appointment, 'user_name', '')}
										</TableCell>
										<TableCell align='center' style={{ ...styles.tableText }}>
											{get(appointment, 'booking_user.first_name', '')} {get(appointment, 'booking_user.last_name', '')}
										</TableCell>
										<TableCell align='center' style={{ ...styles.tableText }}>
											{appointmentStartTime.toLocaleDateString()}
										</TableCell>
										<TableCell align='center' style={{  ...styles.tableText }}>
											{format(appointmentStartTime, 'p')}
										</TableCell>
										<TableCell align='center' style={{ ...styles.tableText }}>
											{!!source ? source : type && (type === 'video_gp_dochq' ? 'DocHQ' : type)}
										</TableCell>
										<TableCell align='center' style={{ ...styles.tableText }}>
											{get(appointment, 'booking_users.length', '')}
										</TableCell>
										<TableCell align='center' style={{ ...styles.tableText }}>
											{get(appointment, 'booking_user.metadata.test_type', '')}
										</TableCell>
										<TableCell align='right' style={{  ...styles.tableText }}>
											<LinkButton
												text='View'
												color='green'
												linkSrc={`/practitioner/appointment?appointmentId=${appointment.id}`}
											/>
										</TableCell>
									</TableRow>
								);
						}))}
						{appointments.length === 0 ? (
							<TableRow>
								<TableCell style={styles.tableText}>
									<p>No appointments to display</p>
								</TableCell>
								<TableCell />
								<TableCell />
								<TableCell/>
								<TableCell />
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

export default memo(UpcomingAppointmentsTable);
