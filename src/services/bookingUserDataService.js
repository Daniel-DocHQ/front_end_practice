import axios from 'axios';
const baseURL = process.env.REACT_APP_BOOKING_USER_DATA_URL;
//{{role_id}}/slots?past=true&status=booked
const bookingUserDataService = {
	submitSymptomChecker,
	getHRData,
	getHRSignups,
	getUserHistory,
	getMyHistory,
	getRoleProfile,
	createRoleProfile,
	updateProfileData,
	createShippingDetails,
	submitHealthAssessment,
	getTestResultHistory,
	getOrganisationRoleProfile,
	orderKit,
	getHRAData,
};

function submitSymptomChecker(auth_token, body) {
	return new Promise((resolve, reject) => {
		if (auth_token && body) {
			axios({
				url: `${baseURL}/symptom`,
				method: 'POST',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
				data: body,
			})
				.then(response => {
					if (
						(response.status === 200 || response.data.status === 'ok') &&
						response.data.text &&
						response.data.code
					) {
						resolve({ success: true, text: response.data.text, code: response.data.code });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
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
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to authenticate user.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}

function getHRData(auth_token) {
	return new Promise((resolve, reject) => {
		if (auth_token) {
			axios({
				url: `${baseURL}/organisations/symptom_history`,
				method: 'get',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, symptom_history: response.data });
					} else if (response.status === 204) {
						resolve({ success: true, symptom_history: [] });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
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
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to authenticate user.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}

function getHRSignups(auth_token) {
	return new Promise((resolve, reject) => {
		if (auth_token) {
			axios({
				url: `${baseURL}/organisations/registrations`,
				method: 'get',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({
							success: true,
							registrations: response.data,
						});
					} else if (response.status === 204) {
						resolve({ success: true, registrations: [] });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
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
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to authenticate user.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}

function getUserHistory(auth_token, user_id) {
	return new Promise((resolve, reject) => {
		if (auth_token && user_id) {
			axios({
				url: `${baseURL}/roles/${user_id}/history`,
				method: 'get',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, symptom_history: response.data });
					} else if (response.status === 204) {
						resolve({ success: true, symptom_history: [] });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
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
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to authenticate user.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}

function getMyHistory(auth_token) {
	return new Promise((resolve, reject) => {
		if (auth_token) {
			axios({
				url: `${baseURL}/roles/history`,
				method: 'get',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, symptom_history: response.data });
					} else if (response.status === 204) {
						resolve({ success: true, symptom_history: [] });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
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
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to authenticate user.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}

function getRoleProfile(auth_token) {
	return new Promise((resolve, reject) => {
		if (auth_token) {
			axios({
				url: `${baseURL}/roles`,
				method: 'GET',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, role_profile: response.data });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
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
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to authenticate user.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}

function createRoleProfile(auth_token, body) {
	function isValid(obj) {
		return (
			obj &&
			obj.role_id &&
			obj.organisation_profile_id &&
			obj.shipping_details &&
			obj.shipping_details.name &&
			obj.shipping_details.address_1 &&
			obj.shipping_details.city &&
			obj.shipping_details.county &&
			obj.shipping_details.postcode
		);
	}
	return new Promise((resolve, reject) => {
		if (auth_token && body) {
			axios({
				url: `${baseURL}/roles`,
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
				data: body,
				method: 'post',
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, role_profile: response.data });
					} else {
						// TODO what other responses will they send?!
						reject({
							success: false,
							error: 'An error occurred',
						});
					}
				})
				.catch(err => reject({ success: false, error: 'Server Error Occurred' }));
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to create role profile.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}

function updateProfileData(auth_token, body) {
	return new Promise((resolve, reject) => {
		if (auth_token && body) {
			axios({
				url: `${baseURL}/roles`,
				method: 'PATCH',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
				data: body,
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, role_profile: response.data });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
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
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to authenticate user.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}

function createShippingDetails(auth_token, body) {
	function isValid(obj) {
		return (
			obj &&
			obj.shipping_details &&
			obj.shipping_details.name &&
			obj.shipping_details.address_1 &&
			obj.shipping_details.city &&
			obj.shipping_details.county &&
			obj.shipping_details.postcode
		);
	}
	return new Promise((resolve, reject) => {
		if (auth_token && body) {
			axios({
				url: `${baseURL}/roles/shipping`,
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
				data: body,
				method: 'post',
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, role_profile: response.data });
					} else {
						// TODO what other responses will they send?!
						reject({
							success: false,
							error: 'An error occurred',
						});
					}
				})
				.catch(err => reject({ success: false, error: 'Server Error Occurred' }));
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to create role profile.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}

function submitHealthAssessment(auth_token, body) {
	return new Promise((resolve, reject) => {
		if (auth_token && body) {
			axios({
				url: `${baseURL}/onboarding`,
				method: 'POST',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
				data: body,
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
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
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to authenticate user.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}
function getHealthAssessment(auth_token, id) {
	return new Promise((resolve, reject) => {
		if (auth_token && id) {
			axios({
				url: `${baseURL}/onboarding?id=${id}`,
				method: 'GET',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, health_assessment: response.data });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
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
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to authenticate user.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}

function getTestResultHistory(auth_token, role_profile_id) {
	return new Promise((resolve, reject) => {
		if (auth_token && role_profile_id) {
			axios({
				url: `${baseURL}/roles/results?id=${role_profile_id}`,
				method: 'get',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, test_results: response.data });
					} else if (response.status === 204) {
						resolve({ success: true, test_results: [] });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
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
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to authenticate user.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}

function getOrganisationRoleProfile(auth_token) {
	return new Promise((resolve, reject) => {
		if (auth_token) {
			axios({
				url: `${baseURL}/organisations`,
				method: 'get',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, organisation_profile: response.data });
					} else if (response.status === 204) {
						resolve({ success: true, organisation_profile: [] });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
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
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to authenticate user.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}
function orderKit(auth_token, body) {
	function isValid(obj) {
		return obj && obj.role_profile_id && obj.appointment_date;
	}
	return new Promise((resolve, reject) => {
		if (auth_token && isValid(body)) {
			axios({
				url: `${baseURL}/order`,
				method: 'POST',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
				data: body,
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, order_details: response.data });
					} else {
						reject({
							success: false,
							error: response.data.error,
						});
					}
				})
				.catch(err => reject({ success: false, error: 'Server Error Occurred' }));
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to authenticate user.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}
function getHRAData(auth_token) {
	return new Promise((resolve, reject) => {
		if (auth_token) {
			axios({
				url: `${baseURL}/roles/onboarding`,
				method: 'GET',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, hra_data: response.data });
					} else {
						reject({
							success: false,
							error: response.data.error,
						});
					}
				})
				.catch(err => reject({ success: false, error: 'Server Error Occurred' }));
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to authenticate user.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}
export default bookingUserDataService;
