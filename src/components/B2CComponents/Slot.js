import React from 'react';
import { formatTimeSlot } from '../../helpers/formatDate';

const Slot = ({ item, start_time, selectSlot, isSelected }) => (
	<div className={`slot ${isSelected ? 'selected' : ''}`} onClick={() => selectSlot(item)}>
		{formatTimeSlot(start_time)}
	</div>
);

export default Slot;
