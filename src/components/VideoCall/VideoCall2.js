import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import OutgoingVideo from '../OutgoingVideo/OutgoingVideo';
import IncomingVideo from '../IncomingVideo/IncomingVideo';
import SettingsBar from '../SettingsBar/SettingsBar';
import hasGetUserMedia from '../../helpers/hasGetUserMedia';
import getURLParams from '../../helpers/getURLParams';
import getUserDevices from '../../helpers/getUserDevices';
const Peer = require('simple-peer');

const ENDPOINT = 'http://127.0.0.1:4001';
const iceConfig = {
	iceServers: [
		{
			url: 'stun:stun.dochq.co.uk:5349',
		},
		{
			url: 'turn:turn.dochq.co.uk:5349?transport=udp',
			credential: 'somepassword',
			username: 'guest',
		},
		{
			url: 'turn:turn.dochq.co.uk:5349?transport=tcp',
			credential: 'somepassword',
			username: 'guest',
		},
	],
};

// check capabilities -- y
/* IF YES
get devices -- y
get permissions -- y
set outgoing stream -- y
create offer
send offer
receive answer
accept answer
 */

/* IF NO
present user with an error
 */

export default class VideoCall2 extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			outgoingStream: null,
			hasPermission: true,
			settingsVisible: true,
			constraints: {},
		};

		this.createPeer = createPeer.bind(this);

		function createPeer() {
			if (this.state.outgoingStream !== null) {
				this.setState(
					{
						peer: new Peer({
							initiator: window.location.href.includes('initiator'),
							trickle: false,
							stream: this.state.outgoingStream,
							config: iceConfig.iceServers,
						}),
					},
					() => console.log('created peer')
				);
			}
		}
	}
	render() {
		return (
			<React.Fragment>
				<SettingsBar navIsVisible={true} />
				<IncomingVideo />
				<OutgoingVideo
					hasPermission={this.state.hasPermission}
					constraints={{ video: true, audio: true }}
					setStream={stream => {
						this.setState({ outgoingStream: stream });
						this.createPeer();
					}}
				/>
			</React.Fragment>
		);
	}
}
