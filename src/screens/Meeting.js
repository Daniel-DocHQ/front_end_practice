import React, { useState } from 'react';
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
import AppointmentContextProvider from '../context/AppointmentContext';

class Meeting extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			step: 2,
			videoCallToken: '',
			questionsVisible: true,
		};
		this.isVista = window.location.href.includes('vista');
		this.displayContent = this.displayContent.bind(this);
	}

	increaseStep = () => this.setState({ step: this.state.step + 1 });
	setVideoCallToken = (token) => this.setState({ videoCallToken: token });
	displayContent() {
		if (this.state.questionsVisible) {
			switch (this.state.step) {
				case 1: return <AppointmentSummary />;
				case 2: return <TermsConditional next={this.increaseStep} />;
				case 3: return <DelphinDataSharingPolicies next={this.increaseStep} />;
				case 4: return <NationalTestDataSharingPolicies next={this.increaseStep} />;
				case 5: return <QuietSpace next={this.increaseStep} />;
				case 6: return <TestKit next={this.increaseStep} />;
				default:
					this.setState({ questionsVisible: false });
					return null;
			}
		}
	}
	render() {
		return (
			<AppointmentContextProvider>
				{this.state.questionsVisible ? (
					<React.Fragment>
						<PatientHeader isVista={this.isVista} />
						<FullScreenOverlay
							isVisible={this.state.questionsVisible}
							content={this.displayContent()}
						/>
					</React.Fragment>
				) : (
					<Box
						isNurse={false}
						videoCallToken={this.state.videoCallToken}
						setVideoCallToken={this.setVideoCallToken}
					/>
				)}
			</AppointmentContextProvider>
		);
	}
}

export default Meeting;

const AppointmentSummary = ({ date }) => (
	<div>
		<h2>Appointment Summary</h2>
		<p><b>Selected date: </b>{date || ''}</p>
		<p><b>Selected time: </b>{date || ''}</p>
		<p>Please, make sure you click on this link <b>30 minutes before</b> your actual appointment.</p>
		<p>If you need to cancel or modify your appointment, please contact us at: <b>vistasupport@dochq.co.uk</b></p>
		<div className='row flex-end'>
			<LinkButton
				text='Back to Home'
				color='green'
				linkSrc='/patient/dashboard'
			/>
		</div>
	</div>
);

const TestKit = ({ next }) => {
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
				<h3>Do you have your test kit with you?</h3>
			) : (
				<h3>Your test kit is required for this appointment, have you got it with you now?</h3>
			)}
			<div style={{ paddingTop: '20px', textAlign: 'center' }}>
				{ready && (
					<DocButton
						color='pink'
						text='No'
						onClick={() => setReady(false)}
						style={{ margin: '5px' }}
					/>
				)}
				<DocButton color='green' text='Yes' onClick={next} style={{ margin: '5px' }} />
			</div>
		</div>
	);
};

const QuietSpace = ({ next }) => {
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
				<h3>Are you positioned in a quiet space?</h3>
			) : (
				<h3>I am in the quietest space I can find.</h3>
			)}
			<div style={{ paddingTop: '20px', textAlign: 'center' }}>
				{ready && (
					<DocButton
						color='pink'
						text='No'
						onClick={() => setReady(false)}
						style={{ margin: '5px' }}
					/>
				)}
				<DocButton color='green' text='Yes' onClick={next} style={{ margin: '5px' }} />
			</div>
		</div>
	);
};

const TermsConditional = ({ next }) => {
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
				<h3>I have read and agree to DocHQs Terms and Conditions.</h3>
			) : (
				<h3>Sorry you cannot attend the video appointment</h3>
			)}
			<a onClick={() => setIsVisible(true)}>
				Read here
			</a>
			<DocModal
				title='Terms Conditions'
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
						<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, sit commodi! Laborum ex illo libero necessitatibus, inventore tenetur excepturi, odit aspernatur reprehenderit doloremque omnis quaerat explicabo fugit distinctio dolorum nemo.</p>
						<div style={{ paddingTop: '20px', textAlign: 'center' }}>
							<DocButton
								color='grey'
								text='Close'
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
						text='Reject'
						onClick={() => setReady(false)}
						style={{ margin: '5px' }}
					/>
				)}
				<DocButton color='green' text='Accept' onClick={next} style={{ margin: '5px' }} />
			</div>
		</div>
	);
};

const DelphinDataSharingPolicies = ({ next }) => {
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
						I accept to share my medical data with Delphin Health Limited to show the test results also on Klarity App. (Optional)
					​</h3>
					<div className='row padding-box'>
						<FormControl component='fieldset'>
							<RadioGroup
								aria-label='dataSharing'
								name='dataSharing'
								value={decision}
								onChange={e => setDecision(e.target.value)}
							>
								<FormControlLabel value='ready' control={<Radio />} label='Share' />
								<FormControlLabel value='notReady' control={<Radio />} label="Don't Share" />
							</RadioGroup>
						</FormControl>
					</div>
				</React.Fragment>
			) : ( ready === 'ready' ? (
				<h3 className='padding-box'>
					Thank you for submitting your decision. <br />DocHQ will share your medical data with Delphin Health.
				</h3>
			) : (
				<h3 style={{ fontWeight: 500 }} className='padding-box'>
					Thank you for submitting your decision. <br />DocHQ <b>will not</b> share your medical data with Delphin Health.
				</h3>
			))}
			<div style={{ paddingTop: '20px', textAlign: 'center' }}>
				<DocButton
					color={!!decision ? 'green' : 'disabled'}
					text={isReadyEmpty ? 'Submit' : 'Next'}
					disabled={!decision}
					onClick={() => {
						if (isReadyEmpty) {
							setReady(decision);
						} else {
							next();
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
						I accept to share my details with my national Test and Trace App. (Optional)
					​</h3>
					<div className='row padding-box'>
						<FormControl component='fieldset'>
							<RadioGroup
								aria-label='dataSharing'
								name='dataSharing'
								value={decision}
								onChange={e => setDecision(e.target.value)}
							>
								<FormControlLabel value='ready' control={<Radio />} label='Share' />
								<FormControlLabel value='notReady' control={<Radio />} label="Don't Share" />
							</RadioGroup>
						</FormControl>
					</div>
				</React.Fragment>
			) : ( ready === 'ready' ? (
				<h3 className='padding-box'>
					Thank you for submitting your decision. <br />DocHQ will share your national Test and Trace App.
				</h3>
			) : (
				<h3 style={{ fontWeight: 500 }} className='padding-box'>
					Thank you for submitting your decision. <br />DocHQ <b>will not</b> share your national Test and Trace App.
				</h3>
			))}
			<div style={{ paddingTop: '20px', textAlign: 'center' }}>
				<DocButton
					color={!!decision ? 'green' : 'disabled'}
					text={isReadyEmpty ? 'Submit' : 'Next'}
					disabled={!decision}
					onClick={() => {
						if (isReadyEmpty) {
							setReady(decision);
						} else {
							next();
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
