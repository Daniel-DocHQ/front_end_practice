import React, { useContext, useEffect, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import { format } from 'date-fns';
import DocButton from '../DocButton/DocButton';
import LinkButton from '../DocButton/LinkButton';
import DateOfBirth from '../FormComponents/DateOfBirth';
import EmailInputElement from '../FormComponents/EmailInput';
import TextInputElement from '../FormComponents/TextInputElement';
import existsInArray from '../../helpers/existsInArray';
import PhoneNumber from '../FormComponents/PhoneNumber/PhoneNumber';
import {
	AuthContext,
} from '../../context/AuthContext';
import bookingUserDataService from '../../services/bookingUserDataService';
import authorisationSvc from '../../services/authorisationService';
import './PatientProfileDetails.scss';

const PatientProfileDetailsNew = ({ isShippingInfo }) => {
	const {
		setRole,
		setUser,
		token,
		user,
		role,
		role_profile,
		organisation_profile,
		setRoleProfile,
	} = useContext(AuthContext);
	const shipping_details =
		!!role_profile && !!role_profile.shipping_details ? { ...role_profile.shipping_details } : {};
	const [isEditable, setIsEditable] = useState(
		typeof shipping_details === 'undefined' || shipping_details === null
	);

	return (
		<div className='profile-grid'>
			<ProfileRow
				title='Personal Information'
				content={
					<PersonalInformation
						setRole={setRole}
						setUser={setUser}
						token={token}
						user={user}
					/>
				}
			/>
			<ProfileRow
				title='Shipping Information'
				content={
					<ShippingInformation
						token={token}
						user={user}
						role={!!role && !!role.name && role.name}
						isEditable={isEditable}
						isShippingInfo={isShippingInfo}
						setIsEditable={setIsEditable}
						role_profile={role_profile}
						shipping_details={shipping_details}
						organisation_profile={organisation_profile}
						setRoleProfile={setRoleProfile}
					/>
				}
			/>
		</div>
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

const PersonalInformation = ({
	user,
	token,
	setRole,
	setUser,
}) => {
	const [isEditable, setIsEditable] = useState(false);
	const [first_name, setFirst_name] = useState(!!user && !!user.first_name ? user.first_name : '');
	const [last_name, setLast_name] = useState(!!user && !!user.last_name ? user.last_name : '');
	const [date_of_birth, setDateOfBirth] = useState(
		!!user && !!user.date_of_birth ? user.date_of_birth : new Date()
	);
	const [email, setEmail] = useState(!!user && !!user.email ? user.email : '');
	const [telephone, setTelephone] = useState(!!user && !!user.telephone ? user.telephone : '');
	const [errors, setErrors] = useState([]);
	const [attemptedSubmit, setAttemptedSubmit] = useState(false);

	useEffect(() => {
		if (!!user) {
			authorisationSvc
				.getUser(token)
				.then(result => {
					if (result.success && result.user) {
						setUser(result.user);
						if (!!result.user && !!result.user.roles && !!result.user.roles[0]) {
							setRole(result.user.roles[0]);
						}
					}
				})
				.catch(err => console.log('error fetching user'));
		}
	}, [isEditable]);
	useEffect(() => {
		if (!!user) {
			if (!!user.first_name) setFirst_name(user.first_name);
			if (!!user.last_name) setLast_name(user.last_name);
			if (!!user.email) setEmail(user.email);
			if (!!user.telephone) setTelephone(user.telephone);
			if (!!user.date_of_birth) setDateOfBirth(user.date_of_birth);
		}
	}, [user]);
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
		const body = {
			telephone,
		};
		if (errors.length === 0) {
			authorisationSvc
				.updateUser(token, body)
				.then(result => {
					if (result.success && result.role_profile) {
						// setStatus({
						// 	severity: 'success',
						// 	message: 'Successfully saved shipping details',
						// });
					}
				})
				.catch((err) => {
					console.log(err);
					// setStatus({
					// 	severity: 'error',
					// 	message: 'Error saving shipping details',
					// });
				});
		} else {
			setAttemptedSubmit(true);
		}
		setIsEditable(false);
	};
	return isEditable ? (
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
					required
					disabled
					style={{ width: '300px', maxWidth: '90%', marginRight: '10px', marginTop: '20px' }}
				/>
				<TextInputElement
					value={last_name}
					id='shipping-last_name'
					label='Last Name'
					onChange={setLast_name}
					autoComplete='family-name'
					pattern={new RegExp(/^[a-zA-Z ]+$/)}
					required
					disabled
					style={{ width: '300px', maxWidth: '90%', marginTop: '20px' }}
				/>
			</div>
			<div className='row' style={{ width: '300px', maxWidth: '90%' }}>
				<DateOfBirth
					onChange={setDateOfBirth}
					value={new Date(date_of_birth).getTime()}
					required
					disabled
				/>
			</div>
			<div className='row' style={{ width: '300px', maxWidth: '90%' }}>
				<EmailInputElement value={email} onChange={setEmail} disabled={true} />
			</div>
			<div className='row' style={{ width: '300px', maxWidth: '90%' }}>
				<PhoneNumber value={telephone} onChange={setTelephone} required disabled={!isEditable} />
			</div>
			<div className='row space-between no-margin' style={{ width: '300px', maxWidth: '90%' }}>
				<DocButton
					color="pink"
					text="Cancel"
					onClick={() => setIsEditable(false)}
				/>
				<DocButton
					color="green"
					text="Save"
					onClick={proceed}
				/>
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
	) : (
		<React.Fragment>
			<div className='row space-between no-margin' style={{ width: '300px', maxWidth: '90%' }}>
				<p className='title-info'>First Name:</p>
				<p>{first_name}</p>
			</div>
			<div className='row space-between no-margin' style={{ width: '300px', maxWidth: '90%' }}>
				<p className='title-info'>Last Name:</p>
				<p>{last_name}</p>
			</div>
			<div className='row space-between no-margin' style={{ width: '300px', maxWidth: '90%' }}>
				<p className='title-info'>Date of Birth:</p>
				<p>{format(new Date(date_of_birth), 'dd-MM-yyyy')}</p>
			</div>
			<div className='row space-between no-margin' style={{ width: '300px', maxWidth: '90%' }}>
				<p className='title-info'>Email:</p>
				<p>{email}</p>
			</div>
			<div className='row space-between no-margin' style={{ width: '300px', maxWidth: '90%' }}>
				<p className='title-info'>Phone:</p>
				<p>{telephone}</p>
			</div>
			<div className='row flex-end' style={{ width: '300px', maxWidth: '90%' }}>
				<DocButton
					color="pink"
					text="Edit"
					onClick={() => setIsEditable(true)}
				/>
			</div>
		</React.Fragment>
	);
};
const ShippingInformation = ({
	organisation_profile,
	user,
	token,
	role,
	role_profile,
	shipping_details,
	isEditable,
	setIsEditable,
	setRoleProfile,
	isShippingInfo,
}) => {
	const [address_1, setAddress_1] = useState('');
	const [address_2, setAddress_2] = useState('');
	const [city, setCity] = useState(shipping_details.city || '');
	const [county, setCounty] = useState(shipping_details.county || '');
	const [postcode, setPostcode] = useState(shipping_details.postcode || '');
	const [errors, setErrors] = useState([]);
	const [attemptedSubmit, setAttemptedSubmit] = useState(false);
	const [status, setStatus] = useState(false);
	useEffect(() => {
		if (!!role_profile && !!role_profile.shipping_details) {
			if (!!role_profile.shipping_details.address_1)
				setAddress_1(role_profile.shipping_details.address_1);
			if (!!role_profile.shipping_details.address_2)
				setAddress_2(role_profile.shipping_details.address_2);
			if (!!role_profile.shipping_details.city) setCity(role_profile.shipping_details.city);
			if (!!role_profile.shipping_details.county) setCounty(role_profile.shipping_details.county);
			if (!!role_profile.shipping_details.postcode)
				setPostcode(role_profile.shipping_details.postcode);
			setIsEditable(false);
		} else {
			setIsEditable(true);
		}
		if (!!organisation_profile && !!organisation_profile.id)
			shipping_details.organisation_profile_id = organisation_profile.id;
	}, [role_profile]);

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
		const body = {
			shipping_details: { ...shipping_details, address_1, address_2, city, county, postcode },
		};
		if (
			!!user &&
			!!user.id &&
			!!user.roles &&
			!!user.roles[0] &&
			!!user.roles[0].id &&
			!!user.roles[0].organisation_id &&
			!!user.first_name &&
			!!user.last_name
		) {
			body.role_id = user.roles[0].id;
			body.organisation_profile_id = user.roles[0].organisation_id;
			body.user_id = user.id;
			body.name = `${user.first_name} ${user.last_name}`;
		}
		if (errors.length === 0) {
			if (
				!!role_profile &&
				!!role_profile.shipping_details &&
				!!role_profile.shipping_details.address_1
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
			}
		} else {
			setAttemptedSubmit(true);
		}
	}
	return (
		<React.Fragment>
			{isEditable ? (
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
							required
							updateStatus={updateErrors}
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
						/>
					</div>
					<div className='row' style={{ width: '300px', maxWidth: '90%' }}>
						<TextInputElement
							value={city}
							id='shipping-locality'
							label='Town'
							onChange={setCity}
							autoComplete='shipping locality'
							pattern={new RegExp(/^[A-Za-z ]+$/)}
							inputProps={{ minLength: '3' }}
							required
							updateStatus={updateErrors}
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
							required
							updateStatus={updateErrors}
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
							required
							updateStatus={updateErrors}
						/>
					</div>
					{attemptedSubmit && errors.includes('postcode') && (
						<div className='row no-margin'>
							<p className='error'>Enter your postcode</p>
						</div>
					)}
				</React.Fragment>
			) : (
				<React.Fragment>
					<div className='row space-between no-margin' style={{ width: '300px', maxWidth: '90%' }}>
						<p className='title-info'>Address Line 1:</p>
						<p>{address_1}</p>
					</div>
					<div className='row space-between no-margin' style={{ width: '300px', maxWidth: '90%' }}>
						<p className='title-info'>Address Line 2:</p>
						<p>{address_2}</p>
					</div>
					<div className='row space-between no-margin' style={{ width: '300px', maxWidth: '90%' }}>
						<p className='title-info'>Town:</p>
						<p>{city}</p>
					</div>
					<div className='row space-between no-margin' style={{ width: '300px', maxWidth: '90%' }}>
						<p className='title-info'>County:</p>
						<p>{county}</p>
					</div>
					<div className='row space-between no-margin' style={{ width: '300px', maxWidth: '90%' }}>
						<p className='title-info'>Postcode:</p>
						<p>{postcode}</p>
					</div>
					{status !== false && (
						<div className='row'>
							<Alert variant='outlined' severity={status.severity}>
								{status.message}
							</Alert>
						</div>
					)}
					{(!isEditable && isShippingInfo) && (
						<div className='row center' style={{ width: '300px', maxWidth: '90%' }}>
							<LinkButton
								color='green'
								text='Back to Home'
								linkSrc={`/${role}/dashboard`}
							/>
						</div>
					)}
				</React.Fragment>
			)}
			<div className='row flex-end'>
				{isShippingInfo ? (
					isEditable ? (
						<DocButton text='Save' color='pink' onClick={proceed} />
					) : null
				) : isEditable ? (
						<DocButton text='Save' color='pink' onClick={proceed} />
					) : (
						<DocButton text='Edit' color='green' onClick={() => setIsEditable(true)} />
				)}
			</div>
		</React.Fragment>
	);
};
