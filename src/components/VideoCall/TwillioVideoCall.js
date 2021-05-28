import React, { useEffect, useState, memo, useContext } from 'react';
import { get } from 'lodash';
import Controls from '../Controls/Controls';
import InVid from '../IncomingVideo/InVid';
import OutVid from '../OutgoingVideo/OutVid';
import DocModal from '../DocModal/DocModal';
import DocButton from '../DocButton/DocButton';
import Video from 'twilio-video';
import { Redirect } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import { AppointmentContext, useBookingUsers } from '../../context/AppointmentContext';
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
	hideVideoAppointment,
}) {
	const { storeImage, displayCertificates } = useContext(AppointmentContext);
	const patients = useBookingUsers();
	const [counter, setCounter] = useState(0);
	const [bookingUsers, setBookingUsers] = useState(isNurse ? [...patients] : []);
	const [isCloseCallVisible, setIsCloseCallVisible] = useState(false);
	const [isVideoClosed, setIsVideoClosed] = useState(false);
	const [takePhoto, setTakePhoto] = useState(false);
	const currentBookingUserName = `${get(bookingUsers, '[0].first_name', '')} ${get(bookingUsers, '[0].last_name', '')}`;
	const [message, setMessage] = useState(
		isNurse
			? 'Your patient will be with you shortly'
			: 'Your medical practitioner will be with you shortly'
	);
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
	const [room, setRoom] = useState(null);
	const [participants, setParticipants] = useState([]);
	const [isMuted, setIsMuted] = useState(false);

	const updateAppointmentStatus = (status) =>
		bookingService.updateAppointmentStatus(authToken, appointmentId, { status });

	useEffect(() => {
		const participantConnected = participant => {
			setMessage(isNurse ? 'Patient Connected' : 'Medical Professional Connected');
			setParticipants(prevParticipants => [...prevParticipants, participant]);
		};

		const participantDisconnected = participant => {
			setMessage(isNurse ? 'Patient Disconnected' : 'Medical Professional Left');
			setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant));
		};

		Video.connect(token, {
			name: appointmentId,
			audio: true,
			video: { width: 720 },
		}).then(room => {
			setRoom(room);
			room.on('participantConnected', participantConnected);
			room.on('participantDisconnected', participantDisconnected);
			room.participants.forEach(participantConnected);
		});

		return () => {
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
	}, [token]);


	useEffect(() => {
		if (counter < 180 && !isNurse) { // 3 min until show message
			const interval = setInterval(() => {
				setCounter((prev) => prev + 1);
			}, 1000);
			return () => clearInterval(interval);
		} else if (!isNurse) {
			setMessage('Apologies for the delay. Your practitioner is running late on the previous appointment but will be with you as soon as possible. Thank you very much for your understanding.');
		}
	}, [counter]);

	const handleDisconnect = () => {
		if (isNurse) {
			setIsCloseCallVisible(true);
		} else if (!!room ) {
			room.disconnect();
		}
	};

	const handlePause = async () => {
		await updateAppointmentStatus('ON_HOLD');
		if (!!hideVideoAppointment) {
			hideVideoAppointment();
		}
		if (!!room) {
			room.disconnect();
		}
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
									setIsCloseCallVisible(false);
									if(!!room) {
										await updateAppointmentStatus('COMPLETED');
										if (!!hideVideoAppointment) {
											hideVideoAppointment();
										}
										room.disconnect();
									}
									setIsVideoClosed(true);
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
							participants.map(participant => (
								<InVid
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
