import React, { useState } from 'react';
import { get } from 'lodash';
import { format } from 'date-fns';
import Collapse from '@material-ui/core/Collapse';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinkButton from '../../DocButton/LinkButton';
import '../../Tables/Tables.scss';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';

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
        cursor: 'pointer',
    },
    snackbar: {
        color: '#FFF',
    }
};

const DiscountTable = ({ isUsed = false, discounts = [], loading }) => {
	const [checked, setChecked] = useState(false);
    const sortedDiscounts = discounts.sort(({ created_at: aStartTime }, { created_at: bStartTime }) => new Date(bStartTime * 1000).getTime() - new Date(aStartTime * 1000).getTime());

    const handleChange = () => {
		setChecked((prev) => !prev);
	};

    return (
       <div className='doc-container tables' style={{ justifyContent: 'unset' }}>
            <div style={styles.mainContainer} onClick={handleChange}>
                <h2>{isUsed && 'Used '}Discount List</h2>
                {checked ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
                                <TableCell align='left' style={styles.tableText}>Project</TableCell>
                                <TableCell align='center' style={styles.tableText}>Code</TableCell>
                                <TableCell align='center' style={styles.tableText}>Uses</TableCell>
                                <TableCell align='center' style={styles.tableText}>Value</TableCell>
                                <TableCell align='center' style={styles.tableText}>Generated</TableCell>
                                <TableCell align='center' style={styles.tableText}>Valid From</TableCell>
                                <TableCell align='center' style={styles.tableText}>Valid Until</TableCell>
                                {isUsed && (
                                    <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell>
                                        <LoadingSpinner />
                                    </TableCell>
                                    <TableCell />
                                    <TableCell />
                                    {isUsed && (
                                        <TableCell />
                                    )}
                                </>
                            ) : sortedDiscounts.length > 0 ? (
                                sortedDiscounts.map((discount, indx) => (
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
                                            {get(discount, 'uses', 0)}
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
                                        {isUsed && (
                                            <TableCell align='right' style={{ ...styles.tableText }}>
                                                <div style={{ display: 'inline-flex' }}>
                                                    <div style={{ margin: '0 10px' }}>
                                                        <LinkButton
                                                            text="View Order"
                                                            color='green'
                                                            linkSrc={`/super_admin/order-list?discount=${discount.code}`}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))) : (
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
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>
        </div>
    );
};


export default DiscountTable;
