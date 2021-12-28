import { Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import React from 'react';
import './Controls.scss';

const Controls = ({
	isPause = false,
	isMuted,
	scanQr,
	userMediaDevices,
	updateMuted,
	capturePhoto,
	isNurse,
	videoDevice,
	updateVideoDevice,
	handleDisconnect,
	handlePause,
	handleScanQr,
	captureDisabled,
	currentBookingUserName,
}) => (
	<>
		<div className="top-container">
			{(isNurse) ? (
				<div className='control-container'>
					{isPause && (
						<div className='control-item' onClick={handlePause}>
							<i className='fa fa-pause'></i>
						</div>
					)}
					<div style={{ width: 50 }} className={`control-item ${scanQr ? 'scanning' : ''}`} onClick={handleScanQr}>
						<i className='fa fa-qrcode'></i>
					</div>
				</div>
			) : (
				userMediaDevices.length > 1 && (
					<div className='select-container'>
						<FormControl className='select-form'>
							<InputLabel id="demo-simple-select-label">Camera</InputLabel>
							<Select
								value={videoDevice}
								onChange={updateVideoDevice}
							>
								{userMediaDevices.map((value) => (
									<MenuItem key={value.deviceId} value={value.deviceId}>{value.label}</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
				)
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
