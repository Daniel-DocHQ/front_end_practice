import React from 'react';
import './FullScreenOverlay.scss';

const FullScreenOverlay = ({ isVisible, content }) =>
	isVisible ? (
		<React.Fragment>
			<div className='full-screen-overlay-container'>
				<div className='full-screen-overlay-content'>{content || 'here'}</div>
			</div>
		</React.Fragment>
	) : null;

export default FullScreenOverlay;
