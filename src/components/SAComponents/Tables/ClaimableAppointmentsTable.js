import React, { memo } from 'react';
import clsx from 'clsx';
import { get } from 'lodash';
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
import LinkButton from '../../DocButton/LinkButton';
import useDateFilter from '../../../helpers/hooks/useDateFilter';
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

const ClaimableAppointmentsTable = ({ appointments = [] }) => {
	const classes = useStyles();
	const { filteredAppointments, filter, setFilter } = useDateFilter(appointments);

	return (
		<div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
			<div style={styles.mainContainer}>
				<h2>Claimable Appointments</h2>
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
						{(!!filteredAppointments && filteredAppointments.length > 0) && filteredAppointments.map(appointment => {
							const appointmentStartTime = new Date(get(appointment, 'start_time', ''));
							const type = get(appointment, 'type', '');

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
										{type && (type === 'video_gp_dochq' ? 'DocHQ' : 'TUI')}
									</TableCell>
									<TableCell align='center' style={{ ...styles.tableText }}>
										{get(appointment, 'booking_users.length', '')}
									</TableCell>
									<TableCell align='center' style={{ ...styles.tableText }}>
										{get(appointment, 'booking_user.metadata.test_type', '')}
									</TableCell>
                                    <TableCell align='right' style={{  ...styles.tableText }}>
                                        {/*
										<LinkButton
											text='Assign'
											color='pink'
                                        />*/}
									</TableCell>
								</TableRow>
							);
						})}
						{filteredAppointments.length === 0 ? (
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
		</div>
	);
};

export default memo(ClaimableAppointmentsTable);
