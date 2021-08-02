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
import nurseSvc from '../../services/nurseService';
import { useServerDateFilter, DateFilter } from '../../helpers/hooks/useServerDateFilter';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './Tables.scss';

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

const AppointmentTable = ({
	ongoingAppointmentId,
	releaseAppointment,
	token,
	roleId,
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
        status: 'WAITING',
		userId: roleId,
		isLive: true,
    });
    const filteredAppointments = appointments.filter(({ id }) => id !== ongoingAppointmentId);

	return (
		<div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
			<div style={styles.mainContainer}>
				<h2>Upcoming Appointments</h2>
				<DateFilter
					filter={filter}
					setFilter={setFilter}
                    appointments={appointments}
                    setEndTime={setEndTime}
                    setStartTime={setStartTime}
					start_time={start_time}
					end_time={end_time}
                />
			</div>
			<TableContainer
				style={{
					marginBottom: '40px',
				}}
			>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell align='left' style={styles.tableText}>Patient Name</TableCell>
							<TableCell align='center' style={styles.tableText}>Date</TableCell>
							<TableCell align='center' style={styles.tableText}>Time</TableCell>
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
						) : (filteredAppointments.length > 0 && filteredAppointments.map(appointment => {
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
										{get(appointment, 'booking_users.length', '')}
									</TableCell>
									<TableCell align='center' style={{ ...styles.smallCol, ...styles.tableText }}>
										{get(appointment, 'booking_user.metadata.test_type', '')}
									</TableCell>
									<TableCell align='right' style={{ ...styles.medCol, ...styles.tableText }}>
										<div style={{ display: 'flex' }}>
											<LinkButton
												text='View'
												color='green'
												linkSrc={`/practitioner/appointment?appointmentId=${appointment.id}`}
											/>
											<div style={{ marginLeft: 10 }}
												onClick={async () => {
													localStorage.setItem('appointmentId', appointment.id);
													await nurseSvc.clearPractitionerInformation(token, roleId);
												}}
											>
												<LinkButton
													text='Join'
													color='green'
													linkSrc={`/practitioner/live/my-rooms`}
												/>
											</div>
											{/* <DocButton
												text='Release'
												color='pink'
												style={{ marginLeft: 10 }}
												onClick={() => releaseAppointment(appointment.id)}
											/> */}
										</div>
									</TableCell>
								</TableRow>
							);
						}))}
						{filteredAppointments.length === 0 ? (
							<TableRow>
								<TableCell style={styles.tableText}>
									<p>No appointments to display</p>
								</TableCell>
								<TableCell />
								<TableCell />
								<TableCell/>
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

export default memo(AppointmentTable);
