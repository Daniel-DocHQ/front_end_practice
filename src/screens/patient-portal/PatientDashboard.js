import React, { useState, useEffect, memo } from 'react';
import '../../assets/css/PatientDashboard.scss';
import LinkButton from '../../components/DocButton/LinkButton';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import HomepageCards from '../../components/HomepageCards/HomepageCards';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';

const PatientDashboard = () => {
	const { role_profile, token, organisation_profile } = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		// run once on mount
		if (!isLoading && typeof token !== 'undefined') {
			setIsLoading(true);
		}
	}, []);

	return (
		<React.Fragment>
			<BigWhiteContainer>
				<div id='here-to-pad' style={{ height: '92px', width: '100%' }}></div>
				<HomepageCards
					role='patient'
					role_profile={role_profile}
					organisation_profile={organisation_profile}
				/>
			</BigWhiteContainer>
		</React.Fragment>
	);
};

export default memo(PatientDashboard);
