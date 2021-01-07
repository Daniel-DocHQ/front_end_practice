import React, { useState, useEffect, useContext } from 'react';
import { Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import existsInArray from '../../helpers/existsInArray';
import DocButton from '../DocButton/DocButton';
import DateOfBirth from '../FormComponents/DateOfBirth';
import EmailInputElement from '../FormComponents/EmailInput';
import TextInputElement from '../FormComponents/TextInputElement';
import LinkButton from '../DocButton/LinkButton';
import AuthContext from  '../../context/AuthContext.js';

const PatientProfileDetails = ({
	initialData,
	saveChanges,
	profile_complete,
	onboarding_complete,
    role,
}) => {
    const [telephone, settelephone] = useState('');
	const [first_name, setFirst_name] = useState('');
	const [last_name, setLast_name] = useState('');
	const [address_1, setaddress_1] = useState('');
	const [city, setCity] = useState('');
	const [county, setCounty] = useState('');
	const [postcode, setPostcode] = useState('');
	const [email, setEmail] = useState('');
	const [isModified, setIsModified] = useState(false);
	const [errors, setErrors] = useState([]);
	const [savedChanges, setSavedChanges] = useState(false);
	const [attemptedSubmit, setAttemptedSubmit] = useState(false);

	useEffect(() => {
		if (typeof initialData !== 'undefined') {
            if (typeof initialData.telephone !== 'undefined') settelephone(initialData.telephone)
			if (typeof initialData.first_name !== 'undefined') setFirst_name(initialData.first_name);
			if (typeof initialData.last_name !== 'undefined') setLast_name(initialData.last_name);
			if (typeof initialData.email !== 'undefined') setEmail(initialData.email);
			if (typeof initialData.address_1 !== 'undefined') setaddress_1(initialData.address_1);
			if (typeof initialData.city !== 'undefined') setCity(initialData.city);
			if (typeof initialData.county !== 'undefined') setCounty(initialData.county);
			if (typeof initialData.postcode !== 'undefined') setPostcode(initialData.postcode);
		}
	}, [initialData]);
	useEffect(() => {
		checkModified();
	}, [
        telephone,
        settelephone,
		first_name,
		setFirst_name,
		last_name,
		setLast_name,
		address_1,
		setaddress_1,
		city,
		setCity,
		county,
		setCounty,
		email,
		setEmail,
		postcode,
		setPostcode,
	]);
	function checkModified() {
		if (typeof initialData !== 'undefined') {
			let modified = false;
            if (
                typeof initialData.telephone !== 'undefined' && 
                initialData.telephone.toLowerCase() !== telephone.toLowerCase()
            )
                modified = true;
			if (
				typeof initialData.first_name !== 'undefined' &&
				initialData.first_name.toLowerCase() !== first_name.toLowerCase()
			)
				modified = true;
			if (
				typeof initialData.last_name !== 'undefined' &&
				initialData.last_name.toLowerCase() !== last_name.toLowerCase()
			)
				modified = true;
			if (
				typeof initialData.address_1 !== 'undefined' &&
				initialData.address_1.toLowerCase() !== address_1.toLowerCase()
			)
				modified = true;
			if (
				typeof initialData.city !== 'undefined' &&
				initialData.city.toLowerCase() !== city.toLowerCase()
			)
				modified = true;
			if (
				typeof initialData.county !== 'undefined' &&
				initialData.county.toLowerCase() !== county.toLowerCase()
			)
				modified = true;
			if (
				typeof initialData.postcode !== 'undefined' &&
				initialData.postcode.toLowerCase() !== postcode.toLowerCase()
			)
				modified = true;

			if (modified !== isModified) {
				setSavedChanges(false);
				setIsModified(modified);
			}
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
	function update() {
		if (typeof saveChanges !== 'undefined' && isValid()) {
			saveChanges({ telephone, first_name, last_name, address_1, city, county, email, postcode });
			setSavedChanges(true);
		} else {
			setAttemptedSubmit(true);
		}
	}
	function isValid() {
		let allCorrect = true;
        if (telephone.length <= 5) allCorrect = false;
		if (first_name.length <= 2) allCorrect = false;
		if (last_name.length <= 2) allCorrect = false;
		if (address_1.length <= 2) allCorrect = false;
		if (city.length <= 2) allCorrect = false;
		if (county.length <= 2) allCorrect = false;
		if (postcode.length <= 4) allCorrect = false;

		return allCorrect;
	}
	return (
		<React.Fragment>
			<React.Fragment>
				<div className='row'>
					<TextInputElement
						value={first_name}
						id='shipping-first_name'
						label='First Name'
						onChange={setFirst_name}
						autoComplete='given-name'
						pattern={new RegExp(/^[a-zA-Z ]+$/)}
						inputProps={{ minLength: '2' }}
						required={true}
						updateStatus={updateErrors}
						disabled
					/>
				</div>
				<div className='row'>
					<TextInputElement
						value={last_name}
						id='shipping-last_name'
						label='Last Name'
						onChange={setLast_name}
						autoComplete='family-name'
						pattern={new RegExp(/^[a-zA-Z ]+$/)}
						required={true}
						updateStatus={updateErrors}
						disabled
					/>
				</div>
				<div className='row'>
					<h4>Shipping Address</h4>
				</div>
				<div className='row'>
					<TextInputElement
						value={telephone}
						id='telephone'
						label='telephone Number'
						onChange={settelephone}
						autoComplete='teletelephone'
						inputProps={{ minLength: '1' }}
						required={true}
						updateStatus={updateErrors}
					/>
				</div>
				<div className='row'>
					<TextInputElement
						value={address_1}
						id='shipping-address_1'
						label='Address Line 1'
						onChange={setaddress_1}
						autoComplete='shipping address-line1'
						pattern={new RegExp(/^[a-zA-Z0-9 ]+$/)}
						inputProps={{ minLength: '1' }}
						required={true}
						updateStatus={updateErrors}
					/>
				</div>
				{attemptedSubmit && address_1.length <= 2 && (
					<div className='row'>
						<p style={{ color: 'var(--doc-orange)' }}>Enter the first line of your address</p>
					</div>
				)}
				<div className='row'>
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
					/>
				</div>
				{attemptedSubmit && city.length <= 2 && (
					<div className='row'>
						<p style={{ color: 'var(--doc-orange)' }}>Enter your town</p>
					</div>
				)}
				<div className='row'>
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
					/>
				</div>
				{attemptedSubmit && county.length <= 2 && (
					<div className='row'>
						<p style={{ color: 'var(--doc-orange)' }}>Enter your county</p>
					</div>
				)}
				<div className='row'>
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
					/>
				</div>
				{attemptedSubmit && postcode.length <= 6 && (
					<div className='row'>
						<p style={{ color: 'var(--doc-orange)' }}>Enter your postcode</p>
					</div>
				)}
				<div className='row center'>
					{onboarding_complete === false && savedChanges && (
                        <LinkButton
                            text='Back to Home'
                            color='green'
                            linkSrc={`/${role}/dashboard`}
                        />

					)}
					{!savedChanges && <DocButton text='Save Changes' color='green' onClick={update} />}
				</div>
			</React.Fragment>
		</React.Fragment>
	);
};

export default PatientProfileDetails;
