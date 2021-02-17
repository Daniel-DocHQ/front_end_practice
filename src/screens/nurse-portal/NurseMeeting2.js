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
} from '@material-ui/core';
import { format, differenceInMinutes } from 'date-fns';
import { ToastsStore } from 'react-toasts';
import { useToken } from '../../context/AuthContext';
import '../../assets/css/NurseMeeting.scss';
import Box from '../../components/TwilioVideo/Box';
import MaterialCheckbox from '../../components/FormComponents/MaterialCheckbox/MaterialCheckbox';
import CertificatesAaron from '../../components/Certificates/CertificatesAaron';
import DocButton from '../../components/DocButton/DocButton';
import TextInputElement from '../../components/FormComponents/TextInputElement';
import EditorWrapper from '../../components/EditorWrapper/EditorWrapper';
import bookingService from '../../services/bookingService';
import { AuthContext } from '../../context/AuthContext';

const APPOINTMENT_TYPES = {
	vista: 'video_gp',
	tui: 'video_gp_tui',
};

const NurseMeeting2 = ({ isVideo }) => {
	const token = useToken();
	const [videoCallToken, setVideoCallToken] = useState();

	return (
		<AppointmentContextProvider token={token}>
			<div className='row flex-start items-start'>
				{isVideo && (
					<div className='patient-video'>
						<Box
							isNurse
							updateImageData={console.log}
							captureDisabled
							videoCallToken={videoCallToken}
							setVideoCallToken={setVideoCallToken}
						/>
					</div>
				)}
				<div className={`patient-notes-container ${isVideo ? '' : 'face-to-face'}`}>
					<TabContainer isJoined={!!videoCallToken} />
				</div>
			</div>
			<CertificatesContainer />
		</AppointmentContextProvider>
	);
};

export default NurseMeeting2;

const TabContainer = ({ isJoined }) => {
	const [value, setValue] = React.useState(0);
	const {
		type,
		appointmentId,
	} = useContext(AppointmentContext);
	const patients = useBookingUsers();
	const patient = useBookingUser(0);
	const appointmentDetails = useAppointmentDetails();
	const increaseStep = useCallback(() => {
		setValue((oldValue) => oldValue + 1);
	});

	useEffect(() => {
		if (isJoined && value === 0 && type === APPOINTMENT_TYPES.vista) {
			increaseStep();
		}
	}, [isJoined]);

	return (
		type === APPOINTMENT_TYPES.tui ? (
			<div className='tab-container' style={{ minHeight: 'unset' }}>
				{value === 0 && (
					<AddressVerification
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
    patients = [],
    appointmentId,
	isSpaceBetweenPhoneBox,
}) => {
	const linkRef = useRef(null);

	return (
		<React.Fragment>
			<div className='row no-margin'>
				<h3 className='no-margin'>{title}</h3>
			</div>
			<div className='column'>
				{patients.length > 1 ? (
					patients.map((item, indx) => (
						!!item.last_name && !!item.first_name && (
							<div key={indx} className='row space-between no-margin'>
								<p className='tab-row-text'>Full Name Client {indx + 1}:</p>
								<p className='tab-row-text'>{item.first_name} {item.last_name}</p>
							</div>
						)
					))
				) : (
					!!patient.first_name && !!patient.last_name && (
						<div className='row space-between no-margin'>
							<p className='tab-row-text'>Full Name:</p>
							<p className='tab-row-text'>{patient.first_name} {patient.last_name}</p>
						</div>
					)
				)}
				{!!patient.dob && !fullData && (
					<div className='row space-between no-margin'>
						<p className='tab-row-text'>DOB:</p>
						<p className='tab-row-text'>{format(new Date(patient.dob), 'dd-MM-yyyy')}</p>
					</div>
				)}
				{!!patient.street_address && fullData && (
					<div className='row space-between no-margin'>
						<p className='tab-row-text'>Address Line 1:</p>
						<p className='tab-row-text'>{patient.street_address}</p>
					</div>
				)}
				{!!patient.extended_address && fullData && (
					<div className='row space-between no-margin'>
						<p className='tab-row-text'>Address Line 2:</p>
						<p className='tab-row-text'>{patient.extended_address}</p>
					</div>
				)}
				{!!patient.region && fullData && (
					<div className='row space-between no-margin'>
						<p className='tab-row-text'>Town:</p>
						<p className='tab-row-text'>{patient.region}</p>
					</div>
				)}
				{!!patient.country && fullData && (
					<div className='row space-between no-margin'>
						<p className='tab-row-text'>Country:</p>
						<p className='tab-row-text'>{patient.country}</p>
					</div>
				)}
				{!!patient.postal_code && fullData && (
					<div className='row space-between no-margin'>
						<p className='tab-row-text'>Post Code:</p>
						<p className='tab-row-text'>{patient.postal_code}</p>
					</div>
				)}
				<div className={isSpaceBetweenPhoneBox && 'padding-box'}>
					{patients.length > 1 ? (
						patients.map((item, indx) => (
							!!item.phone && (
								<div key={indx} className='row space-between no-margin'>
									<p className='tab-row-text'>Phone No Client {indx + 1}:</p>
									<p className='tab-row-text'>{item.phone}</p>
								</div>
							)
						))
					) : (
						!!patient.phone && (
							<div className='row space-between no-margin'>
								<p className='tab-row-text'>Phone No:</p>
								<p className='tab-row-text'>{patient.phone}</p>
							</div>
						)
					)}
					<div className='row space-between no-margin'>
						<p className='tab-row-text'>
							Patient Joining link:
						</p>
						<Tooltip title="Click to copy">
							<Typography
								noWrap
								ref={linkRef}
								onClick={() => copyToClipboard(linkRef)}
								className='no-margin patient-link-text'
							>
								https://myhealth.dochq.co.uk/appointment?appointmentId={appointmentId}
							</Typography>
						</Tooltip>
					</div>
				</div>
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
	const [showNotes, setShowNotes] = useState(false);
	const [showAppointmentNotes, setShowAppointmentNotes] = useState(false);
	const [kidIdSubmitted, setKidIdSubmitted] = useState(false);
	// Fields
	const [notes, setNotes] = useState();
	const [sampleTaken, setSampleTaken] = useState();
	const [kidId, setKidId] = useState();
	const [appointmentNotes, setAppointmentNotes] = useState();

	const isSampleTakenRejected = sampleTaken === 'rejected';

	function updateKidId() {
		if (kidId) {
			sendResult({
				kidId,
				result: '',
			});
			ToastsStore.success('Success');
			setKidIdSubmitted(true);
		}
	}

	function sendSampleTaken() {
		if (sampleTaken) {
			sendResult({
				result: '',
				...(isSampleTakenRejected && {
					reject_notes: notes,
				}),
				sampleTaken,
			});
		}
	}

    function sendResult(formData) {
		const body = formData;
		bookingService
			.sendResult(token, appointmentId, body)
			.then(result => {
				if (result.success) {
					ToastsStore.success('Success');
				} else {
					ToastsStore.error('Failed');
				}
			})
			.catch(() => {
				ToastsStore.error('Failed');
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
					<Grid item className='padding-box'>
						<div className='row space-between'>
							<h3 className='no-margin'>Enter KID ID</h3>
						</div>
						<div className='row'>
							<TextInputElement
								id='kid-id'
								value={kidId}
								placeholder='Eg: 20P456632'
								onChange={setKidId}
								disabled={kidIdSubmitted}
								required
							/>
						</div>
						<div className='row flex-end'>
							<DocButton
								text={kidIdSubmitted ? 'Modify' : 'Submit'}
								color='green'
								onClick={() => kidIdSubmitted ? setKidIdSubmitted(false) : updateKidId()}
							/>
						</div>
					</Grid>
					{kidIdSubmitted && (
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
							{sampleTaken !== 'rejected' && (
								<div className='row flex-end'>
									<DocButton text='Submit' color='green' onClick={sendSampleTaken} />
								</div>
							)}
							<div className='row space-between'>
								<h2 className='no-margin'>Notes</h2>
								{!showNotes && (
									<DocButton
										color='green'
										text='Add'
										onClick={() => setShowNotes(true)}
									/>
								)}
							</div>
							{(showNotes || isSampleTakenRejected) && (
								<React.Fragment>
									<EditorWrapper
										placeholder={isSampleTakenRejected
											? 'Add Reason for Rejection\nThis notes will be sent to the client'
											: ''}
										updateContent={setNotes}
									/>
									<div className='row flex-end'>
										<DocButton
											color='green'
											text='Submit'
											disabled={isSampleTakenRejected ? !notes : false}
											onClick={() => isSampleTakenRejected ? sendSampleTaken() : updateNotes(notes)}
										/>
									</div>
								</React.Fragment>
							)}
							{isSampleTakenRejected && (
								<React.Fragment>
									<div className='row space-between'>
										<h2 className='no-margin'>Appointment Notes</h2>
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
											<EditorWrapper updateContent={setAppointmentNotes} />
											<div className='row flex-end'>
												<DocButton
													color='green'
													text='Submit'
													onClick={() => updateNotes(appointmentNotes)}
												/>
											</div>
										</React.Fragment>
									)}
								</React.Fragment>
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
    updateParent,
    appointmentId,
}) => (
	<div className='tab-container'>
		<div className='tab-content'>
			<Grid container direction='column' justify='space-between' className='full-height'>
				<Grid item>
					<PatientDetails
						fullData
						patient={patient}
						patients={patients}
						isSpaceBetweenPhoneBox
						title='Address Verification'
						appointmentId={appointmentId}
					/>
				</Grid>
				{isJoined && (
					<Grid item>
						<div className='row no-margin'>
							<h4>Do you confirm that the patient's current address is the same as the one displayed above?</h4>
						</div>
						<div className='row flex-end'>
							<DocButton text='Modify' color='pink' style={{ marginRight: 25 }} />
							<DocButton text='Confirm' color='green' onClick={updateParent} />
						</div>
					</Grid>
				)}
			</Grid>
		</div>
	</div>
);

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
										<p className='tab-row-text'>Full Name:</p>
										<p className='tab-row-text'>{patient.first_name} {patient.last_name}</p>
									</div>
								)}
								{!!patient.dob && (
									<div className='row space-between no-margin'>
										<p className='tab-row-text'>DOB:</p>
										<p>{format(new Date(patient.dob), 'dd-MM-yyyy')}</p>
									</div>
								)}
								{!!patient.postal_code && (
									<div className='row space-between no-margin'>
										<p className='tab-row-text'>Post Code:</p>
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
										<p className='no-margin'>Start Time:</p>
										<p className='no-margin'>{format(new Date(appointmentDetails.start_time), 'p')}</p>
									</div>
								)}
								{!!appointmentDetails.start_time && !!appointmentDetails.end_time && (
									<div className='row space-between no-margin'>
										<p className='no-margin'>Duration:</p>
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
    const { user, token } = useContext(AuthContext);
    const [security_checked, setSecurity_checked] = useState(false);
	const [security_document, setSecurity_document] = useState('');

    function proceed() {
		if (security_document) {
			sendResult({
				result: '',
				security_checked,
				security_document,
			});
		}
	}

    function sendResult(formData) {
		const body = formData;
		body.medicalprofessional = `${user.first_name} ${user.last_name}`;
		bookingService
			.sendResult(token, appointmentId, body)
			.then(result => {
				if (result.success) {
					ToastsStore.success('Success');
                    updateParent();
				} else {
					ToastsStore.error('Failed');
				}
			})
			.catch(() => {
				ToastsStore.error('Failed');
			});
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
									required={true}
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
							<DocButton text='Submit' color='green' onClick={proceed} />
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
}) => {
	const {
		isCaptureDisabled,
		toggleDisplayCertificates,
		updateNotes,
		uploadImage,
		img,
	} = useContext(AppointmentContext);
	const linkRef = useRef(null);
	const [showNotes, setShowNotes] = useState(false);
	const [notes, setNotes] = useState();

	return (
		<div className='tab-container'>
			<div className='tab-content'>
				<div className='appointment-notes'>
					<div className='row no-margin'>
						<h3 className='no-margin'>Patient's Contact Details</h3>
					</div>
					<div className='column'>
						{patients.length > 1 ? (
							patients.map((item, indx) => (
								<div key={indx} style={{ paddingBottom: 10 }}>
									{!!item.first_name && !!item.last_name && (
										<div className='row space-between no-margin'>
											<p className='tab-row-text'>Full Name {indx + 1}:</p>
											<p className='tab-row-text'>{item.first_name} {item.last_name}</p>
										</div>
									)}
									{!!item.phone && (
										<div className='row space-between no-margin'>
											<p className='tab-row-text'>Phone No:</p>
											<p className='tab-row-text'>{item.phone}</p>
										</div>
									)}
									{!!item.email && (
										<div className='row space-between no-margin'>
											<p className='tab-row-text'>Email Address:</p>
											<p className='tab-row-text'>{item.email}</p>
										</div>
									)}
								</div>
							))
						) : (
							<React.Fragment>
								{!!patient.first_name && !!patient.last_name && (
									<div className='row space-between no-margin'>
										<p className='tab-row-text'>Full Name:</p>
										<p className='tab-row-text'>{patient.first_name} {patient.last_name}</p>
									</div>
								)}
								{!!patient.phone && (
									<div className='row space-between no-margin'>
										<p className='tab-row-text'>Phone No:</p>
										<p className='tab-row-text'>{patient.phone}</p>
									</div>
								)}
								{!!patient.email && (
									<div className='row space-between no-margin'>
										<p className='tab-row-text'>Email Address:</p>
										<p className='tab-row-text'>{patient.email}</p>
									</div>
								)}
							</React.Fragment>
						)}
					</div>
					<div className='row space-between'>
						<p className='no-margin'>Patient Joining link:</p>
						<Tooltip title="Click to copy">
							<Typography
								noWrap
								ref={linkRef}
								onClick={() => copyToClipboard(linkRef)}
								className='no-margin patient-link-text'
							>
								https://myhealth.dochq.co.uk/appointment?appointmentId={appointmentId}
							</Typography>
						</Tooltip>
					</div>
					<div className='row space-between'>
						<h3 className='no-margin'>Appointment Notes</h3>
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
							<EditorWrapper updateContent={setNotes} />
							<div className='row flex-end'>
								<DocButton
									color='green'
									text='Submit'
									onClick={() => updateNotes(notes)}
								/>
							</div>
						</React.Fragment>
					)}
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
							<DocButton text='Create Certificate' color='pink' onClick={toggleDisplayCertificates} />
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

const CertificatesContainer = () => {
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
				booking_users.map((user, i) => <CertificatesAaron key={i} patient_data={user} />)}
		</div>
	) : null;
};
