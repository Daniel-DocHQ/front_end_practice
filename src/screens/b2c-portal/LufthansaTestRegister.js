import React, { memo } from 'react';
import LufthansaBooking from '../../components/B2CComponents/LufthansaBooking';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';

const LufthansaTestRegister = () => (
	<React.Fragment>
		<BigWhiteContainer>
			<LufthansaBooking />
		</BigWhiteContainer>
	</React.Fragment>
);

export default memo(LufthansaTestRegister);