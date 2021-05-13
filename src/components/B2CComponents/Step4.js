import React from 'react';
import { useFormikContext } from 'formik';
import { ddMMyyyy, formatTimeSlot } from '../../helpers/formatDate';

const Step4 = () => {
    const { values: { appointmentDate, selectedSlot, passengers, timezone } } = useFormikContext();

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
					{formatTimeSlot(selectedSlot.start_time)} - {formatTimeSlot(selectedSlot.end_time)} ({timezone})
				</p>
			</div>
            {passengers.map(({
				firstName,
				lastName,
				email,
				phone,
				dateOfBirth,
				ethnicity,
				sex,
				passportNumber,
			}, i) => (
				<div key={i}>
					<div className='row no-margin'>
						<p>
							<strong>Passenger Name {i + 1}:&nbsp;</strong>
							{firstName} {lastName}
						</p>
					</div>
					<div className='row no-margin'>
						<p>
							<strong>Email:&nbsp;</strong>
							{email}
						</p>
					</div>
					<div className='row no-margin'>
						<p>
							<strong>Phone:&nbsp;</strong>
							{phone}
						</p>
					</div>
					<div className='row no-margin'>
						<p>
							<strong>Date Of Birth:&nbsp;</strong>
							{dateOfBirth}
						</p>
					</div>
					<div className='row no-margin'>
						<p>
							<strong>Ethnicity:&nbsp;</strong>
							{ethnicity}
						</p>
					</div>
					<div className='row no-margin'>
						<p>
							<strong>Sex:&nbsp;</strong>
							{sex}
						</p>
					</div>
					<div className='row no-margin'>
						<p>
							<strong>Passport number:&nbsp;</strong>
							{passportNumber}
						</p>
					</div>
				</div>
			))}
		</React.Fragment>
	);
};

export default Step4;
