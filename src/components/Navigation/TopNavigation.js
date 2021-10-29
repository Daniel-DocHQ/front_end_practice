import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import './Navigation.scss';
import ClaimableNotification from './ClaimableNotification';

const docIcon = require('../../assets/images/icons/dochq-logo-rect-white.svg');
const vistaLogo = require('../../assets/images/vista-logo.png');

const TopNavigation = ({
	title,
	isAuthenticated,
	user,
	role,
	logout,
	token,
	logo,
	...rest
}) => {
	const isVista = window.location.href.includes('vista');

	return (
		<div className='top-navigation-container'>
			<div style={{ display: 'flex' }}>
				{!!role && (
					<Link to={`/${typeof role === 'object' ? role.name : role}/dashboard`}>
						<i className='fa fa-home' style={{ fontSize: '36px', marginRight: 20 }}></i>
					</Link>
				)}
				<div className='practice-logo'>
					<img src={docIcon} alt='DocHQ Icon' />
				</div>
				{isVista && (
					<div className='practice-logo'>
						<img src={vistaLogo} alt='Vista Health' className='vista-logo' />
					</div>
				)}
			</div>
			<h1 className='page-title'>{title}</h1>
			{isAuthenticated && (
				<>
					<ClaimableNotification title={title} token={token} />
					<UserMenu
						user={user}
						logout={logout}
					/>
				</>
			)}
			{logo && (
				<div className='partner-logo'>
					<img src={logo} alt='logo' className='vista-logo' />
				</div>
			)}
		</div>
	);
};

export default TopNavigation;
