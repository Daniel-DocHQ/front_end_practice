import React, { memo, useState } from 'react';
import { get, startCase } from 'lodash';
import { format } from 'date-fns';
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
import { useServerDateFilter, DateFilter }  from '../../../helpers/hooks/useServerDateFilter';
import '../../Tables/Tables.scss';

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
};

const PastAppointmentsTable = ({ token }) => {
	const [checked, setChecked] = useState(false);
    const {
        filter,
		setFilter,
        isLoading,
        appointments,
        setEndTime,
        setStartTime,
        start_time,
		end_time,
        sort,
        sortOrder,
    } = useServerDateFilter({
        token,
        query: adminService.getAppointmentsSearch,
        status: 'COMPLETED',
        practitionerName: true,
    });

    const handleChange = () => {
		setChecked((prev) => !prev);
	};

    return (
       <div className='doc-container tables' style={{ height: '100%', justifyContent: 'unset' }}>
            <div style={styles.mainContainer}>
                <div className='row no-margin' style={{ paddingBottom: 10, cursor: 'pointer' }} onClick={handleChange}>
					<h2>Past Appointments</h2>
					{checked ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</div>
                {checked && (
                    <DateFilter
                        isPast
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
                <TableContainer style={{ margin: 'auto' }}>
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
                                    const result = get(appointment, 'booking_user.metadata.result', '') || get(appointment, 'booking_user.metadata.sample_taken', '');
                                    const test_type = get(appointment, 'booking_user.metadata.test_type', '');
                                    const sampleTakens = test_type === "PCR"
                                        ? [...get(appointment, 'booking_users', [])].map((user) => get(user, 'metadata.sample_taken', ''))
                                        : [];
                                    const sample_taken = !!sampleTakens.length ? sampleTakens.find((sampleTaken) => sampleTaken === 'valid') || sampleTakens[0]  : '';

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
                                                {test_type}
                                            </TableCell>
                                            <TableCell
                                                align='center'
                                                className={result.toLocaleLowerCase() === 'positive' ? 'red-bold-text' : ''}
                                                style={{ ...styles.tableText }}
                                            >
                                                {startCase(result || sample_taken) }
                                            </TableCell>
                                            <TableCell align='right' style={{ ...styles.tableText }}>
                                                <div className="row flex-end no-margin">
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
            </Collapse>
        </div>
    );
};

export default memo(PastAppointmentsTable);
