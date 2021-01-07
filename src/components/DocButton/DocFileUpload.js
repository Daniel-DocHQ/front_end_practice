import React, { useState, useRef } from 'react';
import './DocFileUpload.scss';
import './DocButton.scss';

const DocFileUpload = ({ color, label, id, style, accept, updateFileData, ...rest }) => {
	const fileRef = useRef();
	const [fileSelected, setFileSelected] = useState(false);

	function handleChange(e) {
		setFileSelected(true);
		updateFileData(e.target.files[0]);
	}
	return (
		<div>
			<input
				ref={fileRef}
				type='file'
				id={id ? id : 'file-upload'}
				accept={accept ? accept : 'image/*'}
				onChange={handleChange}
			/>
			<label htmlFor={id ? id : 'file-upload'}>{fileSelected ? 'Upload' : label}</label>
		</div>
	);
};

export default DocFileUpload;
