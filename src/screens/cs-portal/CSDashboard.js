import React, { memo } from 'react';
import '../../assets/css/PatientDashboard.scss';
import CSHomepageCards from '../../components/CSComponents/CSHomepageCards';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';

const CSDashboard = () => (
	<React.Fragment>
		<BigWhiteContainer>
			<CSHomepageCards/>
		</BigWhiteContainer>
	</React.Fragment>
);

export default memo(CSDashboard);
