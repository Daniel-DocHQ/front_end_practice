import React from 'react';
import { TextField } from '@material-ui/core';
import { useState, useEffect } from 'react';
import validateEmail from '../../helpers/validateEmail';

const EmailInputElement = ({ value, onChange, updateStatus, style, ...rest }) => {
	const [completedInput, setCompletedInput] = useState(false);
	const [initialErrorFieldSubmitted, setInitialErrorFieldSubmitted] = useState(false);
	if (initialErrorFieldSubmitted === false && updateStatus && value.length === 0) {
		updateStatus(false, 'email');
		setInitialErrorFieldSubmitted(true);
	}
	useEffect(() => {
		if (completedInput && updateStatus) {
			updateStatus(validateEmail(value), 'email');
		}
	}, [completedInput, updateStatus, value]);
	let allStyles = {};
	if (style) {
		allStyles = { ...style };
	} else {
		allStyles = { flex: 1, width: '100%' };
	}
	return (
		<TextField
			error={completedInput && !validateEmail(value)}
			id={`email-field-${(Math.random() * 100).toFixed(0)}`}
			inputProps={{ 'aria-label': 'Email address input' }}
			variant='filled'
			type='email'
			autoComplete='email'
			label='Email'
			value={value}
			onChange={e => onChange(e.target.value)}
			onBlur={() => setCompletedInput(true)}
			onFocus={() => setCompletedInput(false)}
			{...rest}
			required
			style={allStyles}
		/>
	);
};
export default EmailInputElement;
