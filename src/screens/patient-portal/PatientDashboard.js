import React, { useState, useEffect, memo } from 'react';
import '../../assets/css/PatientDashboard.scss';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import bookingUserDataService from '../../services/bookingUserDataService';
import HomepageCards from '../../components/HomepageCards/HomepageCards';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';

const PatientDashboard = () => {
	const { role_profile, token, organisation_profile, setRoleProfile, setOrgProfile } = useContext(AuthContext);

	const [isLoading, setIsLoading] = useState(false);
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
		bookingUserDataService.
			getOrganisationRoleProfile(token)
			.then(result => {
				if (result.success && result.organisation_profile) {
					setOrgProfile(result.organisation_profile);
					setIsLoading(false);
				}
			})
			.catch(err => null);
	}

	return (
		<React.Fragment>
			<BigWhiteContainer>
				<div id='here-to-pad' style={{ height: '92px', width: '100%' }}></div>
				<HomepageCards
					token={token}
					role='patient'
					role_profile={role_profile}
					organisation_profile={organisation_profile}
				/>
			</BigWhiteContainer>
		</React.Fragment>
	);
};

export default memo(PatientDashboard);
