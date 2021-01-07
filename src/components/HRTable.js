import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { Paper, TextField, Toolbar } from '@material-ui/core';
import firstCharUpper from '../helpers/firstCharUpper';

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

const headCells = [
	{ id: 'first_name', numeric: false, disablePadding: false, label: 'First Name' },
	{ id: 'last_name', numeric: false, disablePadding: false, label: 'Last Name' },
	{ id: 'last_symptomatic_date', numeric: false, disablePadding: false, label: 'Check Date' },
	{ id: 'symptomatic', numeric: false, disablePadding: false, label: 'Symptomatic' },
	{ id: 'last_kit_date', numeric: false, disablePadding: false, label: 'Test Date' },
	{ id: 'last_kit_result', numeric: false, disablePadding: false, label: 'Test Result' },
	// { id: 'actions', numeric: false, disablePadding: false, label: 'Further Details' },
];

function EnhancedTableHead(props) {
	const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
	const createSortHandler = property => event => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map(headCell => (
					<TableCell
						key={headCell.id}
						align='left'
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<span className={classes.visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</span>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		marginTop: '20px',
		marginBottom: '20px',
	},
	paper: {
		width: '100%',
		maxWidth: '1200px',
		margin: 'auto',
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1,
	},
}));

export default function HRTable({ symptom_history }) {
	const originalData = symptom_history;
	const classes = useStyles();
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('symptomatic');
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [dense, setDense] = React.useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [filteredRows, setFilteredRows] = useState(symptom_history);

	useEffect(() => {
		if (typeof searchValue !== 'undefined' && searchValue.length > 0 && searchValue !== '') {
			const filteredRows = symptom_history.filter(item =>
				`${item.first_name}${item.last_name}`
					.toLowerCase()
					.startsWith(searchValue.toLowerCase().replace(' ', ''))
			);
			setFilteredRows(filteredRows);
		} else {
			setFilteredRows(originalData);
		}
	}, [searchValue, setSearchValue, setFilteredRows]);
	useEffect(() => {
		setFilteredRows(symptom_history);
	}, [symptom_history]);
	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = event => {
		if (event.target.checked) {
			const newSelecteds = symptom_history.map(n => n.name);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, name) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	const isSelected = name => selected.indexOf(name) !== -1;

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<TableContainer>
					<Toolbar
						style={{
							display: 'flex',
							width: '100%',
							justifyContent: 'space-between',
							alignItems: 'center',
							boxSizing: 'border-box',
						}}
					>
						<h3>Employee Results</h3>
						<div
							className='search-patient-name-container row space-between'
							style={{ alignItems: 'center', width: '230px' }}
						>
							<i className='fa fa-search' style={{ fontSize: '24px', paddingRight: '5px' }}></i>
							<TextField
								style={{ width: '200px' }}
								placeholder={`Enter Employee Name`}
								value={searchValue}
								onChange={e => setSearchValue(e.target.value)}
							/>
						</div>
					</Toolbar>
					<Table
						className={classes.table}
						aria-labelledby='tableTitle'
						size={dense ? 'small' : 'medium'}
						aria-label='enhanced table'
					>
						<EnhancedTableHead
							classes={classes}
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={filteredRows.length}
						/>
						<TableBody>
							{filteredRows.length > 0 &&
								stableSort(filteredRows, getComparator(order, orderBy)).map((row, index) => {
									const isItemSelected = isSelected(row.name);
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											onClick={event => handleClick(event, row.name)}
											role='checkbox'
											aria-checked={isItemSelected}
											tabIndex={-1}
											key={row.role_profile_id}
											selected={isItemSelected}
										>
											<TableCell align='left'>{row.first_name}</TableCell>
											<TableCell align='left'>{row.last_name}</TableCell>
											<TableCell align='left'>
												{new Date(row.last_symptomatic_date * 1000).toLocaleDateString()}
											</TableCell>
											<TableCell align='left'>
												{typeof row.last_symptomatic_result !== 'undefined'
													? firstCharUpper(row.last_symptomatic_result.toString())
													: ' '}
											</TableCell>
											<TableCell align='left'>
												{typeof row.last_kit_date !== 'undefined'
													? new Date(row.last_kit_date * 1000).toLocaleDateString()
													: ' '}
											</TableCell>
											<TableCell align='left'>
												{typeof row.last_kit_result !== 'undefined'
													? firstCharUpper(row.last_kit_result.toString())
													: ' '}
											</TableCell>
											{/* <TableCell align='left'>
												<DocButton text='View' color='pink' onClick={() => console.log('woo')} />
											</TableCell> */}
										</TableRow>
									);
								})}
							{filteredRows.length === 0 && (
								<TableRow>
									<TableCell>No results to display</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</div>
	);
}
