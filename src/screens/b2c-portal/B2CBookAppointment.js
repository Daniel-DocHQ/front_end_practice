import React, { memo } from 'react';
import BookingEngine from '../../components/B2CComponents/BookingEngine';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';

const B2CDashboard = () => (
	<React.Fragment>
		<BigWhiteContainer>
			<BookingEngine />
		</BigWhiteContainer>
	</React.Fragment>
);

export default memo(B2CDashboard);
