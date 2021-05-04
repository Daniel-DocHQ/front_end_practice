import React, { useEffect, memo, useState } from 'react';
import UploadedPositiveResultsTable from '../../components/Tables/UploadedPositiveResultsTable';
import CertificatesListTable from '../../components/Tables/CertificatesListTable';
import adminService from '../../services/adminService';
import { useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';

const CertificatesList = props => {
	const [certificates, setCertificates] = useState();
	const certificatesTemplates = [
		{
			name: 'UK PCR Travel Certificate',
			downloadLink: 'https://storage.googleapis.com/dochq.co.uk/certificate-templates/UK%20PCR%20travel%20certificate.csv',
			onChange: (file) => uploadCsvFile('PCRTravelUK', file),
		},
		{
			name: 'UK PCR Medical Certificate',
			downloadLink: 'https://storage.googleapis.com/dochq.co.uk/certificate-templates/UK%20PCR%20medical%20certificate.csv',
			onChange: (file) => uploadCsvFile('PCRMedicalUK', file),
		},
		{
			name: 'UK Antigen Travel Certificate',
			downloadLink: 'https://storage.googleapis.com/dochq.co.uk/certificate-templates/UK%20Antigen%20medical%20certificate.csv',
			onChange: (file) => uploadCsvFile('AntigenTravelUK', file),
		},
		{
			name: 'UK Antigen Medical Certificate',
			downloadLink: 'https://storage.googleapis.com/dochq.co.uk/certificate-templates/UK%20Antigen%20medical%20certificate.csv',
			onChange: (file) => uploadCsvFile('AntigenMedicalUK', file),
		},
		{
			name: 'DE PCR Travel Certificate',
			downloadLink: 'https://storage.googleapis.com/dochq.co.uk/certificate-templates/DE%20PCR%20Travel%20Certificate.csv',
			onChange: (file) => uploadCsvFile('PCRTravelDE', file),
		},
		{
			name: 'DE Antigen Travel Certificate',
			downloadLink: 'https://storage.googleapis.com/dochq.co.uk/certificate-templates/DE%20Antigen%20Travel%20Certificate.csv',
			onChange: (file) => uploadCsvFile('AntigenTravelDE', file),
		},
	];

	let history = useHistory();
	if (props.isAuthenticated !== true && props.role !== 'practitioner') {
		history.push('/login');
	}

	// const getCsvFiles = () => (
	// 	adminService
	// 		.getAppointments(props.token)
	// 		.then(data => {
	// 			if (data.success) {
	// 				// setCertificates(data.certificates);
	// 			} else if (!data.authenticated) {
	// 				history.push('/login');
	// 			} else {
	// 				ToastsStore.error('Error fetching certificates');
	// 			}
	// 		})
	// 		.catch(err => ToastsStore.error('Error fetching certificates'))
    // );

	const uploadCsvFile = (type, upload) => {
		const data = new FormData();
		data.append("upload", upload);
		adminService
			.uploadCsvFile(type, data, props.token)
			.then(result => {
				if (result.success) {
					setCertificates(result.certificates);
					ToastsStore.success('File uploaded');
				} else {
					ToastsStore.error('Error uploading file');
				}
			})
			.catch(() => ToastsStore.error('Error uploading file'))
	};

	// useEffect(() => {
	// 	getCsvFiles();
	// }, []);

	return !!certificates
		? <UploadedPositiveResultsTable results={certificates} back={() => setCertificates()} />
		: <CertificatesListTable certificates={certificatesTemplates} />;
};

export default memo(CertificatesList);
