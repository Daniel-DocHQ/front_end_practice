import React, { useState }  from 'react';
import { get } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import adminService from '../../../services/adminService';
import LinkButton from '../../DocButton/LinkButton';
import DocButton from '../../DocButton/DocButton';
import DocModal from '../../DocModal/DocModal';
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

const DrugsTable = ({ token, drugs = [], loading, reload }) => {
    const [drugToDelete, setDrugToDelete] = useState();
    const [isVisible, setIsVisible] = useState(false);

    const closeModal = () => {
        setDrugToDelete();
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
                            Are you sure you want to delete this drug?
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
                                    await adminService.deleteDrug(token, drugToDelete);
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
                    <h2>Drugs List</h2>
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
                                <TableCell align='center' style={styles.tableText}>Base Component</TableCell>
                                <TableCell align='center' style={styles.tableText}>Type</TableCell>
                                <TableCell align='center' style={styles.tableText}>Show In Autocomplete</TableCell>
                                <TableCell align='center' style={styles.tableText}>Class</TableCell>
                                <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell style={styles.tableText}>
                                        <LoadingSpinner />
                                    </TableCell>
                                    <TableCell />
                                    <TableCell />
                                </>
                            ) : drugs.length > 0 ? drugs.map((drug) => (
                                <TableRow key={drug.id}>
                                    <TableCell
                                        align='left'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(drug, 'name', '')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(drug, 'base_component', '')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(drug, 'type', '')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(drug, 'show_in_autocomplete', '').toString()}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(drug, 'class', '')}
                                    </TableCell>
                                    <TableCell align='right' style={{ ...styles.tableText }}>
                                        <div className="row space-between">
                                            <LinkButton
                                                text="View"
                                                color='green'
                                                linkSrc={`/super_admin/drug/${drug.id}`}
                                            />
                                            <DocButton
                                                color="pink"
                                                text="Delete"
                                                style={{ marginLeft: 10 }}
                                                onClick={() => {
                                                    setDrugToDelete(drug.id);
                                                    setIsVisible(true);
                                                }}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell style={styles.tableText}>
                                        <p>No drugs to display</p>
                                    </TableCell>
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

export default DrugsTable;
