import React, { memo } from 'react';
import BookingEngine from '../../components/B2CComponents/EditBookedAppointmentForm';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';

const CustomerEditBookedAppointment = () => (
	<React.Fragment>
		<BigWhiteContainer>
			<BookingEngine isCustomer />
		</BigWhiteContainer>
	</React.Fragment>
);

export default memo(CustomerEditBookedAppointment);
