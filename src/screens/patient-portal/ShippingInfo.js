import React from 'react';
import PatientProfileDetailsNew from '../../components/PatientProfile/PatientProfileDetailsNew';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';

export default class PatientProfile extends React.Component {
	render() {
		return (
			<BigWhiteContainer>
				<PatientProfileDetailsNew textPersonalInfo />
			</BigWhiteContainer>
		);
	}
}
