import React, { useEffect, useState, memo, useContext } from 'react';
import { get } from 'lodash';
import { format } from 'date-fns';
import Controls from '../Controls/Controls';
import InVid from '../IncomingVideo/InVid';
import OutVid from '../OutgoingVideo/OutVid';
import DocModal from '../DocModal/DocModal';
import DocButton from '../DocButton/DocButton';
import Video from 'twilio-video';
import { Redirect } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import { AppointmentContext, useBookingUsers } from '../../context/AppointmentContext';
import nurseSvc from '../../services/nurseService';
import { ToastsStore } from 'react-toasts';
import './VideoCallAppointment.scss';

const dochqLogo = require('../../assets/images/icons/dochq-logo-rect-white.svg');
const dochqLogoSq = require('../../assets/images/icons/dochq-logo-sq-white.svg');
const { isSupported } = require('twilio-video');

function TwillioVideoCall({
	isNurse,
	updateImageData,
	token,
	appointmentId,
	captureDisabled,
	authToken,
	appointmentInfo,
	hideVideoAppointment,
}) {
	const {
		storeImage,
		displayCertificates,
		status_changes,
	} = useContext(AppointmentContext);
	const [timeBeforeStart, setTimeBeforeStart] = useState(isNurse ? 0 : new Date(appointmentInfo.start_time).getTime() - new Date().getTime());
	const isEarly = timeBeforeStart > 0;
	const patients = useBookingUsers();
	const [counter, setCounter] = useState(0);
	const [room, setRoom] = useState(null);
	const [participants, setParticipants] = useState([]);
	const [isMuted, setIsMuted] = useState(false);
	const [bookingUsers, setBookingUsers] = useState(isNurse ? [...patients] : []);
	const [isCloseCallVisible, setIsCloseCallVisible] = useState(false);
	const [isVideoClosed, setIsVideoClosed] = useState(false);
	const [isAppointmentUnfinished, setIsAppointmentUnfinished] = useState(false);
	const [takePhoto, setTakePhoto] = useState(false);
	const statusChanges = status_changes || [];
	const lastStatus = (get(statusChanges, `${[statusChanges.length - 1]}`, ''));
	const currentBookingUserName = `${get(bookingUsers, '[0].first_name', '')} ${get(bookingUsers, '[0].last_name', '')}`;
	const [message, setMessage] = useState(
		isNurse
			? (!!lastStatus && lastStatus.changed_to === 'PATIENT_ATTENDED') ? `Patient joined at ${format(new Date(lastStatus.created_at), 'dd/MM/yyyy pp')}` : 'Your patient will be with you shortly'
			: 'Your medical practitioner will be with you shortly'
	);
	const disconnectRoom = () => {
		try {
			room.disconnect();
			room.localParticipant.tracks.forEach(function(trackPublication) {
				trackPublication.track.stop();
			});
		} catch (err) {
			console.log(err);
		}
		setRoom(currentRoom => {
			if (currentRoom && currentRoom.localParticipant.state === 'connected') {
				currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
					trackPublication.track.stop();
				});
				currentRoom.disconnect();
				return null;
			} else {
				return currentRoom;
			}
		});
	};
	const handleHideVideoAppointment = () => {
		if (!!hideVideoAppointment) {
			hideVideoAppointment();
		}
		disconnectRoom();
	};
	function capturePhoto() {
		setTakePhoto(true);
		setTimeout(() => {
			setTakePhoto(false);
		}, 100);
	}
	const uploadImageForUser = (img) => {
		if (!!bookingUsers.length) {
			storeImage(img);
			const newBookingUsers = [...bookingUsers];
			newBookingUsers.shift();
			setBookingUsers(newBookingUsers);
		}
	};
	function updateImage(data) {
		updateImageData(data);
	}

	const updateAppointmentStatus = (status) =>
		bookingService.updateAppointmentStatus(appointmentId, { status }, authToken)
		.then((resp) => !!resp.error ? ToastsStore.error(resp.error, 10000) : null)
		.catch(err => ToastsStore.error(err.error, 10000));

	useEffect(() => {
		const participantConnected = participant => {
			setMessage(isNurse ? 'Patient Connected' : 'Medical Professional Connected');
			setParticipants(prevParticipants => [...prevParticipants, participant]);
		};

		const participantDisconnected = participant => {
			setMessage(isNurse ? 'Patient Disconnected' : 'Medical Professional Left');
			if (isNurse) updateAppointmentStatus('PATIENT_LEFT');
			setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant));
		};

		Video.connect(token, {
			name: appointmentId,
			audio: true,
			video: {
				video: { width: 720 },
			}
		}).then(room => {
			setRoom(room);
			room.on('participantConnected', participantConnected);
			room.on('participantDisconnected', participantDisconnected);
			room.participants.forEach(participantConnected);
		});

		return () => disconnectRoom;
	}, [token]);

	useEffect(() => {
		return () => {
			disconnectRoom();
			setTimeout(async () => {
				if (isNurse) {
					await nurseSvc
						.getAppointmentDetails(appointmentId, token)
						.then(result => {
							if (result.success && result.appointment) {
								const { status } = result.appointment;
								if (status !== 'ON_HOLD' && status !== 'COMPLETED') {
									updateAppointmentStatus('PRACTITIONER_LEFT');
								}
							}
						})
						.catch(err => {
							console.log(err)
						});
				} else if (!isNurse) updateAppointmentStatus('PATIENT_LEFT');
			}, 2000);
		};
	}, []);

	useEffect(() => {
		if (!isNurse && timeBeforeStart > 0) { // 3 min until show message
			const interval = setInterval(() => {
				const timeDifference = new Date(appointmentInfo.start_time).getTime() - new Date().getTime();
				setTimeBeforeStart(timeDifference);
				setMessage(
					<p>
						Your appointment starts in {format(new Date(timeDifference), 'mm:ss')}<br />
						Please wait for your practitioner to join the call.<br />
						Thank you.
					</p>
				);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [timeBeforeStart, isEarly]);

	useEffect(() => {
		if (counter < 180 && !isNurse && !isEarly) { // 3 min until show message
			const interval = setInterval(() => {
				setCounter((prev) => prev + 1);
			}, 1000);
			return () => clearInterval(interval);
		} else if (!isNurse && counter > 180 && !isEarly) {
			setMessage(
				<p>
					Apologies for the delay. Your practitioner is running late on the previous appointment but will be with you as soon as possible. Thank you very much for your understanding.<br/><br/>
					If you are waiting for your test results, no worries, your health care professional will be back with you on time to read your test results.
				</p>
			);
		}
	}, [counter, isEarly]);

	const handleDisconnect = async () => {
		if (isNurse) {
			await nurseSvc
				.getAppointmentDetails(appointmentId, token)
				.then(result => {
					if (result.success && result.appointment) {
						const { booking_users } = result.appointment;
						if ([...booking_users].filter((patient) => (!get(patient, 'metadata.result') && !get(patient, 'metadata.sample_taken'))).length) {
							setIsAppointmentUnfinished(true);
						} else {
							setIsAppointmentUnfinished(false);
						}
					}
				})
				.catch(err => {
					console.log(err)
				});
		}
		setIsCloseCallVisible(true);
	};

	const handlePause = async () => {
		await updateAppointmentStatus('ON_HOLD');
		handleHideVideoAppointment();
	}

	const handleToggleAudio = () => {
		if (!!room && !!room.localParticipant) {
			room.localParticipant.audioTracks.forEach(track => {
				if (track.track.isEnabled) {
					track.track.disable();
				} else {
					track.track.enable();
				}
				setIsMuted(!track.track.isEnabled);
			});
		}
	};
	return isSupported ? (
		<React.Fragment>
			<DocModal
				isVisible={isCloseCallVisible}
				onClose={() => setIsCloseCallVisible(false)}
				content={
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						{(isAppointmentUnfinished && isNurse) && (
							<>
								<p>Warning!</p>
								<p>You have not submitted results for all patients.</p>
							</>
						)}
						<p>Are you sure you want to end this call?</p>
						<div className="row space-between">
							<DocButton
								color='green'
								text='No'
								onClick={() => setIsCloseCallVisible(false)}
								style={{ marginRight: '5px' }}
							/>
							<DocButton
								color='pink'
								text='Yes'
								onClick={async () => {
									if (isNurse) {
										if (!!room) {
											await updateAppointmentStatus('COMPLETED');
											handleHideVideoAppointment();
										}
										setIsVideoClosed(true);
									}
									else if (!!room) {
										room.disconnect();
									}
									setIsCloseCallVisible(false);
									setMessage('Call has been closed');
									setTimeBeforeStart(0);
								}}
							/>
						</div>
					</div>
				}
			/>
			<DocModal
				isVisible={isVideoClosed}
				onClose={() => setIsVideoClosed(false)}
				content={
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<p>Your call is closed</p>
						<div style={{ paddingTop: '20px', textAlign: 'center' }}>
							<DocButton
								color='grey'
								text='Close'
								onClick={() => setIsVideoClosed(false)}
								style={{ margin: '5px' }}
							/>
						</div>
					</div>
				}
			/>
			<div className='video-call-container'>
				<React.Fragment>
					{typeof isNurse !== 'undefined' && !isNurse ? <PatientHeader /> : null}
					<Controls
						isMuted={isMuted}
						isPause={!!hideVideoAppointment}
						updateMuted={handleToggleAudio}
						capturePhoto={capturePhoto}
						handlePause={handlePause}
						isNurse={typeof isNurse !== 'undefined' ? isNurse : false}
						handleDisconnect={handleDisconnect}
						currentBookingUserName={currentBookingUserName}
						captureDisabled={captureDisabled || !bookingUsers.length || !displayCertificates}
					/>
					<React.Fragment>
						{room && <OutVid participant={room.localParticipant} />}
						{participants.length !== 0 &&
							participants.map((participant, indx) => (
								<InVid
									key={indx}
									takePhoto={takePhoto}
									participant={participant}
									updateImageData={updateImage}
									storeImage={uploadImageForUser}
									currentBookingUserName={currentBookingUserName}
								/>
							))}
					</React.Fragment>
					<Message message={message} />
				</React.Fragment>
			</div>
		</React.Fragment>
	) : (
		<Redirect to='/unsupported-browser' />
	);
}

export default memo(TwillioVideoCall);

export const PatientHeader = () => (
	<div className='patient-header'>
		<img src={dochqLogo} alt='DocHQ Logo' className='hide-on-sm' />
		<img src={dochqLogoSq} alt='DocHQ Logo' className='show-on-sm' />
		<h3>Video Consultation</h3>
		<div style={{ width: 150 }}/>
	</div>
);

const Message = ({ message }) => (
	<div className='message-background'>{message || 'hello world'}</div>
);
