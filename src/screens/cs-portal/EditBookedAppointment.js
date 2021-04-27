import React, { memo } from 'react';
import EditBookedAppointment from '../../components/B2CComponents/EditBookedAppointment';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';

const EditBookedAppointment = () => (
	<React.Fragment>
		<BigWhiteContainer>
			<EditBookedAppointment />
		</BigWhiteContainer>
	</React.Fragment>
);

export default memo(EditBookedAppointment);
