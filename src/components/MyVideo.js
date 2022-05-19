import React, { useState, useRef } from 'react';

const MyVideo = () => {
	const [displayMicSelect, setDisplayMicSelect] = useState(false);
	const [audioInputs, setAudioInputs] = useState({});
	const [videoInputs, setVideoInputs] = useState({});

	const videoRef = useRef();
	const canvasRef = useRef();
	const photoRef = useRef();

	// Put variables in global scope to make them available to the browser console.
	const constraints = {
		audio: true,
		video: { facingMode: 'user', height: 360, width: 680 },
	};

	function handleSuccess(stream) {
		if (typeof window !== 'undefined') window.stream = stream; // only to make stream available to console
		videoRef.current.srcObject = stream;
	}

	function handleError(error) {
		console.log('getUserMedia error: ', error);
	}
	function startCamera() {
		navigator.mediaDevices
			.getUserMedia(constraints)
			.then(handleSuccess)
			.catch(handleError);
	}
	function stopStream() {
		const tracks = videoRef.current.srcObject.getTracks();
		tracks.forEach(function(track) {
			track.stop();
		});
		videoRef.current.srcObject = null;
	}
	function toggleMic() {
		if (videoRef && videoRef.current && videoRef.current.srcObject) {
			videoRef.current.srcObject.getAudioTracks()[0].enabled
				? (videoRef.current.srcObject.getAudioTracks()[0].enabled = false)
				: (videoRef.current.srcObject.getAudioTracks()[0].enabled = true);
			console.log(videoRef.current.srcObject.getAudioTracks()[0].enabled);
		}
	}
	function handleCanPlay() {
		videoRef.current.play();
		if (audioInputs.length < 1) {
			setAudioInputs(getUserDevices().audioDevices);
		}
		if (videoInputs.length < 1) {
			setVideoInputs(getUserDevices().videoDevices);
		}
		// // set width and height of video and canvas element
		// const height =
		//   videoRef.current.videoHeight / (videoRef.current.videoWidth / 320);
		// videoRef.current.width = 320;
		// videoRef.current.height = height;
		// canvasRef.current.width = 320;
		// canvasRef.current.height = height;
	}
	async function getUserDevices() {
		const devices = await navigator.mediaDevices.enumerateDevices();
		let audioDevices = [],
			videoDevices = [];
		if (devices && devices.length > 0) {
			devices.forEach(device => {
				if ((device.kind && device.kind === 'audioinput') || 'audiooutput') {
					audioDevices.push(device);
				} else if (device.kind && device.kind === 'videoinput') {
					videoDevices.push(device);
				}
			});
			return { audioDevices, videoDevices };
		} else {
			return { error: 'No devices found' };
		}
	}
	function handleCapture() {
		const context = canvasRef.current.getContext('2d');
		// const imageCapture = new ImageCapture(
		//   videoRef.current.srcObject.getVideoTracks()[0]
		// );
		// imageCapture.takePhoto().then((blob) => {
		//   photoRef.current.src = URL.createObjectURL(blob);
		// });
		context.drawImage(videoRef.current, 0, 0, 1280, 720);
		photoRef.current.src = canvasRef.current.toDataURL('image/webp');
	}
	function toggleSpeaker() {
		videoRef.current.muted = !videoRef.current.muted;
	}

	return (
		<React.Fragment>
			<h1>Live Video</h1>
			<video
				className='video'
				ref={videoRef}
				autoPlay
				playsInline
				onCanPlay={handleCanPlay}
			></video>
			<div id='errorMsg'></div>
			<button onClick={startCamera}>Start Camera</button>
			<button onClick={stopStream}>Stop Camera</button>
			<button onClick={toggleMic}>Mic</button>
			<button onClick={toggleSpeaker}>Speaker</button>
			<button onClick={handleCapture}>Take Picture</button>
			<div className='mic'>
				<button onClick={() => setDisplayMicSelect(true)}>Mic Select</button>
				{displayMicSelect && <div className='mic-select'></div>}
			</div>
			<div className='speaker'>
				<button onClick={() => setDisplayMicSelect(true)}>Speaker Select</button>
			</div>
			<h1>Snapshot</h1>
			<canvas ref={canvasRef} width={1280} height={720} style={{ display: 'none' }} />
			<div className='output'>
				<img id='photo' ref={photoRef} alt='The screen capture will appear in this box.' />
			</div>
		</React.Fragment>
	);
};

export default MyVideo;
