import React, { useEffect, useState, memo } from 'react';
import './VideoCallAppointment.scss';
import Controls from '../Controls/Controls';
import InVid from '../IncomingVideo/InVid';
import OutVid from '../OutgoingVideo/OutVid';
import DocModal from '../DocModal/DocModal';
import DocButton from '../DocButton/DocButton';
import Video from 'twilio-video';
import { Redirect } from 'react-router-dom';
import useNatureSounds from '../../helpers/hooks/useNatureSounds';
const dochqLogo = require('../../assets/images/icons/dochq-logo-rect-white.svg');
const dochqLogoSq = require('../../assets/images/icons/dochq-logo-sq-white.svg');

const { isSupported } = require('twilio-video');

function TwillioVideoCall({ isNurse, updateImageData, token, appointmentId, captureDisabled }) {
	const sound = useNatureSounds();
	const [isCloseCallVisible, setIsCloseCallVisible] = useState(false);
	const [isVideoClosed, setIsVideoClosed] = useState(false);
	const [isSoundPlayable, setIsSoundPlayable] = useState(!isNurse);
	const [isPhotoMode, setIsPhotoMode] = useState(false);
	const [takePhoto, setTakePhoto] = useState(false);
	const [message, setMessage] = useState(
		isNurse
			? 'Your patient will be with you shortly'
			: 'Your medical practitioner will be with you shortly'
	);
	function capturePhoto() {
		if (isPhotoMode) {
			setTakePhoto(true);
		}
		setTimeout(() => {
			setTakePhoto(false);
		}, 100);
	}
	function updateImage(data) {
		updateImageData(data);
	}
	const [room, setRoom] = useState(null);
	const [participants, setParticipants] = useState([]);
	const [isMuted, setIsMuted] = useState(false);
	useEffect(() => {
		const participantConnected = participant => {
			if (isSoundPlayable) setIsSoundPlayable(false);
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

	const handleDisconnect = () => {
		isNurse ? setIsCloseCallVisible(true) : room.disconnect();
	};

	const handleToggleAudio = () => {
		room.localParticipant.audioTracks.forEach(track => {
			if (track.track.isEnabled) {
				track.track.disable();
			} else {
				track.track.enable();
			}
			console.log(track.track.isEnabled);
			setIsMuted(!track.track.isEnabled);
		});
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
								onClick={() => {
									setIsCloseCallVisible(false);
									if(!!room) {
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
			{isSoundPlayable && <>{sound}</>}
			<div className='video-call-container'>
				<React.Fragment>
					{typeof isNurse !== 'undefined' && !isNurse ? <PatientHeader /> : null}
					<Controls
						isMuted={isMuted}
						isPhotoMode={isPhotoMode}
						updateMuted={handleToggleAudio}
						updatePhotoMode={setIsPhotoMode}
						capturePhoto={capturePhoto}
						isNurse={typeof isNurse !== 'undefined' ? isNurse : false}
						handleDisconnect={handleDisconnect}
						captureDisabled={captureDisabled}
					/>
					<React.Fragment>
						{room && <OutVid participant={room.localParticipant} />}
						{participants.length !== 0 &&
							participants.map(participant => (
								<InVid
									participant={participant}
									updateImageData={updateImage}
									takePhoto={takePhoto}
									isPhotoMode={isPhotoMode}
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
