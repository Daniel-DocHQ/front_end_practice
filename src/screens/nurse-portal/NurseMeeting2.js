import React, { useState, useCallback, useContext } from 'react';
import AppointmentContextProvider, {
	AppointmentContext,
	useAppointmentDetails,
	useAppointmentId,
	useBookingUsers,
} from '../../context/AppointmentContext';
import { useToken } from '../../context/AuthContext';
import '../../assets/css/NurseMeeting.scss';
import { Tab, Tabs, AppBar, ThemeProvider } from '@material-ui/core';
import Box from '../../components/TwilioVideo/Box';
import VerifyPatients from '../../components/VerifyPatients.js/VerifyPatients';
import CertificatesAaron from '../../components/Certificates/CertificatesAaron';
import { format, parse } from 'date-fns';
import DocButton from '../../components/DocButton/DocButton';
import EditorWrapper from '../../components/EditorWrapper/EditorWrapper';
import { appBarTheme } from '../../helpers/themes/appBarTheme';

const NurseMeeting2 = ({ isVideo }) => {
	const token = useToken();
	return (
		<AppointmentContextProvider token={token}>
			<div className='row flex-start'>
				{isVideo && (
					<div className='patient-video'>
						<Box isNurse={true} updateImageData={console.log} captureDisabled={true} />
					</div>
				)}
				<div className={`patient-notes-container ${isVideo ? '' : 'face-to-face'}`}>
					<TabContainer />
				</div>
			</div>
			<CertificatesContainer />
		</AppointmentContextProvider>
	);
};

export default NurseMeeting2;

const TabContainer = () => {
	const [value, setValue] = React.useState(0);
	const [hasVerifiedPatients, setHasVerifiedPatients] = useState(false);
	const patients = useBookingUsers();
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const handleVerifiedPatients = useCallback(() => {
		setHasVerifiedPatients(true);
		setValue(1);
	}, []);
	function a11yProps(index) {
		return {
			id: `scrollable-auto-tab-${index}`,
			'aria-controls': `scrollable-auto-tabpanel-${index}`,
		};
	}
	return (
		<div className='tab-container'>
			<ThemeProvider theme={appBarTheme}>
				<AppBar position='static'>
					<Tabs
						value={value}
						onChange={handleChange}
						variant='scrollable'
						scrollButtons='auto'
						aria-label='Appointment Details Tabs'
					>
						<Tab label='Verify Patients' {...a11yProps(0)} disabled={hasVerifiedPatients} />
						<Tab label='Appointment Actions' {...a11yProps(1)} />
						{!!patients &&
							patients.map((p, i) => (
								<Tab
									label={`${p.first_name} ${p.last_name}`}
									{...a11yProps(i + 1)}
									key={i + 1}
									disabled={!hasVerifiedPatients}
								/>
							))}
					</Tabs>
				</AppBar>
			</ThemeProvider>
			<div className='tab-content-container'>
				{value === 0 && (
					<VerifyPatients patients={patients} updateParent={handleVerifiedPatients} />
				)}
				{value === 1 && (
					<div>
						<AppointmentActions />
					</div>
				)}
				{!!patients &&
					patients.map((p, i) =>
						value === i + 2 ? <PatientData patientData={p} key={i} /> : null
					)}
			</div>
		</div>
	);
};
const PatientData = ({ patientData }) => {
	const appointmentId = useAppointmentId();
	const { start_time } = useAppointmentDetails();
	let dobObject = undefined;
	if (patientData && patientData.dob) {
		try {
			var d = parse(patientData.dob, 'yyyy-MM-dd', new Date());
			dobObject = format(d, 'dd/MM/yyyy');
		} catch (err) {
			dobObject = patientData.dob;
		}
	}

	return (
		<div className='patient-notes'>
			<h2 className='no-margin'>Patient Details</h2>
			{patientData && patientData.first_name && (
				<div className='row'>
					<p className='no-margin'>First Name:</p>
					<p>{patientData.first_name}</p>
				</div>
			)}
			{patientData && patientData.first_name && (
				<div className='row'>
					<p className='no-margin'>Last Name:</p>
					<p>{patientData.last_name}</p>
				</div>
			)}
			{typeof dobObject !== 'undefined' && (
				<div className='row'>
					<p className='no-margin'>DOB:</p>
					<p>{dobObject}</p>
				</div>
			)}
			{patientData && typeof patientData.sex !== 'undefined' && (
				<div className='row'>
					<p className='no-margin'>Sex:</p>
					<p>{patientData.sex}</p>
				</div>
			)}
			{patientData && patientData.postal_code && (
				<div className='row'>
					<p className='no-margin'>Post Code:</p>
					<p>{patientData.postal_code}</p>
				</div>
			)}
			{patientData && patientData.email && (
				<div className='row'>
					<p className='no-margin'>Email:</p>
					<p>{patientData.email}</p>
				</div>
			)}
			{patientData && patientData.phone && (
				<div className='row'>
					<p className='no-margin'>Phone Number:</p>
					<p>{patientData.phone}</p>
				</div>
			)}
			{!!start_time && (
				<React.Fragment>
					<h2 className='no-margin'>Appointment Details</h2>
					<div className='row'>
						<p className='no-margin'>Appointment Start Time:</p>
						<p className='no-margin'> {new Date(start_time).toLocaleTimeString()}</p>
					</div>
				</React.Fragment>
			)}

			<div className='row'>
				<p className='no-margin'>Patient Joining link:</p>
				<p className='no-margin' style={{ wordBreak: 'break-all' }}>
					https://myhealth.dochq.co.uk/appointment?appointmentId={appointmentId}
				</p>
			</div>
		</div>
	);
};

const AppointmentActions = () => {
	const {
		isCaptureDisabled,
		toggleDisplayCertificates,
		updateNotes,
		uploadImage,
		img,
		appointmentId,
	} = useContext(AppointmentContext);
	const { end_time } = useAppointmentDetails();
	const endTimeDisplay = `${new Date(end_time).toLocaleTimeString().split(':')[0]}:${
		new Date(end_time).toLocaleTimeString().split(':')[1]
	}`;
	const [notes, setNotes] = useState();

	return (
		<div className='appointment-notes'>
			<div className='row'>
				<p className='no-margin'>Patient Joining link:</p>
				<p className='no-margin' style={{ wordBreak: 'break-all' }}>
					https://myhealth.dochq.co.uk/appointment?appointmentId={appointmentId}
				</p>
			</div>
			<div className='row space-between'>
				<p className='no-margin'>End Time:</p>
				<p className='no-margin'>{endTimeDisplay}</p>
			</div>
			<div className='row space-between'>
				<h2 className='no-margin'>Appointment Notes</h2>
				<DocButton text='Submit Notes' color='green' onClick={() => updateNotes(notes)} />
			</div>
			<EditorWrapper updateContent={setNotes} />
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
					<DocButton text='Issue Certificate' color='pink' onClick={toggleDisplayCertificates} />
				</div>
			</div>
		</div>
	);
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
