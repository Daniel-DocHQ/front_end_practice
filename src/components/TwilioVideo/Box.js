import React, { useState, useEffect, useCallback, useRef } from 'react';
import getURLParams from '../../helpers/getURLParams';
import DocButton from '../DocButton/DocButton';
import './box-test.scss';
import TwillioVideoCall, { PatientHeader } from '../VideoCall/TwillioVideoCall';
import FullScreenOverlay from '../FullScreenOverlay/FullScreenOverlay';

const Box = ({ isNurse, updateImageData, captureDisabled }) => {
	const params = getURLParams(window.location.href);
	const [token, setToken] = useState();
	const handleSubmit = useCallback(
		async event => {
			event.preventDefault();
			const data = await fetch('/video/token', {
				method: 'POST',
				body: JSON.stringify({
					identity: isNurse ? 'nurse' : 'patient',
					room: params['appointmentId'],
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then(res => res.json());
			setToken(data.token);
		},
		[params, isNurse]
	);
	return token ? (
		<div className='vid-box'>
			<TwillioVideoCall
				isNurse={isNurse}
				token={token}
				appointmentId={params['appointmentId']}
				updateImageData={updateImageData}
				captureDisabled={captureDisabled}
			/>
		</div>
	) : (
		<React.Fragment>
			{!isNurse && <PatientHeader />}
			{!isNurse ? (
				<FullScreenOverlay
					isVisible={true}
					content={
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<h2>You are ready for your appointment</h2>
							<DocButton text='Join Appointment' onClick={handleSubmit} color='green' />
						</div>
					}
				/>
			) : (
				<div className='full-screen-nurse'>
					<div
						style={{
							padding: '20px',
							backgroundColor: 'var(--doc-white)',
							borderRadius: '4px',
						}}
					>
						<h2>You are ready for your appointment</h2>
						<DocButton text='Join Appointment' onClick={handleSubmit} color='green' />
					</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default Box;
