import React from 'react';
import { TextField } from '@material-ui/core';
import './TextInput.scss';

const Input = ({
	style,
	variant = 'filled',
	...rest
}) => {
	let allStyles = {};
	if (style) {
		allStyles = { ...style };
	} else {
		allStyles = { flex: 1, width: '100%' };
	}

	return (
		<TextField
			variant={variant}
			style={allStyles}
			{...rest}
		/>
	);
};
export default Input;