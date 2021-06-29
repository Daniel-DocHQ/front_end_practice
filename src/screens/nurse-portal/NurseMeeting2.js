import React, { useRef, useEffect, useState, useCallback, useContext } from 'react';
import { get } from 'lodash';
import moment from 'moment';
import Collapse from '@material-ui/core/Collapse';
import AppointmentContextProvider, {
	AppointmentContext,
	useAppointmentDetails,
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
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Alert } from '@material-ui/lab';
import { format, differenceInMinutes } from 'date-fns';
import { ToastsStore } from 'react-toasts';
import { useToken } from '../../context/AuthContext';
import Box from '../../components/TwilioVideo/Box';
import MaterialCheckbox from '../../components/FormComponents/MaterialCheckbox/MaterialCheckbox';
import CertificatesAaron from '../../components/Certificates/CertificatesAaron';
import DocButton from '../../components/DocButton/DocButton';
import LinkButton from '../../components/DocButton/LinkButton';
import TextInputElement from '../../components/FormComponents/TextInputElement';
import bookingService from '../../services/bookingService';
import getValueFromObject from '../../helpers/getValueFromObject';
import { AuthContext } from '../../context/AuthContext';
import '../../assets/css/NurseMeeting.scss';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import copyToClipboard from '../../helpers/copyToClipboard';

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
		booking_users,
		status_changes,
		toggleDisplayCertificates,
		getAppointmentDetails,
	} = useContext(AppointmentContext);
	const [value, setValue] = useState(0);
	const [loading, setLoading] = useState(false);
	const [customerNotThere, setCustomerNotThere] = useState({});
	const patients = !!booking_users ? [...booking_users] : [];
	let patient = !!patients.length ? patients[0] : {};
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

	useEffect(() => {
		if (appointmentId) {
			(async () => {
				await setLoading(true);
				await getAppointmentDetails(appointmentId, authToken);
				await setLoading(false);
			})();
		}
	}, [value]);

	return !loading ? (
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
						patient={patient}
						patients={patients}
						authToken={authToken}
						isTuiType={isTuiType}
						appointmentId={appointmentId}
						updateParent={increaseStep}
						customerNotThere={customerNotThere}
						setCustomerNotThere={setCustomerNotThere}
					/>
				)}
				{value === 3 && (
					<SubmitPatientResult
						authToken={authToken}
						patients={patients}
						isTuiType={isTuiType}
						appointmentId={appointmentId}
						customerNotThere={customerNotThere}
					/>
				)}
			</React.Fragment>
		)
	): <LoadingSpinner />;
};

const PatientDetails = ({
    title,
    patient,
    fullData,
	authToken,
	isAntigenType,
    patients = [],
    appointmentId,
	isJoined,
	addressVerification,
	isSpaceBetweenPhoneBox,
}) => {
	const linkRef = useRef(null);
	const alternativeLinkRef = useRef(null);
	const isManyPatients = patients.length > 1 || isAntigenType;
	const [checked, setChecked] = useState(!isJoined);

	const handleChange = () => {
		setChecked((prev) => !prev);
	};
	const addressDataBlock = (title = 'Address Verification') => (
		<React.Fragment>
			{!!isJoined && (
				<div className='row no-margin' style={{ paddingBottom: 10 }}>
					<h3 className='no-margin'>{title}</h3>
				</div>
			)}
			{!!patient.street_address && fullData && (
				<div className='row space-between no-margin'>
					<p className='tab-row-text title-info'>Address Line 1:</p>
					<p className='tab-row-text'>{get(patient, 'metadata.street_address', '') || patient.street_address}</p>
				</div>
			)}
			{!!patient.extended_address && fullData && (
				<div className='row space-between no-margin'>
					<p className='tab-row-text title-info'>Address Line 2:</p>
					<p className='tab-row-text'>{get(patient, 'metadata.extended_address', '') || patient.extended_address}</p>
				</div>
			)}
			{!!patient.locality && fullData && (
				<div className='row space-between no-margin'>
					<p className='tab-row-text title-info'>Town:</p>
					<p className='tab-row-text'>{get(patient, 'metadata.locality', '') || patient.locality}</p>
				</div>
			)}
			{!!patient.region && fullData && (
				<div className='row space-between no-margin'>
					<p className='tab-row-text title-info'>County:</p>
					<p className='tab-row-text'>{get(patient, 'metadata.region', '') || patient.region}</p>
				</div>
			)}
			{!!patient.country && fullData && (
				<div className='row space-between no-margin'>
					<p className='tab-row-text title-info'>Country:</p>
					<p className='tab-row-text'>{get(patient, 'metadata.country', '') || patient.country}</p>
				</div>
			)}
			{!!patient.postal_code && fullData && (
				<div className='row space-between no-margin'>
					<p className='tab-row-text title-info'>Post Code:</p>
					<p className='tab-row-text'>{get(patient, 'metadata.postal_code', '') || patient.postal_code}</p>
				</div>
			)}
		</React.Fragment>
	);

	useEffect(() => {
		setChecked(!isJoined);
	}, [isJoined])

	return (
		<React.Fragment>
			<div className='row no-margin' style={{ paddingBottom: 10, cursor: 'pointer' }} onClick={handleChange}>
				<h3 className='no-margin'>
					{title}
				</h3>
				{checked ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
			</div>
			<div className='column'>
				<Collapse in={checked}>
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
						{addressDataBlock('Address')}
						<div className='no-margin' style={{ padding: '20px 0' }}>
							<p className='tab-row-text title-info'>
								Customer Joining link:
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
						<div className='row center no-margin' style={{ padding: '20px 0' }}>
							<LinkButton
								newTab
								color='green'
								text='Join customer on alternative video'
								linkSrc={`https://8x8.vc/dochq/${patient.metadata.short_token}`}
							/>
						</div>
						<div className='row center no-margin' style={{ padding: '20px 0' }}>
							<DocButton
								text="Email Alternative Link to Customer"
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
				</Collapse>
				{isJoined && (<Divider />)}
				{(addressVerification && isJoined) && (
					<div className={isSpaceBetweenPhoneBox && 'padding-top-box'}>
						{addressDataBlock()}
					</div>
				)}
			</div>
		</React.Fragment>
	);
};

const SubmitPatientResult = ({
	patients,
	authToken,
	appointmentId,
	customerNotThere: customerNotThereObj,
}) => {
	const {
		updateNotes,
	} = useContext(AppointmentContext);
	const { token } = useContext(AuthContext);
	const [patientsToVerify, setPatientsToVerify] = useState([...patients]);
	const currentPatient = get(patientsToVerify, '[0]');
	const customerNotThere = customerNotThereObj[currentPatient.id];
	const forename = get(currentPatient, 'first_name', '');
	const surname = get(currentPatient, 'last_name', '');
	const currentPatientName = `${forename} ${surname}`;
	const [reasonForRejected, setReasonForRejected] = useState('');
	const [loading, setLoading] = useState(false);
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
	const resultNotes = isOtherOption ? notes : reasonForRejected;

	function updateKitId() {
		if (kitId) {
			sendResult({
				kit_id: kitId,
				result: '',
				forename,
				surname,
			});
			setKitIdSubmitted(true);
			setKitIdModifyMode(true);
		}
	}

	const sendSampleTaken = async () => {
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

    const sendResult = async (formData, isSampleTaken) => {
		if (isSampleTaken) setLoading(true);
		const body = formData;
		body.date_sampled =  moment().format();
		await bookingService.sendResult(token, appointmentId, body, currentPatient.id)
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
						setSampleTaken('');
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
		setLoading(false);
	}

	useEffect(() => {
		setReasonForRejected('');
		setNotes('');
	}, [sampleTaken]);

	useEffect(() => {
		if (sampleTakenStatus && sampleTakenStatus.severity === 'success') {
			const timer = setTimeout(() => setSampleTakenStatus(), 5000);
			return () => clearTimeout(timer);
		}
	}, [sampleTakenStatus]);

	useEffect(() => {
		if (notesStatus && notesStatus.severity === 'success') {
			const timer = setTimeout(() => setNotesStatus(), 5000);
			return () => clearTimeout(timer);
		}
	}, [notesStatus]);

	return (
		<div className='tab-container'>
			<div className='tab-content'>
				<Grid container direction='column'>
					<Grid item>
						<PatientDetails
							isJoined
							fullData
							title='Customer Details'
							authToken={authToken}
							patients={patients}
							patient={currentPatient}
							appointmentId={appointmentId}
						/>
					</Grid>
					{!customerNotThere && (
						<Grid item className='padding-top-box'>
							<div className='row space-between'>
								<h3 className='no-margin'>{currentPatientName} - Kit ID</h3>
							</div>
							<div className='row'>
								<TextInputElement
									id='kit-id'
									value={kitId}
									placeholder='Eg: 20P456632'
									onChange={setKitId}
									helperText={(!!kitId && kitId.replace(/[0-9]/g,"").length > 1) && 'Kit ID usually contains only one letter. Please double check your kit ID if you have entered "O" letter instead of zero.'}
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
					)}
					{(kitIdSubmitted || customerNotThere) && (
						<Grid item>
							<div className='row space-between'>
								<h3 className='no-margin'>{currentPatientName} - Sample Taken</h3>
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
										{!customerNotThere && (
											<>
												<FormControlLabel value='valid' control={<Radio />} label='Valid' />
												<FormControlLabel value='invalid' control={<Radio />} label='Invalid' />
											</>
										)}
										<FormControlLabel value='rejected' control={<Radio />} label='Rejected' />
									</RadioGroup>
								</FormControl>
							</div>
							{isSampleTakenValid && (
								<div className='row flex-end'>
									{loading ? (
										<LoadingSpinner />
									) : (
										<DocButton
											text='Submit'
											disabled={!sampleTaken}
											onClick={sendSampleTaken}
											color={!!sampleTaken ? 'green' : 'disabled'}
										/>
									)}
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
										{loading ? (
											<LoadingSpinner />
										) : (
											<DocButton
												text='Submit'
												disabled={isSampleTakenNotValid ? !resultNotes : false}
												color={(isSampleTakenNotValid && !resultNotes) ? 'disabled' : 'green'}
												onClick={sendSampleTaken}
											/>
										)}
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
							<Divider />
							<div className='row space-between'>
								<h3 className='no-margin'>Appointment Notes</h3>
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
	const [county, setCounty] = useState('');
	const [postCode, setPostCode] = useState('');

	function isValid() {
		return (
			!!addressLine1 &&
			!!locality &&
			!!county &&
			!!postCode
		);
	}

	function proceed() {
		if (isValid()) {
			bookingService
				.sendResult(token, appointmentId, {
					result: '',
					street_address: addressLine1,
					extended_address: addressLine2,
					locality: locality,
					region: county,
					postal_code: postCode,
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
							isJoined={isJoined}
							addressVerification
							title={isJoined ? 'Customer Details' : 'Appointment Details'}
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
									value={county}
									id='country'
									label='County'
									onChange={setCounty}
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
								<h3 className='no-margin'>Customer Details</h3>
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
	patient,
    patients,
	isTuiType,
	authToken,
    updateParent,
    appointmentId,
	customerNotThere: customerNotThereObj,
	setCustomerNotThere,
}) => {
	const {
		updateNotes,
	} = useContext(AppointmentContext);
    const { token } = useContext(AuthContext);
	const [patientsToVerify, setPatientsToVerify] = useState([...patients]);
    const [security_checked, setSecurity_checked] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showAppointmentNotes, setShowAppointmentNotes] = useState(false);
	const [security_document, setSecurity_document] = useState('');
	const [notesStatus, setNotesStatus] = useState();
	const [appointmentNotes, setAppointmentNotes] = useState();
	const currentPatient = get(patientsToVerify, '[0]');
	const customerNotThere = customerNotThereObj[currentPatient.id];
	const forename = get(currentPatient, 'first_name', '');
	const surname = get(currentPatient, 'last_name', '');
	const dateOfBirth = get(currentPatient, 'date_of_birth', '');
	const [passportId, setPassportId] = useState(get(currentPatient, 'metadata.passport_number', '') || get(currentPatient, 'metadata.passportId', ''));
	const currentPatientName = `${forename} ${surname}`;
	const isValid = (!!security_checked && (isTuiType ? !!passportId : !!security_document)) || customerNotThere;

	const nextStep = () => {
		const newPatients = [...patientsToVerify];
		newPatients.shift();
		if (newPatients.length === 0) {
			updateParent();
			return;
		}
		setPatientsToVerify(newPatients);
		setSecurity_checked(false);
		setSecurity_document('');
	};

    const proceed = async () => {
		if (customerNotThere) {
			nextStep();
		} else if (isValid) {
			setLoading(true);
			await bookingService
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
						nextStep();
					} else {
						ToastsStore.error('Failed');
					}
				})
				.catch(() => {
					ToastsStore.error('Failed');
				});
			setLoading(false);
		}
	}

	useEffect(() => {
		if (currentPatient) {
			setPassportId(get(currentPatient, 'metadata.passport_number', '') || get(currentPatient, 'metadata.passportId', ''));
		}
	}, [patientsToVerify]);

	useEffect(() => {
		if (customerNotThere) {
			setSecurity_checked(false);
		}
	}, [customerNotThereObj]);

	useEffect(() => {
		if (security_checked) {
			setCustomerNotThere({
				...customerNotThereObj,
				[currentPatient.id]: false.length,
			});
		}
	}, [security_checked]);

	useEffect(() => {
		if (notesStatus && notesStatus.severity === 'success') {
			const timer = setTimeout(() => setNotesStatus(), 5000);
			return () => clearTimeout(timer);
		}
	}, [notesStatus]);

    return (
		<div className='tab-container'>
			<div className='tab-content'>
				<Grid container direction='column' justify='space-between'>
					<Grid item>
						<PatientDetails
							fullData
							isJoined
							patient={patient}
							patients={patients}
							authToken={authToken}
							title='Customer Details'
							patient={currentPatient}
							appointmentId={appointmentId}
						/>
					</Grid>
					<Grid item>
						<div className='row space-between'>
							<h3 className='no-margin'>{currentPatientName} - ID Verification</h3>
						</div>
						{!!dateOfBirth && (
							<div className='row space-between'>
								<p>
									<b>Date of Birth</b> - {format(new Date(dateOfBirth), 'dd-MM-yyyy')}
								</p>
							</div>
						)}
						{!isTuiType && (
							<div className='row'>
								<FormControl variant='filled' style={{ width: '100%' }}>
									<InputLabel id='security-document-label'>{currentPatientName} - Security Document</InputLabel>
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
						{(isTuiType) && (
							<>
								<div className='row space-between padding-top-box'>
									<h3 className='no-margin'>{currentPatientName} - ID Document Number</h3>
								</div>
								<div className='row'>
									<TextInputElement
										id='passport-id'
										value={passportId}
										placeholder='ID Document Number'
										disabled
										onChange={setPassportId}
										required
									/>
								</div>
							</>
						)}
						<div className='row'>
							<MaterialCheckbox
								value={security_checked}
								onChange={setSecurity_checked}
								labelComponent='Customer ID verified'
							/>
						</div>
						<div className='row'>
							<MaterialCheckbox
								value={customerNotThere}
								onChange={(value) => setCustomerNotThere({ ...customerNotThereObj, [currentPatient.id]: value })}
								labelComponent='Customer not there'
							/>
						</div>
					</Grid>
					<Grid item>
						<div className='row flex-end'>
							{loading ? (
								<LoadingSpinner />
							) : (
								<DocButton
									text='Submit'
									onClick={proceed}
									disabled={!isValid}
									color={isValid ? 'green' : 'disabled'}
								/>
							)}
						</div>
					</Grid>
					<Grid item>
						<Divider />
						<div className='row space-between'>
							<h3 className='no-margin'>Appointment Notes</h3>
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
					<PatientDetails
						fullData
						isJoined
						patient={patient}
						patients={patients}
						authToken={authToken}
						title='Customer Details'
						appointmentId={appointmentId}
					/>
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

const CertificatesContainer = ({ kitProvider }) => {
	const { displayCertificates, booking_users, img, appointmentId } = useContext(AppointmentContext);
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
					appointmentId={appointmentId}
					img={get(img, `[${i}]`, '')}
					patient_data={user}
					kitProvider={kitProvider}
				/>)}
		</div>
	) : null;
};
