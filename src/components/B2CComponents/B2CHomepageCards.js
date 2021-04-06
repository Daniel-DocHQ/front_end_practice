import React from 'react';
import LinkButton from '../DocButton/LinkButton';
import DocCard from '../DocCard/DocCard';
import DocCardContainer from '../DocCard/DocCardContainer';

const testResultsIcon = require('../../assets/images/icons/test-results.svg');
const TestKitIcon = require('../../assets/images/icons/homepage-test-kit.svg');
const BookAppointmentIcon = require('../../assets/images/icons/homepage-book-appointment.svg');

const B2CHomepageCards = () => {
	const cards = [
		{
			display: true,
			title: 'Buy Antigen Kits',
			icon: <img src={TestKitIcon} alt='Order Test Kit' />,
			content: (
				<React.Fragment>
					<p>You must order a Home Test Kit at least <span className='pink-text'>8 working days prior</span> to your procedure.</p>
				</React.Fragment>
			),
			actions: (
				<LinkButton
					text='Order Test Kit'
					color='green'
					linkSrc='/b2c/order-test-kit'
				/>
			),
		},
		{
			display: true,
			title: 'Book an Appointment',
			icon: <img src={BookAppointmentIcon} alt='Order Test Kit' />,
			content: 'Please book a video appointment to take your swab sample.',
			actions: (
				<LinkButton
					text='Book Appointment'
					color='green'
					linkSrc='/b2c/book-appointment'
				/>
			),
		},
        {
			display: true,
			title: 'My Appointments',
			icon: <img src={BookAppointmentIcon} alt='Order Test Kit' />,
			content: 'Your future and past appointments will be shown in this section.',
			actions: (
				<LinkButton
					text='See Appointments'
					color='green'
					linkSrc='/b2c/appointments'
				/>
			),
		},
		{
			display: true,
			title: 'Test Results',
			icon: <img src={testResultsIcon} alt='Test Results' />,
			content: 'Your test results will be shown in this section.',
			actions: (
				<LinkButton
					text='See Results'
					color='green'
					linkSrc='/b2c/test-results'
				/>
			),
		},
	];

	return (
		<DocCardContainer>
			{cards.map(({ display, title, icon, content, actions }, i) =>
				display === true ? (
					<DocCard key={i} title={title} icon={icon} content={content} actions={actions} />
				) : null
			)}
		</DocCardContainer>
	);
};

export default B2CHomepageCards;
