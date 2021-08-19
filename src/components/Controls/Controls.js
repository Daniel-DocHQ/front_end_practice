import React from 'react';
import './Controls.scss';
const Controls = ({
	isPause = false,
	isMuted,
	updateMuted,
	capturePhoto,
	isNurse,
	handleDisconnect,
	handlePause,
	captureDisabled,
	currentBookingUserName,
}) => (
	<>
		<div className="top-container">
			{(isNurse && isPause) && (
				<div className='control-container'>
					<div className='control-item' onClick={handlePause}>
						<i className='fa fa-pause'></i>
					</div>
					<div style={{ width: 50 }}>
						{/* <i className='fas fa-comment-alt'></i> */}
					</div>
				</div>
			)}
		</div>
		<div className="top-container right">
			{isNurse && !captureDisabled ? (
				<div className="photo-box">
					<div className="text-box">
						<p>{currentBookingUserName} - Test Results</p>
					</div>
					<div className='photo-controller'>
						<div
							className='control-item'
							onClick={capturePhoto}
						>
							<i className='fa fa-camera'></i>
						</div>
					</div>
				</div>
			) : null}
		</div>
		<div className="controls-container">
			{!isMuted && (
				<div className='control-item' onClick={updateMuted}>
					<i className='fa fa-microphone'></i>
				</div>
			)}
			{isMuted && (
				<div className='control-item' onClick={updateMuted}>
					<i className='fa fa-microphone-slash' style={{ color: 'var(--doc-pink)' }}></i>
				</div>
			)}
			<div className='control-item' onClick={handleDisconnect}>
				<i className='fa fa-phone' style={{ color: 'var(--doc-pink)' }}></i>
			</div>
		</div>
	</>
);

export default Controls;
