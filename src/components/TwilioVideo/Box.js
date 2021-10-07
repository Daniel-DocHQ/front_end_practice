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
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const VideoUserWrapper = ({ isNurse = false, children }) => (
	isNurse ? (
		<div className='full-screen-nurse'>
			<div
				style={{
					padding: '20px',
					backgroundColor: 'var(--doc-white)',
					borderRadius: '4px',
				}}
			>
				{children}
			</div>
		</div>
	) : (
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
					{children}
				</div>
			}
		/>
	)
);

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
	const [preflightLoading, setPreflightLoading] = useState(false);
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
	const sendInfoAboutJoin = async () => {
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
	}
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
		},
		[params, isNurse],
	);

	useEffect(() => {
		if (!!videoCallToken) {
			setPreflightLoading(true);
			const preflightTest = runPreflight(videoCallToken);

			preflightTest.on('progress', (progress) => {
				console.log('preflight progress:', progress);
			});

			preflightTest.on('failed', async (error) => {
				await sendInfoAboutJoin();
				setPreflightLoading(false);
				console.error('preflight error:', error);
			});

			preflightTest.on('completed', (report) => {
				setPreflightCheckReport(report);
				setTimeout(async () => {
					await sendInfoAboutJoin();
					setPreflightLoading(false);
				}, 5000);

			});
		}
	}, [videoCallToken]);

	if (preflightLoading || !preflightCheckReport && videoCallToken) {
		return !preflightCheckReport ? (
			<VideoUserWrapper isNurse={isNurse}>
				<div className="row center">
					<LoadingSpinner />
				</div>
				<h2>Internet connection check</h2>
			</VideoUserWrapper>

		) : (
			<VideoUserWrapper isNurse={isNurse}>
				<h2>Internet connection check report</h2>
				{preflightCheckReport.networkTiming.connect?.duration < 950 ? (
					<h4 className="green-bold-text">You have good internet connection quality</h4>
				) : (
					<h4 className="yellow-bold-text">Your internet connection is low. Might be some issues during video appointment</h4>
				)}
				<h3>Joining to the appointment...</h3>
			</VideoUserWrapper>
		);
	};

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
				<VideoUserWrapper>
					<h2>{isEnglish ? 'You are ready for your appointment' : 'Sie sind bereit für Ihren Termin.'}</h2>
					<DocButton
						text={isEnglish ? 'Join Appointment' : 'Nehmen Sie am Termin teil'}
						onClick={handleSubmit}
						color='green'
					/>
				</VideoUserWrapper>
			) : (
				<VideoUserWrapper isNurse>
					<h2>You are ready for your appointment</h2>
					<DocButton text='Join Appointment' onClick={handleSubmit} color='green' />
				</VideoUserWrapper>
			)}
		</React.Fragment>
	);
};

export default Box;
