import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import React from 'react';

const DocAccordion = ({ key, title, content }) => (
	<React.Fragment>
		<Accordion key={key}>
			<AccordionSummary
				expandIcon={<i className='fa fa-chevron-down'></i>}
				aria-controls={`panel${key}-content`}
				id={`panel${key}-header`}
			>
				{title}
			</AccordionSummary>
			<AccordionDetails style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
				{content}
			</AccordionDetails>
		</Accordion>
	</React.Fragment>
);

export default DocAccordion;
