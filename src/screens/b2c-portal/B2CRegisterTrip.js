import React, { memo } from 'react';
import BookingEngine from '../../components/B2CComponents/BookingEngine';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';

const B2CRegisterTrip = () => (
	<React.Fragment>
		<BigWhiteContainer>
			<BookingEngine skipBooking />
		</BigWhiteContainer>
	</React.Fragment>
);

export default memo(B2CRegisterTrip);
