import React, { useRef, useEffect, useState, useCallback, useContext } from 'react';
import { get } from 'lodash';
import moment from 'moment';
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
import Box from '../../components/TwilioVideo/Box';
import MaterialCheckbox from '../../components/FormComponents/MaterialCheckbox/MaterialCheckbox';
import CertificatesAaron from '../../components/Certificates/CertificatesAaron';
import DocButton from '../../components/DocButton/DocButton';
import TextInputElement from '../../components/FormComponents/TextInputElement';
import bookingService from '../../services/bookingService';
import getValueFromObject from '../../helpers/getValueFromObject';
import { AuthContext } from '../../context/AuthContext';
import '../../assets/css/NurseMeeting.scss';

const TEST_TYPES = {
	pcr: 'PCR',
	antigen: 'Antigen',
};

const APPOINTMENT_TYPES = {
	tui: 'video_gp_tui',
	vista: 'video_gp',
	dochq: 'video_gp_dochq',
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
							updateImageData={console.log}
							videoCallToken={videoCallToken}
							setVideoCallToken={setVideoCallToken}
							hideVideoAppointment={hideVideoAppointment}
						/>
					</div>
				)}
				<div className={`patient-notes-container ${isVideo ? '' : 'face-to-face'}`}>
					<TabContainer
						authToken={token}
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
	authToken,
	isJoined,
	kitProvider,
	setKitProvider,
}) => {
	const {
		type,
		test_type,
		appointmentId,
		status_changes,
		toggleDisplayCertificates,
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
	const isTuiType = type === APPOINTMENT_TYPES.tui || type === APPOINTMENT_TYPES.dochq;

	useEffect(() => {
		if (isJoined && value === 0 && test_type === TEST_TYPES.pcr) {
			increaseStep();
		}
		if (get(status_changes, `${[status_changes.length - 1]}.changed_to`) === 'ON_HOLD' && test_type === TEST_TYPES.antigen) {
			setValue(1);
			toggleDisplayCertificates();
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
						authToken={authToken}
						appointmentId={appointmentId}
						updateParent={increaseStep}
					/>
				)}
				{value === 1 && (
					<AppointmentActions
						authToken={authToken}
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
					isTuiType ? (
						<AddressVerification
							isAntigenType
							authToken={authToken}
							patient={patient}
							patients={patients}
							isJoined={isJoined}
							appointmentId={appointmentId}
							updateParent={increaseStep}
						/>
					) : (
						<VideoAppointmentDetails
							patient={patient}
							appointmentDetails={appointmentDetails}
							updateParent={increaseStep}
						/>
					)
				)}
				{value === 1 && (
					<AddressVerification
						isJoined
						authToken={authToken}
						patient={patient}
						patients={patients}
						appointmentId={appointmentId}
						updateParent={increaseStep}
					/>
				)}
				{value === 2 && (
					<PatientIdVerification
						patients={patients}
						authToken={authToken}
						isTuiType={isTuiType}
						appointmentId={appointmentId}
						updateParent={increaseStep}
					/>
				)}
				{value === 3 && (
					<SubmitPatientResult
						authToken={authToken}
						patients={patients}
						isTuiType={isTuiType}
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
	authToken,
	isAntigenType,
    patients = [],
    appointmentId,
	addressBlockTitle,
	isSpaceBetweenPhoneBox,
}) => {
	const linkRef = useRef(null);
	const alternativeLinkRef = useRef(null);
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
			{!!patient.locality && fullData && (
				<div className='row space-between no-margin'>
					<p className='tab-row-text title-info'>Town:</p>
					<p className='tab-row-text'>{patient.locality}</p>
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
				{!!patient.date_of_birth && !fullData && (
					<div className='row space-between no-margin'>
						<p className='tab-row-text title-info'>DOB:</p>
						<p className='tab-row-text'>{format(new Date(patient.date_of_birth), 'dd-MM-yyyy')}</p>
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
					<div style={{ padding: '20px 0' }}>
						{isManyPatients ? (
							patients.map((item, indx) => (
								!!item.email && (
									<div key={indx} className='row space-between no-margin'>
										<p className='tab-row-text title-info'>Email Address {indx + 1}:</p>
										<p className='tab-row-text'>{item.email}</p>
									</div>
								)
							))
						) : (
							!!patient.email && (
								<div className='row space-between no-margin'>
									<p className='tab-row-text title-info'>Email Address:</p>
									<p className='tab-row-text'>{patient.email}</p>
								</div>
							)
						)}
					</div>
					<div className='no-margin' style={{ padding: '20px 0' }}>
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
								https://{process.env.REACT_APP_JOIN_LINK_PREFIX}.dochq.co.uk/appointment?appointmentId={appointmentId}
							</Typography>
						</Tooltip>
					</div>
					<div className='no-margin' style={{ padding: '20px 0' }}>
						<p className='tab-row-text title-info'>
							Alternative Patient Joining link:
						</p>
						<Tooltip title="Click to copy">
							<Typography
								noWrap
								ref={alternativeLinkRef}
								onClick={() => copyToClipboard(alternativeLinkRef)}
								className='tab-row-text patient-link-text'
							>
								https://8x8.vc/dochq/{process.env.REACT_APP_JOIN_LINK_PREFIX}-{appointmentId}
							</Typography>
						</Tooltip>
					</div>
					<div className='row center no-margin' style={{ padding: '20px 0' }}>
						<DocButton
							text="Email Alternative Link to Patient"
							color="green"
							onClick={() => bookingService.sendAlternativeLink(authToken, appointmentId)
								.then(result => {
									if (result.success) {
										ToastsStore.success('Alternative Link has been sent successfully');
									} else {
										ToastsStore.error('Failed');
									}
								}).catch(() => {
									ToastsStore.error('Failed');
								})
							}
						/>
					</div>
				</div>
				{isManyPatients && (
					<React.Fragment>
						<Divider />
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
	patients,
	isTuiType,
	authToken,
	appointmentId,
}) => {
	const {
		updateNotes,
	} = useContext(AppointmentContext);
	const { token } = useContext(AuthContext);
	const [patientsToVerify, setPatientsToVerify] = useState([...patients]);
	const currentPatient = get(patientsToVerify, '[0]');
	const forename = get(currentPatient, 'first_name', '');
	const surname = get(currentPatient, 'last_name', '');
	const currentPatientName = `${forename} ${surname}`;
	const [reasonForRejected, setReasonForRejected] = useState('');
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

	const isOtherOption = reasonForRejected === 'Other';
	const isSampleTakenInvalid = sampleTaken === 'invalid';
	const isSampleTakenRejected = sampleTaken === 'rejected';
	const isSampleTakenValid = !isSampleTakenInvalid && !isSampleTakenRejected;
	const isSampleTakenNotValid = isSampleTakenInvalid || isSampleTakenRejected;
	const showPatientName = isTuiType && patients && patients.length > 1;
	const resultNotes = isOtherOption ? notes : reasonForRejected;

	function updateKitId() {
		if (kitId) {
			sendResult({
				kitId,
				result: '',
				forename,
				surname,
			});
			setKitIdSubmitted(true);
			setKitIdModifyMode(true);
		}
	}

	function sendSampleTaken() {
		if (sampleTaken) {
			sendResult({
				...((isSampleTakenInvalid) && {
					invalid_notes: resultNotes,
				}),
				...(isSampleTakenRejected && {
					reject_notes: resultNotes,
				}),
				result: '',
				forename,
				surname,
				sample_taken: sampleTaken,
			}, true);
		}
	}

    function sendResult(formData, isSampleTaken) {
		const body = formData;
		let currentDate = moment();
		body.date_sampled = currentDate.format();
		bookingService.sendResult(token, appointmentId, body, currentPatient.id)
			.then(result => {
				if (isSampleTaken) {
					if (result.success) {
						const newPatients = [...patientsToVerify];
						newPatients.shift();
						if (newPatients.length === 0) {
							setSampleTakenStatus({ severity: 'success', message: 'Result sent successfully' });
							return;
						}
						setPatientsToVerify(newPatients);
						setNotes();
						setSampleTaken();
						setKitId('');
						setAppointmentNotes();
						setShowAppointmentNotes(false);
						setKitIdModifyMode(false);
						setKitIdSubmitted(false);
						setSampleTakenStatus();
						setNotesStatus();
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

	useEffect(() => {
		setReasonForRejected('');
		setNotes('');
	}, [sampleTaken]);

	return (
		<div className='tab-container'>
			<div className='tab-content'>
				<Grid container direction='column'>
					<Grid item>
						<PatientDetails
							title='Patient Details'
							authToken={authToken}
							patient={currentPatient}
							appointmentId={appointmentId}
						/>
					</Grid>
					<Grid item className='padding-top-box'>
						<div className='row space-between'>
							<h3 className='no-margin'>Enter{showPatientName ? ` ${currentPatientName} ` : ' '}Kit ID</h3>
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
								<h3 className='no-margin'>{showPatientName && `${currentPatientName} - `}Sample Taken</h3>
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
								<>
									<div className='row'>
										<FormControl variant='filled' style={{ width: '100%' }}>
											<InputLabel id='test-result-label'>Reason for {isSampleTakenRejected ? 'Rejected' : 'Invalid'}</InputLabel>
											{isSampleTakenRejected ? (
												<Select
													labelId='test-result-label'
													id='test-result'
													label="Reason for Rejected"
													onChange={e => setReasonForRejected(e.target.value)}
													value={reasonForRejected}
													required
												>
													<MenuItem value='Client not there'>Client not there</MenuItem>
													<MenuItem value='Test not performed as instructed'>Test not performed as instructed</MenuItem>
													<MenuItem value='Other'>Other</MenuItem>
												</Select>
											) : (
												<Select
													labelId='test-result-label'
													id='test-result'
													label="Reason for Invalid"
													onChange={e => setReasonForRejected(e.target.value)}
													value={reasonForRejected}
													required
												>
													<MenuItem value='Test kit is damaged'>Test kit is damaged</MenuItem>
													<MenuItem value='Other'>Other</MenuItem>
												</Select>
											)}
										</FormControl>
									</div>
									{isOtherOption && (
										<>
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
										</>
									)}
									<div className='row flex-end'>
										<DocButton
											text='Submit'
											disabled={isSampleTakenNotValid ? !resultNotes : false}
											color={(isSampleTakenNotValid && !resultNotes) ? 'disabled' : 'green'}
											onClick={sendSampleTaken}
										/>
									</div>
								</>
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
	authToken,
	isAntigenType,
    updateParent,
    appointmentId,
}) => {
	const { token } = useContext(AuthContext);
	const [modifyMode, setModifyMode] = useState(false);
	// Fields
	const [addressLine1, setAddressLine1] = useState('');
	const [addressLine2, setAddressLine2] = useState('');
	const [locality, setLocality] = useState('');
	const [country, setCountry] = useState('');
	const [postCode, setPostCode] = useState('');

	function isValid() {
		return (
			!!addressLine1 &&
			!!locality &&
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
						address_1: addressLine1,
						address_1: addressLine2,
						locality,
						country,
						postalCode: postCode,
					},
				}, patient.id)
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
							authToken={authToken}
							isAntigenType={isAntigenType}
							isSpaceBetweenPhoneBox
							addressBlockTitle={isJoined}
							title={isJoined ? 'Patient Details' : 'Appointment Details'}
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
									value={locality}
									id='locality'
									label='Town'
									onChange={setLocality}
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
								{!!patient.date_of_birth && (
									<div className='row space-between no-margin'>
										<p className='tab-row-text title-info'>DOB:</p>
										<p>{format(new Date(patient.date_of_birth), 'dd-MM-yyyy')}</p>
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
    patients,
	isTuiType,
	authToken,
    updateParent,
    appointmentId,
}) => {
    const { token } = useContext(AuthContext);
	const [patientsToVerify, setPatientsToVerify] = useState([...patients]);
    const [security_checked, setSecurity_checked] = useState(false);
	const [security_document, setSecurity_document] = useState('');
	const currentPatient = get(patientsToVerify, '[0]');
	const forename = get(currentPatient, 'first_name', '');
	const surname = get(currentPatient, 'last_name', '');
	const [passportId, setPassportId] = useState(get(currentPatient, 'metadata.passport_number', '') || get(currentPatient, 'metadata.passportId', ''));
	const currentPatientName = `${forename} ${surname}`;
	const showPatientName = isTuiType && patients && patients.length > 1;
	const isValid = !!security_checked && (isTuiType ? !!passportId : !!security_document);

    function proceed() {
		if (isValid) {
			bookingService
				.sendResult(token, appointmentId, isTuiType ? {
					result: '',
					forename,
					surname,
					passport_number: passportId,
					security_checked,
				} : {
					result: '',
					forename,
					surname,
					security_checked,
					security_document,
				}, currentPatient.id)
				.then(result => {
					if (result.success) {
						const newPatients = [...patientsToVerify];
						newPatients.shift();
						if (newPatients.length === 0) {
							updateParent();
							return;
						}
						setPatientsToVerify(newPatients);
						setSecurity_checked(false);
						setSecurity_document('');
						setPassportId('');
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
							authToken={authToken}
							title='Patient Details'
							patient={currentPatient}
							appointmentId={appointmentId}
						/>
					</Grid>
					<Grid item>
						<div className='row space-between'>
							<h3 className='no-margin'>{showPatientName ? currentPatientName : 'Patient'} ID Verification</h3>
						</div>
						<div className='row'>
							<MaterialCheckbox
								value={security_checked}
								onChange={setSecurity_checked}
								labelComponent='Customer security check completed'
							/>
						</div>
						{!isTuiType && (
							<div className='row'>
								<FormControl variant='filled' style={{ width: '100%' }}>
									<InputLabel id='security-document-label'>{showPatientName && currentPatientName} Security Document</InputLabel>
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
						)}
						{(isTuiType && security_checked) && (
							<>
								<div className='row space-between padding-top-box'>
									<h3 className='no-margin'>{showPatientName && currentPatientName} Document ID Number</h3>
								</div>
								<div className='row'>
									<TextInputElement
										id='passport-id'
										value={passportId}
										placeholder='Document ID Number'
										onChange={setPassportId}
										required
									/>
								</div>
							</>
						)}
					</Grid>
					<Grid item>
						<div className='row flex-end'>
							<DocButton
								text='Submit'
								onClick={proceed}
								disabled={!isValid}
								color={isValid ? 'green' : 'disabled'}
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
	authToken,
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
	const alternativeLinkRef = useRef(null);
	const [notesStatus, setNotesStatus] = useState();
	const [showNotes, setShowNotes] = useState(false);
	const [notes, setNotes] = useState();

	useEffect(() => {
		if (notesStatus && notesStatus.severity === 'success') {
			const timer = setTimeout(() => setNotesStatus(), 3000);
			return () => clearTimeout(timer);
		}
	  }, [notesStatus]);

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
					<div style={{ paddingBottom: '10px' }}>
						<p className='tab-row-text title-info'>Patient Joining link:</p>
						<Tooltip title="Click to copy">
							<Typography
								noWrap
								ref={linkRef}
								onClick={() => copyToClipboard(linkRef)}
								className='tab-row-text patient-link-text'
							>
								https://{process.env.REACT_APP_JOIN_LINK_PREFIX}.dochq.co.uk/appointment?appointmentId={appointmentId}
							</Typography>
						</Tooltip>
					</div>
					<div className='no-margin' style={{ padding: '20px 0' }}>
						<p className='tab-row-text title-info'>
							Alternative Patient Joining link:
						</p>
						<Tooltip title="Click to copy">
							<Typography
								noWrap
								ref={alternativeLinkRef}
								onClick={() => copyToClipboard(alternativeLinkRef)}
								className='tab-row-text patient-link-text'
							>
								https://8x8.vc/dochq/{process.env.REACT_APP_JOIN_LINK_PREFIX}-{appointmentId}
							</Typography>
						</Tooltip>
					</div>
					<div className='row center no-margin' style={{ padding: '20px 0' }}>
						<DocButton
							text="Email Alternative Link to Patient"
							color="green"
							onClick={() => bookingService.sendAlternativeLink(authToken, appointmentId)
								.then(result => {
									if (result.success) {
										ToastsStore.success('Alternative Link has been sent successfully');
									} else {
										ToastsStore.error('Failed');
									}
								}).catch(() => {
									ToastsStore.error('Failed');
								})
							}
						/>
					</div>
					<Divider />
					<div className='row no-margin' style={{ paddingTop: '20px' }}>
						<h3 className='no-margin'>Appointment Actions</h3>
					</div>
					<div className='row space-between'>
						<p className='no-margin'><b>Appointment Notes</b></p>
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
							<p className='no-margin'><b>Kit Provider</b></p>
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
									<MenuItem value='Roche'>Roche Test Kit</MenuItem>
									<MenuItem value='Flowflex'>Flowflex Kit</MenuItem>
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
	const { displayCertificates, booking_users, img } = useContext(AppointmentContext);
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
					img={get(img, `[${i}]`, '')}
					patient_data={user}
					kitProvider={kitProvider}
				/>)}
		</div>
	) : null;
};
