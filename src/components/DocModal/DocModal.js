import React from 'react';
import './DocModal.scss';

const DocModal = ({ isVisible, title, content, footer, onClose }) =>
	!isVisible ? null : (
		<div className='modal'>
			<div className='modal-dialog'>
				{!!title && (
					<div className='modal-header'>
						<h3 className='modal-title'>{title}</h3>
						<span className='modal-close' onClick={onClose}>
							<i className='fa fa-times close-button'></i>
						</span>
					</div>
				)}
				<div className='modal-body'>
					<div className='modal-content'>{content}</div>
				</div>
				{footer && <div className='modal-footer'>{footer}</div>}
			</div>
		</div>
	);
export default DocModal;
