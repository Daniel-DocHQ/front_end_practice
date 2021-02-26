import React, { useState } from 'react';
import FullScreenOverlay from '../components/FullScreenOverlay/FullScreenOverlay';
import DocButton from '../components/DocButton/DocButton';
import { PatientHeader } from '../components/VideoCall/TwillioVideoCall';
import DocModal from '../components/DocModal/DocModal';
import LinkButton from '../components/DocButton/LinkButton';
import Box from '../components/TwilioVideo/Box';

class Meeting extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			step: 4,
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
				case 3: return <DataSharingPolicies next={this.increaseStep} />;
				case 4: return <QuietSpace next={this.increaseStep} />;
				case 5: return <TestKit next={this.increaseStep} />;
				default:
					this.setState({ questionsVisible: false });
					return null;
			}
		}
	}
	render() {
		return (
			<React.Fragment>
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
			</React.Fragment>
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
				<React.Fragment>
					<h3>Do you accept T&C?</h3>
					<h4>If you do not accept you won’t be able to do the test​</h4>
				</React.Fragment>
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

const DataSharingPolicies = ({ next }) => {
	const [ready, setReady] = useState('');
	const [isVisible, setIsVisible] = useState(false);
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
					<h3>Do you accept  data sharing policies?​</h3>
					<a onClick={() => setIsVisible(true)}>
						Read here
					</a>
				</React.Fragment>
			) : ( ready === 'ready' ? (
				<h3>Thank you for agreeing to share</h3>
			) : (
				<h3>Thank you for submitting your decision​</h3>
			))}
			<DocModal
				title='Data Sharing Policies'
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
				{isReadyEmpty && (
					<DocButton
						color='pink'
						text='Reject'
						onClick={() => setReady('notReady')}
						style={{ margin: '5px' }}
					/>
				)}
				<DocButton
					color='green'
					text={isReadyEmpty ? 'Accept' : 'Next'}
					onClick={() => {
						if (isReadyEmpty) {
							setReady('ready');
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
