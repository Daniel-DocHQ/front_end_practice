import {
	FormControl,
	FormControlLabel,
	FormLabel,
	InputLabel,
	Paper,
	Radio,
	RadioGroup,
	Select,
	MenuItem,
} from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useEffect, useState } from 'react';
import existsInArray from '../../helpers/existsInArray';
import DocButton from '../DocButton/DocButton';
import MaterialCheckbox from '../FormComponents/MaterialCheckbox/MaterialCheckbox';
import EmailInputElement from '../FormComponents/EmailInput';
import TextInputElement from '../FormComponents/TextInputElement';
import DateFnsUtils from '@date-io/date-fns';

const CertificatesAaron = ({ patient_data, submit, i, statusMessage }) => {
	// Form fields
	const [forename, setForename] = useState('');
	const [surname, setSurname] = useState('');
	const [email, setEmail] = useState('');
	const [dob, setDob] = useState('');
	const [sex, setSex] = useState();
	const [security_checked, setSecurity_checked] = useState(false);
	const [security_document, setSecurity_document] = useState('');
	const [result, setResult] = useState('');
	const [passport_number, setPassportNumber] = useState('');
	// Error handling
	const [attemptedSubmit, setAttemptedSubmit] = useState(false);
	const [errors, setErrors] = useState([]);
	useEffect(() => {
		// runs on init
		if (typeof patient_data !== 'undefined' && patient_data !== null) {
			populate();
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
	// populate with patient_date provided
	function populate() {
		if (patient_data.first_name) {
			setForename(patient_data.first_name);
		}
		if (patient_data.last_name) {
			setSurname(patient_data.last_name);
		}
		if (patient_data.email) {
			setEmail(patient_data.email);
		}
		if (patient_data.sex) {
			setSex(patient_data.sex);
		}
		if (patient_data.date_of_birth) {
			setDob(patient_data.date_of_birth);
		} else if (patient_data.dateOfBirth) {
			setDob(patient_data.dateOfBirth);
		} else if (patient_data.dob) {
			setDob(patient_data.dob);
		}
	}
	// used as the form submit function, super lazy but works a charm
	function proceed() {
		if (errors.length === 0) {
			submit(
				{
					forename,
					surname,
					email,
					dob,
					sex,
					security_checked,
					security_document,
					result,
					passport_number,
				},
				i
			);
		} else {
			setAttemptedSubmit(true);
		}
	}
	return (
		<React.Fragment>
			<Paper style={{ padding: '20px', width: '350px' }}>
				<div className='row space-between'>
					<h3 className='no-margin'>Certificate Form</h3>
				</div>
				{typeof patient_data !== 'undefined' && (
					<div className='row flex-end'>
						<DocButton text='Autofill with Patient data' color='green' onClick={populate} />
					</div>
				)}
				<div className='row'>
					<TextInputElement
						value={forename}
						id='first-name'
						label='First Name'
						onChange={setForename}
						pattern={new RegExp(/^[a-zA-Z ]+$/)}
						inputProps={{ minLength: '2' }}
						required={true}
						updateStatus={updateErrors}
					/>
				</div>
				{attemptedSubmit && errors.includes('first name') && (
					<div className='row no-margin'>
						<p className='error'>Enter patient first name</p>
					</div>
				)}
				<div className='row'>
					<TextInputElement
						value={surname}
						id='last-name'
						label='Last Name'
						onChange={setSurname}
						pattern={new RegExp(/^[a-zA-Z ]+$/)}
						inputProps={{ minLength: '2' }}
						required={true}
						updateStatus={updateErrors}
					/>
				</div>
				{attemptedSubmit && errors.includes('last name') && (
					<div className='row no-margin'>
						<p className='error'>Enter patient last name</p>
					</div>
				)}
				<div className='row'>
					<EmailInputElement value={email} onChange={setEmail} updateStatus={updateErrors} />
				</div>
				{attemptedSubmit && errors.includes('email') && (
					<div className='row no-margin'>
						<p className='error'>Please enter patient email address</p>
					</div>
				)}
				<div className='row'>
					<TextInputElement
						value={dob}
						id='date-of-birth'
						label='Date of Birth (dd/mm/yyyy)'
						onChange={setDob}
						pattern={new RegExp(/^[0-3][1-9]\/[0-1][0-9]\/[0-9][0-9][0-9][0-9]$/)}
						inputProps={{ minLength: '2' }}
						required={true}
						updateStatus={updateErrors}
					/>
				</div>
				{attemptedSubmit && typeof dob === 'undefined' && (
					<div className='row no-margin'>
						<p className='error'>Please enter patient date of birth - dd/mm/yyyy</p>
					</div>
				)}
				<div className='row'>
					<FormControl component='fieldset'>
						<FormLabel component='legend'>Sex *</FormLabel>
						<RadioGroup
							style={{ display: 'inline' }}
							aria-label='sex'
							name='sex'
							value={sex}
							onChange={e => setSex(e.target.value)}
						>
							<FormControlLabel value='Female' control={<Radio />} label='Female' />
							<FormControlLabel value='Male' control={<Radio />} label='Male' />
							<FormControlLabel value='Other' control={<Radio />} label='Other' />
						</RadioGroup>
					</FormControl>
				</div>
				{attemptedSubmit && typeof sex === 'undefined' && (
					<div className='row no-margin'>
						<p className='error'>Please select a sex</p>
					</div>
				)}
				<div className='row'>
					<MaterialCheckbox
						value={security_checked}
						onChange={setSecurity_checked}
						labelComponent='Security check completed'
					/>
				</div>
				{attemptedSubmit && !security_checked && (
					<div className='row no-margin'>
						<p className='error'>You must confirm security has been checked</p>
					</div>
				)}
				<div className='row'>
					<FormControl variant='filled' style={{ width: '100%' }}>
						<InputLabel id='security-document-label'>Security Document</InputLabel>
						<Select
							labelId='security-document-label'
							id='security-document'
							onChange={e => setSecurity_document(e.target.value)}
							value={security_document}
							required={true}
							updateStatus={updateErrors}
						>
							<MenuItem value='Passport'>Passport</MenuItem>
							<MenuItem value='Driving Licence'>Driving Licence</MenuItem>
							<MenuItem value='National Identification'>National Identification</MenuItem>
						</Select>
					</FormControl>
				</div>
				{attemptedSubmit && typeof security_document !== 'undefined' && (
					<div className='row no-margin'>
						<p className='error'>You must confirm enter a security document</p>
					</div>
				)}
				<div className='row'>
					<FormControl variant='filled' style={{ width: '100%' }}>
						<InputLabel id='test-result-label'>Test Result</InputLabel>
						<Select
							labelId='test-result-label'
							id='test-result'
							onChange={e => setResult(e.target.value)}
							value={result}
							required={true}
							updateStatus={updateErrors}
						>
							<MenuItem value='Positive'>Positive</MenuItem>
							<MenuItem value='Negative'>Negative</MenuItem>
							<MenuItem value='Invalid'>Invalid</MenuItem>
						</Select>
					</FormControl>
				</div>
				{attemptedSubmit && errors.includes('test result') && (
					<div className='row no-margin'>
						<p className='error'>You must enter a result</p>
					</div>
				)}
				<div className='row'>
					<TextInputElement
						value={passport_number}
						id='passport-number'
						label='Passport number'
						onChange={setPassportNumber}
						inputProps={{ minLength: '5' }}
						required={true}
						updateStatus={updateErrors}
					/>
				</div>
				{attemptedSubmit && errors.includes('passport number') && (
					<div className='row no-margin'>
						<p className='error'>Enter patient passport number</p>
					</div>
				)}
				{statusMessage !== 'pending' && (
					<div className='row center'>
						{statusMessage === 'success' ? (
							<p style={{ border: '2px solid var(--doc-green)' }}>
								Successfully generated certificate
							</p>
						) : (
							<p className='error'>Failed to generate certificate</p>
						)}
					</div>
				)}
				<div className='row flex-end'>
					<DocButton
						text='Submit'
						color='green'
						onClick={proceed}
						disabled={statusMessage === 'success'}
					/>
				</div>
			</Paper>
		</React.Fragment>
	);
};

export default CertificatesAaron;
