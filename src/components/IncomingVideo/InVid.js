import { Grid, Typography, Tooltip } from '@material-ui/core';
import React, { useState, useRef, useEffect } from 'react';
import jsQR from "jsqr";
import DocButton from '../DocButton/DocButton';
import copyToClipboard from '../../helpers/copyToClipboard';
import './IncomingVideo.scss';

const InVid = ({
	scanQr,
	stopScanQr,
	takePhoto,
	participant,
	storeImage,
	localVideoTracks,
	currentBookingUserName,
	currentBookingUserId,
}) => {
	const containerRef = useRef();
	const canvasRef = useRef();
	const qrCodeRef = useRef(null);
	const [isHidden, setIsHidden] = useState(false);
	const [bufferPhoto, setBufferPhoto] = useState();
	const [scanQrInterval, setScanQrInterval] = useState();
	const [qrResult, setQrResult] = useState();
	const [videoTracks, setVideoTracks] = useState([]);
	const [audioTracks, setAudioTracks] = useState([]);
	const videoRef = useRef();
	const audioRef = useRef();

	const cleanBufferPhoto = () => setBufferPhoto();

	function handleCapture() {
		const context = canvasRef.current.getContext('2d');
		context.clearRect(0, 0, 1280, 720);
		context.globalAlpha = 1;
		context.drawImage(videoRef.current, 0, 0, 1280, 720);
		context.fillStyle = "white";
		context.globalAlpha = 0.6;
		context.font = 'bold 32px serif';
		context.textBaseline = "middle";
		context.fillText(currentBookingUserId, 1280 - 280, 720 - 20, 280);
		setBufferPhoto(canvasRef.current.toDataURL('image/webp'));
	}

	const trackpubsToTracks = trackMap =>
		Array.from(trackMap.values())
			.map(publication => publication.track)
			.filter(track => track !== null);

	const scanningQr = () => {
        setScanQrInterval(setInterval(() => {
			if (scanQr) {
				const context = canvasRef.current.getContext('2d');
				context.drawImage(videoRef.current, 0, 0, 1280, 720);
				const pixels = context.getImageData(0, 0, 1280, 720);
				const imageData = pixels.data;
				const code = jsQR(imageData, 1280, 720);
				if (code) {
					setQrResult(code);
					return () => clearInterval(scanQrInterval);
				};
			}
		}, 500));
		return () => clearInterval(scanQrInterval);
    };

	const updateTracks = (updatedParticipant) => {
		setVideoTracks(trackpubsToTracks(updatedParticipant.videoTracks));
		setAudioTracks(trackpubsToTracks(updatedParticipant.audioTracks));
	};

	useEffect(() => {
		updateTracks(participant);

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
		if (localVideoTracks.length)
			updateTracks(participant);
	}, [localVideoTracks]);

	useEffect(() => {
		if (takePhoto) {
			handleCapture();
		}
	}, [takePhoto]);

	useEffect(() => {
		if (qrResult) {
			stopScanQr();
		}
	}, [qrResult]);

	useEffect(() => {
		if (scanQr && videoRef.current) {
			scanningQr();
		} else if (scanQrInterval)  {
			clearInterval(scanQrInterval);
			setScanQrInterval();
		}
	}, [scanQr]);

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
				{!!qrResult && (
					<div className="captured-image-box">
						<p className="captured-text">QR code scanned successfully:</p>
						<Grid container justify="space-between" spacing={2}>
							<Grid item xs={12}>
							<Tooltip title="Click to copy">
								<Typography
									noWrap
									ref={qrCodeRef}
									onClick={() => copyToClipboard(qrCodeRef)}
									className='qrcode-text'
								>
									{qrResult.data}
								</Typography>
							</Tooltip>
							</Grid>
							<Grid item container direction="column" justify="space-between" xs={12}>
								<Grid item>
									<DocButton
										text='Close'
										color='green'
										style={{ width: '100%', margin: '10px 0px' }}
										onClick={() => setQrResult()}
									/>
								</Grid>
							</Grid>
						</Grid>
					</div>
				)}
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
