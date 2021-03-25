import React, { memo } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import './Tables.scss';
import LinkButton from '../DocButton/LinkButton';

const styles = {
	smallCol: {
		width: '10%',
		maxWidth: '10%',
		fontSize: 16,
	},
	tableText: {
		fontSize: 16,
	},
	medCol: { width: '25%', maxWidth: '25%' },
};

const RotaPastAppointmentsTable = ({ doctors = [] }) => {

	return (
		<div className="doc-container"  style={{ height: '100%' }}>
			<div
				style={{
					width: '100%',
					margin: 'auto',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<h2>Past Appointments</h2>
			</div>
			<TableContainer style={{ margin: 'auto', maxHeight: '500px' }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell align='left' style={styles.tableText}>Patient Name</TableCell>
                            <TableCell align='center' style={styles.tableText}>0-1</TableCell>
                            <TableCell align='center' style={styles.tableText}>1-2</TableCell>
                            {/* <TableCell align='left' style={styles.tableText}>2-3</TableCell>
                            <TableCell align='left' style={styles.tableText}>3-4</TableCell>
                            <TableCell align='left' style={styles.tableText}>4-5</TableCell>
                            <TableCell align='left' style={styles.tableText}>6-7</TableCell>
                            <TableCell align='left' style={styles.tableText}>7-8</TableCell>
                            <TableCell align='left' style={styles.tableText}>8-9</TableCell>
                            <TableCell align='left' style={styles.tableText}>9-10</TableCell>
                            <TableCell align='left' style={styles.tableText}>10-11</TableCell>
                            <TableCell align='left' style={styles.tableText}>11-12</TableCell> */}
						</TableRow>
					</TableHead>
					<TableBody>
						{doctors.length > 0 && doctors.map((doctor, indx) =>
                            <TableRow key={indx}>
                                <TableCell align='left' style={{ ...styles.medCol, ...styles.tableText }}>
                                    {`${doctor.first_name} ${doctor.last_name}`}
                                </TableCell>
                                <TableCell align='center' style={{ ...styles.smallCol, ...styles.tableText }}>
                                    <div>
                                    <svg
                                        style={ {
                                            fontFamily: 'Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif',
                                            width: 60,
                                        } }
                                        height={15}
                                    >
                                        <rect
                                            key={indx}
                                            x={1}
                                            y={1}
                                            rx={2}
                                            ry={2}
                                            width={15}
                                            height={15}
                                            fill="#ebedf0"
                                        />
                                        <rect
                                            key={indx}
                                            x={21}
                                            y={1}
                                            rx={2}
                                            ry={2}
                                            width={15}
                                            height={15}
                                            fill="#ebedf0"
                                        />
                                        <rect
                                            key={indx}
                                            x={41}
                                            y={1}
                                            rx={2}
                                            ry={2}
                                            width={15}
                                            height={15}
                                            fill="#ebedf0"
                                        />
                                    </svg>
                                    </div>
                                </TableCell>
                                <TableCell align='center' style={{ ...styles.smallCol, ...styles.tableText }}>
                                    <svg
                                        style={ {
                                            fontFamily: 'Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif',
                                            width: 60,
                                        } }
                                        height={15}
                                    >
                                        <rect
                                            key={indx}
                                            x={1}
                                            y={1}
                                            rx={2}
                                            ry={2}
                                            width={15}
                                            height={15}
                                            fill="#ebedf0"
                                        />
                                        <rect
                                            key={indx}
                                            x={21}
                                            y={1}
                                            rx={2}
                                            ry={2}
                                            width={15}
                                            height={15}
                                            fill="#ebedf0"
                                        />
                                        <rect
                                            key={indx}
                                            x={41}
                                            y={1}
                                            rx={2}
                                            ry={2}
                                            width={15}
                                            height={15}
                                            fill="#ebedf0"
                                        />
                                    </svg>
                                </TableCell>
                            </TableRow>
                        )}
						{doctors.length === 0 ? (
							<TableRow>
								<TableCell style={styles.tableText}>
									<p>No information to display</p>
								</TableCell>
								<TableCell/>
								<TableCell/>
								<TableCell/>
							</TableRow>
						) : null}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default memo(RotaPastAppointmentsTable);
