import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import getURLParams from '../helpers/getURLParams';
import authorisationSvc from '../services/authorisationService';
import bookingUserDataService from '../services/bookingUserDataService';

const VerifyToken = props => {
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		// runs on page load
		localStorage.clear();
	}, []);
	useEffect(() => {
		const params = getURLParams(window.location.href);
		if (!!params && !!params['token']) {
			authorisationSvc
				.getJWT(params['token'])
				.then(result => {
					if (result.success && result.token) {
						props.setToken(result.token);
						const promises = [
							authorisationSvc.getUser(result.token),
							bookingUserDataService.getOrganisationRoleProfile(result.token),
							bookingUserDataService.getRoleProfile(result.token),
						];
						Promise.allSettled(promises)
							.then(values => {
								const userData = values[0];
								const orgProfileData = values[1];
								const roleProfile = values[2];
								if (
									userData.status === 'fulfilled' &&
									userData.value.success &&
									userData.value.user
								) {
									props.setUser(userData.value.user);
								}
								if (
									orgProfileData.status === 'fulfilled' &&
									orgProfileData.value.success &&
									orgProfileData.value.organisation_profile
								) {
									props.setOrgProfile(orgProfileData.value.organisation_profile);
								}
								if (
									roleProfile.status === 'fulfilled' &&
									roleProfile.value.success &&
									roleProfile.value.role_profile
								) {
									props.setRoleProfile(roleProfile.value.role_profile);
								} else {
									console.log('profile_not_complete');
								}
								setIsLoading(false);
							})
							.catch(() => console.log('error'));
					} else {
						ToastsStore.error('Invalid login token');
					}
				})
				.catch(err => ToastsStore.error('Invalid login token'));
		}
	}, []);
	const pathname = () => {
		if (typeof roleName !== 'undefined' && roleName !== null) {
			return `/${roleName}/dashboard`;
		} else {
			return '/login';
		}
	};
	return !isLoading ? <Redirect to={pathname} /> : <React.Fragment></React.Fragment>;
};

export default VerifyToken;
