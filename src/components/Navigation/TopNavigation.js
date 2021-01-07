import React, { useState, useEffect } from 'react';
import './Navigation.scss';
import DocButton from '../DocButton/DocButton';
import { Paper, Avatar } from '@material-ui/core';
import { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LinkButton from '../DocButton/LinkButton';
import isClickOutsideElement from '../../helpers/isClickOutsideElement';
const docIcon = require('../../assets/images/icons/dochq-logo-rect-white.svg');
const vistaLogo = require('../../assets/images/vista-logo.png');
const TopNavigation = ({ title, ...rest }) => {
	const [isActive, setIsActive] = useState(false);
	const { isAuthenticated, user, role, logout } = useContext(AuthContext);
	let history = useHistory();
	const isVista = window.location.href.includes('vista');
	const logoutAndRedirect = () => {
		logout();
		history.push('/login');
	};
	useEffect(() => {
		if (isActive) {
			// click outside navigation hides
			window.addEventListener('click', handleClicks, true);
			// scroll outside navigation hides
			window.addEventListener('scroll', handleScroll, true);
		} else {
			window.removeEventListener('click', handleClicks, true);
			window.removeEventListener('scroll', handleScroll, true);
		}
	}, [isActive, setIsActive]);
	function handleClicks(e) {
		if (isClickOutsideElement('.personal-profile-actions', e)) setIsActive(false);
	}
	function handleScroll(e) {
		setIsActive(false);
	}
	return (
		<React.Fragment>
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
					<div
						className={`personal-profile ${isActive ? 'active' : ''}`}
						onClick={() => setIsActive(!isActive)}
					>
						{user && user.avatar_image ? (
							<Avatar alt='Profile Avatar' src={user.avatar_image} />
						) : (
							<i className='fa fa-user-circle'></i>
						)}
						{isActive && (
							<div className='personal-profile-actions'>
								<Paper
									elevation={3}
									style={{ padding: '8px 17px', minWidth: '150px', textAlign: 'left' }}
								>
									<div>
										<LinkButton
											flat
											text='My Account'
											linkSrc='/patient/profile'
											style={{ fontSize: '16px' }}
											color='dark-grey'
										/>
										<LinkButton
											flat
											text='Change Password'
											color='dark-grey'
											linkSrc={`https://login.dochq.co.uk/change-password?role_id=${
												typeof user !== 'undefined' &&
												user !== null &&
												typeof user.roles !== 'undefined' &&
												typeof user.roles[0].id !== 'undefined'
													? user.roles[0].id
													: ''
											}&redirectUrl=${window.location.href}`}
											style={{ fontSize: '16px' }}
										/>
										<DocButton
											flat
											text='Logout'
											color='pink'
											style={{
												marginTop: '0px !important',
												fontSize: '16px',
												minWidth: '10px !important',
											}}
											onClick={logoutAndRedirect}
										/>
									</div>
								</Paper>
							</div>
						)}
					</div>
				)}
			</div>
		</React.Fragment>
	);
};

export default TopNavigation;
