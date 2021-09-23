import React, { useState, useEffect } from 'react';
import {
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
} from '@material-ui/core';
import { format } from 'date-fns';
import { get } from 'lodash';
import FullScreenOverlay from '../components/FullScreenOverlay/FullScreenOverlay';
import DocButton from '../components/DocButton/DocButton';
import { PatientHeader } from '../components/VideoCall/TwillioVideoCall';
import DocModal from '../components/DocModal/DocModal';
import LinkButton from '../components/DocButton/LinkButton';
import Box from '../components/TwilioVideo/Box';
import bookingService from '../services/bookingService';
import { ddMMyyyy } from '../helpers/formatDate';
import getURLParams from '../helpers/getURLParams';
import AppointmentContextProvider from '../context/AppointmentContext';
import TermsConditionsEn from './TermsConditionsEn';
import TermsConditionsDe from './TermsConditionsDe';
import '../assets/css/Meeting.scss';

const Meeting = () => {
	const [step, setStep] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [invalidLink, setIsInvalidLink] = useState(false);
	const [videoCallToken, setVideoCallToken] = useState('');
	const [toc_accept, setToc_accept] = useState(true);
	const [marketing_accept, setMarketing_accept] = useState(false);
	const [isEarly, setIsEarly] = useState();
	const [userMedia, setUserMedia] = useState(false);
	const [questionsVisible, setQuestionsVisible] = useState(true);
	const [isEnglish, setIsEnglish] = useState(true);
	const [isVista, setIsVista] = useState(false);
	const [appointmentInfo, setAppointmentInfo] = useState();
	const params = getURLParams(window.location.href);
	const appointmentId = params['appointmentId'];
	const videoType = get(appointmentInfo, 'type', '');
	const skiptime = params['skiptime'];

	const getAppointmentInfo = async () => {
		setIsLoading(true);
		await bookingService.getAppointmentInfo(appointmentId)
			.then(result => {
				if (result.success && result.appointments) {
					setAppointmentInfo(result.appointments);
					const now = new Date();
					const appointmentTime = new Date(result.appointments.start_time);
					setIsEarly(Math.round((((appointmentTime.getTime() - now.getTime()) / 1000) / 60)) > 30);
					const language = !!result.appointments && result.appointments.language;
					const isVistaType = (!!result.appointments && result.appointments.type) === 'video_gp';
					setIsVista(isVistaType);
					setIsEnglish(isVistaType ? true : language === 'EN');
					setIsLoading(false);
				} else setIsInvalidLink(true);
			}).catch(err => {
				console.log(err);
				setIsInvalidLink(true);
			});
		setIsLoading(false);
	}

	useEffect(() => {
		getAppointmentInfo();
	}, []);

	useEffect(() => {
		setIsLoading(true);
		if (isEarly === false || !!skiptime) {
			navigator.getUserMedia({
				video: true,
				audio: true,
			},
				() => setUserMedia(true),
				() => setUserMedia(false),
			);
		}
		setIsLoading(false);
	}, [isEarly]);

	useEffect(() => {
		if (videoType && appointmentInfo && !isVista) {
			videoType === 'video_gp_dochq' ? setStep(2) : setStep(1);
		}
	}, [appointmentInfo])

	const increaseStep = (value) => setStep(step + value);
	const displayContent = () => {
		if (questionsVisible) {
			if (invalidLink) {
				return (
					<InvalidLinkMessage
						isEnglish={isEnglish}
					/>
				);
			}
			if ((isEarly && !skiptime)) {
				return (
					<AppointmentSummary
						isVista={isVista}
						isEnglish={isEnglish}
						date={!!appointmentInfo && appointmentInfo.start_time}
					/>
				);
			}

			if (!userMedia) {
				return (
					<CameraMicrophoneCheck
						isEnglish={isEnglish}
					/>
				);
			}
			if (isVista) {
				switch (step) {
					case 1: return <QuietSpace isEnglish={isEnglish} next={() => increaseStep(1)} />;
					case 2: return <TestKit isEnglish={isEnglish} next={() => {
						increaseStep(1);
						bookingService
							.updateTerms(appointmentId, {
								toc_accept,
							});
					}} />;
					default:
						setQuestionsVisible(false);
						return null;
				}
			} else {
				switch (step) {
					// case 1: return <DelphinDataSharingPolicies isEnglish={isEnglish} next={(value) => {
					// 	setMarketing_accept(value);
					// 	increaseStep(1);
					// }} />;
					case 1: return <QuietSpace isEnglish={isEnglish} next={() => increaseStep(1)} />;
					case 2: return <TestKit isEnglish={isEnglish} next={() => {
						increaseStep(1);
						bookingService
							.updateTerms(appointmentId, {
								toc_accept: toc_accept.toString(),
								marketing_accept: marketing_accept.toString(),
							});
					}} />;
					default:
						setQuestionsVisible(false);
						return null;
				}
			}
		}
	};

	return !isLoading && (
		<AppointmentContextProvider>
			{questionsVisible ? (
				<React.Fragment>
					<PatientHeader />
					<FullScreenOverlay
						isVisible={questionsVisible}
						content={displayContent()}
					/>
				</React.Fragment>
			) : (
				<Box
					token="token"
					isNurse={false}
					appointmentInfo={appointmentInfo}
					isEnglish={isEnglish}
					videoCallToken={videoCallToken}
					setVideoCallToken={setVideoCallToken}
				/>
			)}
		</AppointmentContextProvider>
	);
}

export default Meeting;

const AppointmentSummary = ({ date, isVista, isEnglish }) => (
	<div>
		<h2>{isEnglish ? 'Appointment Summary' : 'Terminübersicht'}</h2>
		<p><b>{isEnglish ? 'Selected date' : 'Ausgewähltes Datum'}: </b>{ddMMyyyy(date)}</p>
		<p><b>{isEnglish ? 'Selected date' : 'Ausgewählte Zeit'}: </b>{format(new Date(date || ''), 'p')} ({get(Intl.DateTimeFormat().resolvedOptions(), 'timeZone', 'local time')})</p>
		{isEnglish ? (
			<p>Please, make sure you click on this link at least <b>5 minutes before</b> your actual appointment.</p>
		) : (
			<p>	Bitte stellen Sie sicher, dass Sie mindestens <b>5 Minuten vor</b> Ihrem eigentlichen Termin auf diesen Link klicken.</p>
		)}
		{isVista && (
			<>
				<p>If you need to cancel or modify your appointment, please contact us at: <b>vistasupport@dochq.co.uk</b></p>
				<div className='row center'>
					<LinkButton
						text='Back to Home'
						color='green'
						linkSrc='/patient/dashboard'
					/>
				</div>
			</>
		)}
	</div>
);

const CameraMicrophoneCheck = ({ isEnglish }) => (
	<h3>
		{isEnglish
			? 'Please make sure you enable your camera and microphone before the appointment.'
			: 'Bitte stellen Sie sicher, dass Sie Ihre Kamera und Ihr Mikrofon vor dem Termin aktivieren.'
		}
	</h3>
);

const InvalidLinkMessage = ({ isEnglish }) => (
	<h3>
		{isEnglish
			? 'You appointment link is invalid, please contact customer services to discuss your further support@dochq.co.uk'
			: 'Ihr Terminlink ist ungültig. Bitte wenden Sie sich an den Kundenservice, um Ihr weiteres Vorgehen zu besprechen support@dochq.co.uk'
		}
	</h3>
);

const TestKit = ({ isEnglish, next }) => {
	const [ready, setReady] = useState(true);
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			{ready ? (
				<h3>{isEnglish ? 'Do you have your test kit with you?' : 'Haben Sie Ihr Testkit dabei?'}</h3>
			) : (
				isEnglish ? (
					<h3>
						Your test kit is required for this appointment.<br />
						Have you got it with you now?
					</h3>
				) : (
					<h3>
						Ihr Testkit wird für diesen Termin benötigt.<bt />
						Haben Sie es jetzt bei sich?
					</h3>
				)
			)}
			<div style={{ paddingTop: '20px', textAlign: 'center' }}>
				{ready && (
					<DocButton
						color='pink'
						text={isEnglish ? 'No' : 'Nein'}
						onClick={() => setReady(false)}
						style={{ margin: '5px' }}
					/>
				)}
				<DocButton
					color='green'
					text={isEnglish ? 'Yes' : 'Ja'}
					onClick={next}
					style={{ margin: '5px' }}
				/>
			</div>
		</div>
	);
};

const QuietSpace = ({ isEnglish, next }) => {
	const [ready, setReady] = useState(true);
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			{ready ? (
				<h3>{isEnglish ? 'Are you positioned in a quiet space?' : 'Sind Sie an einem ruhigen Ort positioniert?'}</h3>
			) : (
				<h3>{isEnglish ? 'I am in the quietest space I can find.' : 'Ich bin in dem ruhigsten Raum, den ich finden kann.'}</h3>
			)}
			<div style={{ paddingTop: '20px', textAlign: 'center' }}>
				{ready && (
					<DocButton
						color='pink'
						text={isEnglish ? 'No' : 'Nein'}
						onClick={() => setReady(false)}
						style={{ margin: '5px' }}
					/>
				)}
				<DocButton
					color='green'
					text={isEnglish ? 'Yes' : 'Ja'}
					onClick={next}
					style={{ margin: '5px' }}
				/>
			</div>
		</div>
	);
};

const TermsConditional = ({ isEnglish, next }) => {
	const [ready, setReady] = useState(true);
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			{ready ? (
				<h3>{isEnglish ? 'I have read and agree to DocHQs Terms and Conditions.' : 'Ich habe die Allgemeinen Geschäftsbedingungen von DocHQ Limited gelesen und bin damit einverstanden.'}</h3>
			) : (
				<h3>{isEnglish ? 'Sorry you cannot attend the video appointment' : 'Leider können Sie nicht am Videotermin teilnehmen'}</h3>
			)}
			<a onClick={() => setIsVisible(true)}>
				{isEnglish ? 'Read here' : 'Allgemeine Geschäftsbedingungen'}
			</a>
			<DocModal
				title={isEnglish ? 'Terms Conditions' : 'Terms & amp; Bedingungen'}
				isVisible={isVisible}
				onClose={() => setIsVisible(false)}
				content={
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						{isEnglish ? (
							<TermsConditionsEn />
						) : (
							<TermsConditionsDe />
						)}
						<div style={{ paddingTop: '20px', textAlign: 'center' }}>
							<DocButton
								color='grey'
								text={isEnglish ? 'Close' : 'Schließen'}
								onClick={() => setIsVisible(false)}
								style={{ margin: '5px' }}
							/>
						</div>
					</div>
				}
			/>
			<div style={{ paddingTop: '20px', textAlign: 'center' }}>
				{ready && (
					<DocButton
						color='pink'
						text={isEnglish ? 'Reject' : 'Ablehnen'}
						onClick={() => setReady(false)}
						style={{ margin: '5px' }}
					/>
				)}
				<DocButton color='green' text={isEnglish ? 'Accept' : 'Zustimmen'} onClick={next} style={{ margin: '5px' }} />
			</div>
		</div>
	);
};

const DelphinDataSharingPolicies = ({ isEnglish, next }) => {
	const [ready, setReady] = useState('');
	const [decision, setDecision] = useState();
	const isReadyEmpty = ready === '';

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			{isReadyEmpty ? (
				<React.Fragment>
					<h3 className='padding-box'>
						{isEnglish
							? 'I accept to share my medical data with Managed Self Limited to access the test results also on Klarity App. (Optional)'
							: 'Ich stimme zu, dass meine medizinischen Daten mit Managed Self Limited geteilt werden, damit ich auf die Testergebnisse auch über die Klarity App zugreifen kann. (Optional)'
						}
					​</h3>
					<div className='row padding-box'>
						<FormControl component='fieldset'>
							<RadioGroup
								aria-label='dataSharing'
								name='dataSharing'
								value={decision}
								onChange={e => setDecision(e.target.value)}
							>
								<FormControlLabel
									value='ready'
									control={<Radio />}
									label={isEnglish ? 'Share' : 'Daten teilen' }
								/>
								<FormControlLabel
									value='notReady'
									control={<Radio />}
									label={isEnglish ? 'Don\'t Share' : 'Daten nicht teilen'}
								/>
							</RadioGroup>
						</FormControl>
					</div>
				</React.Fragment>
			) : ( ready === 'ready' ? (
				isEnglish ? (
					<h3 className='padding-box'>
						Thank you for submitting your decision.<br />
						DocHQ Limited will share your medical data with Klarity App.
					</h3>
				) : (
					<h3 className='padding-box'>
						Vielen Dank für Ihre Entscheidung.<br />
						DocHQ Limited teilt Ihre medizinischen Daten mit der Klarity App.
					</h3>
				)
			) : (
				isEnglish ? (
					<h3 className='padding-box'>
						Thank you for submitting your decision.<br />
						DocHQ Limited will not share your medical data with Klarity App.
					</h3>
				) : (
					<h3 className='padding-box'>
						Vielen Dank für Ihre Entscheidung.<br />
						DocHQ Limited gibt Ihre medizinischen Daten nicht an die Klarity App weiter.
					</h3>
				)
			))}
			<div style={{ paddingTop: '20px', textAlign: 'center' }}>
				<DocButton
					color={!!decision ? 'green' : 'disabled'}
					text={isReadyEmpty ? (isEnglish ? 'Submit' : 'Speichern') : (isEnglish ? 'Next' : 'Nächster')}
					disabled={!decision}
					onClick={() => {
						if (isReadyEmpty) {
							setReady(decision);
						} else {
							next(decision === 'ready' ? true : false);
						}
					}}
					style={{ margin: '5px' }}
				/>
			</div>
		</div>
	);
};

const Countdown = ({ start_time }) => {
	return (
		<React.Fragment>
			<div
				className='timer-container'
				style={{
					position: 'absolute',
					top: '100px',
					left: '20px',
					zIndex: '100',
					backgroundColor: 'var(--doc-light-grey)',
					color: 'var(--doc-dark-grey)',
					padding: '10px',
					borderRadius: '5px',
					textAlign: 'center',
				}}
			>
				<div className='timer'>
					<span style={{ fontWeight: 'bold' }}>Appointment Date:</span>
					<p> {new Date(start_time).toLocaleDateString()}</p>
					<p>
						{new Date(start_time).toLocaleTimeString().slice(0, 5)}
						{new Date(start_time).toLocaleTimeString().slice(0, 2) > 12 ? ' PM' : ' AM'}
					</p>
					{new Date().getTime() >= new Date(start_time).getTime() && <p>Sorry you're late</p>}
				</div>
			</div>
		</React.Fragment>
	);
};
