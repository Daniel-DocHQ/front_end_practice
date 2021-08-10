import React, { memo, useEffect, useState } from 'react';
import { get } from 'lodash';
import { format } from 'date-fns';
import Table from '@material-ui/core/Table';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinkButton from '../../DocButton/LinkButton';
import adminService from '../../../services/adminService';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { useServerDateFilter, DateFilter } from '../../../helpers/hooks/useServerDateFilter';
import DocButton from '../../DocButton/DocButton';
import DocModal from '../../DocModal/DocModal';
import '../../Tables/Tables.scss';

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
};

const UpcomingAppointmentsTable = ({ releaseAppointment, reload, token }) => {
	const [isVisible, setIsVisible] = useState(false);
    const [appId, setAppId] = useState();

    const closeModal = () => {
        setAppId();
        setIsVisible(false);
    };

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
		sort,
        sortOrder,
    } = useServerDateFilter({
        token,
        query: adminService.getAppointmentsSearch,
        status: 'WAITING',
		practitionerName: true,
    });

	useEffect(() => {
		getData()
	}, [reload]);

	return (
		<>
			<DocModal
                isVisible={isVisible}
                onClose={closeModal}
                content={
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <p>
                            Are you sure you want to release this appointment?
                        </p>
                        <div className="row space-between">
                            <DocButton
                                color='green'
                                text='No'
                                onClick={closeModal}
                            />
                            <DocButton
                                color='pink'
                                text='Yes'
                                onClick={() => {
                                    releaseAppointment(appId);
                                    closeModal();
                                }}
                            />
                        </div>
                    </div>
                }
            />
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
								<TableCell align='left' style={styles.tableText}>
									<TableSortLabel
										active
										direction={sortOrder}
										onClick={sort}
									>
										Practitioner Name
									</TableSortLabel>
								</TableCell>
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
												<div className="row flex-end no-margin">
													<LinkButton
														text='View'
														color='green'
														linkSrc={`/practitioner/appointment?appointmentId=${appointment.id}`}
													/>
													<div style={{ margin: '0 10px' }}>
														<LinkButton
															newTab
															text='Join'
															color='pink'
															linkSrc={`/practitioner/video-appointment?appointmentId=${appointment.id}`}
														/>
													</div>
													<DocButton
														color="pink"
														text="Release"
														onClick={() => {
                                                            setAppId(appointment.id);
                                                            setIsVisible(true);
                                                        }}
													/>
												</div>
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
		</>
	);
};

export default memo(UpcomingAppointmentsTable);
