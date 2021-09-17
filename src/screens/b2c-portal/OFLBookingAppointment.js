import React, { memo } from 'react';
import OFLBooking from '../../components/B2CComponents/OFLBooking';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';

const OFLBookingAppointment = () => (
	<React.Fragment>
		<BigWhiteContainer>
			<OFLBooking />
		</BigWhiteContainer>
	</React.Fragment>
);

export default memo(OFLBookingAppointment);
