import React from 'react';
import LinkButton from '../DocButton/LinkButton';
import DocCard from '../DocCard/DocCard';
import DocCardContainer from '../DocCard/DocCardContainer';

const BookAppointmentIcon = require('../../assets/images/icons/homepage-book-appointment.svg');

const SAHomepageCards = () => {
	const cards = [
		{
			display: true,
			title: 'Doctors Management',
			icon: <img src={BookAppointmentIcon} alt='Doctors Management' />,
			content: (
				<React.Fragment>
					<p>Doctors Management</p>
				</React.Fragment>
			),
			actions: (
				<LinkButton
					text='View'
					color='green'
					linkSrc='/super_admin/doctors-management'
				/>
			),
		},
		{
			display: true,
			title: 'Uploaded Results Management',
			icon: <img src={BookAppointmentIcon} alt='Doctors Management' />,
			content: (
				<React.Fragment>
					<p>Uploaded Results Management</p>
				</React.Fragment>
			),
			actions: (
				<LinkButton
					color='green'
					text='Certificates List'
					linkSrc='/super_admin/certificates-list'
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

export default SAHomepageCards;
