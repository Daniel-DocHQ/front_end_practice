import React, { useState, useRef, useEffect } from 'react';
import './OutgoingVideo.scss';
//import Controls from "../Controls/Controls";

const OutgoingVideo = ({
	displayState,
	setStream,
	hasPermission,
	// audioInput,
	// videoInput,
	// devices,
	updateImageData,
	takePhoto,
	isMuted,
	isPhotoMode,
}) => {
	const videoRef = useRef();
	const canvasRef = useRef();
	const [isStreaming, setIsStreaming] = useState(false);
	const [isCreatingStream, setIsCreatingStream] = useState(false);
	const [takingPhoto, setTakingPhoto] = useState(false);
	const [isHidden, setIsHidden] = useState(false);
	// eslint-disable-next-line
	useEffect(() => {
		if (isStreaming === false && hasPermission && isCreatingStream === false) {
			const constraints = { audio: true, video: { facingMode: 'user' } };
			// if (audioInput) {
			//   constraints.audio = { deviceId: audioInput };
			// }
			// if (videoInput) {
			//   constraints.video = { deviceId: videoInput };
			// }
			setIsCreatingStream(true);
			navigator.mediaDevices
				.getUserMedia(constraints)
				.then(handleSuccess)
				.catch(handleError);
		}
	});
	if (takePhoto && takingPhoto !== true) {
		setTakingPhoto(true);
		handleCapture();
	}
	// if (isStreaming && typeof devices !== "undefined") {
	//   const audioTracks = videoRef.current.srcObject.getAudioTracks();
	//   const videoTracks = videoRef.current.srcObject.getVideoTracks();
	//   const selectedAudio = devices.audioDevices.filter(
	//     (device) => device.deviceId === audioInput
	//   );
	//   const selectedVideo = devices.videoDevices.filter(
	//     (device) => device.deviceId === videoInput
	//   );
	//   audioTracks.forEach((track) => {
	//     if (track.kind === "audio" && track.label !== selectedAudio.label) {
	//       track.applyConstraints({ deviceId: audioInput });
	//       console.log("swapped audio");
	//     }
	//   });
	//   videoTracks.forEach((track) => {
	//     if (track.kind === "video" && track.label !== selectedVideo.label) {
	//       track.applyConstraints({ deviceId: videoInput });
	//       console.log("swapped video");
	//     }
	//   });
	// }
	useEffect(() => {
		toggleMic();
	}, [isMuted]);
	if (isStreaming === true && displayState === 'off') {
		const tracks = videoRef.current.srcObject.getTracks();
		if (typeof tracks !== 'undefined') {
			tracks.forEach(function(track) {
				track.stop();
			});
			videoRef.current.srcObject = null;
		}
	}
	function handleSuccess(stream) {
		videoRef.current.srcObject = stream;
		videoRef.current.play().catch(() => console.log(''));
		setStream(stream);
		setIsStreaming(true);
		console.log('is streaming');
	}

	function handleError(error) {
		console.log('getUserMedia error: ', error);
	}
	function handleCapture() {
		console.log('captured self');
		const context = canvasRef.current.getContext('2d');
		// const imageCapture = new ImageCapture(
		//   videoRef.current.srcObject.getVideoTracks()[0]
		// );
		// imageCapture.takePhoto().then((blob) => {
		//   photoRef.current.src = URL.createObjectURL(blob);
		// });
		context.drawImage(videoRef.current, 0, 0, 1280, 720);
		localStorage.setItem('appointmentImage', canvasRef.current.toDataURL('image/webp'));
		console.log(canvasRef.current.toDataURL('image/webp'));
		updateImageData(canvasRef.current.toDataURL('image/webp'));
	}
	function toggleMic() {
		if (videoRef && videoRef.current && videoRef.current.srcObject) {
			videoRef.current.srcObject.getAudioTracks()[0].enabled
				? (videoRef.current.srcObject.getAudioTracks()[0].enabled = false)
				: (videoRef.current.srcObject.getAudioTracks()[0].enabled = true);
			console.log(videoRef.current.srcObject.getAudioTracks()[0].enabled);
		}
	}

	return (
		<React.Fragment>
			<div className='caller-video-container'>
				<div
					className={`video-and-overlay ${isPhotoMode ? 'photo' : ''} ${
						isHidden && !isPhotoMode ? 'hidden-video' : ''
					}`}
					onClick={() => setIsHidden(!isHidden)}
				>
					<video
						className='caller-video'
						ref={videoRef}
						autoPlay
						playsInline
						onClick={() => console.log('clicked')}
						muted
					></video>
					{isPhotoMode && (
						<React.Fragment>
							<div className='overlay-outline'>
								<div className='box left'></div>
								<div className='box center'></div>
								<div className='box right'></div>
							</div>
						</React.Fragment>
					)}
					{isHidden && !isPhotoMode && (
						<React.Fragment>
							<div className='overlay'>
								<i className='fa fa-chevron-left'></i>
							</div>
						</React.Fragment>
					)}
					{!isHidden && !isPhotoMode && (
						<React.Fragment>
							<div className='overlay-close'>
								<i className='fa fa-chevron-right'></i>
							</div>
						</React.Fragment>
					)}
				</div>
			</div>
			<canvas ref={canvasRef} width={1280} height={720} style={{ display: 'none' }} />
		</React.Fragment>
	);
};

export default OutgoingVideo;
