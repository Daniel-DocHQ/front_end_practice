import React, { useState, useEffect } from 'react';
import {
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
} from '@material-ui/core';
import FullScreenOverlay from '../components/FullScreenOverlay/FullScreenOverlay';
import DocButton from '../components/DocButton/DocButton';
import { PatientHeader } from '../components/VideoCall/TwillioVideoCall';
import DocModal from '../components/DocModal/DocModal';
import LinkButton from '../components/DocButton/LinkButton';
import Box from '../components/TwilioVideo/Box';
import '../assets/css/Meeting.scss';
import bookingService from '../services/bookingService';
import { ddMMyyyy, formatTimeSlot } from '../helpers/formatDate';
import getURLParams from '../helpers/getURLParams';

import AppointmentContextProvider from '../context/AppointmentContext';
import { is } from 'immutable';

const Meeting = () => {
	const [step, setStep] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [videoCallToken, setVideoCallToken] = useState('');
	const [toc_accept, setToc_accept] = useState();
	const [marketing_accept, setMarketing_accept] = useState();
	const [isEarly, setIsEarly] = useState();
	const [share_accept, setShare_accept] = useState();
	const [userMedia, setUserMedia] = useState(false);
	const [questionsVisible, setQuestionsVisible] = useState(true);
	const [isEnglish, setIsEnglish] = useState(true);
	const [isVista, setIsVista] = useState(false);
	const [appointmentInfo, setAppointmentInfo] = useState();
	const params = getURLParams(window.location.href);
	const appointmentId = params['appointmentId'];
	const skiptime = params['skiptime'];

	useEffect(async () => {
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
				} else {
					// handle
					setIsLoading(false);
				}
			})
			.catch(err => console.log(err));
	}, []);

	useEffect(() => {
		if (isEarly === false) {
			navigator.getUserMedia({
				video: true,
				audio: true
				},
				() => setUserMedia(true),
				() => setUserMedia(false),
			);
		}
	}, [isEarly]);

	const increaseStep = (value) => setStep(step + value);
	const displayContent = () => {
		if (questionsVisible) {
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
					case 1: return <TermsConditional isEnglish={isEnglish} next={() => {
						setToc_accept(true);
						increaseStep(1);
					}} />;
					case 2: return <QuietSpace isEnglish={isEnglish} next={() => increaseStep(1)} />;
					case 3: return <TestKit isEnglish={isEnglish} next={() => {
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
					case 1: return <TermsConditional isEnglish={isEnglish} next={() => {
						setToc_accept(true);
						increaseStep(1);
					}} />;
					case 2: return <DelphinDataSharingPolicies isEnglish={isEnglish} next={(value) => {
						setMarketing_accept(value);
						isEnglish ? increaseStep(2) : increaseStep(1)
					}} />;
					case 3: return <NationalTestDataSharingPolicies next={(value) => {
						setShare_accept(value);
						increaseStep(1);
					}} />;
					case 4: return <QuietSpace isEnglish={isEnglish} next={() => increaseStep(1)} />;
					case 5: return <TestKit isEnglish={isEnglish} next={() => {
						increaseStep(1);
						bookingService
							.updateTerms(appointmentId, {
								toc_accept,
								marketing_accept,
								share_accept,
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
					isNurse={false}
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
		<p><b>{isEnglish ? 'Selected date' : 'Ausgewählte Zeit'}: </b>{formatTimeSlot(date)}</p>
		{isEnglish ? (
			<p>Please, make sure you click on this link at least <b>15 minutes before</b> your actual appointment.</p>
		) : (
			<p>	Bitte stellen Sie sicher, dass Sie mindestens <b>15 Minuten vor</b> Ihrem eigentlichen Termin auf diesen Link klicken.</p>
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
							<>
								<p>
									This online guided Covid-19 self-test is a screening method rather than a diagnostic service. It <b>does not replace</b> a consultation with a medical doctor.<br/>
									You may find the sampling procedure unpleasant. Common reactions are sneezing, gagging and coughing.<br />
									False negative and false positive test results are possible.<br />
									A negative test result (no virus detected) does <b>not</b> release you from your duty to follow current government hygiene recommendations and guidelines.<br />
									In case of a positive test result (virus detected) you and the people in your household, <b>must</b> follow the current government regulations and guidelines.<br />
									Errors that occur during the sampling and shipment processes that are beyond the control of DocHQ Limited and their partners, can lead to delays or make a sample unreadable or invalid.<br />
									You can find further information in the FAQ section. If you feel you need to talk to a doctor before your test, please contact customer service.<br />
									DocHQ Limited and their partners are not liable for any damage to your or other’s health or financial property resulting from any of the above points.<br /><br /><br />
									I hereby declare that the data I provide is correct and that I will assure that the sample/s originate exclusively from the named person/s and will be obtained in accordance with the written and verbal instructions provided during the online appointment.<br /><br /><br />
									I give permission for DocHQ Limited to share my personal and medical data for this process with their
									necessary partners, <b>Public Health England (PHE)</b>, any relevant regulatory authorities, and release the
									involved doctors and medical staff from their duty of confidentiality.<br />
									The necessarily involved partners are:<br />
									Dr. Simon Chaplin-Rogers, Park and St Francis Surgery, Ciconia Recovery Ltd.<br />
									In case of PCR testing, also: SYNLAB Group, 2030 Labs Limited, Oncologica UK Limited and any other
									laboratory that DocHQ Limited will contract with in future.<br /><br />
									<h3>All the above is MANDATORY TO ACCEPT</h3>
								</p>

							</>
						) : (
							<p>
								Dieser online begleitete COVID Selbsttest ist ein Screening, <b>keine</b> medizinische oder diagnostische Dienstleistung, er <b>ersetzt keine</b> ärztliche Untersuchung.<br /><br />
								Beim COVID Selbsttest können unangenehme körperliche Reaktionen auftreten. Falsch negative und falsch positive Testergebnisse sind möglich<br /><br />
								Ein negatives Testergebnis (kein Virus-Nachweis) entbindet Sie nicht von den aktuell lokal gültigen Abstands- und Hygieneregeln.<br /><br />
								Bei positivem Testergebnis (Virus nachgewiesen) sind Sie und alle mit Ihnen lebenden Personen <b>verpflichtet, den aktuell geltenden Leitlinien des lokalen Gesundheitsamtes zu folgen.</b><br /><br />
								Fehler im Prozess der Probenentnahme und des Versandes, über die DocHQ und seine Partner keine Kontrolle haben, können zu zeitlichen Verzögerungen sowohl zur Unauswertbarkeit einer Probe führen.<br /><br />
								Hintergrundinformationen sind in den FAQ zu finden. Bei Bedarf nach einer ärztlichen Beratung vor PCR Testung wenden Sie sich bitte an den Kundendienst.<br /><br />
								Das Unternehmen DocHQ und seine Partner übernimmt keinerlei Haftung zu Schäden oder Schadensersatzforderungen von Kunden oder Dritten, die sich aus den genannten Punkten ergeben.<br /><br />
								<ul>
									<li>
										Ich erkläre an eides statt, dass meine Angaben korrekt sind und verpflichte mich hiermit, Sorge zu tragen, dass die Probe gemäß den schriftlichen und während der Videokonferenz vom medizinischen Personal erteilten Anleitungen von ausschließlich der bezeichneten Person am angegebenen Datum gewonnen wird.
									</li>
									<li>
										Ich bin einverstanden, dass DocHQ meine persönlichen und medizinischen Daten mit den für den Prozess notwendigen Parteien teilt und entbinde die an meinem Covid-19 Test beteiligten Ärzte von DocHQ diesbezüglich von der ärztlichen Schweigepflicht.<br />
										Die notwendigerweise beteiligten Parteien sind
										<ul>
											<li>
												Synlab Group (bei PCR Test)
											</li>
											<li>
												Die zuständigen Gesundheitsämter und das Robert-Koch-Institut (gemäß Infektionsschutzgesetz).
											</li>
										</ul>
									</li>
								</ul>
							</p>
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

const NationalTestDataSharingPolicies = ({ next }) => {
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
						Ich erlaube die Verwertung meiner Daten inklusive Testergebnis für die Corona- Warn-App des Robert-Koch-Instituts. (Optional)
					​</h3>
					<div className='row padding-box'>
						<FormControl component='fieldset'>
							<RadioGroup
								aria-label='dataSharing'
								name='dataSharing'
								value={decision}
								onChange={e => setDecision(e.target.value)}
							>
								<FormControlLabel value='ready' control={<Radio />} label='Daten teilen' />
								<FormControlLabel value='notReady' control={<Radio />} label="Daten nicht teilen" />
							</RadioGroup>
						</FormControl>
					</div>
				</React.Fragment>
			) : ( ready === 'ready' ? (
				<h3 className='padding-box'>
					Vielen Dank für Ihre Entscheidung. DocHQ Limited teilt Ihre Daten mit der Corona Warn App.
				</h3>
			) : (
				<h3 style={{ fontWeight: 500 }} className='padding-box'>
					Vielen Dank für Ihre Entscheidung. DocHQ Limited gibt Ihre Daten nicht an die Corona Warn App weiter.
				</h3>
			))}
			<div style={{ paddingTop: '20px', textAlign: 'center' }}>
				<DocButton
					color={!!decision ? 'green' : 'disabled'}
					text={isReadyEmpty ? 'Speichern' : 'Nächster'}
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
