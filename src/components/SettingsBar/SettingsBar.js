import React, { useState } from 'react';
import './SettingsBar.scss';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const SettingsBar = ({
	navIsVisible,
	audioDevices,
	videoDevices,
	audioInput,
	videoInput,
	updateInput,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [controlsVisible, setControlsVisible] = useState(true);

	return (
		<React.Fragment>
			<nav className={`${navIsVisible ? 'nav-visible' : 'nav-hidden'}`}>
				<div className={`navigation-bar-container ${controlsVisible ? 'active' : ''}`}>
					<span style={{ visibility: 'hidden' }}>Left</span>
					<div className='dochq-icon' onClick={() => setControlsVisible(!controlsVisible)}>
						DocHQ
					</div>
					<div className='settings-button' onClick={() => setIsVisible(!isVisible)}>
						<i className='fa fa-cogs fa-2x'></i>
						<div className={`settings-dropdown ${isVisible ? 'active' : ''}`}>
							{audioInput && (
								<div>
									<i className='fa fa-microphone'></i>
									<Select
										id='demo-simple-select'
										onChange={e => updateInput('audio', e.target.value)}
										value={audioInput}
										style={{ width: '120px' }}
									>
										{audioDevices.map((device, i) => (
											<MenuItem key={i} value={device.deviceId}>
												{device.label}
											</MenuItem>
										))}
									</Select>
								</div>
							)}
							{videoInput && (
								<div>
									<i className='fa fa-camera'></i>
									<Select
										id='demo-simple-select-video'
										onChange={e => updateInput('video', e.target.value)}
										value={videoInput}
										displayEmpty
										style={{ width: '120px' }}
									>
										{videoDevices.map((device, i) => (
											<MenuItem key={i} value={device.deviceId}>
												{device.label}
											</MenuItem>
										))}
									</Select>
								</div>
							)}
						</div>
					</div>
				</div>
			</nav>
		</React.Fragment>
	);
};

export default SettingsBar;
