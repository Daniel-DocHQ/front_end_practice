import React from 'react';
import LinkButton from '../DocButton/LinkButton';
import DocCard from '../DocCard/DocCard';
import DocCardContainer from '../DocCard/DocCardContainer';

const completeProfileIcon = require('../../assets/images/icons/completeProfile.svg');
const symptomCheckerIcon = require('../../assets/images/icons/symptom-checker.svg');
const testResultsIcon = require('../../assets/images/icons/test-results.svg');
const ShippingIcon = require('../../assets/images/icons/hompage-shipping-info.svg');
const HealthProfileIcon = require('../../assets/images/icons/homepage-health-profile.svg');
const TestKitIcon = require('../../assets/images/icons/homepage-test-kit.svg');
const BookAppointmentIcon = require('../../assets/images/icons/homepage-book-appointment.svg');

const HomepageCards = ({ role, role_profile, organisation_profile }) => {
	const postComplete = role_profile !== null && role_profile.onboarding_complete === true;

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
			display: typeof role_profile !== 'undefined',
			title: 'Shipping Info',
			icon: <img src={ShippingIcon} alt='Complete Profile' />,
			content: 'Please complete your profile with shipping information to order your test kit.',
			actions: (
				<LinkButton
					text={postComplete ? 'View' : 'Complete'}
					color={postComplete ? 'green' : 'pink'}
					linkSrc='/patient/profile'
				/>
			),
		},
		{
			display: typeof role_profile !== 'undefined',
			title: 'Health Profile',
			icon: <img src={HealthProfileIcon} alt='Complete Health Assessment' />,
			content: `Please complete your profile with some information about your health.`,
			actions: (
				<LinkButton
					text={postComplete ? 'View' : 'Complete'}
					color={postComplete ? 'green' : 'pink'}
					linkSrc={postComplete ? '/patient/profile' : '/patient/health-assessment'}
				/>
			),
		},
		{
			display:
				typeof organisation_profile !== 'undefined' &&
				organisation_profile !== null &&
				organisation_profile.daily_check === true,
			title: 'Symptom Checker',
			icon: <img src={symptomCheckerIcon} alt='Symptom Checker' />,
			content: 'Every day you need to complete a symptom checker questionnaire with us.',
			actions: (
				<LinkButton
					text='Complete'
					color='green'
					linkSrc='/patient/symptom-checker'
					disabled={
						role_profile !== 'undefined' &&
						role_profile !== null &&
						role_profile.onboarding_complete
							? false
							: true
					}
				/>
			),
		},
		{
			display:
				typeof organisation_profile !== 'undefined' &&
				organisation_profile !== null &&
				organisation_profile.order_kit === true,
			title: 'Order Home Test Kit',
			icon: <img src={TestKitIcon} alt='Order Test Kit' />,
			content: 'You must order a Home Test Kit at least 8 working days prior to your procedure.',
			actions: (
				<LinkButton
					text='Order'
					color='green'
					linkSrc='/patient/order-test-kit'
					disabled={!!role_profile && role_profile.onboarding_complete ? false : true}
				/>
			),
		},
		{
			display:
				typeof organisation_profile !== 'undefined' &&
				organisation_profile !== null &&
				organisation_profile.order_kit === true,
			title: 'Book an Appointment',
			icon: <img src={BookAppointmentIcon} alt='Order Test Kit' />,
			content: 'Please book a video appointment to take your swab sample.',
			actions: (
				<LinkButton
					text='Book'
					color='green'
					linkSrc='/authenticated/book'
					disabled={
						role_profile !== 'undefined' &&
						role_profile !== null &&
						role_profile.onboarding_complete
							? false
							: true
					}
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
					text='View'
					color='green'
					linkSrc='/patient/test-results'
					disabled={
						role_profile !== 'undefined' &&
						role_profile !== null &&
						role_profile.onboarding_complete
							? false
							: true
					}
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
