import React, { memo } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import './Tables.scss';

const styles = {
	smallCol: {
		width: '10%',
		maxWidth: '10%',
		fontSize: 16,
	},
	tableText: {
		fontSize: 16,
	},
	medCol: { width: '40%', maxWidth: '40%' },
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
				<h2>Rota Management</h2>
			</div>
			<TableContainer style={{ margin: 'auto', maxHeight: '500px' }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell align='left' style={styles.tableText}>Patient Name</TableCell>
                            {[...Array(24)].map((_, i) => (
                                <TableCell align='center' style={styles.tableText}>{i}-{i + 1}</TableCell>
                            ))}
						</TableRow>
					</TableHead>
					<TableBody>
						{doctors.length > 0 && doctors.map((doctor, indx) =>
                            <TableRow key={indx} className='noneBackground'>
                                <TableCell align='left' style={{ ...styles.medCol, ...styles.tableText }}>
                                    {`${doctor.first_name} ${doctor.last_name}`}
                                </TableCell>
                                {[...Array(24)].map((_, i) => (
                                    <TableCell key={i} align='center' style={{ ...styles.smallCol, ...styles.tableText }}>
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
                                ))}
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
