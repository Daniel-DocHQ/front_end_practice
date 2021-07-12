import React, { memo } from 'react';
import PharmacyBookingEngine from '../../components/B2CComponents/PharmacyBookingEngine';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';

const PharmacyActivateTestKit = () => (
	<React.Fragment>
		<BigWhiteContainer>
			<PharmacyBookingEngine />
		</BigWhiteContainer>
	</React.Fragment>
);

export default memo(PharmacyActivateTestKit);
