import React, { useState, useEffect } from 'react';
import { evaluateDevice } from '../helpers/utils';

const Unsupported = () => {
	const [device, setDevice] = useState(evaluateDevice);
	return (
		<React.Fragment>
			<div
				style={{
					backgroundColor: 'var(--doc-dark-grey)',
					color: 'var(--doc-white)',
					padding: '10px',
					margin: 'auto',
					minWidth: '100vw',
					overflow: 'hidden',
					boxSizing: 'border-box',
				}}
			>
				<div className='message-container'>
					<h1>Unsupported Browser</h1>
					<p>Unfortunately we do not support your browser!</p>
					{
						<SupportedBrowsers
							isMobileDevice={device.isMobileDevice}
							osName={device.osName}
							browserName={device.browserName}
							isIE={device.isIE}
							isSafari={device.isSafari}
						/>
					}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Unsupported;

const SupportedBrowsers = ({ isMobileDevice, osName, isIE, isSafari }) => (
	<React.Fragment>
		<p>Supported browsers for your device are:</p>
		<ul>
			{isMobileDevice && osName.includes('iOS') && isSafari !== true && <li>Safari</li>}
			{isMobileDevice && osName.includes('Android') && (
				<React.Fragment>
					<li>Chrome</li>
					<li>Firefox</li>
				</React.Fragment>
			)}

			{!isMobileDevice && !osName.includes('mac') && (
				<React.Fragment>
					<li>Chrome</li>
					<li>Edge</li>
					<li>Firefox</li>
					<li>Opera</li>
				</React.Fragment>
			)}
			{!isMobileDevice && osName.includes('mac') && (
				<React.Fragment>
					<li>Chrome</li>
					<li>Edge</li>
					<li>Firefox</li>
					<li>Opera</li>
					<li>Safari</li>
				</React.Fragment>
			)}
		</ul>
	</React.Fragment>
);
