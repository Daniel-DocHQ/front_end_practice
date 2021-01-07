import React, { useEffect } from 'react';
import './Login.scss';
import { useState } from 'react';
import DocButton from '../DocButton/DocButton';
import { Redirect } from 'react-router-dom';
const logo = require('../../assets/images/icons/dochq-logo-rect.svg');
const identitiesUi = process.env.REACT_APP_IDENTITES_UI
	? process.env.REACT_APP_IDENTITES_UI
	: 'https://login.dochq.co.uk/login';

const Login = () => {
	const [isAuthed, setIsAuthed] = useState(false);
	const [redirectUrl, setRedirectUrl] = useState('/login');

	function handleRedirects() {
		const role =
			typeof localStorage.getItem('docHQRole') !== 'undefined'
				? localStorage.getItem('docHQRole')
				: null;
		if (role !== null && typeof localStorage.getItem('auth_token') !== 'undefined') {
			setIsAuthed(true);
			if (typeof role !== 'undefined') {
				return `/${role}/dashboard`;
			} else {
				return '/login';
			}
		} else {
			return '/login';
		}
	}
	useEffect(() => {
		setRedirectUrl(handleRedirects());
	});
	return isAuthed ? (
		<Redirect to={redirectUrl} />
	) : (
		<React.Fragment>
			<div className='login-container'>
				<div className='login-form'>
					<div className='row center'>
						<img src={logo} alt='dochq logo' style={{ maxHeight: '100px' }} />
					</div>
					<div className='row center'>
						<DocButton
							text='Login with DocHQ'
							color='green'
							onClick={() => {
								window.location.href = identitiesUi;
							}}
						/>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Login;
