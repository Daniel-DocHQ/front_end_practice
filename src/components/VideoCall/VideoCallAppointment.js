import React, { useEffect, useState, useRef, memo } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import OutgoingVideo from '../OutgoingVideo/OutgoingVideo';
import IncomingVideo from '../IncomingVideo/IncomingVideo';
//import SettingsBar from "../SettingsBar/SettingsBar";
import getURLParams from '../../helpers/getURLParams';
import hasGetUserMedia from '../../helpers/hasGetUserMedia';
import getUserDevices from '../../helpers/getUserDevices';
import './VideoCallAppointment.scss';
import Controls from '../Controls/Controls';
const dochqLogo = require('../../assets/images/icons/dochq-logo-rect.svg');
const dochqLogoSq = require('../../assets/images/icons/dochq-logo-sq.svg');
const audioFile = require('../../assets/call-tone.mp3');
const socketURL =
	typeof process.env.REACT_APP_WEB_SOCKET_URL !== 'undefined'
		? process.env.REACT_APP_WEB_SOCKET_URL
		: 'https://services-websocket-server-staging.dochq.co.uk/';
// check capabilities -- yes
/* IF YES
get devices -- yes
get permissions -- yes
set outgoing stream -- yes
create offer --yes
send offer -- yes
receive answer -- yes
accept answer -- yes
 */

/* IF NO
present user with an error
 */
function VideoCallAppointment({ nurseView, updateImageData, endCall }) {
	const [appointmentId, setAppointmentId] = useState(null);
	const [outgoingStream, setOutgoingStream] = useState();
	const [incomingStream, setIncomingStream] = useState();
	const [receivingCall, setReceivingCall] = useState(false);
	const [callerSignal, setCallerSignal] = useState();
	const [callAccepted, setCallAccepted] = useState(false);
	const [isInitiator, setIsInitiator] = useState(null);
	const [hasPermission, setHasPermission] = useState(false);
	const [devices, setDevices] = useState();
	const [audioInput, setAudioInput] = useState();
	const [videoInput, setVideoInput] = useState();
	const [otherPresent, setOtherPresent] = useState(false);
	const [isViable, setIsViable] = useState(null);
	const [isCalling, setIsCalling] = useState(false);
	const [isEnding, setIsEnding] = useState(false);
	// control related
	const [isMuted, setIsMuted] = useState(false);
	const [isPhotoMode, setIsPhotoMode] = useState(false);
	const [takePhoto, setTakePhoto] = useState(false);
	const [hasEmittedCall, setHasEmittedCall] = useState(false);
	// web socket related
	const socket = useRef();
	const peer = useRef();
	const [connected, setConnected] = useState(false);
	const [connecting, setConnecting] = useState(false);
	useEffect(() => {
		if (endCall && !isEnding) {
			socket.current.emit('endCall', appointmentId);
			handleEndCall();
		} else if (!endCall && isEnding) {
			setIsEnding(false);
		}
	}, [endCall]);
	if (appointmentId === null) {
		setUpAppointmentDetails();
	}

	if (isViable === true && hasPermission !== true) {
		setHasPermission(true);
	}

	useEffect(() => {
		// if runs on init;
		if (appointmentId !== null && isViable === null) {
			checkIsViable()
				.then(result => {
					console.log('isViable: ', result);
					setIsViable(result);
				})
				.catch(err => {
					console.log(err);
					setIsViable(false);
				});
		}
		if (isViable && !connected && !connecting) {
			socket.current = io.connect(socketURL, {
				transports: ['websocket'],
			});
			setConnecting(true);
		}
		if (isViable && connecting) {
			socket.current.on('connect', () => {
				setConnected(true);
				setConnecting(false);
				socket.current.emit('join', appointmentId);
			});
		}
		if (isViable && connected) {
			socket.current.on('otherPresent', () => {
				setOtherPresent(true);
				console.log('someone is already here!');
			});

			socket.current.on('incomingCall', data => {
				if (isInitiator !== true) {
					setReceivingCall(true);
					setCallerSignal(data.signal);
					console.log('call received');
				}
			});
			socket.current.on('endCall', handleEndCall);
		}
		// eslint - disable - next - line;
	}, [isViable, connected, connecting]);

	function callPeer() {
		console.log('call peer');
		setIsCalling(true);
		peer.current = new Peer({
			initiator: true,
			trickle: false,
			config: {
				iceServers: [
					{
						url: 'stun:stun.dochq.co.uk:5349',
					},
					{
						url: 'turn:turn.dochq.co.uk:5349?transport=udp',
						credential: 'somepassword',
						username: 'guest',
					},
					{
						url: 'turn:turn.dochq.co.uk:5349?transport=tcp',
						credential: 'somepassword',
						username: 'guest',
					},
				],
			},
			stream: outgoingStream,
		});

		peer.current.on('signal', data => {
			socket.current.emit('callRoom', {
				appointmentId,
				signalData: data,
			});
		});

		peer.current.on('stream', stream => {
			setIncomingStream(stream);
		});

		socket.current.on('callAccepted', signal => {
			setCallAccepted(true);
			peer.current.signal(signal);
		});
	}

	function acceptCall() {
		console.log('call accepted');
		setIsInitiator(false);
		setCallAccepted(true);
		peer.current = new Peer({
			initiator: false,
			trickle: false,
			stream: outgoingStream,
			config: {
				iceServers: [
					{
						url: 'stun:stun.dochq.co.uk:5349',
					},
					{
						url: 'turn:turn.dochq.co.uk:5349?transport=udp',
						credential: 'somepassword',
						username: 'guest',
					},
					{
						url: 'turn:turn.dochq.co.uk:5349?transport=tcp',
						credential: 'somepassword',
						username: 'guest',
					},
				],
			},
		});
		peer.current.on('signal', data => {
			socket.current.emit('acceptCall', {
				signal: data,
				appointmentId,
			});
		});

		peer.current.on('stream', stream => {
			setIncomingStream(stream);
		});
		peer.current.signal(callerSignal);
		peer.current.on('error', e => {
			setIsCalling(false);
			setHasEmittedCall(false);
			console.log(e);
		});
		peer.current.on('close', e => {
			setIsCalling(false);
			setHasEmittedCall(false);
			console.log(e);
		});
	}
	function setUpAppointmentDetails() {
		const params = getURLParams(window.location.href);
		if (params['appointmentId']) {
			setAppointmentId(params['appointmentId']);
			if (params['nurseId'] || nurseView) {
				setIsInitiator(true);
			}
		} else {
			setAppointmentId('unknown');
		}
	}
	function checkIsViable() {
		if (hasGetUserMedia()) {
			return new Promise((resolve, reject) => {
				getUserDevices()
					.then(devices => {
						console.log('got devices', devices);
						if (
							devices &&
							devices.audioDevices &&
							devices.videoDevices &&
							devices.audioDevices.length > 0 &&
							devices.videoDevices.length > 0
						) {
							setDevices(devices);
							console.log(devices);
							devices.audioDevices.filter(device => {
								if (device.deviceId === 'default') {
									setAudioInput(device.deviceId);
								}
								return device;
							});
							setVideoInput(devices.videoDevices[0].deviceId);
							console.log('audio and video devices present');
							resolve(true);
						} else {
							console.log('unsuitable media devices');
							resolve(false);
						}
					})
					.catch(err => {
						console.log(err);
						resolve(false);
					});
			});
		} else {
			return false;
		}
	}

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
	function handleEndCall() {
		peer.current.destroy();
		setOtherPresent(false);
		setIsCalling(false);
		setHasEmittedCall(false);
		setCallAccepted(false);
		setReceivingCall(false);
		setCallerSignal();
		setIncomingStream();
		setIsEnding(true);
	}
	return (
		<React.Fragment>
			<div
				className='video-call-container'
				style={{
					position: 'absolute',
					top: '0px',
					bottom: '0px',
					width: '100%',
				}}
			>
				{isViable && (
					<React.Fragment>
						{/* <SettingsBar
              navIsVisible={true}
              audioDevices={devices.audioDevices}
              videoDevices={devices.videoDevices}
              audioInput={audioInput}
              videoInput={videoInput}
              updateInput={(type, value) => {
                if (type === "audio") {
                  setAudioInput(value);
                } else if (type === "video") {
                  setVideoInput(value);
                }
              }}
            /> */}
						{typeof nurseView === 'undefined' ? <PatientHeader /> : null}
						<Controls
							isMuted={isMuted}
							isPhotoMode={isPhotoMode}
							updateMuted={setIsMuted}
							updatePhotoMode={setIsPhotoMode}
							capturePhoto={capturePhoto}
							isInitiator={isInitiator}
						/>
						{isInitiator ? (
							<React.Fragment>
								<OutgoingVideo
									setStream={stream => setOutgoingStream(stream)}
									hasPermission={hasPermission}
									audioInput={audioInput}
									videoInput={videoInput}
									devices={devices}
								/>
								<IncomingVideo
									nurseView
									incomingStream={incomingStream}
									constraints={''}
									otherPresent={otherPresent}
									updateImageData={updateImage}
									takePhoto={takePhoto}
									isPhotoMode={isPhotoMode}
								/>
							</React.Fragment>
						) : (
							<React.Fragment>
								<OutgoingVideo
									setStream={stream => setOutgoingStream(stream)}
									hasPermission={hasPermission}
									audioInput={audioInput}
									videoInput={videoInput}
									devices={devices}
								/>
								<IncomingVideo
									incomingStream={incomingStream}
									constraints={''}
									otherPresent={otherPresent}
								/>
							</React.Fragment>
						)}
					</React.Fragment>
				)}
				{receivingCall && !callAccepted && <IncomingCall acceptCall={() => acceptCall()} />}
				{isInitiator && otherPresent && !callAccepted && (
					<StartCall
						callPeer={() => {
							if (!hasEmittedCall) {
								callPeer();
							} else {
								setIsCalling(false);
								setHasEmittedCall(false);
							}
						}}
						isCalling={isCalling}
					/>
				)}
			</div>
		</React.Fragment>
	);
}

export default memo(VideoCallAppointment);

const IncomingCall = ({ acceptCall }) => (
	<div className='make-call'>
		<div className='button-container'>
			<h1>Incoming Call</h1>
			<div className='control-item' onClick={acceptCall} style={{ color: 'var(--doc-green)' }}>
				<i className='fa fa-phone'></i>
			</div>
		</div>
		<audio id='myAudio' style={{ visibility: 'hidden' }} autoPlay>
			<source src={audioFile} type='audio/mp3' />
		</audio>
	</div>
);
const StartCall = ({ callPeer, isCalling }) => (
	<div className='make-call'>
		<div className='button-container'>
			{!isCalling && <h1>Start Call</h1>}{' '}
			{isCalling && (
				<React.Fragment>
					<h1>Calling . . .</h1>
					<audio id='myAudio' style={{ visibility: 'hidden' }}>
						<source src={audioFile} type='audio/mp3' />
					</audio>
				</React.Fragment>
			)}
			<div className='control-item' onClick={callPeer} style={{ color: 'var(--doc-green)' }}>
				<i className='fa fa-phone'></i>
			</div>
		</div>
	</div>
);
export const PatientHeader = () => (
	<div className='patient-header'>
		<h3>Video Consultations</h3>
		<img src={dochqLogo} alt='DocHQ Logo' className='hide-on-sm' />
		<img src={dochqLogoSq} alt='DocHQ Logo' className='show-on-sm' />
	</div>
);
