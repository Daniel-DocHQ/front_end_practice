import React, { memo, useEffect, useState } from 'react';
import { get } from 'lodash';
import { format } from 'date-fns';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Table from '@material-ui/core/Table';
import Collapse from '@material-ui/core/Collapse';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import adminService from '../../../services/adminService';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { useServerDateFilter, DateFilter } from '../../../helpers/hooks/useServerDateFilter';
import LinkButton from '../../DocButton/LinkButton';
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

const ClaimableAppointmentsTable = ({ token, reload }) => {
	const [checked, setChecked] = useState(true);
	const {
		filter,
		setFilter,
        isLoading,
        appointments,
        setEndTime,
        setStartTime,
		start_time,
		end_time,
		getData,
    } = useServerDateFilter({
        token,
		isLive: true,
		liveUpdateIn: 10000,
        query: adminService.getAppointmentsSearch,
        status: 'CLAIMABLE',
    });

	const handleChange = () => {
		setChecked((prev) => !prev);
	};

	useEffect(() => {
		getData()
	}, [reload]);

	return (
		<div className='doc-container tables' style={{ height: '100%', justifyContent: 'unset' }}>
			<div style={styles.mainContainer}>
				<div className='row no-margin' style={{ paddingBottom: 10, cursor: 'pointer' }} onClick={handleChange}>
					<h2>Claimable Appointments</h2>
					{checked ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</div>
				{checked && (
					<DateFilter
						filter={filter}
						setFilter={setFilter}
						appointments={appointments}
						setEndTime={setEndTime}
						setStartTime={setStartTime}
						start_time={start_time}
						end_time={end_time}
					/>
				)}
			</div>
			<Collapse in={checked}>
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
								(!!appointments && appointments.length > 0) && appointments.map(appointment => {
									const appointmentStartTime = new Date(get(appointment, 'start_time', ''));
									const type = get(appointment, 'type', '');
									const source = get(appointment, 'booking_user.metadata.source', '');

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
												{!!source ? source : type && (type === 'video_gp_dochq' ? 'DocHQ' : type)}
											</TableCell>
											<TableCell align='center' style={{ ...styles.tableText }}>
												{get(appointment, 'booking_users.length', '')}
											</TableCell>
											<TableCell align='center' style={{ ...styles.tableText }}>
												{get(appointment, 'booking_user.metadata.test_type', '')}
											</TableCell>
											<TableCell>
												<div style={{ margin: '0 10px' }}>
													<LinkButton
														newTab
														text='Join'
														color='pink'
														linkSrc={`/practitioner/video-appointment?appointmentId=${appointment.id}`}
													/>
												</div>
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
									<TableCell />
									<TableCell />
									<TableCell />
									<TableCell />
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				</TableContainer>
			</Collapse>
		</div>
	);
};

export default memo(ClaimableAppointmentsTable);
