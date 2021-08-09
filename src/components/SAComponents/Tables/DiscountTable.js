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
import { format } from 'date-fns';

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

const DiscountTable = ({ reload, token, discounts = [] }) => {

    return (
        <div className='doc-container' style={{ justifyContent: 'unset' }}>
            <div style={styles.mainContainer}>
                <h2>Discount Table</h2>
                <div>
                    <LinkButton
                        text='Create Discount'
                        color='pink'
                        linkSrc="/super_admin/generate-discount"
                    />
                </div>
            </div>
            <TableContainer
                style={{
                    marginBottom: '40px',
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align='left' style={styles.tableText}>Project</TableCell>
                            <TableCell align='center' style={styles.tableText}>Code</TableCell>
                            <TableCell align='center' style={styles.tableText}>Uses</TableCell>
                            <TableCell align='center' style={styles.tableText}>Value</TableCell>
                            <TableCell align='center' style={styles.tableText}>Generated</TableCell>
                            <TableCell align='center' style={styles.tableText}>Valid From</TableCell>
                            <TableCell align='center' style={styles.tableText}>Valid Until</TableCell>
                            <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {typeof discounts !== 'undefined' &&
                            typeof discounts === 'object' &&
                            discounts.length > 0 &&
                            discounts.map((discount, indx) => (
                                <TableRow key={indx}>
                                    <TableCell
                                        align='left'
                                        style={{ ...styles.tableText }}
                                    >
                                        DocHQ
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(discount, 'code', '')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(discount, 'uses', '')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {get(discount, 'value', '')}{get(discount, 'type', '') === 'percentage' ? '%' : '£'}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {format(new Date(get(discount, 'created_at', new Date().getTime()) * 1000), 'dd/MM/yyyy p')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {format(new Date(get(discount, 'active_from', new Date())), 'dd/MM/yyyy')}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        style={{ ...styles.tableText }}
                                    >
                                        {format(new Date(get(discount, 'active_to', new Date())), 'dd/MM/yyyy')}
                                    </TableCell>
                                    <TableCell align='right' style={{ ...styles.tableText }}>
                                        <div style={{ display: 'inline-flex' }}>
                                            <div style={{ margin: '0 10px' }}>
                                                {/* <DocButton
                                                    text={!!discount.active ? 'Deactivate' : 'Activate'}
                                                    color={!!discount.active ? 'pink' : 'green'}
                                                    onClick={async () => {
                                                        await adminService.switchDropboxStatus(token, discount.id);
                                                        reload();
                                                    }}
                                                /> */}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        {typeof discounts !== 'object' || discounts.length === 0 ? (
                            <TableRow>
                                <TableCell style={styles.tableText}>
                                    <p>No discounts to display</p>
                                </TableCell>
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
        </div>
    );
};


export default DiscountTable;
