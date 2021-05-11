import React, { memo } from 'react';
import BookingEngine from '../../components/B2CComponents/EditBookedAppointmentForm';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';

const EditBookedAppointment = () => (
	<React.Fragment>
		<BigWhiteContainer>
			<BookingEngine />
		</BigWhiteContainer>
	</React.Fragment>
);

export default memo(EditBookedAppointment);
