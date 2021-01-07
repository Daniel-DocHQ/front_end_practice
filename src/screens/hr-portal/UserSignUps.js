import React, { Component } from 'react';
import { ToastsStore } from 'react-toasts';
import SignUpTable from '../../components/Tables/SignUpTable';
import bookingUserDataService from '../../services/bookingUserDataService';

export default class UserSignUps extends Component {
	constructor(props) {
		super(props);

		this.state = {
			registrations: [],
		};
		this.getUserSignUps = getUserSignUps.bind(this);
		function getUserSignUps() {
			bookingUserDataService
				.getHRSignups(this.props.token)
				.then(result => {
					if (result.success && result.registrations) {
						this.state.registrations = result.registrations;
						this.setState({ registrations: result.registrations });
						ToastsStore.success('Retrieved registrations');
					} else {
						ToastsStore.error('Error retrieving registrations');
					}
				})
				.catch(err => ToastsStore.error('Error retrieving registrations'));
		}
	}
	componentWillMount() {
		if (this.props.token) {
			this.getUserSignUps();
		}
	}
	render() {
		return (
			<React.Fragment>
				<SignUpTable registrations={this.state.registrations} />
			</React.Fragment>
		);
	}
}
