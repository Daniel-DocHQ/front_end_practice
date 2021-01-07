import React from 'react';
import './DocCard.scss';
const DocCard = ({ title, icon, content, actions }) => (
	<React.Fragment>
		<div className='doc-card'>
			<div className='doc-card-row'>
				<div className='doc-card-column'>
					<div className='doc-card-icon'>{icon}</div>
				</div>
				<div className='doc-card-content'>
					<h2>{title}</h2>
					{React.isValidElement(content) ? { content } : <p>{content}</p>}
				</div>
			</div>
			<div className='doc-card-actions'>{actions}</div>
		</div>
	</React.Fragment>
);

export default DocCard;

// Card component
// If content is a string, wrap in p tags,
// else treat as own component and render that component
// Actions are treated as a component, always. Will always render flex-end
