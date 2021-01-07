import React, { useState, useEffect } from 'react';
import { Paper, Accordion } from '@material-ui/core';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
const HelpScreen = ({}) => {
	const data = [
		{
			title: 'What is Covid-19',
			content:
				'Covid-19 is a coronavirus which can cause illness in both humans and animals. The effect of the virus on an individual varies from person to person. Covid-19 is highly contagious and spreads very quickly from person to person.',
		},
		{
			title: 'What are the symptoms',
			content: (
				<React.Fragment>
					<p>The main symptoms of coronavirus are:</p>
					<ul>
						<li>
							a high temperature – this means you feel hot to touch on your chest or back (you do
							not need to measure your temperature).
						</li>
						<li>
							a new, continuous cough – this means coughing a lot for more than an hour, or 3 or
							more coughing episodes in 24 hours (if you usually have a cough, it may be worse than
							usual)
						</li>
						<li>
							a loss or change to your sense of smell or taste – this means you've noticed you
							cannot smell or taste anything, or things smell or taste different to normal
						</li>
					</ul>
					<p>Most people with coronavirus have at least 1 of these symptoms.</p>
				</React.Fragment>
			),
		},
		{
			title: 'How can I protect yourselves and others around me?',
			content: (
				<React.Fragment>
					<p>
						Covid-19 is thought to be transmitted through close contact with the virus. This occurs
						through droplets produced when a person with Covid-19 coughs or sneezes. Other people
						can then become infected with the virus by breathing in the droplets. Transmission can
						also occur when a person touches nearby surfaces and objects where the droplets have
						landed, and then touches their eyes, nose or mouth.
					</p>
					<p>How to protect myself:</p>
					<ul>
						<li>Avoid exposure by avoiding close contact (6 feet away), coughs and sneezes</li>
						<li>Wash your hands often</li>
						<li>Use hand sanitizer</li>
						<li>Avoid touching your eyes, nose and mouth</li>
						<li>Wear a mask when near others</li>
					</ul>
					<p>Protecting other:</p>
					<ul>
						<li>Stay at home if you are sick</li>
						<li>Cover coughs and sneezes with a tissue</li>
						<li>Dispose of the tissue</li>
						<li>Wash your hands</li>
						<li>Wear a face mask if you are caring for someone who is sick</li>
						<li>Clean and disinfect surfaces that are touched often</li>
					</ul>
				</React.Fragment>
			),
		},
		{
			title: 'How to take a swab test',
			content: (
				<iframe
					src='https://player.vimeo.com/video/461319322'
					width='640'
					height='360'
					frameborder='0'
					allow='autoplay; fullscreen'
					allowFullScreen
				></iframe>
			),
		},
		{
			title: 'Understanding your RT-PCR test results',
			content: (
				<React.Fragment>
					<h4>
						<i className='fa fa-check' style={{ color: 'var(--doc-green)' }}></i>
						&nbsp;&nbsp;Positive
					</h4>
					<p>
						The RT-PCR Test looks for the presence of coronavirus SARS-CoV-2. Test analysis
						indicates that genetic material from SARS-CoV-2 was found in the test sample and the
						individual has confirmed coronavirus disease.
					</p>
					<div className='separator'></div>
					<h4>
						<i className='fa fa-times' style={{ color: 'var(--doc-pink)' }}></i>
						&nbsp;&nbsp;Negative
					</h4>
					<p>
						The RT-PCR Test looks for the presence of coronavirus SARS-CoV-2. Test analysis
						indicates that no genetic material from SARS-CoV-2 was not found in the test sample, the
						individual does not have coronavirus disease.
					</p>
				</React.Fragment>
			),
		},
		{
			title: 'What do I do if my RT-PCR test result is negative?',
			content: (
				<React.Fragment>
					<p>You do not need to self-isolate if your test is negative, as long as:</p>
					<ul>
						<li>everyone you live with who has symptoms tests negative</li>
						<li>everyone in your support bubble who has symptoms tests negative</li>
						<li>
							you were not told to self-isolate for 14 days by NHS Test and Trace – if you were, see
							what to do if you've been told you've been in contact with someone who has coronavirus
						</li>
						<li>you feel well – if you feel unwell, stay at home until you’re feeling better</li>
						<li>
							If you have diarrhea or you’re being sick, stay at home until 48 hours after they've
							stopped
						</li>
					</ul>
				</React.Fragment>
			),
		},
		{
			title: 'What do I do if my RT-PCR test result is positive?',
			content: (
				<React.Fragment>
					<p>
						If your test is positive, you must self-isolate immediately.
						<br></br>
						<br></br>
						If you had a test because you had symptoms, keep self-isolating for at least 10 days
						from when your symptoms started.
						<br></br>
						<br></br>
						If you had a test but have not had symptoms, self-isolate for 10 days from when you had
						the test.
						<br></br>
						<br></br>
						Anyone you live with, and anyone in your support bubble, must self-isolate for 14 days
						from when you start self-isolating.
					</p>
				</React.Fragment>
			),
		},
		{
			title: 'Unclear or inconclusive test result',
			content: (
				<React.Fragment>
					<p>
						An unclear, void, borderline or inconclusive result means it's not possible to say if
						you had coronavirus when the test was done. We recommend that you get another test as
						soon as possible if this happens.
					</p>
					<p>
						If you had a test because you had symptoms, you must keep self-isolating and have
						another test:
					</p>
					<ul>
						<li>within 8 days of your symptoms starting (England)</li>
						<li>within 5 days of your symptoms starting (Scotland, Wales and Northern Ireland)</li>
					</ul>
					<p>
						If you're not able to have another test in time, you must self-isolate for at least 10
						days from when your symptoms started. Anyone you live with, and anyone in your support
						bubble, must self-isolate for 14 days.{' '}
						<a
							href='https://www.nhs.uk/conditions/coronavirus-covid-19/self-isolation-and-treatment/how-long-to-self-isolate/'
							rel='noopener noreferrer'
						>
							Read more
						</a>{' '}
						about how long to self-isolate.
					</p>
					<p>
						If you had a test but have not had any symptoms, you do not need to self-isolate while
						you wait to get another test. People you live with, and anyone in your support bubble,
						do not need to self-isolate.
					</p>
				</React.Fragment>
			),
		},
	];
	return (
		<React.Fragment>
			<div
				style={{
					padding: '15px',
					width: '800px',
					maxWidth: '95%',
					margin: 'auto',
					boxSizing: 'border-box',
				}}
			>
				<div className='row center'>
					<h1>DocHQ Help</h1>
				</div>
				{data.map((item, i) => (
					<Accordion key={i}>
						<AccordionSummary
							expandIcon={<i className='fa fa-chevron-down'></i>}
							aria-controls={`panel${i}-content`}
							id={`panel${i}-header`}
						>
							{item.title}
						</AccordionSummary>
						<AccordionDetails
							style={
								item.title === 'How to take a swab test'
									? { flexDirection: 'column', alignItems: 'center' }
									: { flexDirection: 'column', alignItems: 'flex-start' }
							}
						>
							{item.content}
						</AccordionDetails>
					</Accordion>
				))}
				{/* <div className='row center'>
					<h3>Understanding your results</h3>
				</div>
				<UnderstandingResults /> */}
			</div>
		</React.Fragment>
	);
};

export default HelpScreen;

const UnderstandingResults = () => {
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
	return (
		<React.Fragment>
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
		</React.Fragment>
	);
};
