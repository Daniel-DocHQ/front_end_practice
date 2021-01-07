import React from 'react';
import { formatTimeSlot } from '../../helpers/formatDate';

const Slot = ({ start_time, id, selectSlot, isSelected }) => (
	<div className={`slot ${isSelected ? 'selected' : ''}`} onClick={() => selectSlot(id)}>
		{formatTimeSlot(start_time)}
	</div>
);

export default Slot;
