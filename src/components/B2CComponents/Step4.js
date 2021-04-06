import React from 'react';
import { useFormikContext } from 'formik';
import { ddMMyyyy, formatTimeSlot } from '../../helpers/formatDate';

const Step4 = () => {
    const { values: { appointmentDate, selectedSlot, firstName, lastName } } = useFormikContext();

	return (
		<React.Fragment>
			<div className='row no-margin'>
				<p>
					<strong>Appointment Date:&nbsp;</strong>
					{ddMMyyyy(appointmentDate)}
				</p>
			</div>
			<div className='row no-margin'>
				<p>
					<strong>Appointment Time:&nbsp;</strong>
					{formatTimeSlot(selectedSlot)} - {formatTimeSlot(selectedSlot)}
				</p>
			</div>
            <div className='row no-margin'>
				<p>
					<strong>Passenger Name:&nbsp;</strong>
					{firstName} {lastName}
				</p>
			</div>
		</React.Fragment>
	);
};

export default Step4;
