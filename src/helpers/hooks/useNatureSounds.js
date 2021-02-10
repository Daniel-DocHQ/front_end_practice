import React, { useState, useRef } from 'react';
const sound = require('../../assets/nature.wav');
const styles = {
	soundController: {
		position: 'absolute',
		zIndex: '4200',
		right: '20px',
		bottom: '20px',
	},
	toggleButton: {
		height: '50px',
		width: '50px',
		backgroundColor: 'var(--doc-green)',
		color: 'var(--doc-dark-grey)',
		borderRadius: '50%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		boxShadow: '0 0 10px 1px var(--doc-dark-grey)',
		cursor: 'pointer',
	},
};
const useNatureSounds = () => {
	const audio = useRef();
	const [isPlaying, setIsPlaying] = useState(true);
	function handleToggle() {
		if (audio.current.volume > 0) {
			audio.current.volume = 0;
			setIsPlaying(false);
		} else {
			audio.current.volume = 0.7;
			setIsPlaying(true);
		}
	}
	return (
		<React.Fragment>
			<div className='sound-controller' style={styles.soundController}>
				<div className='toggle-button' style={styles.toggleButton} onClick={handleToggle}>
					{isPlaying ? <i className='fa fa-pause'></i> : <i className='fa fa-play'></i>}
				</div>
			</div>
			<audio ref={audio} src={sound} style={{ display: 'none' }} autoPlay loop />
		</React.Fragment>
	);
};

export default useNatureSounds;
