import axios from 'axios';
import { jwtDecode } from '../helpers/jwtDecode';
const identitiesUrl = process.env.REACT_APP_IDENTITIES_URL || `https://services-identity-staging.dochq.co.uk`;
const loginUrl = process.env.REACT_APP_LOGIN_URL || `https://services-login-staging.dochq.co.uk`;
const loginBearer = process.env.REACT_APP_LOGIN_BEARER
	? `Bearer ${process.env.REACT_APP_LOGIN_BEARER}`
	: 'Bearer qj6WfxEpLg2WVjss';
const identitiesBearer = process.env.REACT_APP_IDENTITIES_BEARER
	? `Bearer ${process.env.REACT_APP_IDENTITIES_BEARER}`
	: 'Bearer Ww8cEFh9EIGPNNRi';
const authorisationSvc = {
	login(username, password) {},
	logout() {
		try {
			localStorage.clear();
			return true;
		} catch (error) {
			return false;
		}
	},
	attemptLogin(email, password) {
		return new Promise((resolve, reject) => {
			if (email && password) {
				axios({
					url: `${loginUrl}/auth`,
					method: 'post',
					data: { email, password: password },
					headers: { 'Content-type': 'application,json', Authorization: loginBearer },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data.roles) {
							resolve({
								success: true,
								roles: response.data.roles,
								role_data: response.data,
								user: response.data,
							});
						} else {
							reject({ success: false, error: 'Unable to authenticate user.' });
						}
					})
					.catch(err => reject({ success: false, error: 'Unable to authenticate user.' }));
			} else {
				reject({ success: false, error: 'Missing details.' });
			}
		});
	},
	createToken(role) {
		function isValid(obj) {
			return obj && obj.name && obj.user_id && obj.organisation_id && obj.role_id;
		}
		return new Promise((resolve, reject) => {
			if (isValid(role)) {
				axios({
					url: `${loginUrl}/token`,
					method: 'POST',
					headers: { 'Content-type': 'application,json', Authorization: loginBearer },
					data: role,
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data.token) {
							resolve({ success: true, token: response.data.token });
						} else {
							// TODO what other responses will they send?!
							reject({
								success: false,
								error: 'An error occurred',
							});
						}
					})
					.catch(err => reject({ success: false, error: 'Server Error Occurred' }));
			} else {
				resolve({ success: false, error: 'Missing Details' });
			}
		});
	},
	getJWT(token) {
		return new Promise((resolve, reject) => {
			if (token) {
				axios({
					url: `${loginUrl}/token/${token}`,
					method: 'GET',
					headers: { 'Content-type': 'application,json', Authorization: loginBearer },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data.token) {
							resolve({ success: true, token: response.data.token });
						} else {
							reject({ success: false, error: 'Unable to authenticate user.' });
						}
					})
					.catch(err => reject({ success: false, error: 'Unable to authenticate user.' }));
			} else {
				reject({ success: false, error: 'Missing details.' });
			}
		});
	},
	// resetPassword(email) {
	// 	return new Promise((resolve, reject) => {
	// 		axios({
	// 			method: 'post',
	// 			url: `${userUrl}/forgot-password`,
	// 			data: { email: email },
	// 		})
	// 			.then(response => {
	// 				if (response.status === 200 || response.data.status === 'ok') {
	// 					resolve({
	// 						success: true,
	// 					});
	// 				} else {
	// 					reject({
	// 						success: false,
	// 						error: 'Error resetting password',
	// 					});
	// 				}
	// 			})
	// 			.catch(err => {
	// 				reject(err);
	// 			});
	// 	});
	// },
	// newPassword(password, reset_token) {
	// 	return new Promise((resolve, reject) => {
	// 		axios({
	// 			method: 'patch',
	// 			url: `${userUrl}/reset-password`,
	// 			data: {
	// 				password: password,
	// 				reset_token: reset_token,
	// 			},
	// 		})
	// 			.then(response => {
	// 				if (response.status === 200 || response.data.status === 'ok') {
	// 					resolve({
	// 						success: true,
	// 					});
	// 				} else {
	// 					reject({
	// 						success: false,
	// 						error: 'Error resetting password',
	// 					});
	// 				}
	// 			})
	// 			.catch(err => {
	// 				reject(err);
	// 			});
	// 	});
	// },
	createUser(body) {
		function isValid(obj) {
			return (
				obj &&
				obj.first_name &&
				obj.last_name &&
				obj.email &&
				obj.date_of_birth &&
				obj.password &&
				obj.username &&
				obj.organisation_id
			);
		}
		return new Promise((resolve, reject) => {
			if (body && isValid(body)) {
				axios({
					url: `${identitiesUrl}/users`,
					method: 'POST',
					headers: {
						'Content-type': 'application,json',
						Authorization: identitiesBearer,
					},
					data: body,
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data.id) {
							resolve({ success: true, user: response.data, id: response.data.id });
						} else if (response.status === 403) {
							reject({
								success: false,
								error: 'Unable to create user.',
								authenticated: false,
							});
						} else {
							// TODO what other responses will they send?!
							reject({
								success: false,
								error: 'An error occurred',
							});
						}
					})
					.catch(err => reject({ success: false, error: 'Server Error Occurred' }));
			} else {
				resolve({ success: false, error: 'Missing Details' });
			}
		});
	},
	createRole(body) {
		function isValid(obj) {
			return obj && obj.name && obj.user_id && obj.organisation_id;
		}
		return new Promise((resolve, reject) => {
			if (body && isValid(body)) {
				axios({
					url: `${identitiesUrl}/roles`,
					method: 'POST',
					headers: { 'Content-type': 'application,json', Authorization: identitiesBearer },
					data: body,
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data.id) {
							resolve({ success: true, role: response.data, id: response.data.id });
						} else {
							// TODO what other responses will they send?!
							reject({
								success: false,
								error: 'An error occurred',
							});
						}
					})
					.catch(err => reject({ success: false, error: 'Server Error Occurred' }));
			} else {
				resolve({ success: false, error: 'Missing Details' });
			}
		});
	},
	getUser(token) {
		return new Promise((resolve, reject) => {
			const decode = jwtDecode(token);
			if (token && typeof decode !== 'undefined' && typeof decode.user_id !== 'undefined') {
				axios({
					url: `${identitiesUrl}/users/${decode.user_id}`,
					method: 'GET',
					headers: { 'Content-type': 'application,json', Authorization: identitiesBearer },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({ success: true, user: response.data });
						} else {
							reject({ success: false, error: 'Unable to find user data.' });
						}
					})
					.catch(err => reject({ success: false, error: 'Unable to find user data.' }));
			} else {
				reject({ success: false, error: 'Missing details.' });
			}
		});
	},
};
export default authorisationSvc;
