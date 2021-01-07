import React, { useState } from 'react';
import { BookingSlotPicker } from './BookingSlotPicker';
import { DatePicker } from './DatePicker';
import './index.scss';

export default function Step1({ handleNext, setStepData, location }) {
	const [stepData, _setStepData] = useState({});
	const [dateSelected, setDateSelected] = useState(false);

	const updateData = (field, data) => {
		const fields = ['data', 'appointment', 'price', 'slotTime'];
		stepData[field] = data;

		_setStepData({ ...stepData, [field]: data });

		if (stepData.date && stepData.appointment) {
			handleNext();
			setStepData('step1', { data: stepData, fields });
		}
	};

	return (
		<div className='step1'>
			<div style={{ flex: 1 }}>
				<DatePicker
					label='Choose a date'
					maxDate={new Date('01-01-2022')}
					minDate={new Date()}
					onDateSelect={date => {
						updateData('date', date);
						setDateSelected(true);
					}}
				/>
				{dateSelected && (
					<BookingSlotPicker
						onSlotPress={(slotId, slotPrice, slotTime) => {
							updateData('appointment', slotId);
							updateData('price', slotPrice);
							updateData('slotTime', slotTime);
							if (!stepData.date) updateData('date', new Date());
						}}
						location={location}
						date={stepData.date}
					/>
				)}
				{!dateSelected && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							placeContent: 'flex-start',
						}}
					>
						<p style={{ paddingLeft: '1rem' }}>Select a date to view available booking slots.</p>
					</div>
				)}
			</div>
			<div style={{ flex: 1 }}>
				<p>
					Please select the <strong>date and time</strong> that you would like your videoGP
					appointment.
				</p>
			</div>
		</div>
	);
}
