import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import './Tables.scss';

const styles = {
	smallCol: {
		width: '15%',
		maxWidth: '15%',
	},
	medCol: { width: '25%', maxWidth: '25%' },
	largeCol: { width: '50%', maxWidth: '50%' },
};

const PastTestResults = ({ results }) => {
	return (
		<React.Fragment>
			<div>
				<TableContainer style={{ margin: 'auto', maxHeight: '500px' }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow key={'head'}>
								<TableCell align='center'>Test Type</TableCell>
								<TableCell align='center'>Result</TableCell>
								<TableCell align='center'>Appointment Date</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{typeof results === 'undefined' || results.length === 0 ? (
								<TableRow key={'no-display'}>
									<TableCell>
										<p>No past test results to display</p>
									</TableCell>
								</TableRow>
							) : (
								results.map((result, i) => (
									<TableRow key={i}>
										<TableCell align='center'>
											{result.test_kit.type ? result.test_kit.type : 'Unknown'}
										</TableCell>
										<TableCell align='center'>
											{result.test_kit.result && result.test_kit.result !== 'unknown'
												? result.test_kit.result
												: 'Unknown'}
										</TableCell>
										<TableCell align='center'>
											{result.created_at
												? new Date(result.created_at).toLocaleDateString()
												: 'Unknown'}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</React.Fragment>
	);
};

export default PastTestResults;
