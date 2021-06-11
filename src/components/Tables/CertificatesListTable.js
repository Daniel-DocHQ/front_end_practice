import React from 'react';
import { get } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DocButton from '../DocButton/DocButton';
import LinkButton from '../DocButton/LinkButton';
import './Tables.scss';

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

const CertificatesListTable = ({ certificates = [] }) => (
    <div className='doc-container' style={{ height: '100%', justifyContent: 'unset' }}>
        <div style={styles.mainContainer}>
            <h2>Certificates Lists</h2>
        </div>
        <TableContainer
            style={{
                marginBottom: '40px',
            }}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align='left' style={styles.tableText}>Certificates</TableCell>
                        <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {certificates.length > 0 && certificates.map((certificate, indx) => (
                        <TableRow key={indx}>
                            <TableCell
                                align='left'
                                style={styles.tableText}
                            >
                                {get(certificate, 'name', '')}
                            </TableCell>
                            <TableCell align='right' style={{ ...styles.smallCol, ...styles.tableText }}>
                                <div style={{ display: 'flex' }}>
                                    <LinkButton
                                        newTab
                                        text='Download'
                                        color='green'
                                        linkSrc={certificate.downloadLink}
                                    />
                                    <label
                                        color='pink'
                                        style={{ marginLeft: 10 }}
                                        className="btn pink upload-file-input"
                                    >
                                        <input
                                            type="file"
                                            accept=".csv"
                                            className="upload-file-input"
                                            onChange={(e) => {
                                                certificate.onChange(get(e, 'target.files[0]'));
                                            }}
                                        />
                                        Upload
                                    </label>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {typeof certificates !== 'object' || certificates.length === 0 ? (
                        <TableRow>
                            <TableCell style={styles.tableText}>
                                <p>No files to display</p>
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    ) : null}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
);

export default CertificatesListTable;
