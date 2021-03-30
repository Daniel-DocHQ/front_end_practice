import React, { useRef, useEffect, useState, useCallback, useContext } from 'react';
import AppointmentContextProvider, {
	AppointmentContext,
	useAppointmentDetails,
	useBookingUsers,
	useBookingUser,
} from '../../context/AppointmentContext';
import {
	Grid,
	MenuItem,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	InputLabel,
	Select,
	Typography,
	Tooltip,
	Divider,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { format, differenceInMinutes } from 'date-fns';
import { ToastsStore } from 'react-toasts';
import { useToken } from '../../context/AuthContext';
import '../../assets/css/NurseMeeting.scss';
import Box from '../../components/TwilioVideo/Box';
import MaterialCheckbox from '../../components/FormComponents/MaterialCheckbox/MaterialCheckbox';
import CertificatesAaron from '../../components/Certificates/CertificatesAaron';
import DocButton from '../../components/DocButton/DocButton';
import TextInputElement from '../../components/FormComponents/TextInputElement';
import bookingService from '../../services/bookingService';
import getValueFromObject from '../../helpers/getValueFromObject';
import { AuthContext } from '../../context/AuthContext';

const TEST_TYPES = {
	pcr: 'PCR',
	antigen: 'Antigen',
};

const NurseMeeting2 = ({
	isVideo,
	appointmentId,
	hideVideoAppointment,
}) => {
	const token = useToken();
	const [videoCallToken, setVideoCallToken] = useState();
	const [kitProvider, setKitProvider] = useState();

	return (
		<AppointmentContextProvider token={token} appointmentId={appointmentId}>
			<div className='row flex-start items-start'>
				{isVideo && (
					<div className='patient-video'>
						<Box
							isNurse
							token={token}
							captureDisabled
							updateImageData={console.log}
							videoCallToken={videoCallToken}
							setVideoCallToken={setVideoCallToken}
							hideVideoAppointment={hideVideoAppointment}
						/>
					</div>
				)}
				<div className={`patient-notes-container ${isVideo ? '' : 'face-to-face'}`}>
					<TabContainer
						kitProvider={kitProvider}
						isJoined={!!videoCallToken}
						setKitProvider={setKitProvider}
					/>
				</div>
			</div>
			<CertificatesContainer kitProvider={kitProvider} />
		</AppointmentContextProvider>
	);
};

export default NurseMeeting2;

const TabContainer = ({
	isJoined,
	kitProvider,
	setKitProvider,
}) => {
	const {
		test_type,
		appointmentId,
	} = useContext(AppointmentContext);
	const [value, setValue] = React.useState(0);
	const patients = useBookingUsers();
	let patient = useBookingUser(0);
	patient = {...patient, ...getValueFromObject(patient, 'metadata', {}), ...getValueFromObject(patient, 'metadata.appointment_address', {})}
	const appointmentDetails = useAppointmentDetails();
	const increaseStep = useCallback(() => {
		setValue((oldValue) => oldValue + 1);
	});
	const isAntigenType = test_type === TEST_TYPES.antigen;

	useEffect(() => {
		if (isJoined && value === 0 && test_type === TEST_TYPES.pcr) {
			increaseStep();
		}
	}, [isJoined]);

	return (
		isAntigenType ? (
			<div className='tab-container' style={{ minHeight: 'unset' }}>
				{value === 0 && (
					<AddressVerification
						isAntigenType
						patient={patient}
						patients={patients}
						isJoined={isJoined}
						appointmentId={appointmentId}
						updateParent={increaseStep}
					/>
				)}
				{value === 1 && (
					<AppointmentActions
						patient={patient}
						patients={patients}
						appointmentId={appointmentId}
						kitProvider={kitProvider}
						setKitProvider={setKitProvider}
					/>
				)}
			</div>
		) : (
			<React.Fragment>
				{value === 0 && (
					<VideoAppointmentDetails
						patient={patient}
						appointmentDetails={appointmentDetails}
						updateParent={increaseStep}
					/>
				)}
				{value === 1 && (
					<AddressVerification
						isJoined
						patient={patient}
						appointmentId={appointmentId}
						updateParent={increaseStep}
					/>
				)}
				{value === 2 && (
					<PatientIdVerification
						patient={patient}
						appointmentId={appointmentId}
						updateParent={increaseStep}
					/>
				)}
				{value === 3 && (
					<SubmitPatientResult
						patient={patient}
						appointmentId={appointmentId}
					/>
				)}
			</React.Fragment>
		)
	);
};

const PatientDetails = ({
    title,
    patient,
    fullData,
	isAntigenType,
    patients = [],
    appointmentId,
	addressBlockTitle,
	isSpaceBetweenPhoneBox,
}) => {
	const linkRef = useRef(null);
	const isManyPatients = patients.length > 1 || isAntigenType;

	const addressDataBlock = () => (
		<React.Fragment>
			{!!addressBlockTitle && (
				<div className='row no-margin' style={{ paddingBottom: 10 }}>
					<h3 className='no-margin'>Address Verification</h3>
				</div>
			)}
			{!!patient.street_address && fullData && (
				<div className='row space-between no-margin'>
					<p className='tab-row-text title-info'>Address Line 1:</p>
					<p className='tab-row-text'>{patient.street_address}</p>
				</div>
			)}
			{!!patient.extended_address && fullData && (
				<div className='row space-between no-margin'>
					<p className='tab-row-text title-info'>Address Line 2:</p>
					<p className='tab-row-text'>{patient.extended_address}</p>
				</div>
			)}
			{!!patient.region && fullData && (
				<div className='row space-between no-margin'>
					<p className='tab-row-text title-info'>Town:</p>
					<p className='tab-row-text'>{patient.region}</p>
				</div>
			)}
			{!!patient.country && fullData && (
				<div className='row space-between no-margin'>
					<p className='tab-row-text title-info'>Country:</p>
					<p className='tab-row-text'>{patient.country}</p>
				</div>
			)}
			{!!patient.postal_code && fullData && (
				<div className='row space-between no-margin'>
					<p className='tab-row-text title-info'>Post Code:</p>
					<p className='tab-row-text'>{patient.postal_code}</p>
				</div>
			)}
		</React.Fragment>
	);

	return (
		<React.Fragment>
			<div className='row no-margin' style={{ paddingBottom: 10 }}>
				<h3 className='no-margin'>{title}</h3>
			</div>
			<div className='column'>
				{isManyPatients ? (
					patients.map((item, indx) => (
						!!item.last_name && !!item.first_name && (
							<div key={indx} className='row space-between no-margin'>
								<p className='tab-row-text title-info'>Full Name Client {indx + 1}:</p>
								<p className='tab-row-text'>{item.first_name} {item.last_name}</p>
							</div>
						)
					))
				) : (
					!!patient.first_name && !!patient.last_name && (
						<div className='row space-between no-margin'>
							<p className='tab-row-text title-info'>Full Name:</p>
							<p className='tab-row-text'>{patient.first_name} {patient.last_name}</p>
						</div>
					)
				)}
				{!!patient.dob && !fullData && (
					<div className='row space-between no-margin'>
						<p className='tab-row-text title-info'>DOB:</p>
						<p className='tab-row-text'>{format(new Date(patient.dob), 'dd-MM-yyyy')}</p>
					</div>
				)}
				{!isManyPatients && (
					addressDataBlock()
				)}
				<div className={isSpaceBetweenPhoneBox && 'padding-top-box'}>
					{isManyPatients ? (
						patients.map((item, indx) => (
							!!item.phone && (
								<div key={indx} className='row space-between no-margin'>
									<p className='tab-row-text title-info'>Phone No Client {indx + 1}:</p>
									<p className='tab-row-text'>{item.phone}</p>
								</div>
							)
						))
					) : (
						!!patient.phone && (
							<div className='row space-between no-margin'>
								<p className='tab-row-text title-info'>Phone No:</p>
								<p className='tab-row-text'>{patient.phone}</p>
							</div>
						)
					)}
					<div className='row space-between no-margin' style={{ padding: '20px 0' }}>
						<p className='tab-row-text title-info'>
							Patient Joining link:
						</p>
						<Tooltip title="Click to copy">
							<Typography
								noWrap
								ref={linkRef}
								onClick={() => copyToClipboard(linkRef)}
								className='tab-row-text patient-link-text'
							>
								https://myhealth.dochq.co.uk/appointment?appointmentId={appointmentId}
							</Typography>
						</Tooltip>
					</div>
				</div>
				{isManyPatients && (
					<React.Fragment>
						{!!addressBlockTitle && <Divider />}
						<div className={isSpaceBetweenPhoneBox && 'padding-top-box'}>
							{addressDataBlock()}
						</div>
					</React.Fragment>
				)}
			</div>
		</React.Fragment>
	);
};

const SubmitPatientResult = ({
	patient,
	appointmentId,
}) => {
	const {
		updateNotes,
	} = useContext(AppointmentContext);
	const { token } = useContext(AuthContext);
	const [showAppointmentNotes, setShowAppointmentNotes] = useState(false);
	const [kitIdModifyMode, setKitIdModifyMode] = useState(false);
	const [kitIdSubmitted, setKitIdSubmitted] = useState(false);
	const [sampleTakenStatus, setSampleTakenStatus] = useState();
	const [notesStatus, setNotesStatus] = useState();
	// Fields
	const [notes, setNotes] = useState();
	const [sampleTaken, setSampleTaken] = useState();
	const [kitId, setKitId] = useState();
	const [appointmentNotes, setAppointmentNotes] = useState();

	const isSampleTakenInvalid = sampleTaken === 'invalid';
	const isSampleTakenRejected = sampleTaken === 'rejected';
	const isSampleTakenValid = !isSampleTakenInvalid && !isSampleTakenRejected;
	const isSampleTakenNotValid = isSampleTakenInvalid || isSampleTakenRejected;

	function updateKitId() {
		if (kitId) {
			sendResult({
				kitId,
				result: '',
			});
			setKitIdSubmitted(true);
			setKitIdModifyMode(true);
		}
	}

	function sendSampleTaken() {
		if (sampleTaken) {
			sendResult({
				result: '',
				...((isSampleTakenInvalid) && {
					invalid_notes: notes,
				}),
				...(isSampleTakenRejected && {
					reject_notes: notes,
				}),
				sampleTaken,
			}, true);
		}
	}

    function sendResult(formData, isSampleTaken) {
		const body = formData;
		bookingService
			.sendResult(token, appointmentId, body)
			.then(result => {
				if (isSampleTaken) {
					if (result.success) {
						setSampleTakenStatus({ severity: 'success', message: 'Result sent successfully' });
					} else {
						setSampleTakenStatus({
							severity: 'error',
							message: 'Failed to generate certificate, please try again.',
						});
						ToastsStore.error('Failed');
					}
				}
			})
			.catch(() => {
				console.log('error')
			});
	}

	return (
		<div className='tab-container'>
			<div className='tab-content'>
				<Grid container direction='column'>
					<Grid item>
						<PatientDetails
							title='Patient Details'
							patient={patient}
							appointmentId={appointmentId}
						/>
					</Grid>
					<Grid item className='padding-top-box'>
						<div className='row space-between'>
							<h3 className='no-margin'>Enter Kit ID</h3>
						</div>
						<div className='row'>
							<TextInputElement
								id='kit-id'
								value={kitId}
								placeholder='Eg: 20P456632'
								onChange={setKitId}
								disabled={kitIdModifyMode}
								required
							/>
						</div>
						<div className='row flex-end'>
							<DocButton
								text={kitIdModifyMode ? 'Modify' : 'Submit'}
								color={kitId ? 'green' : 'disabled'}
								disabled={!kitId}
								onClick={() => {
									if (kitIdModifyMode) {
										setKitIdModifyMode(false);
									} else {
										updateKitId();
									}
								}}
							/>
						</div>
					</Grid>
					{kitIdSubmitted && (
						<Grid item>
							<div className='row space-between'>
								<h3 className='no-margin'>Sample Taken</h3>
							</div>
							<div style={{ paddingLeft: 10 }}>
								<FormControl component='fieldset'>
									<RadioGroup
										aria-label='sample-taken'
										name='sample-taken'
										value={sampleTaken}
										style={{ display: 'inline' }}
										onChange={e => setSampleTaken(e.target.value)}
									>
										<FormControlLabel value='valid' control={<Radio />} label='Valid' />
										<FormControlLabel value='invalid' control={<Radio />} label='Invalid' />
										<FormControlLabel value='rejected' control={<Radio />} label='Rejected' />
									</RadioGroup>
								</FormControl>
							</div>
							{isSampleTakenValid && (
								<div className='row flex-end'>
									<DocButton
										text='Submit'
										disabled={!sampleTaken}
										onClick={sendSampleTaken}
										color={!!sampleTaken ? 'green' : 'disabled'}
									/>
								</div>
							)}
							{isSampleTakenNotValid && (
								<React.Fragment>
									<div className='row space-between'>
										<h3 className='no-margin'>
											{isSampleTakenRejected ? 'Rejection Notes' : 'Invalidation Notes'}
										</h3>
									</div>
									<TextInputElement
										rows={4}
										multiline
										id='notes'
										value={notes}
										onChange={setNotes}
										required={isSampleTakenNotValid}
										placeholder={`Add Reason for ${isSampleTakenRejected ? 'Rejection' : 'Invalidation'}\nThis notes will be sent to the client`}
									/>
									<div className='row flex-end'>
										<DocButton
											text='Submit'
											disabled={isSampleTakenNotValid ? !notes : false}
											color={isSampleTakenNotValid && !notes ? 'disabled' : 'green'}
											onClick={sendSampleTaken}
										/>
									</div>
								</React.Fragment>
							)}
							{!!sampleTakenStatus && !!sampleTakenStatus.severity && !!sampleTakenStatus.message && (
								<div className='row center'>
									<Alert
										variant="outlined"
										severity={sampleTakenStatus.severity}
									>
									 	{sampleTakenStatus.message}
									</Alert>
								</div>
							)}
							<div className='row space-between'>
								<h3 className='no-margin'>{isSampleTakenNotValid ? 'Appointment Notes' : 'Notes'}</h3>
								{!showAppointmentNotes && (
									<DocButton
										color='green'
										text='Add'
										onClick={() => setShowAppointmentNotes(true)}
									/>
								)}
							</div>
							{showAppointmentNotes && (
								<React.Fragment>
									<TextInputElement
										rows={4}
										multiline
										id='appointment-notes'
										value={appointmentNotes}
										onChange={setAppointmentNotes}
									/>
									<div className='row flex-end'>
										<DocButton
											color='green'
											text='Submit'
											onClick={() => {
												updateNotes(appointmentNotes);
												setNotesStatus({ severity: 'success', message: 'Notes updated successfully' });
											}}
										/>
									</div>
								</React.Fragment>
							)}
							{!!notesStatus && !!notesStatus.severity && !!notesStatus.message && (
								<div className='row center'>
									<Alert
										variant="outlined"
										severity={notesStatus.severity}
									>
										{notesStatus.message}
									</Alert>
								</div>
							)}
						</Grid>
					)}
				</Grid>
			</div>
		</div>
	);
};

const AddressVerification = ({
    patient,
    patients,
	isJoined,
	isAntigenType,
    updateParent,
    appointmentId,
}) => {
	const { token } = useContext(AuthContext);
	const [modifyMode, setModifyMode] = useState(false);
	// Fields
	const [addressLine1, setAddressLine1] = useState('');
	const [addressLine2, setAddressLine2] = useState('');
	const [town, setTown] = useState('');
	const [country, setCountry] = useState('');
	const [postCode, setPostCode] = useState('');

	function isValid() {
		return (
			!!addressLine1 &&
			!!town &&
			!!country &&
			!!postCode
		);
	}

	function proceed() {
		if (isValid()) {
			bookingService
				.sendResult(token, appointmentId, {
					result: '',
					appointment_address: {
						addressLine1,
						addressLine2,
						town,
						country,
						postCode,
					},
				})
				.then(result => {
					if (result.success) {
						updateParent();
					} else {
						ToastsStore.error('Failed');
					}
				})
				.catch(() => {
					ToastsStore.error('Failed');
				});
		}
	}

	return (
		<div className='tab-container'>
			<div className='tab-content'>
				<Grid
					container
					direction='column'
					justify='space-between'
					className='full-height'
				>
					<Grid item>
						<PatientDetails
							fullData
							patient={patient}
							patients={patients}
							isAntigenType={isAntigenType}
							isSpaceBetweenPhoneBox
							addressBlockTitle={isAntigenType && isJoined}
							title={isAntigenType ? ( isJoined ? 'Patient Details' : 'Appointment Details') : 'Address Verification' }
							appointmentId={appointmentId}
						/>
					</Grid>
					{modifyMode && (
						<Grid item>
							<div className='row space-between padding-top-box'>
								<h3 className='no-margin'>New Address</h3>
							</div>
							<div className='row'>
								<TextInputElement
									required
									value={addressLine1}
									id='address-line-1'
									label='Address Line 1'
									onChange={setAddressLine1}
								/>
							</div>
							<div className='row'>
								<TextInputElement
									value={addressLine2}
									id='address-line-2'
									label='Address Line 2'
									onChange={setAddressLine2}
								/>
							</div>
							<div className='row'>
								<TextInputElement
									required
									value={town}
									id='town'
									label='Town'
									onChange={setTown}
								/>
							</div>
							<div className='row'>
								<TextInputElement
									required
									value={country}
									id='country'
									label='Country'
									onChange={setCountry}
								/>
							</div>
							<div className='row'>
								<TextInputElement
									required
									value={postCode}
									id='post-code'
									label='Post Code'
									onChange={setPostCode}
								/>
							</div>
							<div className='row space-between'>
								<DocButton
									color='pink'
									text='Cancel'
									style={{ marginRight: 25 }}
									onClick={() => setModifyMode(false)}
								/>
								<DocButton
									text='Save'
									onClick={proceed}
									disabled={!isValid()}
									color={isValid() ? 'green' : 'disabled'}
								/>
							</div>
						</Grid>
					)}
					{(isJoined && !modifyMode) && (
						<Grid item>
							<div className='row no-margin padding-top-box'>
								<h4>Do you confirm that the patient's current address is the same as the one displayed above?</h4>
							</div>
							<div className='row flex-end'>
								<DocButton
									color='pink'
									text='Modify'
									style={{ marginRight: 25 }}
									onClick={() => setModifyMode(true)}
								/>
								<DocButton text='Confirm' color='green' onClick={updateParent} />
							</div>
						</Grid>
					)}
				</Grid>
			</div>
		</div>
	);
};

const VideoAppointmentDetails = ({
	patient,
	appointmentDetails,
}) => (
	<div className='tab-container'>
		<div className='tab-content'>
			<Grid container direction='column' justify='space-between' className='full-height'>
				<Grid item>
					{!!patient ? (
						<React.Fragment>
							<div className='row space-between'>
								<h3 className='no-margin'>Patient Details</h3>
							</div>
							<div className='column'>
								{!!patient.first_name && !!patient.last_name && (
									<div className='row space-between no-margin'>
										<p className='tab-row-text title-info'>Full Name:</p>
										<p className='tab-row-text'>{patient.first_name} {patient.last_name}</p>
									</div>
								)}
								{!!patient.dob && (
									<div className='row space-between no-margin'>
										<p className='tab-row-text title-info'>DOB:</p>
										<p>{format(new Date(patient.dob), 'dd-MM-yyyy')}</p>
									</div>
								)}
								{!!patient.postal_code && (
									<div className='row space-between no-margin'>
										<p className='tab-row-text title-info'>Post Code:</p>
										<p className='no-margin'>{patient.postal_code}</p>
									</div>
								)}
							</div>
						</React.Fragment>
					) : null}
					{!!appointmentDetails ? (
						<div style={{ paddingTop: 10 }}>
							<div className='row'>
								<h3 className='no-margin'>Appointment Details</h3>
							</div>
							<div className='column'>
								{!!appointmentDetails.start_time && (
									<div className='row space-between no-margin'>
										<p className='no-margin title-info'>Start Time:</p>
										<p className='no-margin'>{format(new Date(appointmentDetails.start_time), 'p')}</p>
									</div>
								)}
								{!!appointmentDetails.start_time && !!appointmentDetails.end_time && (
									<div className='row space-between no-margin'>
										<p className='no-margin title-info'>Duration:</p>
										<p>{differenceInMinutes(new Date(appointmentDetails.end_time), new Date(appointmentDetails.start_time))} mins</p>
									</div>
								)}
							</div>
						</div>
					) : null}
				</Grid>
			</Grid>
		</div>
	</div>
);

const PatientIdVerification = ({
    patient,
    patients,
    updateParent,
    appointmentId,
}) => {
    const { token } = useContext(AuthContext);
    const [security_checked, setSecurity_checked] = useState(false);
	const [security_document, setSecurity_document] = useState('');

    function proceed() {
		if (security_document) {
			bookingService
				.sendResult(token, appointmentId, {
					result: '',
					security_checked,
					security_document,
				})
				.then(result => {
					if (result.success) {
						updateParent();
					} else {
						ToastsStore.error('Failed');
					}
				})
				.catch(() => {
					ToastsStore.error('Failed');
				});
		}
	}

    return (
		<div className='tab-container'>
			<div className='tab-content'>
				<Grid container direction='column' justify='space-between' className='full-height'>
					<Grid item>
						<PatientDetails
							fullData
							patient={patient}
							patients={patients}
							title='Patient Details'
							appointmentId={appointmentId}
						/>
					</Grid>
					<Grid item>
						<div className='row space-between'>
							<h3 className='no-margin'>Patient ID Verification</h3>
						</div>
						<div className='row'>
							<MaterialCheckbox
								value={security_checked}
								onChange={setSecurity_checked}
								labelComponent='Customer security check completed'
							/>
						</div>
						<div className='row'>
							<FormControl variant='filled' style={{ width: '100%' }}>
								<InputLabel id='security-document-label'>Security Document</InputLabel>
								<Select
									labelId='security-document-label'
									id='security-document'
									onChange={e => setSecurity_document(e.target.value)}
									value={security_document}
									required
								>
									<MenuItem value='Passport'>Passport</MenuItem>
									<MenuItem value='Driving Licence'>Driving Licence</MenuItem>
									<MenuItem value='National Identification'>National Identification</MenuItem>
								</Select>
							</FormControl>
						</div>
					</Grid>
					<Grid item>
						<div className='row flex-end'>
							<DocButton
								text='Submit'
								onClick={proceed}
								disabled={!security_document}
								color={!!security_document ? 'green' : 'disabled'}
							/>
						</div>
					</Grid>
				</Grid>
			</div>
		</div>
    );
};

const AppointmentActions = ({
	patient,
	patients = [],
	appointmentId,
	kitProvider,
	setKitProvider,
}) => {
	const {
		isCaptureDisabled,
		toggleDisplayCertificates,
		updateNotes,
		uploadImage,
		img,
	} = useContext(AppointmentContext);
	const linkRef = useRef(null);
	const [notesStatus, setNotesStatus] = useState();
	const [showNotes, setShowNotes] = useState(false);
	const [notes, setNotes] = useState();

	return (
		<div className='tab-container'>
			<div className='tab-content'>
				<div className='appointment-notes'>
					<div className='row no-margin' style={{ paddingBottom: 10 }}>
						<h3 className='no-margin'>Patient Details</h3>
					</div>
					<div className='column'>
						{patients.length > 1 ? (
							patients.map((item, indx) => (
								<div key={indx} style={{ paddingBottom: 10 }}>
									{!!item.first_name && !!item.last_name && (
										<div className='row space-between no-margin'>
											<p className='tab-row-text title-info'>Full Name {indx + 1}:</p>
											<p className='tab-row-text'>{item.first_name} {item.last_name}</p>
										</div>
									)}
									{!!item.phone && (
										<div className='row space-between no-margin'>
											<p className='tab-row-text title-info'>Phone No:</p>
											<p className='tab-row-text'>{item.phone}</p>
										</div>
									)}
									{!!item.email && (
										<div className='row space-between no-margin'>
											<p className='tab-row-text title-info'>Email Address:</p>
											<p className='tab-row-text'>{item.email}</p>
										</div>
									)}
								</div>
							))
						) : (
							<React.Fragment>
								{!!patient.first_name && !!patient.last_name && (
									<div className='row space-between no-margin'>
										<p className='tab-row-text title-info'>Full Name:</p>
										<p className='tab-row-text'>{patient.first_name} {patient.last_name}</p>
									</div>
								)}
								{!!patient.phone && (
									<div className='row space-between no-margin'>
										<p className='tab-row-text title-info'>Phone No:</p>
										<p className='tab-row-text'>{patient.phone}</p>
									</div>
								)}
								{!!patient.email && (
									<div className='row space-between no-margin'>
										<p className='tab-row-text title-info'>Email Address:</p>
										<p className='tab-row-text'>{patient.email}</p>
									</div>
								)}
							</React.Fragment>
						)}
					</div>
					<div className='row space-between' style={{ paddingBottom: '10px' }}>
						<p className='tab-row-text title-info'>Patient Joining link:</p>
						<Tooltip title="Click to copy">
							<Typography
								noWrap
								ref={linkRef}
								onClick={() => copyToClipboard(linkRef)}
								className='tab-row-text patient-link-text'
							>
								https://myhealth.dochq.co.uk/appointment?appointmentId={appointmentId}
							</Typography>
						</Tooltip>
					</div>
					<Divider />
					<div className='row no-margin' style={{ paddingTop: '20px' }}>
						<h3 className='no-margin'>Appointment Actions</h3>
					</div>
					<div className='row space-between'>
						<p className='no-margin'>Appointment Notes</p>
						{!showNotes && (
							<DocButton
								color='green'
								text='Add'
								onClick={() => setShowNotes(true)}
							/>
						)}
					</div>
					{showNotes && (
						<React.Fragment>
							<TextInputElement
								rows={4}
								multiline
								id='notes'
								value={notes}
								onChange={setNotes}
							/>
							<div className='row flex-end'>
								<DocButton
									color='green'
									text='Submit'
									onClick={() => {
										updateNotes(notes);
										setNotesStatus({ severity: 'success', message: 'Notes updated successfully' });
									}}
								/>
							</div>
						</React.Fragment>
					)}
					{!!notesStatus && !!notesStatus.severity && !!notesStatus.message && (
						<div className='row center'>
							<Alert
								variant="outlined"
								severity={notesStatus.severity}
							>
								{notesStatus.message}
							</Alert>
						</div>
					)}
					<Grid
						container
						alignItems="center"
						justify="space-between"
						style={{ padding: '30px 0'}}
					>
						<Grid item xs={6}>
							<p className='no-margin'>Kit Provider</p>
						</Grid>
						<Grid item xs={6}>
							<FormControl variant='filled' style={{ width: '100%' }}>
								<InputLabel id='kit-provider-label'>Kit Provider</InputLabel>
								<Select
									labelId='kit-provider-label'
									id='kit-provider'
									onChange={e => setKitProvider(e.target.value)}
									value={kitProvider}
									required
								>
									<MenuItem value='Roche Test Kit'>Roche Test Kit</MenuItem>
								</Select>
							</FormControl>
						</Grid>
					</Grid>
					{!!isCaptureDisabled && isCaptureDisabled && (
						<div className='row space-between'>
							<h3 className='no-margin'>Captured Image: </h3>
							{typeof img === 'undefined' || (img === null && <p>No image taken</p>)}
							{!!img && (
								<img
									src={img}
									className='expanding-image'
									style={{ maxWidth: '100px' }}
									alt='Patients test kit'
								/>
							)}
							<DocButton text='Upload Image' color='green' onClick={uploadImage} />
						</div>
					)}
					<div className='appointment-buttons'>
						<div className='row'>
							<DocButton
								disabled={!kitProvider}
								text='Create Certificate'
								onClick={toggleDisplayCertificates}
								color={!!kitProvider ? 'pink' : 'disabled'}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const copyToClipboard = (ref) => {
	window.getSelection().removeAllRanges();
	var range = document.createRange();
	range.selectNode(ref.current);
	window.getSelection().addRange(range);
	document.execCommand("copy");
	window.getSelection().removeAllRanges();
	ToastsStore.success('Copied');
};

const CertificatesContainer = ({ kitProvider }) => {
	const { displayCertificates, booking_users } = useContext(AppointmentContext);
	return displayCertificates ? (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-around',
				flexWrap: 'wrap',
				alignItems: 'flex-start !important',
			}}
		>
			{!!booking_users &&
				booking_users.map((user, i) => <CertificatesAaron
					key={i}
					patient_data={user}
					kitProvider={kitProvider}
				/>)}
		</div>
	) : null;
};