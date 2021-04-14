import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinkButton from '../DocButton/LinkButton';
import './Tables.scss';
import { Grid } from '@material-ui/core';

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

const LiveDoctorsTable = ({ doctors }) => (
    <div className='doc-container' style={{ justifyContent: 'unset' }}>
        <div style={styles.mainContainer}>
            <h2>Live Doctors</h2>
        </div>
        <Grid container alignItems="center">
            <Grid item xs={4}>
                <span>Doctor in charge:</span>
                <span style={{ padding: '0 20px' }}>Silva Quatrocchi</span>
            </Grid>
            <Grid item xs={6}>
                <LinkButton
                    text='Chat'
                    color='green'
                    linkSrc='/'
                />
            </Grid>
        </Grid>
        <TableContainer
            style={{
                marginTop: '10px',
                maxHeight: '500px',
                marginBottom: '40px',
            }}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align='left' style={styles.tableText}>Practitioner Name</TableCell>
                        <TableCell align='center' style={styles.tableText}>Appointments</TableCell>
                        <TableCell align='center' style={styles.tableText}>Patients</TableCell>
                        <TableCell align='center' style={styles.tableText}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {typeof doctors !== 'undefined' &&
                        typeof doctors === 'object' &&
                            doctors.length > 0 &&
                            doctors.map(doctor => {
                                if (doctor.status == "Online"){
                                    return (
                                        <TableRow key={doctor.id}>
                                            <TableCell align='left' style={{ ...styles.smallCol, ...styles.tableText }}>
                                                {doctor.name}
                                            </TableCell>
                                            <TableCell align='center' style={{ ...styles.smallCol, ...styles.tableText }}>
                                            </TableCell>
                                            <TableCell align='center' style={{ ...styles.smallCol, ...styles.tableText }}>
                                                {doctor.patients}
                                            </TableCell>
                                            <TableCell align='center' className={`text-status-${doctor.status}`} style={{ ...styles.smallCol, ...styles.tableText }}>
                                                <div className={`circle status-${doctor.status.toLowerCase()}`}/>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                        })}
                    {typeof doctors !== 'object' || doctors.length === 0 ? (
                        <TableRow>
                            <TableCell style={styles.tableText}>
                                <p>No doctors to display</p>
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
);

export default LiveDoctorsTable;
