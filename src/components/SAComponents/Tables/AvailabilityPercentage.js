import React, { memo, useEffect, useState } from 'react';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import adminService from '../../../services/adminService';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
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

const AvailabilityPercentage = ({ token }) => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getData = async () => {
        let tmpDate = moment().add(1, 'day').utc(0).startOf('day');
        const nextWeek = moment().add(7, 'day').utc(0).startOf('day');
        const tmpAvailableSlots = [];
        const tmpBookedSlots = [];
        setIsLoading(true);
        while (!tmpDate.isSame(nextWeek)) {
            const availableSlotsResponse = await adminService.getAppointmentsSearch({
                    dateRange: {
                        start_time: moment(tmpDate).utc(0).startOf('day').format(),
                        end_time:  moment(tmpDate).utc(0).endOf('day').format(),
                    },
                    status: "AVAILABLE",
                    token,
                }).catch(err => {
                    console.log(err);
                });
            if (availableSlotsResponse.success)
                tmpAvailableSlots.push((availableSlotsResponse.appointments || []).length);
            else tmpAvailableSlots.push(0);
            const bookedSlotsResponse = await adminService.getAppointmentsSearch({
                    dateRange: {
                        start_time: moment(tmpDate).utc(0).startOf('day').format(),
                        end_time:  moment(tmpDate).utc(0).endOf('day').format(),
                    },
                    status: "WAITING",
                    token,
                })
                .catch(err => {
                    console.log(err);
                });
            if (bookedSlotsResponse.success)
                tmpBookedSlots.push((bookedSlotsResponse.appointments || []).length);
            else tmpBookedSlots.push(0);
            tmpDate = moment(tmpDate).add(1, 'day');
        }
        setAvailableSlots(tmpAvailableSlots);
        setBookedSlots(tmpBookedSlots);
        setIsLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

	return (
        <div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
            <div style={styles.mainContainer}>
                <h2>Availability</h2>
            </div>
            <TableContainer
                style={{
                    marginBottom: '40px',
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align='left' style={styles.tableText}>Date</TableCell>
                            <TableCell align='center' style={styles.tableText}>Available Slots</TableCell>
                            <TableCell align='center' style={styles.tableText}>Booked Slots</TableCell>
                            <TableCell align='center' style={styles.tableText}>Total</TableCell>
                            <TableCell align='center' style={styles.tableText}>%</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <LoadingSpinner />
                            </TableRow>
                        ) : (
                            availableSlots.length > 0 && availableSlots.map((item, indx) => {
                                return (
                                    <TableRow key={indx}>
                                        <TableCell align='left' style={{ ...styles.tableText }}>
                                            {moment().add(indx + 1, 'days').format('DD/MM/YYYY')}
                                        </TableCell>
                                        <TableCell align='center' style={{ ...styles.tableText }}>
                                            {item}
                                        </TableCell>
                                        <TableCell align='center' style={{ ...styles.tableText }}>
                                            {bookedSlots[indx]}
                                        </TableCell>
                                        <TableCell align='center' style={{  ...styles.tableText }}>
                                            {item + bookedSlots[indx]}
                                        </TableCell>
                                        <TableCell align='center' style={{ ...styles.tableText }}>
                                            {((item / (item + bookedSlots[indx])) * 100).toFixed(2)}%
                                        </TableCell>
                                    </TableRow>
                                );
                        }))}
                        {availableSlots.length === 0 ? (
                            <TableRow>
                                <TableCell style={styles.tableText}>
                                    <p>No results to display</p>
                                </TableCell>
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

export default memo(AvailabilityPercentage);
