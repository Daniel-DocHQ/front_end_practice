import React from 'react';
import './DocTab.scss';
import { useState } from 'react';

const DocTab = ({ components, titles }) => {
	const [active, setActive] = useState(0);
	return (
		<React.Fragment>
			<div className='doc-tab-container'>
				<div className='tab-headers'>
					{titles.map((title, i) => (
						<div
							key={i}
							className={`doc-tab-title ${i === active ? 'active' : ''}`}
							aria-label='Tab navigation'
							onClick={() => setActive(i)}
						>
							{title}
						</div>
					))}
				</div>
				<div className='tab-body'>{components[active]}</div>
			</div>
		</React.Fragment>
	);
};

export default DocTab;
