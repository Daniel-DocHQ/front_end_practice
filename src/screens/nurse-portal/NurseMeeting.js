import React, { useState, useEffect, useContext, memo } from 'react';
import moment from 'moment';
import { parse, format } from 'date-fns';

import DocButton from '../../components/DocButton/DocButton';
import '../../assets/css/NurseMeeting.scss';

import nurseService from '../../services/nurseService';
import getURLParams from '../../helpers/getURLParams';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import dataURItoBlob from '../../helpers/dataURItoBlob';
import authorisationSvc from '../../services/authorisationService';
import DocModal from '../../components/DocModal/DocModal';
import Box from '../../components/TwilioVideo/Box';
import EditorWrapper from '../../components/EditorWrapper/EditorWrapper';
import CertificatesAaron from '../../components/Certificates/CertificatesAaron';
import bookingUserDataService from '../../services/bookingUserDataService';
import { formatCertificateDate } from '../../helpers/formatDate';
import bookingService from '../../services/bookingService';

const NurseMeeting = ({ isVideo, isAuthenticated, token, role, user }) => {
	const [newNotes, setNewNotes] = useState('');
	const [imageSrc, setImageSrc] = useState();
	const [gotAppointmentData, setGotAppointmentData] = useState(false);
	const [appointmentData, setAppointmentData] = useState();
	const [captureDisabled, setCaptureDisabled] = useState(false);
	const [patientData, setPatientData] = useState();
	const [appointmentId, setAppointmentId] = useState();
	const [patientNotes, setPatientNotes] = useState();
	const [testKitId, setTestKitId] = useState('');
	const [isRapidTest, setIsRapidTest] = useState(false);
	const [isVisible, setIsVisible] = useState();
	const [appointmentStartTime, setAppointmentStartTime] = useState();
	const [patientTestResults, setPatientTestResults] = useState();
	const [endCall, setEndCall] = useState(false);
	const [imgVisible, setImgVisible] = useState(false);
	const [certificateChildren, setCertificateChildren] = useState([]);
	useEffect(() => {
		if (endCall) {
			setTimeout(setEndCall(false), 3000);
		}
	}, [endCall]);
	let history = useHistory();
	if (isAuthenticated !== true && role !== 'practitioner') {
		history.push('/login');
	}
	useEffect(() => {
		if (!appointmentId) {
			const params = getURLParams(window.location.href);
			if (params['appointmentId']) {
				setAppointmentId(params['appointmentId']);
			}
			if (params['testing_kit_id']) {
				setTestKitId(params['testing_kit_id']);
			}
		}
		// eslint-disable-next-line
	}, [appointmentId]);
	useEffect(() => {
		if (!gotAppointmentData && typeof appointmentId !== 'undefined') {
			getAppointmentDetails();
			getPatientNotes();
		}
		// eslint-disable-next-line
	}, [gotAppointmentData, appointmentId]);
	function updateNotes() {
		nurseService
			.addNotes(appointmentId, newNotes, token)
			.then(result => {
				if (result.success) {
					ToastsStore.success(`Updated Notes`);
				} else {
					ToastsStore.error(`Failed to update notes`);
				}
			})
			.catch(err => {
				ToastsStore.error(`Failed to update notes`);
			});
	}
	function uploadImage() {
		if (typeof imageSrc !== 'undefined') {
			const blob = dataURItoBlob(imageSrc);
			blob.name = `${appointmentId}.webp`;
			const formData = new FormData();
			formData.append('file', blob);
			nurseService
				.uploadImage(appointmentId, formData, token)
				.then(resp => {
					if (resp.success) {
						ToastsStore.success('Successfully uploaded image');
					} else {
						ToastsStore.error('Error uploading image, please try again');
					}
				})
				.catch();
		} else {
			ToastsStore.error('Please take a snapshot');
			return { success: false, error: 'Image is not defined' };
		}
	}
	function getAppointmentDetails() {
		nurseService
			.getAppointmentDetails(appointmentId, token)
			.then(result => {
				if (result.success && result.appointment) {
					setGotAppointmentData(true);
					setAppointmentData(result.appointment);
					setCaptureDisabled(
						result && result.appointment && result.appointment.type === 'video_gp'
					);
					setAppointmentStartTime(new Date(result.appointment.start_time).toLocaleTimeString());
					setPatientData(result.appointment.booking_user);
					if (result.appointment.booking_user.email) {
						getPatientTestResults(result.appointment.booking_user.email);
					}
					if (result.appointment.testing_kit_id) {
						setTestKitId(result.appointment.testing_kit_id);
					}
					if (result.appointment.testing_kit_type) {
						if (result.appointment.testing_kit_type === 'rapid_pcr') {
							setIsRapidTest(true);
						} else {
							setIsRapidTest(false);
						}
					} else {
						// TODO handle missing test kit type
					}
					ToastsStore.success(`Found appointment notes`);
				} else {
					ToastsStore.error(`Cannot find appointment notes`);
				}
			})
			.catch(err => ToastsStore.error(`Cannot find appointment notes`));
	}
	function getPatientNotes() {
		nurseService
			.getPatientNotes(appointmentId, token)
			.then(result => {
				if (result.success && result.appointments) {
					setPatientNotes(result.appointments);
					ToastsStore.success(`Found past appointment notes`);
				} else {
					ToastsStore.error(`Cannot find past appointment notes`);
				}
			})
			.catch(err => ToastsStore.error(`Cannot find past appointment notes`));
	}
	function getPatientTestResults(patientEmail) {
		nurseService
			.getPatientTestResults(patientEmail, token)
			.then(result => {
				if (result.success && result.test_results) {
					setPatientTestResults(result.test_results);
					ToastsStore.success(`Found past test results`);
				} else {
					ToastsStore.error(`Cannot find past test results`);
				}
			})
			.catch(err => ToastsStore.error(`Cannot find past test results`));
	}
	function updateTestKit(result) {
		const formData = {};
		formData.result = result;
		nurseService
			.updateTestKit(token, appointmentId, formData)
			.then(result => {
				if (result.success) {
					ToastsStore.success('Successfully updated test kit status');
				} else if (!result.success && !result.isAuthenticated) {
					ToastsStore.error(`User is not authenticated`);
					authorisationSvc.logout();
					history.push('/login');
				} else {
					ToastsStore.error(`Failed to update test kit status`);
				}
			})
			.catch(() => ToastsStore.error(`Failed to update test kit status`));
	}

	function certificateAddChild() {
		if (certificateChildren.length < 4) {
			setCertificateChildren([...certificateChildren, 'pending']);
		}
	}

	function sendResult(formData, key) {
		const body = formData;
		body.medicalprofessional = `${user.first_name} ${user.last_name}`;

		let currentDate = new Date();
		const munusTime = date => {
			const d = new Date(date);
			const newDate = new Date(d.getTime() - 60 * 15 * 1000);
			return newDate;
		};

		body.date_sampled = formatCertificateDate(munusTime(currentDate));
		body.date_reported = formatCertificateDate(currentDate);

		body.security_checked = 'true';
		let certStatuses = certificateChildren;
		bookingService
			.sendResult(token, appointmentId, body)
			.then(result => {
				if (result.success) {
					certStatuses[key] = 'success';
					ToastsStore.success('Generated certificate');
					setCertificateChildren(certStatuses);
				} else {
					certStatuses[key] = 'failed';
					ToastsStore.error('Failed to generate certificate');
					setCertificateChildren(certStatuses);
				}
			})
			.catch(() => {
				ToastsStore.error('Failed to generate certificate');
				certStatuses[key] = 'failed';
				console.log(certStatuses, key, certStatuses[key]);
				setCertificateChildren(certStatuses);
			});
	}
	function getPatientData(i) {
		if (typeof appointmentData !== 'undefined' && appointmentData !== null) {
			if (
				Array.isArray(appointmentData.booking_users) &&
				typeof appointmentData.booking_users[i] !== 'undefined'
			) {
				return appointmentData.booking_users[i];
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
	return (
		<React.Fragment>
			<DocModal
				title='Captured Image'
				isVisible={imgVisible}
				onClose={() => setImgVisible(false)}
				content={
					<img style={{ maxWidth: '100%', width: '500px' }} src={imageSrc} alt='patient-image' />
				}
			/>
			<div className='screen-container'>
				<div className='row flex-start'>
					{isVideo && (
						<div className='patient-video'>
							<Box isNurse={true} updateImageData={setImageSrc} captureDisabled={captureDisabled} />
						</div>
					)}
					<div className='doc-container' style={{ width: '40%' }}>
						<div className={`patient-notes-container ${isVideo ? '' : 'face-to-face'}`}>
							<PatientData
								patientData={patientData}
								testKitId={testKitId}
								appointmentStartTime={appointmentStartTime}
								appointmentId={appointmentId}
							/>
							<div className='appointment-notes'>
								<div className='row space-between'>
									<h2 className='no-margin'>Appointment Notes</h2>
									<DocButton text='Submit Notes' color='green' onClick={updateNotes} />
								</div>
								<EditorWrapper updateContent={setNewNotes} />
								{!captureDisabled && (
									<div className='row space-between'>
										<h3 className='no-margin'>Captured Image: </h3>
										{typeof imageSrc === 'undefined' && <p>No image taken</p>}
										{typeof imageSrc !== 'undefined' && (
											<img
												src={imageSrc}
												className='expanding-image'
												style={{ maxWidth: '100px' }}
												alt='Patients test kit'
												onClick={() => setImgVisible(true)}
											/>
										)}
										<DocButton text='Upload Image' color='green' onClick={uploadImage} />
									</div>
								)}
								<div className='appointment-buttons'>
									<div className='row'>
										<DocButton
											text='Issue Certificate'
											color='pink'
											onClick={certificateAddChild}
										/>
										<DocModal
											title={isRapidTest ? 'Test Result' : 'Sample Taken'}
											isVisible={isVisible}
											onClose={() => {
												setIsVisible(false);
											}}
											content={
												isRapidTest ? (
													<RapidTest
														testKitId={testKitId}
														respond={value => {
															updateTestKit(value);
															setIsVisible(false);
														}}
													/>
												) : (
													<SampleTaken
														testKitId={testKitId}
														respond={value => {
															updateTestKit(value);
															setIsVisible(false);
														}}
													/>
												)
											}
										/>
									</div>
									{certificateChildren.length === 3 && (
										<div className='row no-margin'>
											<p className='error'>Maximum 3 certificates per appointment</p>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='row space-around' style={{ flexWrap: 'wrap' }}>
					{certificateChildren.length !== 0 &&
						certificateChildren.map((status, key) =>
							status === 'pending' || status === 'failed' ? (
								<CertificatesAaron
									key={key}
									submit={sendResult}
									i={key}
									statusMessage={status}
									patient_data={getPatientData(key - 1)}
								/>
							) : null
						)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default memo(NurseMeeting);

const PatientData = ({ patientData, testKitId, appointmentStartTime, appointmentId }) => {
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
			<div className='row'>
				<p className='no-margin'>Test Kit Id:</p>
				<p className='no-margin'>{testKitId || 'unknown'}</p>
			</div>
			{appointmentStartTime && (
				<React.Fragment>
					<h2 className='no-margin'>Appointment Details</h2>
					<div className='row'>
						<p className='no-margin'>Appointment Start Time:</p>
						<p className='no-margin'> {appointmentStartTime}</p>
					</div>
				</React.Fragment>
			)}

			<div className='row'>
				<p className='no-margin'>Patient Joining link:</p>
				<p className='no-margin'>
					https://myhealth.dochq.co.uk/appointment?appointmentId={appointmentId}
				</p>
			</div>
		</div>
	);
};
const RapidTest = ({ respond, testKitId }) => (
	<React.Fragment>
		<div className='submit-result-container' style={{ textAlign: 'center', width: '100%' }}>
			<div className='test-id'>Test Kit ID: {testKitId}</div>
			<div className='row space-around'>
				<DocButton text='Positive' onClick={() => respond('positive')} color='green' />
				<DocButton text='Negative' onClick={() => respond('negative')} color='pink' />
			</div>
		</div>
	</React.Fragment>
);

const SampleTaken = ({ respond, testKitId }) => (
	<React.Fragment>
		<div className='submit-result-container' style={{ textAlign: 'center', width: '100%' }}>
			{/* <div className='test-id'>Test Kit ID: {testKitId}</div> */}
			<h3>Confirm sample has been collected</h3>
			<div className='row space-around'>
				<DocButton text='Yes' onClick={() => respond('correct')} color='green' />
				<DocButton text='Invalid' onClick={() => respond('invalid')} color='dark-grey' />
				<DocButton text='Rejected' onClick={() => respond('rejected')} color='pink' />
			</div>
		</div>
	</React.Fragment>
);
