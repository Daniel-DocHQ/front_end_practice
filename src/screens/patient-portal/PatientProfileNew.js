import { Paper } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { ToastsStore } from 'react-toasts';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';
import LinkButton from '../../components/DocButton/LinkButton';
import PatientProfileDetails from '../../components/PatientProfile/PatientProfileDetails';
import PatientProfileDetailsNew from '../../components/PatientProfile/PatientProfileDetailsNew';
import authorisationSvc from '../../services/authorisationService';
import bookingUserDataService from '../../services/bookingUserDataService';

export default class PatientProfileNew extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			profile_data: {
				first_name: '',
				last_name: '',
				email: '',
				street_address: '',
				city: '',
				county: '',
				postcode: '',
			},
			profile_complete: null,
		};
		this.updateProfile = updateProfile.bind(this);
		this.getProfile = getProfile.bind(this);
		this.getUser = getUser.bind(this);

		function updateProfile(shippingDetails) {
			const body = { shipping_details: shippingDetails };
			body.shipping_details.name =
				body.shipping_details.first_name + ' ' + body.shipping_details.last_name;
			body.role_id = this.props.user.roles[0].id;
			body.organisation_profile_id = this.props.user.roles[0].organisation_id;
			if (this.state.profile_complete) {
				if (typeof this.state.profile_data.id !== 'undefined') {
					body.shipping_details.id = this.state.profile_data.id;
				}
				bookingUserDataService
					.updateProfileData(this.props.token, body)
					.then(result => {
						if (result.success && result.role_profile) {
							props.setRoleProfile(result.role_profile);
							this.setState({
								profile_complete: true,
								profile_data: result.role_profile,
							});

							ToastsStore.success(`Updated Profile`);
						} else {
							ToastsStore.error(`Failed to update profile`);
						}
					})
					.catch(err => {
						ToastsStore.error(`Failed to update profile`);
					});
			} else {
				bookingUserDataService
					.createRoleProfile(this.props.token, body)
					.then(result => {
						if (result.success && result.role_profile) {
							this.setState({ profile_complete: true, profile_data: result.role_profile });
							props.setRoleProfile(result.role_profile);

							ToastsStore.success(`Created Profile`);
						} else {
							ToastsStore.error(`Failed to create profile`);
						}
					})
					.catch(err => {
						ToastsStore.error(`Failed to create profile`);
					});
			}
		}
		function getProfile() {
			bookingUserDataService
				.getRoleProfile(this.props.token)
				.then(result => {
					if (result.success && result.role_profile) {
						props.setRoleProfile(result.role_profile);
						this.setState(prevState => ({
							profile_data: { ...prevState.profile_data, ...result.role_profile.shipping_details },
							profile_complete: true,
						}));
						ToastsStore.success(`Found Profile`);
					} else {
						this.setState({ profile_complete: false });
					}
				})
				.catch(err => {
					this.setState({ profile_complete: false });
				});
		}
		function getUser(token) {
			authorisationSvc.getUser(token).then(resp => {
				if (resp.success && resp.user) {
					this.props.setUser(resp.user);
					this.setState({ profile_data: { ...resp.user } });
					ToastsStore.success('Found user data');
				}
			});
		}
	}
	componentWillMount() {
		// get personal profile
		this.getProfile();
		this.getUser(this.props.token);
		if (this.props.user) {
			if (this.props.user.first_name)
				this.state.profile_data.first_name = this.props.user.first_name;
			if (this.props.user.last_name) this.state.profile_data.last_name = this.props.user.last_name;
			if (this.props.user.email) this.state.profile_data.email = this.props.user.email;
		}
	}

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
