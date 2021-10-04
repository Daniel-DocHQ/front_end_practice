import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { format } from 'date-fns';
import { ToastsStore } from 'react-toasts';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DocButton from '../DocButton/DocButton';
import adminService from '../../services/adminService';
import { useServerDateFilter, DateFilter } from '../../helpers/hooks/useServerDateFilter';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import DocModal from '../DocModal/DocModal';
import bookingService from '../../services/bookingService';
import './Tables.scss';

const styles = {
	tableText: {
		fontSize: 16,
	},
	smallCol: {
		width: '15%',
		maxWidth: '15%',
		fontSize: 16,
	},
	medCol: { width: '25%', maxWidth: '25%' },
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

const ClaimableAppointments = ({ token, reload, makeReload }) => {
	const [claimableSlotId, setClaimableSlotId] = useState();
	const clearClaimableSlotId = () => setClaimableSlotId();
	const askAboutOverrideSlot = (status, slot_id, errorMessage) => {
		if (status === 405) setClaimableSlotId(slot_id)
		else ToastsStore.error(errorMessage);
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
    } = useServerDateFilter({
        token,
        query: adminService.getAppointmentsSearch,
        status: 'CLAIMABLE',
		isLive: true,
    });

	const claimAppointment = async (slot_id, override = false) => {
		await bookingService
			.claimAppointment(token, slot_id, null, override)
			.then(result => {
				if (result.success) {
					ToastsStore.success('Appointment claimed');
					makeReload();
				} else {
					askAboutOverrideSlot(result.status, slot_id, result.error)
				}
			})
			.catch((err) => askAboutOverrideSlot(err.status, slot_id, err.error));
	}

	useEffect(() => {
		getData()
	}, [reload]);

	return (
		<>
			<DocModal
				isVisible={!!claimableSlotId}
				onClose={clearClaimableSlotId}
				content={
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<p>
							You already have an appointment booked at this time.<br/>
							Are you sure you want to claim this appointment?
						</p>
						<div className="row space-between">
							<DocButton
								color='green'
								text='No'
								onClick={clearClaimableSlotId}
							/>
							<DocButton
								color='pink'
								text='Yes'
								onClick={() => {
									claimAppointment(claimableSlotId, true);
									clearClaimableSlotId();
								}}
							/>
						</div>
					</div>
				}
			/>
			<div className='doc-container tables' style={{ height: '100%', justifyContent: 'unset' }}>
				<div style={styles.mainContainer}>
					<h2>Claimable Appointments</h2>
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
						maxHeight: '500px',
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
							) : (typeof appointments !== 'undefined' &&
								typeof appointments === 'object' &&
								appointments.length > 0 &&
								appointments.map(appointment => (
									<TableRow key={appointment.id}>
										<TableCell align='left' style={{ ...styles.tableText }}>
											{get(appointment, 'booking_user.first_name', '')} {get(appointment, 'booking_user.last_name', '')}
										</TableCell>
										<TableCell align='center' style={{ ...styles.tableText }}>
											{new Date(get(appointment, 'start_time', '')).toLocaleDateString()}
										</TableCell>
										<TableCell align='center' style={{ ...styles.tableText }}>
											{format(new Date(get(appointment, 'start_time', '')), 'p')}
										</TableCell>
										<TableCell align='center' style={{ ...styles.tableText }}>
											{get(appointment, 'booking_users.length', '')}
										</TableCell>
										<TableCell align='center' style={{ ...styles.tableText }}>
											{get(appointment, 'booking_user.metadata.test_type', '')}
										</TableCell>
										<TableCell align='right' style={{ ...styles.tableText }}>
											<DocButton
												text='Claim'
												color='green'
												onClick={() => claimAppointment(appointment.id)}
											/>
										</TableCell>
									</TableRow>
								)))}
							{typeof appointments !== 'object' || appointments.length === 0 ? (
								<TableRow>
									<TableCell style={styles.tableText}>
										<p>No appointments to display</p>
									</TableCell>
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
			</div>
		</>
	);
};

export default ClaimableAppointments;
