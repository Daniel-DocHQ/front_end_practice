import React from 'react';
import './Reset.scss';
import { useState, useContext } from 'react';
import DocButton from '../DocButton/DocButton';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import authorisationService from '../../services/authorisationService';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { ToastsStore } from 'react-toasts';
import getURLParams from '../../helpers/getURLParams';

const logo = require('../../assets/images/icons/dochq-logo-rect.svg');
const tick = require('../../assets/images/icons/tick.svg');

const NewPassword = () => {
	const [password, setPassword] = useState('');
	const [passwordRepeat, setPasswordRepeat] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [done, setDone] = useState(false);
	const [submitPressed, setSubmitPressed] = useState(false);

	const isClient = typeof window !== 'undefined';
	let resetToken = '';
	if (isClient) {
		const urlParams = typeof window === 'undefined' ? null : getURLParams(window.location.href);
		if (urlParams && typeof urlParams.error === 'undefined') {
			resetToken = urlParams.reset_token;
		}
	}

	function passwordValidation(password) {
		if (password && password.length >= 1) {
			if (typeof password === 'undefined') {
				return false;
			} else {
				const pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
				return pattern.test(password);
			}
		} else {
			return true;
		}
	}

	function passwordRepeatValidation(password, passwordRepeat) {
		if (passwordRepeat && passwordRepeat.length >= 1) {
			if (typeof password === 'undefined' || typeof passwordRepeat === 'undefined') {
				return false;
			} else {
				return password === passwordRepeat;
			}
		} else {
			return true;
		}
	}
	function emptyFields(password, passwordRepeat) {
		return (
			password === '' ||
			typeof password === 'undefined' ||
			passwordRepeat === '' ||
			typeof passwordRepeat === 'undefined'
		);
	}

	function attemptReset() {
		if (
			passwordValidation(password) &&
			passwordRepeatValidation(password, passwordRepeat) &&
			!emptyFields(password, passwordRepeat)
		) {
			authorisationService
				.newPassword(password, resetToken)
				.then(result => {
					if (result.success) {
						ToastsStore.success('Successfully reset');
						setDone(true);
						setSubmitPressed(false);
					} else if (!result.success && result.error) {
						ToastsStore.error(result.error);
						setSubmitPressed(false);
					}
				})
				.catch(err => {
					/*if(err.response.status === 400){
					ToastsStore.error("New password must differ from your previous ones");
				} else {*/
					ToastsStore.error("Couldn't reset password");
					//}
					setSubmitPressed(false);
				});
		}
	}
	return typeof resetToken !== 'undefined' && resetToken !== '' ? (
		<React.Fragment>
			<div className='new-password-container'>
				<div className='reset-form'>
					<div className='row'>
						<img src={logo} alt='dochq logo' style={{ maxHeight: '50px' }} />
					</div>
					{typeof done === 'undefined' || done === false ? (
						<div>
							<div className='row'>
								<h3>Reset password</h3>
								<p>Create a new password for your account using the form below </p>
								<ul style={{ textAlign: 'left' }}>
									<li>Must contain lowercase and uppercase letters</li>
									<li>Must contain a number</li>
									<li>Must contain at least 8 characters</li>
									<li>Must differ from your previous password</li>
								</ul>
							</div>

							<div className='row'>
								<TextField
									id='filled-adornment-password'
									error={!passwordValidation(password)}
									inputProps={{ 'aria-label': 'Password input' }}
									variant='filled'
									type={showPassword ? 'text' : 'password'}
									label='New Password'
									placeholder='New Password'
									value={password}
									pattern='/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/'
									onChange={e => setPassword(e.target.value)}
									style={{ width: '100%' }}
									required
									autoFocus={true}
									//TODO Tick or X if passwords match
									InputProps={{
										endAdornment: (
											<InputAdornment position='end'>
												<IconButton
													aria-label='toggle password visibility'
													onClick={() => setShowPassword(!showPassword)}
													onMouseDown={event => event.preventDefault()}
													edge='end'
												>
													{showPassword ? (
														<i className='fa fa-eye'></i>
													) : (
														<i className='fa fa-eye-slash'></i>
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
							</div>
							<div className='row'>
								<TextField
									error={!passwordRepeatValidation(password, passwordRepeat)}
									id='PasswordRepeat'
									label='Repeat new password'
									onChange={e => setPasswordRepeat(e.target.value)}
									value={passwordRepeat}
									variant='filled'
									helperText={
										!passwordRepeatValidation(password, passwordRepeat)
											? "Passwords don't match"
											: ' '
									}
									style={{ width: '100%' }}
									type={showPassword ? 'text' : 'password'}
									required
									InputProps={{
										endAdornment: (
											<InputAdornment position='end'>
												<IconButton
													aria-label='toggle password visibility'
													onClick={() => setShowPassword(!showPassword)}
													onMouseDown={event => event.preventDefault()}
													edge='end'
												>
													{showPassword ? (
														<i className='fa fa-eye'></i>
													) : (
														<i className='fa fa-eye-slash'></i>
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
							</div>
							{submitPressed &&
								(!passwordValidation(password) ||
									!passwordRepeatValidation(password, passwordRepeat) ||
									emptyFields(password, passwordRepeat)) && (
									<p style={{ color: 'red' }}>Please enter a valid password</p>
								)}
							<div className='row'>
								<DocButton
									text='Set new password'
									color='green'
									onClick={() => {
										setSubmitPressed(true);
										attemptReset();
									}}
								/>
							</div>
						</div>
					) : (
						<div>
							<div className='row'>
								<img className='tick-image' src={tick} alt='Check icon' />
							</div>
							<div className='row'>
								<h3>Password Reset Complete</h3>

								<p>Your password has been reset, you can now login.</p>
							</div>
							<div className='row'>
								<a className='link-helper' href={'/login'}>
									Go to login
								</a>
							</div>
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	) : (
		<React.Fragment>
			<div className='login-container'>
				<div className='login-form'>
					<div className='row'>
						<img src={logo} alt='dochq logo' style={{ maxHeight: '100px' }} />
					</div>
					<div className='row'>
						<h3>Something went wrong, try again.</h3>
						<a className='link-helper' href={'/forgot-password'}>
							Forgotten password?
						</a>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default NewPassword;
