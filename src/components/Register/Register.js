import React, { useState, useEffect, useContext } from 'react';

import { ToastsStore } from 'react-toasts';
import { useHistory } from 'react-router-dom';
import DocButton from '../DocButton/DocButton';
import DateOfBirth from '../FormComponents/DateOfBirth';
import TextInputElement from '../FormComponents/TextInputElement';
import EmailInputElement from '../FormComponents/EmailInput';
import getURLParams from '../../helpers/getURLParams';
import existsInArray from '../../helpers/existsInArray';
import authorisationSvc from '../../services/authorisationService';
const logo = require('../../assets/images/icons/dochq-logo-rect.svg');

const Register = ({ role, setRole, setRoleData, setToken, setIsAuthenticated, setUser, props }) => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [dateOfBirth, setDateOfBirth] = useState('01/01/1980');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState([]);
	const [attemptedSubmit, setAttemptedSubmit] = useState(false);
	const organisation_id = parseFloat(getURLParams(window.location.href)['company_id']);
	let history = useHistory();
	function proceed() {
		if (errors.length === 0) {
			//TODO attempt registration
			registerUser();
		} else {
			setAttemptedSubmit(true);
		}
	}

	function updateErrors(isValid, field) {
		// if valid and in array remove
		if (isValid && existsInArray(errors, field)) {
			const newErrors = errors.filter(item => item !== field);
			setErrors(newErrors);
		} else if (!isValid && !existsInArray(errors, field)) {
			// if invalid and not in array add to array
			let newErrors = errors;
			newErrors.push(field);
			setErrors(newErrors);
		}
		// if valid and not in array do nothing
		// if invalid and in array, ignore
	}
	function registerUser() {
		const body = {
			first_name: firstName,
			last_name: lastName,
			email,
			password,
			date_of_birth: new Date(dateOfBirth).getTime(),
			username: `${firstName}.${lastName}.${organisation_id}`,
			organisation_id,
		};
		// POST to create user
		authorisationSvc
			.createUser(body)
			.then(result => {
				if (result.success && result.id) {
					// POST to create roles
					const roleBody = { organisation_id, user_id: result.id, name: 'patient' };
					authorisationSvc
						.createRole(roleBody)
						.then(result => {
							if (result.success && result.role && result.id) {
								setRole(result.role.name);
								setRoleData(result.role);
								// Attempt login
								authorisationSvc
									.attemptLogin(body.email, body.password)
									.then(result => {
										if (result && result.success && result.roles && result.roles.length > 0) {
											const reformattedRole = result.roles[0];
											reformattedRole.role_id = reformattedRole.id;

											if (result.user) {
												setUser(result.user);
											}
											// create token
											authorisationSvc
												.createToken(reformattedRole)
												.then(result => {
													if (result.success && result.token) {
														// get jwt using token
														authorisationSvc
															.getJWT(result.token, reformattedRole.name)
															.then(result => {
																if (result.success && result.token) {
																	setToken(result.token);
																	setIsAuthenticated(true);
																	ToastsStore.success('Logged In');
																	history.push(
																		`/${
																			role === 'patient'
																				? 'patient-dashboard'
																				: role === 'practitioner'
																				? 'practitioner-dashboard'
																				: role === 'manager'
																				? 'hr-dashboard'
																				: 'patient-dashboard'
																		}`
																	);
																} else {
																	ToastsStore.error('Failed to login');
																}
															})
															.catch(err => ToastsStore.error('Failed to login'));
													} else {
														ToastsStore.error('Failed to login');
													}
												})
												.catch(err => ToastsStore.error('Failed to login'));
										} else {
											ToastsStore.error('Failed to login');
										}
									})
									.catch(() => ToastsStore.error(`Failed to create account`));
							} else {
								ToastsStore.error(`Failed to create account`);
							}
						})
						.catch(err => {
							ToastsStore.error(`Failed to create account`);
						});
				} else {
					ToastsStore.error(`Failed to create account`);
				}
			})
			.catch(err => {
				ToastsStore.error(`Failed to create account`);
			});
	}
	return (
		<React.Fragment>
			<div
				className='login-background'
				style={{
					backgroundColor: 'var(--doc-dark-grey)',
					minHeight: '100vh',
					overflow: 'hidden',
					width: '100%',
				}}
			>
				<div className='register-container'>
					<div className='row center no-margin'>
						<img src={logo} alt='dochq logo' style={{ maxHeight: '100px' }} />
					</div>
					<div className='row'>
						<TextInputElement
							value={firstName}
							id='first-name'
							label='First Name'
							onChange={setFirstName}
							autoComplete='given-name'
							pattern={new RegExp(/^[a-zA-Z ]+$/)}
							inputProps={{ minLength: '2' }}
							required
							updateStatus={updateErrors}
						/>
					</div>
					{attemptedSubmit && errors.includes('first name') && (
						<div className='row'>
							<p style={{ color: 'var(--doc-orange)' }}>Enter your first name</p>
						</div>
					)}
					<div className='row'>
						<TextInputElement
							value={lastName}
							id='last-name'
							label='Last Name'
							onChange={setLastName}
							autoComplete='family-name'
							pattern={new RegExp(/^[a-zA-Z ]+$/)}
							inputProps={{ minLength: '2' }}
							required
							updateStatus={updateErrors}
						/>
					</div>
					{attemptedSubmit && errors.includes('last name') && (
						<div className='row'>
							<p style={{ color: 'var(--doc-orange)' }}>Enter your last name</p>
						</div>
					)}
					<div className='row'>
						<EmailInputElement value={email} onChange={setEmail} updateStatus={updateErrors} />
					</div>
					{attemptedSubmit && errors.includes('email') && (
						<div className='row'>
							<p style={{ color: 'var(--doc-orange)' }}>Please enter your email address</p>
						</div>
					)}
					<div className='row'>
						<TextInputElement
							value={password}
							id='password'
							label='Password'
							onChange={setPassword}
							autoComplete='new-password'
							inputProps={{ minLength: '7' }}
							required
							type='password'
							updateStatus={updateErrors}
						/>
					</div>
					{attemptedSubmit && errors.includes('password') && (
						<div className='row'>
							<p style={{ color: 'var(--doc-orange)' }}>Please enter a password</p>
						</div>
					)}
					<div className='row'>
						{/* Calendar picker */}
						<DateOfBirth
							onChange={setDateOfBirth}
							value={dateOfBirth}
							required
							updateStatus={updateErrors}
						/>
					</div>
					<div className='row center no-margin'>
						<DocButton text='Register' color='green' onClick={proceed} />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Register;
