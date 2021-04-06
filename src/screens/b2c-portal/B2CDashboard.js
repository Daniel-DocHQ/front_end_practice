import React, { memo } from 'react';
import '../../assets/css/PatientDashboard.scss';
import B2CHomepageCards from '../../components/B2CComponents/B2CHomepageCards';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';

const B2CDashboard = () => (
	<React.Fragment>
		<BigWhiteContainer>
			<B2CHomepageCards/>
		</BigWhiteContainer>
	</React.Fragment>
);

export default memo(B2CDashboard);
