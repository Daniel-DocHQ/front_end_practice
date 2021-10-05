import { get } from 'lodash';
import { useCookies } from 'react-cookie';
import { runPreflight } from 'twilio-video';
import React, { useState, useCallback, useContext, useEffect } from 'react';
import getURLParams from '../../helpers/getURLParams';
import DocButton from '../DocButton/DocButton';
import bookingService from '../../services/bookingService';
import TwillioVideoCall, { PatientHeader } from '../VideoCall/TwillioVideoCall';
import FullScreenOverlay from '../FullScreenOverlay/FullScreenOverlay';
import {
	AppointmentContext,
} from '../../context/AppointmentContext';
import './box-test.scss';
import { jwtDecode } from '../../helpers/jwtDecode';

const Box = ({
	token,
	isNurse,
	appointmentInfo = {},
	isEnglish = true,
	updateImageData,
	captureDisabled,
	videoCallToken,
	setVideoCallToken,
	hideVideoAppointment,
}) => {
	const [preflightCheckReport, setPreflightCheckReport] = useState();
	const params = getURLParams(window.location.href);
	const {
		appointmentDetails,
		appointmentId: contextAppointmentId,
	} = useContext(AppointmentContext);
	const [cookies, setCookie] = useCookies();
	const appointmentId = contextAppointmentId || params['appointmentId'];
	const patientVideoToken = get(cookies, 'video-token');
	const practitionerVideoToken = get(appointmentDetails, 'user_video_token');
	const practitionerDecode = !!practitionerVideoToken ? jwtDecode(practitionerVideoToken) : '';
	const patientDecode = !!patientVideoToken ? jwtDecode(patientVideoToken) : '';
	const handleSubmit = useCallback(
		async event => {
			event.preventDefault();
			if (!!practitionerDecode && new Date(practitionerDecode.exp * 1000).getTime() > new Date().getTime() && isNurse) {
				setVideoCallToken(practitionerVideoToken);
			} else if (!isNurse && !!patientDecode && new Date(patientDecode.exp * 1000).getTime() > new Date().getTime()) {
				setVideoCallToken(patientVideoToken);
			} else {
				const data = await fetch('/video/token', {
					method: 'POST',
					body: JSON.stringify({
						identity: isNurse ? 'nurse' : 'patient',
						room: params['appointmentId'],
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				}).then(res => res.json()).catch((err) => console.log(err));
				setVideoCallToken(data.token);
				if (isNurse) {
					await bookingService.setVideoToken(
						appointmentId,
						{
							user_video_token: data.token,
						},
						token,
					).catch((err) => console.log(err))
				} else setCookie('video-token', data.token);
			}
			if (isNurse) {
				await bookingService
					.joinAppointment(token, appointmentId)
					.then(result => {
						if (result.success) {
							console.log('Appointment joined')
						} else {
							console.log(result.error);
						}
					})
					.catch((err) => console.log(err.error));
			}
			await bookingService
				.updateAppointmentStatus(appointmentId, {
					status: isNurse ? 'PRACTITIONER_ATTENDED' : 'PATIENT_ATTENDED',
				}, token).catch((err) => console.log(err))
		},
		[params, isNurse],
	);

	useEffect(() => {
		if (!!token) {
			const preflightTest = runPreflight(videoCallToken);

			preflightTest.on('progress', (progress) => {
			console.log('preflight progress:', progress);
			});

			preflightTest.on('failed', (error) => {
			console.error('preflight error:', error);
			});

			preflightTest.on('completed', (report) => {
				console.log(report);
				setPreflightCheckReport(report);
				console.log("Test completed in " + report.testTiming.duration + " milliseconds.");
				console.log(" It took " + report.networkTiming.connect?.duration + " milliseconds to connect");
				console.log(" It took " + report.networkTiming.media?.duration + " milliseconds to receive media");
			});
		}
	}, [videoCallToken]);

	return videoCallToken ? (
		<div className='vid-box'>
			<TwillioVideoCall
				isNurse={isNurse}
				token={videoCallToken}
				authToken={token}
				appointmentInfo={appointmentInfo}
				appointmentId={appointmentId}
				updateImageData={updateImageData}
				captureDisabled={captureDisabled}
				hideVideoAppointment={hideVideoAppointment}
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
							<h2>{isEnglish ? 'You are ready for your appointment' : 'Sie sind bereit für Ihren Termin.'}</h2>
							<DocButton
								text={isEnglish ? 'Join Appointment' : 'Nehmen Sie am Termin teil'}
								onClick={handleSubmit}
								color='green'
							/>
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
