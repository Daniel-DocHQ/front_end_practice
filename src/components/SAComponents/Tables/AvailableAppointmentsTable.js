import React, { memo } from 'react';
import { get } from 'lodash';
import { format } from 'date-fns';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import adminService from '../../../services/adminService';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import DateFilter, { useServerDateFilter } from '../../../helpers/hooks/useServerDateFilter';
import '../../Tables/Tables.scss';

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

const AvailableAppointmentsTable = ({ token }) => {
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
        status: 'AVAILABLE',
		practitionerName: true,
    });

	return (
		<div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
			<div style={styles.mainContainer}>
				<h2>Available Appointments</h2>
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
							<TableCell align='left' style={styles.tableText}>Practitioner Name</TableCell>
							<TableCell align='center' style={styles.tableText}>Date</TableCell>
							<TableCell align='center' style={styles.tableText}>Time</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<LoadingSpinner />
							</TableRow>
						) : (
							(!!appointments && appointments.length > 0) && appointments.map(appointment => {
								const appointmentStartTime = new Date(get(appointment, 'start_time', ''));

								return (
									<TableRow key={appointment.id}>
										<TableCell align='left' style={{ ...styles.tableText }}>
											{get(appointment, 'user_name', '')}
										</TableCell>
										<TableCell align='center' style={{ ...styles.tableText }}>
											{appointmentStartTime.toLocaleDateString()}
										</TableCell>
										<TableCell align='center' style={{ ...styles.tableText }}>
											{format(appointmentStartTime, 'p')}
										</TableCell>
									</TableRow>
								);
							})
						)}
						{appointments.length === 0 ? (
							<TableRow>
								<TableCell style={styles.tableText}>
									<p>No appointments to display</p>
								</TableCell>
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

export default memo(AvailableAppointmentsTable);
