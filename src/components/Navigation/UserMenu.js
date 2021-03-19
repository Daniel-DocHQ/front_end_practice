import React, { useState, useEffect } from 'react';
import { Paper, Avatar } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import DocButton from '../DocButton/DocButton';
import LinkButton from '../DocButton/LinkButton';
import isClickOutsideElement from '../../helpers/isClickOutsideElement';
import './Navigation.scss';

const UserMenu = ({ logout, user }) => {
	let history = useHistory();
	const [isActive, setIsActive] = useState(false);

	function handleClicks(e) {
		if (isClickOutsideElement('.personal-profile-actions', e)) setIsActive(false);
	}
	function handleScroll(e) {
		setIsActive(false);
	}

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

    return (
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
                                style={{ fontSize: '16px', width: 'max-content' }}
                                color='dark-grey'
                            />
                            <LinkButton
                                flat
                                text='My Health Profile'
                                linkSrc='/patient/health-assessment'
                                style={{ fontSize: '16px', width: 'max-content' }}
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
                                style={{ fontSize: '16px', width: 'max-content' }}
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
    )
};

export default UserMenu;
