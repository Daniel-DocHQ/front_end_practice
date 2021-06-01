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
import { get } from 'lodash';
import { useDebounce } from 'react-use';
import moment from 'moment';
import { Alert } from '@material-ui/lab';
import { ToastsStore } from 'react-toasts';
import React, { useEffect, useState, useContext } from 'react';
import existsInArray from '../../helpers/existsInArray';
import DocButton from '../DocButton/DocButton';
import MaterialCheckbox from '../FormComponents/MaterialCheckbox/MaterialCheckbox';
import EmailInputElement from '../FormComponents/EmailInput';
import TextInputElement from '../FormComponents/TextInputElement';
import bookingService from '../../services/bookingService';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const CertificatesAaron = ({
	img,
	patient_data,
	appointmentId,
	submitCallback = null,
	kitProvider: preselectedKidProvider,
}) => {
	const { user, token } = useContext(AuthContext);
	const [populated, setPopulated] = useState(false);
	const [patientId, setPatientId] = useState();
	const [doneBy8x8, setDoneBy8x8] = useState(submitCallback === null ? false : true);
	// Form fields
	const [forename, setForename] = useState('');
	const [surname, setSurname] = useState('');
	const [email, setEmail] = useState('');
	const [dob, setDob] = useState('');
	const [sex, setSex] = useState('');
	const [reject_notes, setReject_notes] = useState('');
	const [security_checked, setSecurity_checked] = useState(false);
	const [kitProvider, setKitProvider] = useState(preselectedKidProvider);
	const [result, setResult] = useState('');
	const [reasonForRejected, setReasonForRejected] = useState('');
	const [passportId, setPassportId] = useState('');
	// Error handling
	const [attemptedSubmit, setAttemptedSubmit] = useState(false);
	const [errors, setErrors] = useState([]);
	const [status, setStatus] = useState(); // { severity, message }
	const [isLoading, setIsLoading] = useState(false);

	const [canCreateCertificate, setCanCreateCertificate] = useState(true);
	const isResultRejected = result === 'Rejected';
	const isOtherOption = reasonForRejected === 'Other';

	function isValid(obj) {
		return (
			!!obj &&
			!!obj.forename &&
			!!obj.surname &&
			!!obj.email &&
			!!obj.date_of_birth &&
			!!obj.sex &&
			!!obj.security_checked &&
			!!obj.result &&
			!!obj.passport_number &&
			!!obj.kit_provider &&
			(isResultRejected ? !!obj.reject_notes : (doneBy8x8 ? doneBy8x8 : !!img))
		);
	}

	useEffect(() => {
		// runs on init
		if (!!patient_data) {
			populate();
			setPopulated(true);
		}
	}, []);

	useEffect(() => {
		if (preselectedKidProvider) {
			setKitProvider(preselectedKidProvider);
		}
	}, [preselectedKidProvider])
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
		const firstName = get(patient_data, 'metadata.forename', '') || patient_data.first_name;
		const lastName = get(patient_data, 'metadata.surname', '') || patient_data.last_name;
		const result = get(patient_data, 'metadata.result', '');
		const kitProvider = get(patient_data, 'metadata.kit_provider', '') || preselectedKidProvider;
		const email = get(patient_data, 'metadata.email', '') || patient_data.email;
		const sex = get(patient_data, 'metadata.sex', '') || patient_data.sex;
		const dob = get(patient_data, 'metadata.date_of_birth', '') || patient_data.date_of_birth;
		const securityChecked = get(patient_data, 'metadata.security_checked', false);
		const passportNumber = get(patient_data, 'metadata.passport_number', '') || get(patient_data, 'metadata.passportId', '');
		console.log(result, patient_data);
		if (patient_data.id) {
			setPatientId(patient_data.id)
		}
		if (firstName) {
			setForename(firstName);
		}
		if (securityChecked) {
			setSecurity_checked(securityChecked);
		}
		if (lastName) {
			setSurname(lastName);
		}
		if (!!kitProvider) {
			setKitProvider(kitProvider);
		}
		if (!!result) {
			setResult(result);
		}
		if (email) {
			setEmail(email);
		}
		if (sex) {
			setSex(sex.toLowerCase());
		}
		if (passportNumber) {
			setPassportId(passportNumber)
		}
		if (dob) {
			setDob(moment(dob).format('DD/MM/YYYY'));
		}
	}
	// used as the form submit function, super lazy but works a charm
	function proceed() {
		const body = {
			forename,
			surname,
			email,
			date_of_birth: moment.utc(dob, "DD/MM/YYYY").format(),
			sex,
			security_checked,
			result,
			passport_number: passportId,
			kit_provider: kitProvider,
			reject_notes: '',
			...(isResultRejected && { reject_notes: isOtherOption ? reject_notes : reasonForRejected }),
		};
		if (canCreateCertificate && isValid(body) && errors.length === 0) {
			sendResult(body);
		} else {
			setAttemptedSubmit(true);
		}
	}
	const updatePatientInfo = (body) => bookingService.sendResult(token, appointmentId, body, patientId);

	function sendResult(formData) {
		const body = formData;
		if (submitCallback === null) {
			body.medicalprofessional = (!!user && !!user.first_name && !!user.last_name) ? `${user.first_name} ${user.last_name}` : '';
			body.date_sampled = moment().subtract(20, "minutes").format();
			body.date_reported = moment().format();
			body.security_checked = 'true';
		}

		if (isValid(body)) {
			if (kitProvider === 'Roche') {
				body.specificity = '96.52%';
				body.sensitivity = '99.68%';
			} else {
				body.specificity = '99.6%';
				body.sensitivity = '97.1%';
			}
			setIsLoading(true);
			bookingService
				.sendResult(token, appointmentId, body, patientId)
				.then(result => {
					if (result.success) {
						setStatus({ severity: 'success', message: 'Certificate successfully generated .' });
						setIsLoading(false);
						setCanCreateCertificate(false);
						if (submitCallback) submitCallback();
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

	useDebounce(() => {
		if (!status && populated) {
			const body = {
				forename,
				surname,
				email,
				date_of_birth: moment.utc(dob, "DD/MM/YYYY").format(),
				sex,
				security_checked,
				result: '',
				passport_number: passportId,
				kit_provider: kitProvider,
			};
			updatePatientInfo(body);
		}
	}, 300, [forename, surname, email, dob, sex, security_checked, kitProvider, passportId]);

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
				{((attemptedSubmit && typeof dob === 'undefined') || errors.includes('date of birth (dd/mm/yyyy)')) && (
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
							<FormControlLabel value='female' control={<Radio />} label='Female' />
							<FormControlLabel value='male' control={<Radio />} label='Male' />
							<FormControlLabel value='other' control={<Radio />} label='Other' />
						</RadioGroup>
					</FormControl>
				</div>
				{attemptedSubmit && typeof sex === 'undefined' && (
					<div className='row no-margin'>
						<p className='error'>Please select a sex</p>
					</div>
				)}
				<div className='row'>
					<TextInputElement
						value={passportId}
						id='passport-number'
						label='ID document number'
						onChange={setPassportId}
						disabled
						inputProps={{ minLength: '5' }}
						required
						updateStatus={updateErrors}
					/>
				</div>
				{attemptedSubmit && errors.includes('passport number') && (
					<div className='row no-margin'>
						<p className='error'>Enter patient passport number</p>
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
						<InputLabel id='kid-provider-label'>Kit Provider</InputLabel>
						<Select
							labelId='kid-provider-label'
							id='kid-provider'
							onChange={e => setKitProvider(e.target.value)}
							value={kitProvider}
							required
						>
							<MenuItem value='Roche'>Roche Test Kit</MenuItem>
							<MenuItem value='Flowflex'>Flowflex Kit</MenuItem>
						</Select>
					</FormControl>
				</div>
				<div className='row'>
					<FormControl variant='filled' style={{ width: '100%' }}>
						<InputLabel id='test-result-label'>Test Result</InputLabel>
						<Select
							labelId='test-result-label'
							id='test-result'
							label='Test Result'
							disabled={!!submitCallback}
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
				{attemptedSubmit && result === '' && (
					<div className='row no-margin'>
						<p className='error'>You must enter a result</p>
					</div>
				)}
				{isResultRejected ? (
					<React.Fragment>
						<div className='row'>
							<FormControl variant='filled' style={{ width: '100%' }}>
								<InputLabel id='test-result-label'>Reason for Rejected</InputLabel>
								<Select
									labelId='test-result-label'
									id='test-result'
									label='Reason for Rejected'
									onChange={e => setReasonForRejected(e.target.value)}
									value={reasonForRejected}
									required
									updateStatus={updateErrors}
								>
									<MenuItem value='Client not there'>Client not there</MenuItem>
									<MenuItem value='Test not performed as instructed'>Test not performed as instructed</MenuItem>
									<MenuItem value='Other'>Other</MenuItem>
								</Select>
							</FormControl>
						</div>
						{isOtherOption && (
							<>
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
							</>
						)}
					</React.Fragment>
				) : (
					<>
						{!!img ? (
							<div>
								<p>Captured Image:</p>
								<img src={img} style={{ width: 220 }} />
							</div>
						) : (
							<>
								{!doneBy8x8 && (
									<div className='row'>
										<div style={{ padding: 15, borderRadius: '50%', background: '#EFEFF0', marginRight: 15 }}>
											<i className="fas fa-camera" style={{ fontSize: 20 }} />
										</div>
										<h3 className='no-margin'>Test Results</h3>
									</div>
								)}
								{submitCallback === null && (
									<div className='row'>
										<MaterialCheckbox
											value={doneBy8x8}
											onChange={setDoneBy8x8}
											labelComponent='Done by Alternative Video platform'
										/>
									</div>
								)}
							</>
						)}
						{(attemptedSubmit && !img && !doneBy8x8) && (
							<div className='row no-margin'>
								<p className='error'>You must enter make a test result photo</p>
							</div>
						)}
					</>
				)}
				{!!status && !!status.severity && !!status.message && !isLoading && (
					<div className='row center'>
						<Alert variant="outlined" severity={status.severity}>{status.message}</Alert>
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
