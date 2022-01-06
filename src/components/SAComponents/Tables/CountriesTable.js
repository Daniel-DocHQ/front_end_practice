import React, { useState } from 'react';
import { get } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinkButton from '../../DocButton/LinkButton';
import DocButton from '../../DocButton/DocButton';
import DocModal from '../../DocModal/DocModal';
import adminService from '../../../services/adminService';
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
    snackbar: {
        color: '#FFF',
    }
};

const CountriesTable = ({ token, countries = [], reload }) => {
    const [countriesToDelete, setCountriesToDelete] = useState();
    const [isVisible, setIsVisible] = useState(false);

    const closeModal = () => {
        setCountriesToDelete();
        setIsVisible(false);
    };

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
                            Are you sure you want to delete this country?
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
                                onClick={async () => {
                                    await adminService.deleteCountry(token, countriesToDelete);
                                    reload();
                                    closeModal();
                                }}
                            />
                        </div>
                    </div>
                }
            />
            <div className='doc-container tables' style={{ justifyContent: 'unset' }}>
                <div style={styles.mainContainer}>
                    <h2>Countries List</h2>
                </div>
                <TableContainer
                    style={{
                        marginBottom: '40px',
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align='left' style={styles.tableText}>Name</TableCell>
                                <TableCell align='center' style={styles.tableText}>NCA Address ID</TableCell>
                                <TableCell align='center' style={styles.tableText}>Prohibited Schedule</TableCell>
                                <TableCell align='center' style={styles.tableText}>Prohibited Schedule Narcotics</TableCell>
                                <TableCell align='center' style={styles.tableText}>Prohibited Schedule Psychotropics</TableCell>
                                <TableCell align='center' style={styles.tableText}>Restriction Id</TableCell>
                                <TableCell align='center' style={styles.tableText}>Vaccine Information Id</TableCell>
                                <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {countries.length > 0 ? countries.map((country) => (
                                <TableRow key={country.id}>
                                    <TableCell
                                        align='left'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(country, 'name', '')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(country, 'nca_address_id', '')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(country, 'prohibited_schedule', '')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(country, 'prohibited_schedule_narcotics', []).join(', ')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(country, 'prohibited_schedule_psychotropics', []).join(', ')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(country, 'restriction_id', '')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(country, 'vaccine_information_id', '')}
                                    </TableCell>
                                    <TableCell align='right' style={{ ...styles.tableText }}>
                                        <div className="row space-between">
                                            <LinkButton
                                                text="View"
                                                color='green'
                                                linkSrc={`/super_admin/country/${country.id}`}
                                            />
                                            <DocButton
                                                color="pink"
                                                text="Delete"
                                                style={{ marginLeft: 10 }}
                                                onClick={() => {
                                                    setCountriesToDelete(country.id);
                                                    setIsVisible(true);
                                                }}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell style={styles.tableText}>
                                        <p>No countries to display</p>
                                    </TableCell>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};

export default CountriesTable;
