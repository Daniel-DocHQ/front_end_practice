import React, { useState, useRef, useEffect } from 'react';
import './IncomingVideo.scss';
// on open, get appointmentId
// connect to websocket server room appointmentId
// send offer and create candidate?
// listen for answers, offers and candidates
// may not receive an answer, may receive offer as other person joins
// respond to offers with answers
const IncomingVideo = ({
	nurseView,
	incomingStream,
	otherPresent,
	updateImageData,
	takePhoto,
	isPhotoMode,
}) => {
	const videoRef = useRef();
	const containerRef = useRef();
	const [isStreaming, setIsStreaming] = useState(false);
	let constraints = {
		audio: true,
		video: {
			facingMode: 'user',
			height: window.innerHeight,
			width: window.innerWidth,
		},
	};
	const [takingPhoto, setTakingPhoto] = useState(false);
	const canvasRef = useRef();
	const [isHidden, setIsHidden] = useState(false);

	if (takePhoto && takingPhoto !== true) {
		setTakingPhoto(true);
		handleCapture();
	}
	useEffect(() => {
		if (isStreaming === false && typeof incomingStream !== 'undefined') {
			if (nurseView) {
				constraints.video.height = containerRef.current.offsetHeight;
				constraints.video.width = containerRef.current.offsetWidth;
			}
			videoRef.current.srcObject = incomingStream;
			videoRef.current.play();
			setIsStreaming(true);
		}
	}, [incomingStream, constraints, isStreaming, nurseView]);
	useEffect(() => {
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	function handleResize() {
		if (nurseView) {
			constraints.video.height = containerRef.current.offsetHeight;
			constraints.video.width = containerRef.current.offsetWidth;
		} else {
			constraints.video.height = window.innerHeight;
			constraints.video.width = window.innerWidth;
		}
	}

	function handleCapture() {
		console.log('captured inc');
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

	return (
		<React.Fragment>
			<div className='answer-video-container' ref={containerRef}>
				<div className={`nobody-present ${isStreaming !== false ? 'hidden' : ''}`}>
					{nurseView ? (
						otherPresent ? (
							<h1>Patient is in the room.</h1>
						) : (
							<h1>Please wait, your patient should be with you shortly.</h1>
						)
					) : (
						<h1>Please wait, your medical professional will be with you shortly.</h1>
					)}
				</div>
				<div
					className={`video-and-overlay ${isPhotoMode ? 'photo' : ''} ${
						isHidden && !isPhotoMode ? 'hidden-video' : ''
					}`}
					onClick={() => setIsHidden(!isHidden)}
				>
					<video
						className='answer-video'
						ref={videoRef}
						autoPlay
						playsInline
						onClick={() => console.log('clicked')}
					></video>
					{/* muted for dev purposes */}
					{isPhotoMode && (
						<React.Fragment>
							<div className='overlay-outline'>
								<div className='box left'></div>
								<div className='box center'></div>
								<div className='box right'></div>
							</div>
						</React.Fragment>
					)}
				</div>
			</div>
			<canvas ref={canvasRef} width={1280} height={720} style={{ display: 'none' }} />
		</React.Fragment>
	);
};

export default IncomingVideo;
