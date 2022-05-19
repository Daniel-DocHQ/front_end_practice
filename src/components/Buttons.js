import React from 'react';

const Buttons = ({ start, stop, takePicture, mute }) => (
	<div>
		<button onClick={start}>Start</button>
		<button onClick={stop}>Stop</button>
		<button onClick={takePicture}>Take Picture</button>
		<button onClick={mute}>Mute</button>
	</div>
);

export default Buttons;
