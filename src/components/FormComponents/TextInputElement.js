import React, { useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { useState } from 'react';
import './TextInput.scss';

const TextInputElement = ({
	value,
	onChange,
	updateStatus,
	label,
	id,
	autoComplete,
	inputProps,
	required,
	style,
	numRows,
	...rest
}) => {
	const [completedInput, setCompletedInput] = useState(false);
	const [initialErrorFieldSubmitted, setInitialErrorFieldSubmitted] = useState(false);
	if (
		initialErrorFieldSubmitted === false &&
		updateStatus &&
		required === true &&
		value.length === 0
	) {
		updateStatus(false, label.toLowerCase());
		setInitialErrorFieldSubmitted(true);
	}
	let allStyles = {};
	if (style) {
		allStyles = { ...style };
	} else {
		allStyles = { flex: 1, width: '100%' };
	}
	useEffect(() => {
		if (
			completedInput &&
			typeof value !== 'undefined' &&
			value.length >= 2 &&
			required &&
			updateStatus
		) {
			updateStatus(true, label.toLowerCase());
		} else if (
			updateStatus &&
			typeof required === 'undefined' &&
			typeof value !== 'undefined' &&
			value.length !== 0
		) {
			updateStatus(value.length >= 6, label.toLowerCase());
		} else if (completedInput && required && updateStatus && typeof value !== 'undefined') {
			updateStatus(typeof value !== 'undefined' && value.length >= 6, label.toLowerCase());
		}
	}, [completedInput]);

	return (
		<TextField
			error={required ? (completedInput && typeof value !== 'undefined' && value.length <= 2) : false}
			id={id || `text-field-${(Math.random() * 100).toFixed(0)}`}
			label={label}
			autoComplete={autoComplete}
			onChange={e => onChange(e.target.value)}
			onBlur={() => setCompletedInput(true)}
			onFocus={() => setCompletedInput(false)}
			value={value}
			variant='filled'
			inputProps={inputProps}
			required={required}
			{...rest}
			style={allStyles}
		/>
	);
};
export default TextInputElement;
