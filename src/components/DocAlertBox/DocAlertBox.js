import React, { useState } from 'react';
import './DocAlertBox.scss';
/**
 * status = error || success
 */
const DocAlertBox = ({ status, message, isClosable, style }) => {
	const [isVisible, setIsVisible] = useState(true);
	const allStyles = typeof style !== 'undefined' ? { ...style } : {};
	return isVisible ? (
		<React.Fragment>
			<div className={`alert-box-container ${status}`} style={allStyles}>
				<div className={`alert-box ${status}`}>
					<span>{message}</span>
					{isVisible && typeof isClosable !== 'undefined' && isClosable && (
						<i className='fa fa-times' onClick={() => setIsVisible(false)}></i>
					)}
				</div>
			</div>
		</React.Fragment>
	) : (
		<></>
	);
};

export default DocAlertBox;
