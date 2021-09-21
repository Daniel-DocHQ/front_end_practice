import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { get } from 'lodash';
import LinkButton from '../DocButton/LinkButton';
import DocCard from '../DocCard/DocCard';
import DocCardContainer from '../DocCard/DocCardContainer';
import DISCOUNT_USER_NAMES from '../../helpers/discountUserNames';

const BookAppointmentIcon = require('../../assets/images/icons/homepage-book-appointment.svg');
const apiUrl  = process.env.REACT_APP_API_URL;

const SAHomepageCards = ({ token, user }) => {
	const userName = `${get(user, 'first_name', '')} ${get(user, 'last_name', '')}`;
	const saCards = [
		{
			display: true,
			title: 'Live Doctors Management',
			icon: <img src={BookAppointmentIcon} alt='Live Doctors Management' />,
			content: (
				<React.Fragment>
					<p>Live Doctors Management</p>
				</React.Fragment>
			),
			actions: (
				<LinkButton
					text='View'
					color='green'
					linkSrc='/super_admin/live-doctors-management'
				/>
			),
		},
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
					linkSrc='/super_admin/order-list'
				/>
			),
		},
		{
			display: true,
			title: 'PCR Tests Management',
			icon: <img src={BookAppointmentIcon} alt='Order Management' />,
			content: (
				<React.Fragment>
					<p>PCR Tests Management</p>
				</React.Fragment>
			),
			actions: (
				<LinkButton
					color='green'
					text='View'
					linkSrc='/super_admin/pcr-management'
				/>
			),
		},
		{
			display: true,
			title: 'Dropbox management',
			icon: <img src={BookAppointmentIcon} alt='Dropbox management' />,
			content: (
				<React.Fragment>
					<p>Dropbox management</p>
				</React.Fragment>
			),
			actions: (
				<LinkButton
					color='green'
					text='View'
					linkSrc='/super_admin/pickups-list'
				/>
			),
		},
		{
			display: DISCOUNT_USER_NAMES.includes(userName),
			title: 'Discount Management',
			icon: <img src={BookAppointmentIcon} alt='Discount Management' />,
			content: (
				<React.Fragment>
					<p>Discount Management</p>
				</React.Fragment>
			),
			actions: (
				<LinkButton
					color='green'
					text='View'
					linkSrc='/super_admin/generate-discount'
				/>
			),
		},
	];
	const [cards, setCards] = useState([]);
	useEffect(() => {
		if (!!user) {
			axios({
				url: `${apiUrl}/v1/processor`,
				method: "GET",
				headers: {
					'Authorization': token,
				}
			}).then((response) => {
				if (response.status === 200) {
					setCards([...saCards, {
						display: true,
						title: 'Processor',
						icon: <img src={BookAppointmentIcon} alt='Order Management' />,
						content: (
							<React.Fragment>
								<p>Processor task management</p>
							</React.Fragment>
						),
						actions: (
							<LinkButton
							color='green'
							text='Processor management'
							linkSrc='/super_admin/processor'
						/>
						),
					}])
				} else setCards([...saCards]);
			}).catch(() => {
				setCards([...saCards]);
			})
		};
	}, [user]);

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
