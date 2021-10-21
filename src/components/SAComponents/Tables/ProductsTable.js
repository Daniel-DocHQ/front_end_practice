import React, { useState }  from 'react';
import { get } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinkButton from '../../DocButton/LinkButton';
import DocButton from '../../DocButton/DocButton';
import adminService from '../../../services/adminService';
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

const ProductsTable = ({ reload, token, products = [] }) => {
    const [productId, setProductId] = useState();
    const [isVisible, setIsVisible] = useState(false);

    const closeModal = () => {
        setProductId();
        setIsVisible(false);
    };

    const sortedProducts = products
        .filter((item) => !!item.title)
        .sort(({ title: titleA }, { title: titleB  }) => (
            titleA < titleB ? -1 : titleA > titleB ? 1 : 0
        ));

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
                            Are you sure you want to delete this product?
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
                                    await adminService.deleteProduct(token, productId);
                                    reload();
                                }}
                            />
                        </div>
                    </div>
                }
            />
            <div className='doc-container tables' style={{ justifyContent: 'unset' }}>
                <div style={styles.mainContainer}>
                    <h2>Product Table</h2>
                    <div>
                        {/* <DocButton
                            color='pink'
                            text='Deactivate all'
                            style={{ margin: '0 10px' }}
                            onClick={async () => {
                                await adminService.deactivateAllProducts(token);
                                reload();
                            }}
                        /> */}
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
                                <TableCell align='left' style={styles.tableText}>Title</TableCell>
                                <TableCell align='center' style={styles.tableText}>Price</TableCell>
                                <TableCell align='center' style={styles.tableText}>SKU</TableCell>
                                <TableCell align='center' style={styles.tableText}>Type</TableCell>
                                <TableCell align='center' style={styles.tableText}>Tags</TableCell>
                                <TableCell align='right' style={styles.tableText}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {typeof sortedProducts !== 'undefined' &&
                                typeof sortedProducts === 'object' &&
                                sortedProducts.length > 0 &&
                                sortedProducts.map(product => (
                                    <TableRow key={product.id}>
                                        <TableCell
                                            align='left'
                                            style={{ ...styles.tableText }}
                                        >
                                            {get(product, 'title', '')}
                                        </TableCell>
                                        <TableCell
                                            align='center'
                                            style={{ ...styles.tableText }}
                                        >
                                            £{get(product, 'price', '0')}
                                        </TableCell>
                                        <TableCell
                                            align='center'
                                            style={{ ...styles.tableText }}
                                        >
                                            {get(product, 'sku', '')}
                                        </TableCell>
                                        <TableCell
                                            align='center'
                                            style={{ ...styles.tableText }}
                                        >
                                            {get(product, 'type', '')}
                                        </TableCell>
                                        <TableCell
                                            align='center'
                                            style={{ ...styles.tableText }}
                                        >
                                            {get(product, 'tags', []).join(', ')}
                                        </TableCell>
                                        <TableCell align='right' style={{ ...styles.tableText }}>
                                            <div style={{ display: 'inline-flex' }}>
                                                <LinkButton
                                                    text='View'
                                                    color='green'
                                                    linkSrc={`/super_admin/product/${product.id}`}
                                                />
                                                <div style={{ margin: '0 10px' }}>
                                                    <DocButton
                                                        text={!!product.out_of_stock ? 'Out of stock Off' : 'Out of stock On'}
                                                        color={!!product.out_of_stock ? 'pink' : 'green'}
                                                        onClick={async () => {
                                                            await adminService.switchProductStatus(token, product.id, {
                                                                ...product,
                                                                out_of_stock: !!product.out_of_stock ? 0 : 1,
                                                            });
                                                            reload();
                                                        }}
                                                    />
                                                </div>
                                                <DocButton
                                                    text={!!product.active ? 'Deactivate' : 'Activate'}
                                                    color={!!product.active ? 'pink' : 'green'}
                                                    onClick={async () => {
                                                        await adminService.switchProductStatus(token, product.id, {
                                                            ...product,
                                                            active: !!product.active ? 0 : 1,
                                                        });
                                                        reload();
                                                    }}
                                                />
                                                <DocButton
                                                    text="Delete"
                                                    color="pink"
                                                    style={{ marginLeft: 10 }}
                                                    onClick={() => setProductId(product.id)}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            {typeof sortedProducts !== 'object' || sortedProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell style={styles.tableText}>
                                        <p>No products to display</p>
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
        </>
    );
};


export default ProductsTable;
