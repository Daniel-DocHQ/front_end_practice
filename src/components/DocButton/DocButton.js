import React from 'react';
import './DocButton.scss';
const DocButton = ({ color, onClick, text, type, style, disabled, nomargin, flat, ...rest }) => {
	const allStyles =
		typeof style !== 'undefined' && typeof nomargin !== 'undefined'
			? { margin: '0px', ...style }
			: typeof style !== 'undefined' && typeof nomargin === 'undefined'
			? { ...style }
			: {};
	return disabled ? (
		<React.Fragment>
			<button
				type={type || 'button'}
				className={`btn ${typeof color !== 'undefined' ? color : ''} ${
					typeof flat !== 'undefined' ? 'flat' : ''
				}`}
				onClick={onClick}
				style={allStyles}
				{...rest}
				disabled
			>
				{text}
			</button>
		</React.Fragment>
	) : (
		<React.Fragment>
			<button
				type={type || 'button'}
				className={`btn ${typeof color !== 'undefined' ? color : ''} ${
					typeof flat !== 'undefined' ? 'flat' : ''
				}`}
				onClick={onClick}
				style={allStyles}
				{...rest}
			>
				{text}
			</button>
		</React.Fragment>
	);
};

export default DocButton;
