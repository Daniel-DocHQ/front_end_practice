import React, { useState, useCallback } from 'react';
import getURLParams from '../../helpers/getURLParams';
import './aaron.css';
import Room from './Room';

const VidCall = ({}) => {
	const params = getURLParams(window.location.href);
	const [token, setToken] = useState(null);

	const handleSubmit = useCallback(
		async event => {
			event.preventDefault();
			const data = await fetch('/video/token', {
				method: 'POST',
				body: JSON.stringify({
					identity: params['name'],
					room: params['appointmentId'],
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then(res => res.json());
			setToken(data.token);
		},
		[params, token]
	);
	return (
		<React.Fragment>
			<div className='vid-call'>
				<div className='nav'>fake nav bar to display works with nav</div>
				{token === null ? (
					<DocLobby handleSubmit={handleSubmit} params={params} />
				) : (
					<Room roomName={params['appointmentId']} token={token} />
				)}
			</div>
		</React.Fragment>
	);
};

export default VidCall;
const DocLobby = ({ handleSubmit, params }) => (
	<button style={{ paddingTop: '70px' }} onClick={handleSubmit}>
		Join {params['appointmentId']}
	</button>
);
