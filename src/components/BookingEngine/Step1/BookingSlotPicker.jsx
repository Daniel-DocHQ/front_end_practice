import Button from '@material-ui/core/Button';
import React, { useState, useEffect, useRef } from 'react';
import { bookingSvc } from '../services/booking';
import { CircularProgress } from '@material-ui/core';

const slotStyle = {
	width: 32,
	marginRight: 11,
	marginBottom: 11,
	borderColor: '#F1F1F1',
	fontSize: 12,
	color: '#333',
};
const bookingSlotStyle = {
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	placeContent: 'center flex-start',
	alignItems: 'flex-start',
	flex: 1,
	maxWidth: 375,
};

const alert = {
	color: 'red',
};

const format_two_digits = function(n) {
	return n < 10 ? '0' + n : n;
};

const df = function(st) {
	var d = new Date(st);

	var hours = d.getUTCHours() < 10 ? '0' + d.getUTCHours() : d.getUTCHours();
	var min = d.getUTCMinutes() < 10 ? '0' + d.getUTCMinutes() : d.getUTCMinutes();

	return hours + ':' + min;
};

function formatTimeSlots(date) {
	const d = new Date(date).toLocaleTimeString();
	const dString = d.split(':');
	return `${dString[0]}:${dString[1]}`;
}

export const BookingSlotPicker = ({ onSlotPress = () => {}, location, date }) => {
	const [slots, setSlots] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [_date, setDate] = useState(date);

	useEffect(() => {
		(async () => {
			//force a clear
			setLoading(true);
			setError(null);
			setSlots([]);

			if (typeof _date != 'undefined' && date !== null) {
				const _slots = await bookingSvc.getSlots(location, _date);
				if (Array.isArray(_slots)) {
					// only display slots 2 hours or more in future
					const slotsInFuture = _slots.filter(
						slot => new Date(slot.start_time).getTime() >= new Date().getTime() + 2 * 60 * 60 * 1000
					);
					setSlots(_slots);
				} else {
					if (_slots && _slots.error) {
						setError(_slots.error);
					} else if (_slots === null || _slots === '' || typeof _slots != 'undefined') {
						setError('No available slots.');
					}
				}
			} else {
				setSlots([]);
			}

			setLoading(false);
		})();
	}, [location, _date]);

	useEffect(() => {
		setDate(date);
	}, [date]);

	if (!isLoading) {
		return (
			<div style={bookingSlotStyle}>
				{slots.map(slot => (
					<Button
						onClick={() => onSlotPress(slot.id, slot.cost, slot.start_time)}
						style={slotStyle}
						variant='outlined'
						key={slot.id + slot.start_time}
					>
						{formatTimeSlots(slot.start_time)}
					</Button>
				))}
				{error && (
					<div className='alert-error' style={alert}>
						{error}
					</div>
				)}
			</div>
		);
	} else {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					placeContent: 'flex-start',
				}}
			>
				<CircularProgress size={32} />
				<p style={{ paddingLeft: '1rem' }}>Fetching Booking Slots ...</p>
			</div>
		);
	}
};
