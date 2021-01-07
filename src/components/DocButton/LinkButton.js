import React from 'react';
import { Link } from 'react-router-dom';
import './DocButton.scss';

import PropTypes from 'prop-types';
/* 
	Acceptable colors - pink or green
*/
const LinkButton = ({ text, color, linkSrc, newTab, flat, disabled, style, nomargin }) => {
	const allStyles =
		typeof style !== 'undefined' && typeof nomargin !== 'undefined'
			? { margin: '0px', ...style }
			: typeof style !== 'undefined' && typeof nomargin === 'undefined'
			? { ...style }
			: {};
	if (linkSrc.includes('https://') || linkSrc.includes('http://')) {
		return typeof disabled !== 'undefined' && disabled ? (
			<a href={linkSrc} target='_blank' rel='noopener noreferrer' target={newTab ? '_blank' : ''}>
				<button
					type='button'
					className={`btn disabled ${typeof flat !== 'undefined' ? 'flat' : ''}`}
					disabled
					style={allStyles}
				>
					{text}
				</button>
			</a>
		) : (
			<a href={linkSrc} target='_blank' rel='noopener noreferrer' target={newTab ? '_blank' : ''}>
				<button
					type='button'
					className={`btn ${typeof color !== 'undefined' ? color : ''} ${
						typeof flat !== 'undefined' ? 'flat' : ''
					}`}
					style={allStyles}
				>
					{text}
				</button>
			</a>
		);
	} else {
		return typeof disabled !== 'undefined' && disabled ? (
			<Link to={linkSrc} target={newTab ? '_blank' : ''}>
				<button
					type='button'
					className={`btn disabled ${typeof flat !== 'undefined' ? 'flat' : ''}`}
					disabled
				>
					{text}
				</button>
			</Link>
		) : (
			<Link to={linkSrc} target={newTab ? '_blank' : ''}>
				<button
					type='button'
					className={`btn ${typeof color !== 'undefined' ? color : ''} ${
						typeof flat !== 'undefined' ? 'flat' : ''
					}`}
				>
					{text}
				</button>
			</Link>
		);
	}
};
export default LinkButton;

LinkButton.defaultProps = {
	text: 'DocHQ',
	linkSrc: 'https://dochq.co.uk',
	color: 'pink',
	newTab: false,
};
