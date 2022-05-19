import React from 'react';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';
import PatientProfileDetailsNew from '../../components/PatientProfile/PatientProfileDetailsNew';

export default class PatientProfileNew extends React.Component {
	render() {
		return (
			<React.Fragment>
				<BigWhiteContainer>
					<PatientProfileDetailsNew />
				</BigWhiteContainer>
			</React.Fragment>
		);
	}
}
