import { get } from 'lodash';
import React, { useCallback, useContext } from 'react';
import getURLParams from '../../helpers/getURLParams';
import DocButton from '../DocButton/DocButton';
import bookingService from '../../services/bookingService';
import TwillioVideoCall, { PatientHeader } from '../VideoCall/TwillioVideoCall';
import FullScreenOverlay from '../FullScreenOverlay/FullScreenOverlay';
import {
	AppointmentContext,
} from '../../context/AppointmentContext';
import './box-test.scss';
import { ToastsStore } from 'react-toasts';
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
	const params = getURLParams(window.location.href);
	const {
		appointmentDetails,
		appointmentId: contextAppointmentId,
	} = useContext(AppointmentContext);
	const appointmentId = contextAppointmentId || params['appointmentId'];
	const videoToken = get(appointmentDetails, 'user_video_token');
	const decode = !!videoToken ? jwtDecode(videoToken) : '';
	const handleSubmit = useCallback(
		async event => {
			event.preventDefault();
			if (!!decode && new Date(decode.exp * 1000).getTime() > new Date().getTime() && isNurse) {
				setVideoCallToken(videoToken);
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
				}).then(res => res.json()).catch(ToastsStore.error);
				setVideoCallToken(data.token);
				if (isNurse) await bookingService.setVideoToken(
					appointmentId,
					{
						user_video_token: data.token,
					},
					token,
				).catch(ToastsStore.error);
			}
			await bookingService
				.updateAppointmentStatus(appointmentId, {
					status: isNurse ? 'PRACTITIONER_ATTENDED' : 'PATIENT_ATTENDED',
				}, token).catch(ToastsStore.error);
		},
		[params, isNurse]
	);
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
