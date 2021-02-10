import React, { useState } from 'react';
import FullScreenOverlay from '../components/FullScreenOverlay/FullScreenOverlay';
import DocButton from '../components/DocButton/DocButton';
import { Redirect } from 'react-router-dom';
import { PatientHeader } from '../components/VideoCall/TwillioVideoCall';
import Box from '../components/TwilioVideo/Box';
class Meeting extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasTestKit: false,
			inQuietSpace: false,
			questionsVisible: true,
		};
		this.isVista = window.location.href.includes('vista');
		this.displayContent = this.displayContent.bind(this);
	}
	displayContent() {
		if (this.state.questionsVisible) {
			if (!this.state.inQuietSpace) {
				return <QuietSpace next={() => this.setState({ inQuietSpace: true })} />;
			}
			if (!this.state.hasTestKit) {
				return <TestKit next={() => this.setState({ hasTestKit: true })} />;
			}
			if (this.state.inQuietSpace && this.state.hasTestKit) {
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
					<Box isNurse={false} />
				)}
			</React.Fragment>
		);
	}
}

export default Meeting;

const TestKit = ({ next }) => {
	const [ready, setReady] = useState('');
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			{ready === '' && <h3>Do you have your test kit with you?</h3>}
			{ready === false && (
				<h3>Your test kit is required for this appointment, have you got it with you now?</h3>
			)}
			<div style={{ paddingTop: '20px', textAlign: 'center' }}>
				{ready === '' && (
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
	const [ready, setReady] = useState('');
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			{ready === '' && <h3>Are you positioned in a quiet space?</h3>}
			{ready === false && <h3>I am in the quietest space I can find.</h3>}
			<div style={{ paddingTop: '20px', textAlign: 'center' }}>
				{ready === '' && (
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
