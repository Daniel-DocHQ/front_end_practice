import { Grid } from '@material-ui/core';
import React, { useState, useRef, useEffect } from 'react';
import DocButton from '../DocButton/DocButton';
import './IncomingVideo.scss';

const InVid = ({
	takePhoto,
	participant,
	storeImage,
	currentBookingUserName,
}) => {
	const containerRef = useRef();
	const canvasRef = useRef();
	const [isHidden, setIsHidden] = useState(false);
	const [bufferPhoto, setBufferPhoto] = useState();
	const [videoTracks, setVideoTracks] = useState([]);
	const [audioTracks, setAudioTracks] = useState([]);
	const videoRef = useRef();
	const audioRef = useRef();

	useEffect(() => {
		if (takePhoto) {
			handleCapture();
		}
	}, [takePhoto]);


	const cleanBufferPhoto = () => setBufferPhoto();

	function handleCapture() {
		console.log(canvasRef, canvasRef.current, videoRef, videoRef.current);
		const context = canvasRef.current.getContext('2d');
		context.drawImage(videoRef.current, 0, 0, 1280, 720);
		setBufferPhoto(canvasRef.current.toDataURL('image/webp'));
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
					className={`video-and-overlay ${
						isHidden ? 'hidden-video' : ''
					}`}
					onClick={() => setIsHidden(!isHidden)}
				>
					<video className='answer-video' ref={videoRef} autoPlay playsInline></video>
					<audio ref={audioRef} autoPlay={true} />
				</div>
				{!!bufferPhoto && (
					<div className="captured-image-box">
						<p className="captured-text">{currentBookingUserName} - Captured Image:</p>
						<Grid container justify="space-between" spacing={2}>
							<Grid item xs={6}>
								<img className="captured-img" src={bufferPhoto} />
							</Grid>
							<Grid item container direction="column" justify="space-between" xs={6}>
								<Grid item>
									<DocButton
										flat
										text='Cancel'
										color='white'
										style={{ width: '100%' }}
										onClick={cleanBufferPhoto}
									/>
								</Grid>
								<Grid item>
									<DocButton
										text='Take another one'
										color='green'
										style={{ width: '100%', margin: '10px 0px' }}
										onClick={cleanBufferPhoto}
									/>
								</Grid>
								<Grid item>
									<DocButton
										text='Upload image'
										color='green'
										style={{ width: '100%' }}
										onClick={() => {
											storeImage(bufferPhoto);
											cleanBufferPhoto();
										}}
									/>
								</Grid>
							</Grid>
						</Grid>
					</div>
				)}
			</div>
			<canvas ref={canvasRef} width={1280} height={720} style={{ display: 'none' }} />
		</React.Fragment>
	);
};

export default InVid;
