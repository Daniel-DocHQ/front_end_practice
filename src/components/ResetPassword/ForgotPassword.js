import React from 'react';
import './Reset.scss';
import { useState, useContext } from 'react';
import DocButton from '../DocButton/DocButton';
import { TextField } from '@material-ui/core';
import authorisationService from '../../services/authorisationService';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { ToastsStore } from 'react-toasts';
const logo = require('../../assets/images/icons/dochq-logo-rect.svg');
const tick = require('../../assets/images/icons/tick.svg');

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [isResetPressed, setResetPressed] = useState(false);
	const [isEmailSent, setIsEmailSent] = useState(false);
	let history = useHistory();
	const { token, isAuthenticated } = useContext(UserContext);
	if (typeof token !== 'undefined' && isAuthenticated) {
		history.push('/dashboard');
	}
	function validEmail(email) {
		if (typeof email === 'undefined') {
			return false;
		} else {
			const pattern = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);
			return pattern.test(email.toLowerCase());
		}
	}
	function resetPassword() {
		if (validEmail(email)) {
			authorisationService
				.resetPassword(email)
				.then(result => {
					if (result.success) {
						ToastsStore.success('Email sent');
						setIsEmailSent(true);
						setResetPressed(false);
					} else if (!result.success && result.error) {
						ToastsStore.error('Unable to reset password, server error');
						setResetPressed(false);
						setIsEmailSent(false);
					}
				})
				.catch(err => {
					ToastsStore.error('Unable to reset password');
					setResetPressed(false);
				});
		} else {
			ToastsStore.error('Email not valid');
			setResetPressed(false);
		}
	}
	return !isEmailSent ? (
		<React.Fragment>
			<div className='reset-container'>
				<div className='reset-form'>
					<div className='row'>
						<img src={logo} alt='dochq logo' style={{ maxHeight: '50px' }} />
					</div>
					<div className='row'>
						<h3>Reset password</h3>
						<p>
							To reset your password enter your email address below, we'll send you a recovery link.{' '}
						</p>
					</div>
					<div>
						<div className='row'>
							<TextField
								id='Email'
								label='Email'
								onChange={e => setEmail(e.target.value)}
								value={email}
								variant='filled'
								required
								style={{ width: '100%' }}
								type='text'
							/>
							{isResetPressed && !validEmail(email) && (
								<p style={{ color: 'var(--doc-pink)' }}>Please enter a valid email address.</p>
							)}
						</div>

						<div className='row'>
							<DocButton
								type='submit'
								text='Email me a recovery link'
								color='pink'
								onClick={() => {
									setResetPressed(true);
									resetPassword();
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	) : (
		<React.Fragment>
			<div className='reset-container'>
				<div className='reset-form'>
					<div className='row'>
						<img src={logo} alt='dochq logo' style={{ maxHeight: '100px' }} />
					</div>
					<div className='row'>
						<img className='tick-image' src={tick} alt='Check icon' />
					</div>
					<div className='row'>
						<h3>Reset password</h3>
						{typeof email !== 'undefined' && email !== '' ? (
							<p>If account exists, an email will be sent to {email} with further instructions</p>
						) : (
							<p>
								If account exists, an email will be sent to your address with further instructions
							</p>
						)}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ForgotPassword;
