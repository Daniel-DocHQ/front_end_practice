import React, { useEffect, useState, memo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import PcrTestsTable from '../../components/SAComponents/Tables/PcrTestsTable';

const PcrManagementTable = props => {
	const { logout } = useContext(AuthContext);
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	let history = useHistory();

	const logoutUser = () => {
		logout();
		history.push('/login');
	};
	if (props.isAuthenticated !== true && props.role !== 'super_admin') {
		logoutUser();
	}

	useEffect(() => {
        (async () => {
			setIsLoading(true);
			await adminService
				.getPrcTests(props.token)
				.then(data => {
					if (data.success && data.results) {
						setResults(data.results.results);
					} else if (!data.authenticated) {
						logoutUser();
					}
				})
				.catch(err => {
					console.log(err);
				});
			setIsLoading(false);
		})();
	}, []);

	return isLoading ? (
		 <div className='row center' style={{ height: '100vh', alignContent: 'center' }}>
			<LoadingSpinner />
		</div>
	) :(
		<Grid container justify="space-between">
			<Grid item xs={12}>
				<PcrTestsTable
					results={results}
				/>
			</Grid>
		</Grid>
	);
};

export default memo(PcrManagementTable);
