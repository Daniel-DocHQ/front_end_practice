import { Paper, Accordion } from '@material-ui/core';
import React from 'react';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
const data = [
	{
		test_type: 'RT-PCR',
		positive:
			'The RT-PCR Test looks for the presence of coronavirus SARS-CoV-2. Test analysis indicates that genetic material from SARS-CoV-2 was found in the test sample and the individual has confirmed coronavirus disease.',
		negative:
			'The RT-PCR Test looks for the presence of coronavirus SARS-CoV-2. Test analysis indicates that no genetic material from SARS-CoV-2 was not found in the test sample, the individual does not have coronavirus disease.',
	},

	// {
	// 	test_type: 'ELISA IgG',
	// 	positive:
	// 		'The ELISA IgG is an antibody test. Test analysis has detected the presence of immunoglobulin G (IgG) in the sample, which is an antibody produced in response to Covid-19. These antibodies indicate that the individual may have had Covid-19 in the recent past and has developed antibodies that may protect them from future infection. It is unknown at this point how much protection antibodies might give against another infection with SARS-CoV-2.',
	// 	negative:
	// 		'The ELISA IgG is an antibody test. Test analysis has not detected the presence of immunoglobulin G (IgG) in the sample, which is an antibody produced in response to Covid-19. There is no indication that the individual has had Covid-19 in the recent past as no IgG antibodies have been detected.',
	// },
	// {
	// 	test_type: 'ELISA IgM',
	// 	positive:
	// 		'The ELISA IgM is an antibody test. Test analysis has detected the presence of immunoglobulin M (IgM) in the sample, which is an antibody produced in response to Covid-19. These antibodies indicate that the individual may have had Covid-19 in the recent past and has developed antibodies that may protect them from future infection. It is unknown at this point how much protection antibodies might give against another infection with SARS-CoV-2.',
	// 	negative:
	// 		'The ELISA IgM is an antibody test. Test analysis has not detected the presence of immunoglobulin M (IgM) in the sample, which is an antibody produced in response to Covid-19. There is no indication that the individual has had Covid-19 in the recent past as no IgM antibodies have been detected.',
	// },
];

const ResultsGuide = () => (
	<React.Fragment>
		<div
			style={{
				padding: '15px',
				maxWidth: '1200px',
				margin: 'auto',
				boxSizing: 'border-box',
			}}
		>
			<div className='row center'>
				<h3>Understanding your results</h3>
			</div>
			{data.map((result, i) => (
				<Accordion key={i}>
					<AccordionSummary
						expandIcon={<i className='fa fa-chevron-down'></i>}
						aria-controls={`panel${i}-content`}
						id={`panel${i}-header`}
					>
						{result.test_type}
					</AccordionSummary>
					<AccordionDetails style={{ flexDirection: 'column' }}>
						<h4>
							<i className='fa fa-check' style={{ color: 'var(--doc-green)' }}></i>
							&nbsp;&nbsp;Positive
						</h4>
						<p>{result.positive}</p>
						<div className='separator'></div>
						<h4>
							<i className='fa fa-times' style={{ color: 'var(--doc-pink)' }}></i>
							&nbsp;&nbsp;Negative
						</h4>
						<p>{result.negative}</p>
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	</React.Fragment>
);

export default ResultsGuide;
