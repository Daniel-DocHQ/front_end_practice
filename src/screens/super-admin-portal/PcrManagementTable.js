import React, { useEffect, useState, memo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import adminService from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import PcrTestsTable from '../../components/SAComponents/Tables/PcrTestsTable';
import moment from 'moment';

const PcrManagementTable = props => {
	const { logout } = useContext(AuthContext);
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const day30inPast = new Date(new Date().setDate(new Date().getDate() - 30));
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
				.getPrcTests(props.token, moment(day30inPast).format().replace('+', '%2B'), moment().format().replace('+', '%2B'))
				.then(data => {
					if (data.success && data.results) {
						setResults(data.results);
					} else {
						console.log('error');
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
