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
import React, { useEffect, useState } from 'react';
import existsInArray from '../../helpers/existsInArray';
import DocButton from '../DocButton/DocButton';
import MaterialCheckbox from '../FormComponents/MaterialCheckbox/MaterialCheckbox';
import EmailInputElement from '../FormComponents/EmailInput';
import TextInputElement from '../FormComponents/TextInputElement';
import bookingService from '../../services/bookingService';
import { formatCertificateDate } from '../../helpers/formatDate';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { ToastsStore } from 'react-toasts';
import { Alert } from '@material-ui/lab';
import { useAppointmentId } from '../../context/AppointmentContext';

const CertificatesAaron = ({ patient_data, kitProvider: preselectedKidProvider }) => {
	const { user, token } = useContext(AuthContext);
	const appointmentId = useAppointmentId();
	const [populated, setPopulated] = useState(false);
	// Form fields
	const [forename, setForename] = useState('');
	const [surname, setSurname] = useState('');
	const [email, setEmail] = useState('');
	const [dob, setDob] = useState('');
	const [sex, setSex] = useState('');
	const [reject_notes, setReject_notes] = useState('');
	const [security_checked, setSecurity_checked] = useState(false);
	const [security_document, setSecurity_document] = useState('');
	const [kitProvider, setKitProvider] = useState('');
	const [result, setResult] = useState('');
	const [passport_number, setPassportNumber] = useState('');
	// Error handling
	const [attemptedSubmit, setAttemptedSubmit] = useState(false);
	const [errors, setErrors] = useState([]);
	const [status, setStatus] = useState(); // { severity, message }
	const [isLoading, setIsLoading] = useState(false);

	const [canCreateCertificate, setCanCreateCertificate] = useState(true);
	const isResultRejected = result === 'Rejected';

	function isValid(obj) {
		return (
			!!obj &&
			!!obj.forename &&
			!!obj.surname &&
			!!obj.email &&
			!!obj.dob &&
			!!obj.sex &&
			!!obj.security_checked &&
			!!obj.security_document &&
			!!obj.result &&
			!!obj.medicalprofessional &&
			!!obj.passport_number &&
			!!obj.kitProvider &&
			(isResultRejected ? !!obj.reject_notes : true)
		);
	}

	useEffect(() => {
		// runs on init
		if (!!patient_data) {
			populate();
			setPopulated(true);
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
		if (!!preselectedKidProvider) {
			setKitProvider(preselectedKidProvider);
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
		if (
			canCreateCertificate &&
			(errors.length === 0 || (errors.length === 1 && errors.includes('security-document')))
		) {
			sendResult({
				forename,
				surname,
				email,
				dob,
				sex,
				security_checked,
				security_document,
				result,
				passport_number,
				kitProvider,
				...(isResultRejected && { reject_notes }),
			});
		} else {
			setAttemptedSubmit(true);
		}
	}
	function sendResult(formData) {
		const body = formData;
		body.medicalprofessional = (!!user && !!user.first_name && !!user.last_name) ? `${user.first_name} ${user.last_name}` : '';

		let currentDate = new Date();
		const minus15mins = date => {
			const d = new Date(date);
			const newDate = new Date(d.getTime() - 60 * 15 * 1000);
			return newDate;
		};

		body.date_sampled = formatCertificateDate(minus15mins(currentDate));
		body.date_reported = formatCertificateDate(currentDate);
		body.security_checked = 'true';

		if (isValid(body)) {
			if (kitProvider === 'Roche Test Kit') {
				body.specificity = '96.52%';
				body.sensitivity = '99.68%';
			}
			setIsLoading(true);
			bookingService
				.sendResult(token, appointmentId, body)
				.then(result => {
					if (result.success) {
						ToastsStore.success('Generated certificate');
						setStatus({ severity: 'success', message: 'Successfully generated certificate.' });
						setIsLoading(false);
						setCanCreateCertificate(false);
					} else {
						ToastsStore.error('Failed to generate certificate');
						setStatus({
							severity: 'error',
							message: 'Failed to generate certificate, please try again.',
						});
						setIsLoading(false);
					}
				})
				.catch(() => {
					ToastsStore.error('Failed to generate certificate');
					setStatus({
						severity: 'error',
						message: 'Failed to generate certificate, please try again.',
					});
					setIsLoading(false);
				});
		}
	}
	return ((!!patient_data && populated) || (!patient_data && !populated)) &&  (
		<React.Fragment>
			<Paper style={{ padding: '20px', width: '350px', marginTop: '10px' }}>
				<div className='row space-between'>
					<h3 className='no-margin'>Certificate Form</h3>
				</div>
				{/* {typeof patient_data !== 'undefined' && (
					<div className='row flex-end'>
						<DocButton text='Autofill with Patient data' color='green' onClick={populate} />
					</div>
				)} */}
				<div className='row'>
					<TextInputElement
						value={forename}
						id='first-name'
						label='First Name'
						onChange={setForename}
						pattern={new RegExp(/^[a-zA-Z ]+$/)}
						inputProps={{ minLength: '2' }}
						required
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
						required
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
						required
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
						labelComponent='ID document checked'
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
							required
							updateStatus={updateErrors}
						>
							<MenuItem value='Passport'>Passport</MenuItem>
							<MenuItem value='Driving Licence'>Driving Licence</MenuItem>
							<MenuItem value='National Identification'>National Identification</MenuItem>
						</Select>
					</FormControl>
				</div>
				{attemptedSubmit && security_document === '' && (
					<div className='row no-margin'>
						<p className='error'>You must confirm enter a security document</p>
					</div>
				)}
				<div className='row'>
					<TextInputElement
						value={passport_number}
						id='passport-number'
						label='Passport number'
						onChange={setPassportNumber}
						inputProps={{ minLength: '5' }}
						required={false}
						updateStatus={updateErrors}
					/>
				</div>
				{attemptedSubmit && errors.includes('passport number') && (
					<div className='row no-margin'>
						<p className='error'>Enter patient passport number</p>
					</div>
				)}
				<div className='row'>
					<FormControl variant='filled' style={{ width: '100%' }}>
						<InputLabel id='kid-provider-label'>Kit Provider</InputLabel>
						<Select
							labelId='kid-provider-label'
							id='kid-provider'
							onChange={e => setKitProvider(e.target.value)}
							value={kitProvider}
							required
						>
							<MenuItem value='Roche Test Kit'>Roche Test Kit</MenuItem>
						</Select>
					</FormControl>
				</div>
				<div className='row'>
					<FormControl variant='filled' style={{ width: '100%' }}>
						<InputLabel id='test-result-label'>Test Result</InputLabel>
						<Select
							labelId='test-result-label'
							id='test-result'
							onChange={e => setResult(e.target.value)}
							value={result}
							required
							updateStatus={updateErrors}
						>
							<MenuItem value='Positive'>Positive</MenuItem>
							<MenuItem value='Negative'>Negative</MenuItem>
							<MenuItem value='Invalid'>Invalid</MenuItem>
							<MenuItem value='Rejected'>Reject</MenuItem>
						</Select>
					</FormControl>
				</div>
				{attemptedSubmit && errors.includes('test result') && (
					<div className='row no-margin'>
						<p className='error'>You must enter a result</p>
					</div>
				)}
				{isResultRejected && (
					<React.Fragment>
						<div className='row space-between'>
							<FormLabel component='legend'>Rejection Notes *</FormLabel>
						</div>
						<TextInputElement
							rows={4}
							required
							multiline
							id='reject-notes'
							value={reject_notes}
							onChange={setReject_notes}
							placeholder='Add Reason for Rejection. This notes will be sent to the client'
						/>
					</React.Fragment>
				)}
				{!!status && !!status.severity && !!status.message && !isLoading && (
					<div className='row center'>
						<Alert severity={status.severity}>{status.message}</Alert>
					</div>
				)}
				{isLoading && (
					<div className='row center'>
						<LoadingSpinner />
					</div>
				)}
				{!!status && !!status.severity && status.severity === 'success' ? (
					canCreateCertificate ? (
						<div className='row flex-end'>
							<DocButton text='Submit' color='green' onClick={proceed} />
						</div>
					) : (
						<div className='row flex-end'>
							<DocButton
								text='Reissue Certificate'
								color='pink'
								flat
								onClick={() => {
									setCanCreateCertificate(true);
									setStatus();
								}}
								style={{ textDecoration: 'underline', textDecorationColor: 'var(--doc-pink)' }}
							/>
						</div>
					)
				) : (
					<div className='row flex-end'>
						<DocButton text='Submit' color='green' onClick={proceed} />
					</div>
				)}
			</Paper>
		</React.Fragment>
	);
};

export default CertificatesAaron;
