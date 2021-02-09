import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import DocButton from '../DocButton/DocButton';
import DateOfBirth from '../FormComponents/DateOfBirth';
import EmailInputElement from '../FormComponents/EmailInput';
import TextInputElement from '../FormComponents/TextInputElement';
import existsInArray from '../../helpers/existsInArray';
import './PatientProfileDetails.scss';
import MaterialCheckbox from '../MaterialCheckbox/MaterialCheckbox';
import PhoneNumber from '../FormComponents/PhoneNumber/PhoneNumber';
import { AuthContext } from '../../context/AuthContext';
import bookingUserDataService from '../../services/bookingUserDataService';
import authorisationSvc from '../../services/authorisationService';
import Alert from '@material-ui/lab/Alert';

const PatientProfileDetailsNew = () => {
	return (
		<React.Fragment>
			<div className='profile-grid'>
				<ProfileRow title='Personal Information' content={<PersonalInformation />} />
				<ProfileRow title='Shipping Information' content={<ShippingInformation />} />
				<ProfileRow title='Health Profile' content={<HRAView />} />
			</div>
		</React.Fragment>
	);
};

export default PatientProfileDetailsNew;

const ProfileRow = ({ title, content }) => (
	<React.Fragment>
		<div className='row items-start flex-wrap'>
			<div className='title-col sm-12 md-4 lg-4'>
				<h3 className='no-margin'>{title}</h3>
			</div>
			<div className='col content-col sm-12 md-8 lg-8'>{content}</div>
		</div>
	</React.Fragment>
);

const PersonalInformation = () => {
	const { token, user, setUser, setRole } = useContext(AuthContext);
	const [isEditable, setIsEditable] = useState(false);
	const [first_name, setFirst_name] = useState(user.first_name || '');
	const [last_name, setLast_name] = useState(user.last_name || '');
	const [date_of_birth, setDateOfBirth] = useState(user.date_of_birth || '');
	const [email, setEmail] = useState(user.email || '');
	const [telephone, setTelephone] = useState(user.telephone || '');
	const [errors, setErrors] = useState([]);
	const [attemptedSubmit, setAttemptedSubmit] = useState(false);

	useEffect(() => {
		if (typeof user === 'undefined' || user === null) {
			authorisationSvc
				.getUser(token)
				.then(result => {
					if (result.success && result.user) {
						setUser(result.user);
						if (
							result.user &&
							typeof result.user.roles !== 'undefined' &&
							typeof result.user.roles[0] !== 'undefined' &&
							typeof result.user.roles[0].name !== 'undefined'
						) {
							setRole(result.user.roles[0].name);
						}
					}
				})
				.catch(err => console.log('error fetching user'));
		}
	}, []);
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

	function proceed() {
		if (errors.length === 0) {
		} else {
			setAttemptedSubmit(true);
		}
	}
	return (
		<React.Fragment>
			<div className='row flex-start' style={{ flexWrap: 'wrap' }}>
				<TextInputElement
					value={first_name}
					id='shipping-first_name'
					label='First Name'
					onChange={setFirst_name}
					autoComplete='given-name'
					pattern={new RegExp(/^[a-zA-Z ]+$/)}
					inputProps={{ minLength: '2' }}
					required={true}
					disabled={!isEditable}
					style={{ width: '300px', maxWidth: '90%', marginRight: '10px', marginTop: '20px' }}
				/>
				<TextInputElement
					value={last_name}
					id='shipping-last_name'
					label='Last Name'
					onChange={setLast_name}
					autoComplete='family-name'
					pattern={new RegExp(/^[a-zA-Z ]+$/)}
					required={true}
					disabled={!isEditable}
					style={{ width: '300px', maxWidth: '90%', marginTop: '20px' }}
				/>
			</div>
			<div className='row' style={{ width: '300px', maxWidth: '90%' }}>
				<DateOfBirth
					onChange={setDateOfBirth}
					value={new Date(date_of_birth).getTime()}
					required={true}
					disabled={!isEditable}
				/>
			</div>
			<div className='row' style={{ width: '300px', maxWidth: '90%' }}>
				<EmailInputElement value={email} onChange={setEmail} disabled={true} />
			</div>
			<div className='row' style={{ width: '300px', maxWidth: '90%' }}>
				<PhoneNumber value={telephone} onChange={setTelephone} required disabled={!isEditable} />
			</div>
			{/* <div className='row flex-end'>
				{isEditable ? (
					<DocButton
						text='Save'
						color='pink'
						onClick={() => console.log('save personal profile')}
					/>
				) : (
					<DocButton text='Edit' color='green' onClick={() => setIsEditable(true)} />
				)}
			</div> */}
		</React.Fragment>
	);
};
const ShippingInformation = ({}) => {
	const { user, roles, organisation_profile, token, role_profile, setRoleProfile } = useContext(
		AuthContext
	);
	const shipping_details =
		!!role_profile && !!role_profile.shipping_details ? { ...role_profile.shipping_details } : {};
	const [isEditable, setIsEditable] = useState(!!shipping_details);
	const [address_1, setAddress_1] = useState('');
	const [address_2, setAddress_2] = useState('');
	const [city, setCity] = useState(shipping_details.city || '');
	const [county, setCounty] = useState(shipping_details.county || '');
	const [postcode, setPostcode] = useState(shipping_details.postcode || '');
	const [errors, setErrors] = useState([]);
	const [attemptedSubmit, setAttemptedSubmit] = useState(false);
	const [status, setStatus] = useState(false);
	useEffect(() => {
		if (!!shipping_details && Object.keys(shipping_details).length < 1) {
			if (!!shipping_details.street_address) setAddress_1(shipping_details.street_address);
			if (!!shipping_details.address_1) setAddress_1(shipping_details.address_1);
			if (!!shipping_details.address_2) setAddress_2(shipping_details.address_2);
			if (!!shipping_details.city) setCity(shipping_details.city);
			if (!!shipping_details.county) setCounty(shipping_details.county);
			if (!!shipping_details.postcode) setPostcode(shipping_details.postcode);
		}
		if (!!organisation_profile && !!organisation_profile.id)
			shipping_details.organisation_profile_id = organisation_profile.id;
	}, []);
	useEffect(() => {
		if (typeof role_profile === 'undefined' || role_profile === null) {
			bookingUserDataService
				.getRoleProfile(token)
				.then(result => {
					if (result.success && result.role_profile) {
						setRoleProfile(result.role_profile);
					} else {
						setIsEditable(true);
					}
				})
				.catch(err => {
					setIsEditable(true);
					console.log('profile_not_complete');
				});
		}
	}, []);
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
	function proceed() {
		if (errors.length === 0) {
			const body = {
				shipping_details: { ...shipping_details, address_1, address_2, city, county, postcode },
			};
			if (!!roles && !!roles[0] && !!roles[0].id) body.role_id = roles[0].id;
			if (!!user && !!user.id) body.user_id = user.id;
			if (!!organisation_profile && !!organisation_profile.id)
				body.organisation_profile_id = organisation_profile.id;
			if (!!role_profile) {
				bookingUserDataService
					.createRoleProfile(token, body)
					.then(result => {
						if (result.success && result.role_profile) {
							setRoleProfile(result.role_profile);
							setStatus({
								severity: 'success',
								message: 'Successfully saved shipping details',
							});
						}
					})
					.catch(() => {
						setStatus({
							severity: 'error',
							message: 'Error saving shipping details',
						});
					});
			} else if (
				!!role_profile &&
				!!role_profile.shipping_details &&
				!!role_profile.shipping_details.name
			) {
				body.shipping_details.id = shipping_details.id;
				bookingUserDataService
					.updateProfileData(token, body)
					.then(result => {
						if (result.success && result.role_profile) {
							setRoleProfile(result.role_profile);
							setStatus({
								severity: 'success',
								message: 'Successfully saved shipping details',
							});
						}
					})
					.catch(() => {
						setStatus({
							severity: 'error',
							message: 'Error saving shipping details',
						});
					});
			} else {
				bookingUserDataService
					.createShippingDetails(token, body)
					.then(result => {
						if (result.success && result.role_profile) {
							setRoleProfile(result.role_profile);
							setStatus({
								severity: 'success',
								message: 'Successfully saved shipping details',
							});
						}
					})
					.catch(() => {
						setStatus({
							severity: 'error',
							message: 'Error saving shipping details',
						});
					});
			}
		} else {
			setAttemptedSubmit(true);
		}
	}
	return (
		<React.Fragment>
			<div className='row' style={{ width: '300px', maxWidth: '90%' }}>
				<TextInputElement
					value={address_1}
					id='shipping-address_1'
					label='Address Line 1'
					onChange={setAddress_1}
					autoComplete='shipping address-line1'
					pattern={new RegExp(/^[a-zA-Z0-9 ]+$/)}
					inputProps={{ minLength: '1' }}
					required={true}
					updateStatus={updateErrors}
					disabled={!isEditable}
				/>
			</div>
			{attemptedSubmit && errors.includes('address line 1') && (
				<div className='row no-margin'>
					<p className='error'>Enter the first line of your address</p>
				</div>
			)}
			<div className='row' style={{ width: '300px', maxWidth: '90%' }}>
				<TextInputElement
					value={address_2}
					id='shipping-address_2'
					label='Address Line 2'
					onChange={setAddress_2}
					autoComplete='shipping address-line2'
					pattern={new RegExp(/^[a-zA-Z0-9 ]+$/)}
					inputProps={{ minLength: '1' }}
					updateStatus={updateErrors}
					disabled={!isEditable}
				/>
			</div>
			{attemptedSubmit && errors.includes('address line 2') && (
				<div className='row no-margin'>
					<p className='error'>Enter the second line of your address</p>
				</div>
			)}
			<div className='row' style={{ width: '300px', maxWidth: '90%' }}>
				<TextInputElement
					value={city}
					id='shipping-locality'
					label='Town'
					onChange={setCity}
					autoComplete='shipping locality'
					pattern={new RegExp(/^[A-Za-z ]+$/)}
					inputProps={{ minLength: '3' }}
					required={true}
					updateStatus={updateErrors}
					disabled={!isEditable}
				/>
			</div>
			{attemptedSubmit && errors.includes('town') && (
				<div className='row no-margin'>
					<p className='error'>Enter your town</p>
				</div>
			)}
			<div className='row' style={{ width: '300px', maxWidth: '90%' }}>
				<TextInputElement
					value={county}
					id='shipping-region'
					label='County'
					onChange={setCounty}
					autoComplete='shipping region'
					pattern={new RegExp(/[a-zA-Z ]+$/)}
					inputProps={{ minLength: '3' }}
					required={true}
					updateStatus={updateErrors}
					disabled={!isEditable}
				/>
			</div>
			{attemptedSubmit && errors.includes('county') && (
				<div className='row no-margin'>
					<p className='error'>Enter your county</p>
				</div>
			)}
			<div className='row' style={{ width: '300px', maxWidth: '90%' }}>
				<TextInputElement
					value={postcode}
					id='shipping-postcode'
					label='Postcode'
					onChange={setPostcode}
					autoComplete='shipping postal_code'
					pattern={
						new RegExp(
							/([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/
						)
					}
					inputProps={{ maxLength: '8' }}
					required={true}
					updateStatus={updateErrors}
					disabled={!isEditable}
				/>
			</div>
			{attemptedSubmit && errors.includes('postcode') && (
				<div className='row no-margin'>
					<p className='error'>Enter your postcode</p>
				</div>
			)}
			{status !== false && (
				<div className='row'>
					<Alert variant='outlined' severity={status.severity}>
						{status.message}
					</Alert>
				</div>
			)}
			<div className='row flex-end'>
				{isEditable ? (
					<DocButton text='Save' color='pink' onClick={proceed} />
				) : (
					<DocButton text='Edit' color='green' onClick={() => setIsEditable(true)} />
				)}
			</div>
		</React.Fragment>
	);
};
const HRAView = () => {
	const { token, hra_data, setHRAData } = useContext(AuthContext);
	useEffect(() => {
		if (typeof hra_data === 'undefined' || hra_data === null) {
			bookingUserDataService
				.getHRAData(token)
				.then(result => {
					if (result.success && result.hra_data) {
						setHRAData(result.hra_data);
						console.log(result.hra_data);
					} else {
					}
				})
				.catch(() => console.log('err'));
		}
	}, []);

	// Display only
	return typeof hra_data === 'undefined' || hra_data === null ? (
		<React.Fragment>
			<div className='row items-start'>
				<div className='subtitle-col'>
					<h3 className='no-margin'>About You</h3>
				</div>
				<div>
					<p>No data to display</p>
				</div>
			</div>
			<div className='row items-start'>
				<div className='subtitle-col'>
					<h3 className='no-margin'>Your Health</h3>
				</div>
				<div>
					<p>No data to display</p>
				</div>
			</div>
			<div className='row items-start'>
				<div className='subtitle-col'>
					<h3 className='no-margin'>Family Health</h3>
				</div>
				<div>
					<p>No data to display</p>
				</div>
			</div>
		</React.Fragment>
	) : (
		<React.Fragment>
			<div className='row items-start'>
				<div className='subtitle-col'>
					<h3 className='no-margin'>About You</h3>
				</div>
				<div>
					<div className='row' style={{ flexWrap: 'wrap' }}>
						<TextInputElement
							label='Height (cm)'
							value={hra_data.height}
							onChange={() => null}
							placeholder='Height (cm)'
							type='number'
							inputProps={{ min: 1, max: 300, step: 1 }}
							disabled={true}
							style={{ width: '200px', marginRight: '20px', marginTop: '20px' }}
						/>
						<TextInputElement
							label='Weight (kg)'
							value={hra_data.weight}
							onChange={() => null}
							placeholder='Weight (kg)'
							type='number'
							inputProps={{ min: 20, max: 250 }}
							disabled={true}
							style={{ width: '200px', marginTop: '20px' }}
						/>
					</div>
					<div className='row'>
						<FormControl component='fieldset'>
							<FormLabel component='legend'>Sex *</FormLabel>
							<RadioGroup
								style={{ display: 'inline' }}
								aria-label='sex'
								name='sex'
								value={hra_data.sex}
								onChange={() => null}
							>
								<FormControlLabel value='Female' control={<Radio />} label='Female' />
								<FormControlLabel value='Male' control={<Radio />} label='Male' />
							</RadioGroup>
						</FormControl>
					</div>
					<div className='row'>
						<FormControl component='fieldset'>
							<FormLabel component='legend'>Do you smoke?</FormLabel>
							<RadioGroup
								style={{ display: 'inline' }}
								aria-label='sex'
								name='smoking'
								value={hra_data.smoking}
								onChange={() => null}
								disabled={true}
							>
								<FormControlLabel value={true} control={<Radio />} label='Yes' />
								<FormControlLabel value={false} control={<Radio />} label='No' />
							</RadioGroup>
						</FormControl>
					</div>
				</div>
			</div>
			<div className='row items-start'>
				<div className='subtitle-col'>
					<h3 className='no-margin'>Your Health</h3>
				</div>

				<div>
					<div className='row'>
						<MaterialCheckbox
							value={hra_data.health_conditions !== null && hra_data.health_conditions.includes(1)}
							labelComponent='Active Cancer'
							onChange={() => null}
						/>
					</div>
					<div className='row'>
						<MaterialCheckbox
							value={hra_data.health_conditions !== null && hra_data.health_conditions.includes(2)}
							labelComponent='Disease or medicines that weaken the immune system'
							onChange={() => null}
						/>
					</div>
					<div className='row'>
						<MaterialCheckbox
							value={hra_data.health_conditions !== null && hra_data.health_conditions.includes(3)}
							labelComponent='Diabetes'
							onChange={() => null}
						/>
					</div>
					<div className='row'>
						<MaterialCheckbox
							value={hra_data.health_conditions !== null && hra_data.health_conditions.includes(4)}
							labelComponent='Cardiovascular disease'
							onChange={() => null}
						/>
					</div>
					<div className='row'>
						<MaterialCheckbox
							value={hra_data.health_conditions !== null && hra_data.health_conditions.includes(5)}
							labelComponent='History of chronic lung disease'
							onChange={() => null}
						/>
					</div>
					<div className='row'>
						<MaterialCheckbox
							value={hra_data.health_conditions !== null && hra_data.health_conditions.includes(6)}
							labelComponent='History of chronic liver disease'
							onChange={() => null}
						/>
					</div>
					<div className='row'>
						<MaterialCheckbox
							value={hra_data.health_conditions !== null && hra_data.health_conditions.includes(7)}
							labelComponent='History of chronic kidney disease'
							onChange={() => null}
						/>
					</div>
					<div className='row'>
						<MaterialCheckbox
							value={hra_data.health_conditions === null}
							labelComponent='none'
							onChange={() => null}
						/>
					</div>
				</div>
			</div>
			<div className='row items-start'>
				<div className='subtitle-col'>
					<h3 className='no-margin'>Family Health</h3>
				</div>

				<div>
					<div className='row'>
						<MaterialCheckbox
							value={
								hra_data.family_health_conditions !== null &&
								hra_data.family_health_conditions.includes(1)
							}
							labelComponent='Active Cancer'
							onChange={() => null}
						/>
					</div>
					<div className='row'>
						<MaterialCheckbox
							value={
								hra_data.family_health_conditions !== null &&
								hra_data.family_health_conditions.includes(2)
							}
							labelComponent='Disease or medicines that weaken the immune system'
							onChange={() => null}
						/>
					</div>
					<div className='row'>
						<MaterialCheckbox
							value={
								hra_data.family_health_conditions !== null &&
								hra_data.family_health_conditions.includes(3)
							}
							labelComponent='Diabetes'
							onChange={() => null}
						/>
					</div>
					<div className='row'>
						<MaterialCheckbox
							value={
								hra_data.family_health_conditions !== null &&
								hra_data.family_health_conditions.includes(4)
							}
							labelComponent='Cardiovascular disease'
							onChange={() => null}
						/>
					</div>
					<div className='row'>
						<MaterialCheckbox
							value={
								hra_data.family_health_conditions !== null &&
								hra_data.family_health_conditions.includes(5)
							}
							labelComponent='History of chronic lung disease'
							onChange={() => null}
						/>
					</div>
					<div className='row'>
						<MaterialCheckbox
							value={
								hra_data.family_health_conditions !== null &&
								hra_data.family_health_conditions.includes(6)
							}
							labelComponent='History of chronic liver disease'
							onChange={() => null}
						/>
					</div>
					<div className='row'>
						<MaterialCheckbox
							value={
								hra_data.family_health_conditions !== null &&
								hra_data.family_health_conditions.includes(7)
							}
							labelComponent='History of chronic kidney disease'
							onChange={() => null}
						/>
					</div>
					<div className='row'>
						<MaterialCheckbox
							value={hra_data.family_health_conditions === null}
							labelComponent='none'
							onChange={() => null}
						/>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
