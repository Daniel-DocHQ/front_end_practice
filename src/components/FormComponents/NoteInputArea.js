import React from 'react';
import { TextField } from '@material-ui/core';

const NoteInputArea = ({ value, onChange, label, numRows, inputProps, ...rest }) => {
	return (
		<React.Fragment>
			<TextField
				id={`text-field-${(Math.random() * 100).toFixed(0)}`}
				label={label}
				onChange={e => onChange(e.target.value)}
				value={value}
				variant='filled'
				inputProps={inputProps}
				{...rest}
				rows={numRows}
				multiline
			/>
		</React.Fragment>
	);
};

export default NoteInputArea;
