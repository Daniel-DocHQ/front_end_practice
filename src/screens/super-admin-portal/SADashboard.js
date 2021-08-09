import React, { memo } from 'react';
import SAHomepageCards from '../../components/SAComponents/SAHomepageCards';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';
import '../../assets/css/PatientDashboard.scss';

const SADashboard = (props) => (
	<React.Fragment>
		<BigWhiteContainer>
			<SAHomepageCards {...props} />
		</BigWhiteContainer>
	</React.Fragment>
);

export default memo(SADashboard);
