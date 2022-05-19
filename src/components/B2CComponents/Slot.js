import React from 'react';
import { formatTimeSlotWithTimeZone } from '../../helpers/formatDate';

const Slot = ({ timezone, item, start_time, selectSlot, isSelected }) => (
	<div className={`slot ${isSelected ? 'selected' : ''}`} onClick={() => selectSlot(item)}>
		{formatTimeSlotWithTimeZone(start_time, timezone)}
	</div>
);

export default Slot;
