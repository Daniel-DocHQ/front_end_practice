import React, { useState, useRef, useEffect } from 'react';
import './OutgoingVideo.scss';
//import Controls from "../Controls/Controls";

const OutVid = ({ participant }) => {
	const [isHidden, setIsHidden] = useState(false);

	const [videoTracks, setVideoTracks] = useState([]);
	const [audioTracks, setAudioTracks] = useState([]);
	const videoRef = useRef();
	const audioRef = useRef();

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
			<div className='caller-video-container'>
				<div
					className={`video-and-overlay  ${isHidden ? 'hidden-video' : ''}`}
					onClick={() => setIsHidden(!isHidden)}
				>
					<video className='caller-video' ref={videoRef} autoPlay playsInline muted></video>
					{isHidden && (
						<React.Fragment>
							<div className='overlay'>
								<i className='fa fa-chevron-left'></i>
							</div>
						</React.Fragment>
					)}
					{!isHidden && (
						<React.Fragment>
							<div className='overlay-close'>
								<i className='fa fa-chevron-right'></i>
							</div>
						</React.Fragment>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default OutVid;
