import React, { Component } from 'react';
import { StepperControl } from './Stepper';
import { AppContext } from '../common/AppContext';

class StepperContainer extends Component {
	state = {
		step0: {
			data: { postcode: null, locationData: null },
			fields: ['postcode', 'locationData'],
		},
	};

	stateUpdate(step, changes) {
		const stepData = this.state[step] ? this.state[step] : { data: {}, fields: [] };

		stepData.fields.forEach(field => {
			stepData[field] = changes[field];
		});

		this.setState({ [step]: stepData });
	}

	componentDidUpdate() {
		const { location, postcode, location_data } = this.props;
		this.stateUpdate('step0', { location, postcode, locationData: location_data });
	}

	render() {
		return (
			<AppContext.Provider value={this.state}>
				<StepperControl {...this.props} />
			</AppContext.Provider>
		);
	}
}

StepperContainer.contextType = AppContext;

export default StepperContainer;
