import React, { useEffect, useState } from 'react';
import LinkButton from '../DocButton/LinkButton';
import DocCard from '../DocCard/DocCard';
import bookingUserDataService from '../../services/bookingUserDataService';
import DocCardContainer from '../DocCard/DocCardContainer';

const completeProfileIcon = require('../../assets/images/icons/completeProfile.svg');
const symptomCheckerIcon = require('../../assets/images/icons/symptom-checker.svg');
const testResultsIcon = require('../../assets/images/icons/test-results.svg');
const ShippingIcon = require('../../assets/images/icons/hompage-shipping-info.svg');
const HealthProfileIcon = require('../../assets/images/icons/homepage-health-profile.svg');
const TestKitIcon = require('../../assets/images/icons/homepage-test-kit.svg');
const BookAppointmentIcon = require('../../assets/images/icons/homepage-book-appointment.svg');

const HomepageCards = ({
	role,
	token,
	role_profile,
	organisation_profile,
}) => {
	const [orders, setOrders] = useState();
	const hasOrders = !!orders;
	const hasShippingDetails =
		!!role_profile &&
		!!role_profile.shipping_details &&
		Object.keys(role_profile.shipping_details).length > 0;
	const onboardingComplete =
		!!role_profile && !!role_profile.onboarding_complete && role_profile.onboarding_complete;

	useEffect(() => {
		if(!!token) {
			bookingUserDataService.getOrdersProfile(token)
				.then(result => {
					if (result.success && result.orders) {
						setOrders(result.orders);
					}
				});
		}
	}, []);

	const adminCards = [
		{
			display: true,
			title: 'Organisation Results',
			icon: <img src={testResultsIcon} alt='Organisation Results' />,
			content: 'Access your organisations Covid-19 testing and symptom checker results.',
			actions: <LinkButton text='View' color='green' linkSrc='/manager/test-results' />,
		},
		{
			display: true,
			title: 'Monitor Sign-ups',
			icon: <img src={completeProfileIcon} alt='Monitor Sign Ups' />,
			content: 'View outstanding company DocHQ account registrations.',
			actions: <LinkButton text='View' color='green' linkSrc='/manager/sign-ups' />,
		},
		{
			display: true,
			title: 'Help Portal',
			icon: <img src={completeProfileIcon} alt='Help Portal' />,
			content: `Finding it difficult to understand your test results? Looking for advice on how to
							take a swab test?`,
			actions: <LinkButton text='Get Help' color='green' linkSrc='/patient/help' />,
		},
	];
	const cards = [
		{
			display: !hasShippingDetails,
			title: 'Shipping Info',
			icon: <img src={ShippingIcon} alt='Complete Profile' />,
			content: 'Please complete your profile with shipping information to order your test kit.',
			actions: (
				<LinkButton
					text={onboardingComplete ? 'View' : 'Complete'}
					color={onboardingComplete ? 'green' : 'pink'}
					linkSrc='/patient/shipping-info'
				/>
			),
		},
		{
			display: !onboardingComplete,
			title: 'Health Profile',
			icon: <img src={HealthProfileIcon} alt='Complete Health Assessment' />,
			content: `Please complete your profile with some information about your health.`,
			actions: (
				<LinkButton
					text={onboardingComplete ? 'View' : 'Complete'}
					color={onboardingComplete ? 'green' : 'pink'}
					linkSrc='/patient/health-assessment'
				/>
			),
		},
		{
			display:
				!!organisation_profile &&
				!!organisation_profile.daily_check &&
				organisation_profile.daily_check,
			title: 'Symptom Checker',
			icon: <img src={symptomCheckerIcon} alt='Symptom Checker' />,
			content: 'Every day you need to complete a symptom checker questionnaire with us.',
			actions: (
				<LinkButton
					text='Complete'
					color='green'
					linkSrc='/patient/symptom-checker'
					disabled={!onboardingComplete}
				/>
			),
		},
		{
			display: !hasOrders,
			title: 'Order Home Test Kit',
			icon: <img src={TestKitIcon} alt='Order Test Kit' />,
			content: (
				<React.Fragment>
					<p>You must order a Home Test Kit at least <span className='pink-text'>8 working days prior</span> to your procedure.</p>
				</React.Fragment>
			),
			actions: (
				<LinkButton
					text='Order'
					color='green'
					linkSrc='/patient/order-test-kit'
					disabled={!onboardingComplete}
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
					text='Book'
					color='green'
					linkSrc='/authenticated/book'
					disabled={!(onboardingComplete && hasOrders)}
				/>
			),
		},
		// {
		// 	display: true,
		// 	title: 'Your Appointment',
		// 	icon: <img src={BookAppointmentIcon} alt='Order Test Kit' />,
		// 	content: 'You can join your video appointment from here of from the link the confirmation email.',
		// 	actions: (
		// 		<LinkButton
		// 			text='Join'
		// 			color='green'
		// 			linkSrc='/authenticated/book'
		// 			disabled={!(onboardingComplete && hasOrders)}
		// 		/>
		// 	),
		// },
		{
			display: true,
			title: 'Test Results',
			icon: <img src={testResultsIcon} alt='Test Results' />,
			content: 'Your test results will be shown in this section.',
			actions: (
				<LinkButton
					text='View'
					color='green'
					linkSrc='/patient/test-results'
					disabled={!(onboardingComplete && hasOrders)}
				/>
			),
		},
		{
			display: false,
			title: 'Help Portal',
			icon: <img src={completeProfileIcon} alt='Help Portal' />,
			content: `Finding it difficult to understand your test results? Looking for advice on how to take a swab test?`,
			actions: <LinkButton text='Get Help' color='green' linkSrc='/patient/help' />,
		},
	];

	return role === 'manager' ? (
		<DocCardContainer>
			{adminCards.map(({ display, title, icon, content, actions }, i) =>
				display === true ? (
					<DocCard key={i} title={title} icon={icon} content={content} actions={actions} />
				) : null
			)}
		</DocCardContainer>
	) : (
		<DocCardContainer>
			{cards.map(({ display, title, icon, content, actions }, i) =>
				display === true ? (
					<DocCard key={i} title={title} icon={icon} content={content} actions={actions} />
				) : null
			)}
		</DocCardContainer>
	);
};

export default HomepageCards;