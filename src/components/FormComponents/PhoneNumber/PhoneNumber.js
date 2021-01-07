import React, { useEffect } from 'react';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import './PhoneNumber.scss';
import { useState } from 'react';
import 'react-phone-number-input/style.css';

const PhoneNumber = ({ value, onChange, updateStatus, placeHolder, required, disabled }) => {
	const [placeholder, setPlaceholder] = useState(`${placeHolder ? placeHolder : 'Phone Number'} *`);
	const [completedInput, setCompletedInput] = useState(false);
	const [initialErrorFieldSubmitted, setInitialErrorFieldSubmitted] = useState(false);

	useEffect(() => {
		// this runs on component initialisation
		if (
			initialErrorFieldSubmitted === false &&
			updateStatus &&
			required === true &&
			value.length === 0
		) {
			updateStatus(false, 'phone number');
			setInitialErrorFieldSubmitted(true);
		}
	});

	useEffect(() => {
		if (typeof updateStatus !== 'undefined') {
			updateStatus(isPossiblePhoneNumber(value), 'phone number');
		}
	}, [completedInput]);
	return required === true ? (
		<PhoneInput
			className={`${completedInput && !isPossiblePhoneNumber(value) ? 'invalid' : ''}`}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			onFocus={() => {
				setPlaceholder('');
				setCompletedInput(false);
			}}
			onBlur={() => {
				setPlaceholder('Phone Number *');
				if (!completedInput) {
					setCompletedInput(true);
				}
			}}
			error={completedInput && !isPossiblePhoneNumber(value) ? 'true' : null}
			minLength={5}
			required
			style={{ flex: 1 }}
			disabled={typeof disabled === 'undefined' ? false : disabled}
		/>
	) : (
		<PhoneInput
			className={`${completedInput && !isPossiblePhoneNumber(value) ? 'invalid' : ''}`}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			onFocus={() => {
				setPlaceholder('');
				setCompletedInput(false);
			}}
			onBlur={() => {
				setPlaceholder(`${placeholder} *`);
				if (!completedInput) {
					setCompletedInput(true);
				}
			}}
			error={completedInput && !isPossiblePhoneNumber(value) ? 'true' : null}
			minLength={5}
			style={{ flex: 1 }}
			disabled={typeof disabled === 'undefined' ? false : disabled}
		/>
	);
};

export default PhoneNumber;
