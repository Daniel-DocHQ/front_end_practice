import React from 'react';
import { ddMMyyyy, formatTimeSlot } from '../../helpers/formatDate';

const Step2 = ({ start_time, end_time }) => {
	return (
		<React.Fragment>
			<div className='row no-margin'>
				<p>
					<strong>Appointment Date:&nbsp;</strong>
					{ddMMyyyy(start_time)}
				</p>
			</div>
			<div className='row no-margin'>
				<p>
					<strong>Appointment Time:&nbsp;</strong>
					{formatTimeSlot(start_time)} - {formatTimeSlot(end_time)}
				</p>
			</div>
		</React.Fragment>
	);
};

export default Step2;
