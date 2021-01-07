import React from 'react';
import './Controls.scss';
const Controls = ({
	isMuted,
	isPhotoMode,
	updateMuted,
	updatePhotoMode,
	capturePhoto,
	isNurse,
	handleDisconnect,
	captureDisabled,
}) => (
	<React.Fragment>
		<div className={`controls-container`}>
			{!isMuted && !isPhotoMode && (
				<div className='control-item' onClick={updateMuted}>
					<i className='fa fa-microphone'></i>
				</div>
			)}
			{isMuted && !isPhotoMode && (
				<div className='control-item' onClick={updateMuted}>
					<i className='fa fa-microphone-slash' style={{ color: 'var(--doc-pink)' }}></i>
				</div>
			)}
			<div className='control-item' onClick={handleDisconnect}>
				<i className='fa fa-phone' style={{ color: 'var(--doc-pink)' }}></i>
			</div>
			{isNurse && !captureDisabled ? (
				<div className={`photo-controller ${isPhotoMode ? 'active' : ''}`}>
					<div
						className='control-item'
						onClick={() => {
							updatePhotoMode(!isPhotoMode);
							if (isPhotoMode) {
								capturePhoto();
							}
						}}
					>
						<i className='fa fa-camera'></i>
					</div>
					{isPhotoMode && <p>Capture</p>}
				</div>
			) : null}
		</div>
	</React.Fragment>
);

export default Controls;
