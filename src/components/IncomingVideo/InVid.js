import React, { useState, useRef, useEffect } from 'react';
import './IncomingVideo.scss';

const InVid = ({ updateImageData, takePhoto, isPhotoMode, participant }) => {
	const containerRef = useRef();
	const [takingPhoto, setTakingPhoto] = useState(false);
	const canvasRef = useRef();
	const [isHidden, setIsHidden] = useState(false);
	const [videoTracks, setVideoTracks] = useState([]);
	const [audioTracks, setAudioTracks] = useState([]);
	const videoRef = useRef();
	const audioRef = useRef();
	if (takePhoto && takingPhoto !== true) {
		setTakingPhoto(true);
		handleCapture();
	}

	function handleCapture() {
		console.log('captured inc');
		console.log(canvasRef, canvasRef.current, videoRef, videoRef.current);
		const context = canvasRef.current.getContext('2d');
		context.drawImage(videoRef.current, 0, 0, 1280, 720);
		localStorage.setItem('appointmentImage', canvasRef.current.toDataURL('image/webp'));
		console.log(canvasRef.current.toDataURL('image/webp'));
		updateImageData(canvasRef.current.toDataURL('image/webp'));
	}

	const trackpubsToTracks = trackMap =>
		Array.from(trackMap.values())
			.map(publication => publication.track)
			.filter(track => track !== null);

	useEffect(() => {
		setVideoTracks(trackpubsToTracks(participant.videoTracks));
		setAudioTracks(trackpubsToTracks(participant.audioTracks));

		const trackSubscribed = track => {
			if (track.kind === 'video') {
				setVideoTracks(videoTracks => [...videoTracks, track]);
			} else if (track.kind === 'audio') {
				setAudioTracks(audioTracks => [...audioTracks, track]);
			}
		};

		const trackUnsubscribed = track => {
			if (track.kind === 'video') {
				setVideoTracks(videoTracks => videoTracks.filter(v => v !== track));
			} else if (track.kind === 'audio') {
				setAudioTracks(audioTracks => audioTracks.filter(a => a !== track));
			}
		};

		participant.on('trackSubscribed', trackSubscribed);
		participant.on('trackUnsubscribed', trackUnsubscribed);

		return () => {
			setVideoTracks([]);
			setAudioTracks([]);
			participant.removeAllListeners();
		};
	}, [participant]);

	useEffect(() => {
		const videoTrack = videoTracks[0];
		if (videoTrack) {
			videoTrack.attach(videoRef.current);
			return () => {
				videoTrack.detach();
			};
		}
	}, [videoTracks]);

	useEffect(() => {
		const audioTrack = audioTracks[0];
		if (audioTrack) {
			audioTrack.attach(audioRef.current);
			return () => {
				audioTrack.detach();
			};
		}
	}, [audioTracks]);

	return (
		<React.Fragment>
			<div className='answer-video-container' ref={containerRef}>
				{/* <div className={`nobody-present ${isStreaming !== false ? 'hidden' : ''}`}>
					{nurseView ? (
						otherPresent ? (
							<h1>Patient is in the room.</h1>
						) : (
							<h1>Please wait, your patient should be with you shortly.</h1>
						)
					) : (
						<h1>Please wait, your medical professional will be with you shortly.</h1>
					)}
				</div> */}
				<div
					className={`video-and-overlay ${isPhotoMode ? 'photo' : ''} ${
						isHidden && !isPhotoMode ? 'hidden-video' : ''
					}`}
					onClick={() => setIsHidden(!isHidden)}
				>
					<video className='answer-video' ref={videoRef} autoPlay playsInline></video>
					<audio ref={audioRef} autoPlay={true} />
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

export default InVid;
