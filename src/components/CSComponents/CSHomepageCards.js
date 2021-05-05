import React from 'react';
import LinkButton from '../DocButton/LinkButton';
import DocCard from '../DocCard/DocCard';
import DocCardContainer from '../DocCard/DocCardContainer';

const BookAppointmentIcon = require('../../assets/images/icons/homepage-book-appointment.svg');

const CSHomepageCards = () => {
	const cards = [
		{
			display: true,
			title: 'Order Management',
			icon: <img src={BookAppointmentIcon} alt='Order Management' />,
			content: (
				<React.Fragment>
					<p>Order Management</p>
				</React.Fragment>
			),
			actions: (
				<LinkButton
					color='green'
					text='Order List'
					linkSrc='/customer_services/order-list'
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

export default CSHomepageCards;