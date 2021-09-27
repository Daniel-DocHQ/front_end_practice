import React, { memo, useState } from 'react';
import { get, startCase } from 'lodash';
import { format } from 'date-fns';
import moment from 'moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/styles';
import DateFnsUtils from '@date-io/date-fns';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Collapse from '@material-ui/core/Collapse';
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
import { useServerDateFilter } from '../../../helpers/hooks/useServerDateFilter';
import DocButton from '../../DocButton/DocButton';
import bookingService from '../../../services/bookingService';
import datePickerTheme from '../../../helpers/datePickerTheme';
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
    container: {
        display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
    },
};

const AllAppointments = ({ token }) => {
	const [checked, setChecked] = useState(false);
    const pickerTheme = datePickerTheme();
	const {
        isLoading,
        appointments,
        sortOrder,
        getData,
        start_time,
        setEndTime,
        setStartTime,
        sortField,
        sort,
    } = useServerDateFilter({
        token,
        query: adminService.getAllAppointments,
		practitionerName: true,
    });

    const handleChange = () => {
		setChecked((prev) => !prev);
	};

	return (
        <div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
            <div style={styles.mainContainer}>
                <div className='row no-margin' style={{ paddingBottom: 10, cursor: 'pointer' }} onClick={handleChange}>
					<h2>All Appointments</h2>
					{checked ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</div>
                {checked && (
                    <div style={styles.container}>
                        <ThemeProvider theme={pickerTheme}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DocButton
                                    text="Previous"
                                    color="green"
                                    style={{ marginRight: 10 }}
                                    onClick={() => {
                                        setStartTime(moment(start_time).subtract(1, 'day').utc(0).startOf('day'))
                                        setEndTime(moment(start_time).subtract(1, 'day').utc(0).endOf('day'))
                                    }}
                                />
                                <div>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="dd/MM/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="From"
                                        value={start_time}
                                        onChange={(date)=> {
                                            setStartTime(moment(date).utc(0).startOf('day'))
                                            setEndTime(moment(date).utc(0).endOf('day'))
                                        }}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </div>
                                <DocButton
                                    text="Next"
                                    color="green"
                                    style={{ marginLeft: 10 }}
                                    onClick={() => {
                                        setStartTime(moment(start_time).add(1, 'day').utc(0).startOf('day'))
                                        setEndTime(moment(start_time).add(1, 'day').utc(0).endOf('day'))
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </ThemeProvider>
                    </div>
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
                                <TableCell align='left' style={styles.tableText}>
                                    <TableSortLabel
                                        active
                                        direction={sortField === 'user_name' ? sortOrder : 'desc'}
                                        onClick={() => sort({sortBy: 'user_name'})}
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
                                <TableCell align='center' style={styles.tableText}>
                                    <TableSortLabel
                                        active
                                        direction={sortField === 'status' ? sortOrder : 'desc'}
                                        onClick={() => sort({sortBy: 'status'})}
                                    >
                                        Status
                                    </TableSortLabel>
                                </TableCell>
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
                                    const appointmentStartTime = get(appointment, 'start_time', '');
                                    const type = get(appointment, 'type', '');
                                    const status = startCase(get(appointment, 'status', ''));
                                    const source = get(appointment, 'booking_user.metadata.source', '');
                                    const quantityOfPeople = get(appointment, 'booking_users.length', '');

                                    return (
                                        <TableRow key={appointment.id}>
                                            <TableCell align='left' style={{ ...styles.tableText }}>
                                                {get(appointment, 'user_name', '')}
                                            </TableCell>
                                            <TableCell align='center' style={{ ...styles.tableText }}>
                                                {get(appointment, 'booking_user.first_name', '')} {get(appointment, 'booking_user.last_name', '')}
                                            </TableCell>
                                            <TableCell align='center' style={{ ...styles.tableText }}>
                                                {!!appointmentStartTime ? new Date(appointmentStartTime).toLocaleDateString() : ''}
                                            </TableCell>
                                            <TableCell align='center' style={{  ...styles.tableText }}>
                                                {appointmentStartTime && format(new Date(appointmentStartTime), 'p')}
                                            </TableCell>
                                            <TableCell align='center' style={{ ...styles.tableText }}>
                                                {!!source ? source : type && (type === 'video_gp_dochq' ? 'DocHQ' : type)}
                                            </TableCell>
                                            <TableCell align='center' style={{ ...styles.tableText }}>
                                                {quantityOfPeople}
                                            </TableCell>
                                            <TableCell align='center' style={{ ...styles.tableText }}>
                                                {get(appointment, 'booking_user.metadata.test_type', '')}
                                            </TableCell>
                                            <TableCell align='center' style={{ ...styles.tableText }}>
                                                {status}
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
                                                    {(status === 'UNAVAILABLE' && !!quantityOfPeople) && (
                                                        <DocButton
                                                            text="Make it Waiting"
                                                            color="green"
                                                            onClick={async () => {
                                                                await bookingService.updateAppointmentStatus(
                                                                    appointment.id,
                                                                    { status: 'WAITING' },
                                                                    token,
                                                                ).catch(() => console.log('error'));
                                                                getData();
                                                            }}
                                                        />
                                                    )}
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

export default memo(AllAppointments);
