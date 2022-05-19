import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';

const Room = ({ roomName, token }) => {
	const [room, setRoom] = useState(null);
	const [participants, setParticipants] = useState([]);
	const [isMuted, setIsMuted] = useState(false);
	useEffect(() => {
		const participantConnected = participant => {
			setParticipants(prevParticipants => [...prevParticipants, participant]);
		};

		const participantDisconnected = participant => {
			setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant));
		};

		Video.connect(token, {
			name: roomName,
			video: { width: 720 },
			audio: true,
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
	}, [roomName, token]);

	const handleDisconnect = () => {
		room.disconnect();
		alert('you have disconnected');
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
	const remoteParticipants = participants.map(participant => (
		<Participant key={participant.sid} participant={participant} />
	));

	return (
		<div className='room'>
			<div className='remote-video-container'>{remoteParticipants}</div>
			<div className='local-video-container'>
				<div className='control' onClick={handleToggleAudio}>
					{isMuted ? (
						<i className='fa fa-microphone-slash'></i>
					) : (
						<i className='fa fa-microphone'></i>
					)}
				</div>
				<div className='control' onClick={handleDisconnect}>
					<i className='fa fa-phone'></i>
				</div>
				{room ? (
					<Participant
						key={room.localParticipant.sid}
						participant={room.localParticipant}
						isMuted={isMuted}
						isLocal={true}
					/>
				) : (
					''
				)}
			</div>
		</div>
	);
};

export default Room;
