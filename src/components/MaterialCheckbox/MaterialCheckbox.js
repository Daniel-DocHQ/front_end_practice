import React from 'react';
import './MaterialCheckbox.scss';
const MaterialCheckbox = ({ value, onChange, labelComponent, ...rest }) => (
	<React.Fragment>
		<label className='pure-material-checkbox' style={{ pointerEvents: 'none' }}>
			<input type='checkbox' checked={value} onChange={e => onChange(e.target.checked)} {...rest} />
			<span className='label'>{labelComponent}</span>
		</label>
	</React.Fragment>
);

export default MaterialCheckbox;
