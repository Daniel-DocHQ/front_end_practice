import React, { memo, useEffect, useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
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
    container: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
};

const PastAppointmentsTable = ({ token }) => {
	const today = moment();
	const yesterday = moment().subtract(1, 'day');
	const week = moment().subtract(7, 'day');
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
				.getAppointmentsSearch({
					start_time: moment(start_time).utc(0).startOf('day').format(),
					end_time: moment(end_time).utc(0).endOf('day').format(),
				},'COMPLETED', token, true)
				.then(data => {
					if (data.success) {
						setAppointments(data.appointments.sort(({ start_time: aStartTime }, { start_time: bStartTime }) => new Date(aStartTime).getTime() - new Date(bStartTime).getTime()));
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
                <h2>Past Appointments</h2>
                <div style={styles.container}>
                    <ButtonGroup aria-label="outlined primary button group">
                        <Button
                            className={clsx(
                                classes.btn,
                                {[classes.activeBtn]: filter === 'last week'},
                            )}
                            onClick={() => {
                                setFilter('last week');
                                setStartTime(week);
                                setEndTime(today)
                            }}
                        >
                            Week
                        </Button>
                        <Button
                            className={clsx(
                                classes.btn,
                                {[classes.activeBtn]: filter === 'yesterday'},
                            )}
                            onClick={() => {
                                setFilter('yesterday');
                                setStartTime(yesterday);
                                setEndTime(yesterday);
                            }}
                        >
                            Yesterday
                        </Button>
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
                                {[classes.activeBtn]: filter === 'customize'},
                            )}
                            onClick={() => {
                                setFilter('customize');
                                setStartTime(moment(today).startOf('day'));
								setEndTime(moment(today).endOf('day'));
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
            <TableContainer style={{ margin: 'auto' }}>
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
                            <TableCell align='center' style={styles.tableText}>Results</TableCell>
                            <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <LoadingSpinner />
                            </TableRow>
                        ) : (
                            !!appointments.length ? appointments.map(appointment => {
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
                                        <TableCell align='center' style={{ ...styles.tableText }}>
                                            {get(appointment, 'booking_user.metadata.result', '')}
                                        </TableCell>
                                        <TableCell align='right' style={{ ...styles.tableText }}>
                                            <div className="row flex-end">
                                                <LinkButton
                                                    text='View'
                                                    color='green'
                                                    linkSrc={`/practitioner/appointment?appointmentId=${appointment.id}`}
                                                />
                                                <div style={{ marginLeft: 10 }}>
                                                    <LinkButton
                                                        newTab
                                                        text='Join'
                                                        color='pink'
                                                        linkSrc={`/practitioner/video-appointment?appointmentId=${appointment.id}`}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            }) : (
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
                                    <TableCell />
                                    <TableCell />
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default memo(PastAppointmentsTable);
