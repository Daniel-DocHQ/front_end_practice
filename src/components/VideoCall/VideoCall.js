import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import OutgoingVideo from '../OutgoingVideo/OutgoingVideo';
import IncomingVideo from '../IncomingVideo/IncomingVideo';
import SettingsBar from '../SettingsBar/SettingsBar';
import hasGetUserMedia from '../../helpers/hasGetUserMedia';
import getURLParams from '../../helpers/getURLParams';
import getUserDevices from '../../helpers/getUserDevices';

const ENDPOINT = 'http://127.0.0.1:4001';
const iceConfig = {
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
};

// check capabilities -- y
/* IF YES
get devices -- y
get permissions -- y
set outgoing stream -- y
create offer
send offer
receive answer
accept answer
 */

/* IF NO
present user with an error
 */
const VideoCall = ({ nurseView, providedAppointmentId, navIsVisible }) => {
	const [peer, setPeer] = useState(new RTCPeerConnection(iceConfig));
	const [outgoingStream, setOutgoingStream] = useState();
	const [incomingStream, setIncomingStream] = useState();
	const [socket, setSocket] = useState(io.connect('https://ui-video-consultations.dochq.co.uk/'));
	const [isSocketConnected, setIsSocketConnected] = useState(false);
	const [isViable, setIsViable] = useState(null);
	const [creatingOffer, setCreatingOffer] = useState(false);
	const [offerCreated, setOfferCreated] = useState(false);
	const [offerReceived, setOfferReceived] = useState(false);
	const [answerReceived, setAnswerReceived] = useState(false);
	const [answerCreated, setAnswerCreated] = useState(false);
	const [devices, setDevices] = useState();
	const [selectedConstraints, setSelectedConstraints] = useState({
		audio: true,
		video: {
			facingMode: 'user',
		},
	});
	const [hasPermission, setHasPermission] = useState(false);
	const [appointmentId, setAppointmentId] = useState(null);
	// Get appointment from URL params or from component

	// if (typeof providedAppointmentId === "undefined") {
	//   const params = getURLParams(window.location.href);
	//   if (params["appointmentId"]) {
	//     setAppointmentId(params["appointmentId"]);
	//   } else if (typeof providedAppointmentId !== "undefined") {
	//     setAppointmentId(providedAppointmentId);
	//   } else {
	//     setAppointmentId("unknown");
	//   }
	// }

	// check if viable
	if (isViable === null) {
		setIsViable(hasGetUserMedia());
		console.log(hasGetUserMedia);
	}
	// if viable, get audio and media devices to pass to settings etc
	useEffect(() => {
		if (isViable === true) {
			getUserDevices().then(devices => {
				setHasPermission(true);
				setDevices(devices);
				console.log('got devices', devices);
			});
		} else {
			// display error to user
		}
	}, [isViable]);
	// Connect to web socket room and create peer
	socket.on('connect', () => {
		if (isSocketConnected === false) {
			setIsSocketConnected(true);
			// join appointment id
			socket.emit('join', '2');
			console.log('connected and joined room');
		}
	});

	//  Socket receives offer
	socket.on('offer', offer => {
		if (offerReceived === false) {
			setOfferReceived(true);
			console.log('offer received');
			console.log(JSON.parse(offer));
			peer.setRemoteDescription(JSON.parse(offer));
			peer
				.createAnswer()
				.then(answer => {
					peer.setLocalDescription(new RTCSessionDescription(answer));
					socket.emit('createAnswer', JSON.stringify({ answer, appointmentId: '2' }));
					setAnswerCreated(true);
					console.log('created and sent answer');
				})
				.catch(err => console.log(err));
		}
	});

	// Socket receives answer
	socket.on('answer', answer => {
		if (answerReceived === false) {
			console.log('received answer');
			setAnswerReceived(true);
			peer.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
		}
	});
	// If viable, and outgoingStream and socket connected, create offer
	useEffect(() => {
		if (
			isViable &&
			outgoingStream &&
			!offerCreated &&
			creatingOffer === false &&
			isSocketConnected
		) {
			setCreatingOffer(true);
			console.log('creating peer and offer');
			createPeerAndOffer();
		}
	}, [isViable, outgoingStream, isSocketConnected]);
	function createPeerAndOffer() {
		peer
			.createOffer()
			.then(offer => {
				console.log(peer);
				peer.setLocalDescription(new RTCSessionDescription(offer));
				console.log('created offer');
				socket.emit('createOffer', JSON.stringify({ offer, appointmentId: '2' }));
				setOfferCreated(true);
				console.log('sent offer');
			})
			.catch(err => console.log(err));
	}

	return (
		<React.Fragment>
			<SettingsBar navIsVisible={navIsVisible} audioDevices={''} videoDevices={''} />
			<OutgoingVideo
				setStream={stream => setOutgoingStream(stream)}
				hasPermission={hasPermission}
				constraints={selectedConstraints}
			/>
			{nurseView ? (
				<IncomingVideo nurseView incomingStream={incomingStream} constraints={''} />
			) : (
				<IncomingVideo incomingStream={incomingStream} constraints={''} />
			)}
		</React.Fragment>
	);
};

export default VideoCall;
