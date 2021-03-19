import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import './Navigation.scss';

const docIcon = require('../../assets/images/icons/dochq-logo-rect-white.svg');
const vistaLogo = require('../../assets/images/vista-logo.png');

const TopNavigation = ({
	title,
	isAuthenticated,
	user,
	role,
	logout,
	...rest
}) => {
	const isVista = window.location.href.includes('vista');

	return (
		<div className='top-navigation-container'>
			<div style={{ display: 'flex' }}>
				<Link to={`/${role}/dashboard`}>
					<i className='fa fa-home' style={{ fontSize: '36px' }}></i>
				</Link>
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
				<UserMenu
					user={user}
					logout={logout}
				/>
			)}
		</div>
	);
};

export default TopNavigation;
