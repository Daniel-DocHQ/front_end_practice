import React from 'react';
import { format } from 'date-fns';
import { Field, useFormikContext } from 'formik';
import { Alert } from '@material-ui/lab';
import {
	Divider,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
} from '@material-ui/core';
import { ddMMyyyy, formatTimeSlotWithTimeZone } from '../../helpers/formatDate';
import bookingFormModel from './bookingFormModel';

const Step4 = ({ status }) => {
	const {
        formField: {
            tocAccept,
        }
    } = bookingFormModel;
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
			<Divider style={{ width: '35%' }} />
            {passengers.map(({
				firstName,
				lastName,
				email,
				phone,
				dateOfBirth,
				ethnicity,
				sex,
				countryCode,
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
							{countryCode.label}{phone.trim()}
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
			<div className='row no-margin'>
				<Field name={tocAccept.name}>
					{({ field, form, meta }) => (
						<FormControl
							component='fieldset'
						>
							<FormGroup>
								<FormControlLabel
									control={
										<Checkbox
											{...tocAccept}
											{...field}
											error={!!meta.error}
											touched={meta.touched}
											helperText={(meta.error && meta.touched) && meta.error}
											onChange={event => form.setFieldValue(tocAccept.name, event.target.checked)}
											value={field.value}
										/>
									}
									label={
										<p>
											I have read and understand the{' '}
											<a
												target='_blank'
												rel='noopener noreferrer'
												href='/en/consultation/terms'
											>
												DocHQ T&Cs
											</a>
										</p>
									}
								/>
							</FormGroup>
						</FormControl>
					)}
				</Field>
			</div>
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
