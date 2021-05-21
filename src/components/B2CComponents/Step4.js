import React from 'react';
import { format } from 'date-fns';
import { Alert } from '@material-ui/lab';
import { useFormikContext } from 'formik';
import { ddMMyyyy, formatTimeSlotWithTimeZone } from '../../helpers/formatDate';

const Step4 = ({ status }) => {
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
					{formatTimeSlotWithTimeZone(selectedSlot.start_time, timezone)} - {formatTimeSlotWithTimeZone(selectedSlot.end_time, timezone)} ({timezone})
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
							{format(dateOfBirth, 'dd/MM/yyyy')}
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
			{typeof status !== 'undefined' && (
				<div className='row center'>
					<Alert severity={status.severity} variant='outlined'>
						{status.message}
					</Alert>
				</div>
			)}
		</React.Fragment>
	);
};

export default Step4;
