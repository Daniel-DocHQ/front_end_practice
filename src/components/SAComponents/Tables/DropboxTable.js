import React  from 'react';
import { get } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinkButton from '../../DocButton/LinkButton';
import DocButton from '../../DocButton/DocButton';
import '../../Tables/Tables.scss';
import adminService from '../../../services/adminService';

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

const DropboxTable = ({ reload, token, dropboxes = [] }) => (
    <div className='doc-container' style={{ justifyContent: 'unset' }}>
        <div style={styles.mainContainer}>
            <h2>Dropbox Table</h2>
            <LinkButton
                text='Create Dropbox'
                color='pink'
                linkSrc={`/super_admin/dropbox/create`}
            />
        </div>
        <TableContainer
            style={{
                marginBottom: '40px',
            }}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align='left' style={styles.tableText}>Dropbox name</TableCell>
                        <TableCell align='center' style={styles.tableText}>City</TableCell>
                        <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {typeof dropboxes !== 'undefined' &&
                        typeof dropboxes === 'object' &&
                        dropboxes.length > 0 &&
                        dropboxes.map(dropbox => (
                            <TableRow key={dropbox.id}>
                                <TableCell
                                    align='left'
                                    style={{ ...styles.tableText }}
                                >
                                    {get(dropbox, 'facility.name', '')}
                                </TableCell>
                                <TableCell
                                    align='center'
                                    style={{ ...styles.tableText }}
                                >
                                    {get(dropbox, 'facility.city', '')}
                                </TableCell>
                                <TableCell align='right' style={{ ...styles.tableText }}>
                                    <div style={{ display: 'inline-flex' }}>
                                        <LinkButton
                                            text='View'
                                            color='green'
                                            linkSrc={`/super_admin/dropbox/${dropbox.id}`}
                                        />
                                        <div style={{ margin: '0 10px' }}>
                                            <DocButton
                                                text={dropbox.active ? 'Deactivate' : 'Activate'}
                                                color={dropbox.active ? 'pink' : 'green'}
                                                onClick={async () => {
                                                    await adminService.switchDropboxStatus(token, dropbox.id);
                                                    reload();
                                                }}
                                            />
                                        </div>
                                        <LinkButton
                                            text='Download QR'
                                            color='pink'
                                            newTab
                                            linkSrc={`${process.env.REACT_APP_API_URL}/v1/dropbox/${dropbox.id}/render`}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    {typeof dropboxes !== 'object' || dropboxes.length === 0 ? (
                        <TableRow>
                            <TableCell style={styles.tableText}>
                                <p>No dropboxes to display</p>
                            </TableCell>
                            <TableCell />
                            <TableCell />
                        </TableRow>
                    ) : null}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
);


export default DropboxTable;
