import { AppBar, Button, Paper, Tabs, Tab } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import '../../assets/css/PatientDashboard.scss';
import { AuthContext } from '../../context/AuthContext';
import bookingUserDataService from '../../services/bookingUserDataService';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';
import HomepageCards from '../../components/HomepageCards/HomepageCards';
import { ThemeProvider } from '@material-ui/styles';
import { appBarTheme } from '../../helpers/themes/appBarTheme';

const HRDashboard = ({}) => {
	const { role_profile, setRoleProfile, token, organisation_profile } = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState(0);

	useEffect(() => {
		// run once on mount
		if (!isLoading && typeof token !== 'undefined') {
			setIsLoading(true);
			getRoleProfile(token);
		}
	}, []);

	function getRoleProfile(token) {
		bookingUserDataService
			.getRoleProfile(token)
			.then(result => {
				if (result.success && result.role_profile) {
					setRoleProfile(result.role_profile);
					setIsLoading(false);
				}
			})
			.catch(err => null);
	}
	return (
		<React.Fragment>
			<BigWhiteContainer>
				<AdminAppBar activeTab={activeTab} setActiveTab={setActiveTab} />
				<div id='here-to-pad' style={{ height: '92px', width: '100%' }}></div>
				{activeTab === 0 ? (
					<HomepageCards
						token={token}
						role='manager'
						role_profile={role_profile}
						organisation_profile={organisation_profile}
					/>
				) : (
					<HomepageCards
						token={token}
						role='patient'
						role_profile={role_profile}
						organisation_profile={organisation_profile}
					/>
				)}
			</BigWhiteContainer>
		</React.Fragment>
	);
};

export default HRDashboard;

const AdminAppBar = ({ activeTab, setActiveTab }) => (
	<ThemeProvider theme={appBarTheme}>
		<AppBar position='sticky' style={{ color: 'var(--doc-white) !important' }}>
			<Tabs
				value={activeTab}
				onChange={(e, newVal) => setActiveTab(newVal)}
				aria-label='Tab Navigation'
			>
				<Tab label='Admin' id='simple-tab-0' aria-controls='simple-tabpanel-0' />
				<Tab label='Personal' id='simple-tab-1' aria-controls='simple-tabpanel-1' />
			</Tabs>
		</AppBar>
	</ThemeProvider>
);
