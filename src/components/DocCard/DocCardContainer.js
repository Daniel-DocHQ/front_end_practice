import React from 'react';
import './DocCardContainer.scss';

const DocCardContainer = ({ children }) => (
	<React.Fragment>
		<div className='doc-card-container'>{children}</div>
	</React.Fragment>
);

export default DocCardContainer;
