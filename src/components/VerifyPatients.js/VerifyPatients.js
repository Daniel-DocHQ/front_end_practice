import { format } from 'date-fns';
import React, { useState } from 'react';
import DocButton from '../DocButton/DocButton';

const VerifyPatients = ({ patients, updateParent }) => {
	const [activePatient, setActivePatient] = useState(0);

	function nextPatient() {
		if (activePatient === patients.length - 1) {
			updateParent();
		} else {
			setActivePatient(activePatient + 1);
		}
	}

	return !!patients && !!updateParent ? (
		<React.Fragment>
			<div className='row space-between'>
				<h3 className='no-margin'>Patient Verification</h3>
				<h3 className='no-margin'>{`${activePatient + 1} of ${patients.length}`}</h3>
			</div>
			<Patient patientData={patients[activePatient]} />
			<div className='row no-margin'>
				<h4>I confirm I have verified the identity of the patient I am speaking to.</h4>
			</div>
			<div className='row flex-end'>
				<DocButton text='Confirm' color='green' onClick={nextPatient} />
			</div>
		</React.Fragment>
	) : null;
};

export default VerifyPatients;

const Patient = ({ patientData }) => (
	<React.Fragment>
		{patientData && patientData.first_name && (
			<div className='row space-between'>
				<p className='no-margin'>First Name:</p>
				<p>{patientData.first_name}</p>
			</div>
		)}
		{patientData && patientData.first_name && (
			<div className='row space-between'>
				<p className='no-margin'>Last Name:</p>
				<p>{patientData.last_name}</p>
			</div>
		)}
		{!!patientData && !!patientData.date_of_birth && (
			<div className='row space-between'>
				<p className='no-margin'>DOB:</p>
				<p>{format(new Date(patientData.date_of_birth), 'dd-MM-yyyy')}</p>
			</div>
		)}
		{patientData && typeof patientData.sex !== 'undefined' && (
			<div className='row space-between'>
				<p className='no-margin'>Sex:</p>
				<p>{patientData.sex}</p>
			</div>
		)}
		{patientData && patientData.postal_code && (
			<div className='row space-between'>
				<p className='no-margin'>Post Code:</p>
				<p>{patientData.postal_code}</p>
			</div>
		)}
		{patientData && patientData.email && (
			<div className='row space-between'>
				<p className='no-margin'>Email:</p>
				<p>{patientData.email}</p>
			</div>
		)}
		{patientData && patientData.phone && (
			<div className='row space-between'>
				<p className='no-margin'>Phone Number:</p>
				<p>{patientData.phone}</p>
			</div>
		)}
	</React.Fragment>
);
