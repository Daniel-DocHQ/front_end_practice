import React from 'react';
import { TextField } from '@material-ui/core';
import './TextInput.scss';

const Input = ({
	style,
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
			variant='filled'
			style={allStyles}
			{...rest}
		/>
	);
};
export default Input;
