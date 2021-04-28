import axios from 'axios';
import { ddMMyyyy } from '../helpers/formatDate';
import getURLParams from '../helpers/getURLParams';
const baseURL = process.env.REACT_APP_BOOKING_URL;

const SERVICE_TYPE = 'video_gp';
const bookingService = {
	getSlots,
	getAvailableDates,
	paymentRequest,
	getClaimableAppointments,
	claimAppointment,
	releaseAppointment,
	sendResult,
	getAppointmentInfo,
	updateTerms,
	updateAppointmentStatus,
	sendAlternativeLink,
};

// Booking engine
function getSlots(selectedDate) {
	const params = getURLParams();
	const date = ddMMyyyy(selectedDate);
	function additionalParams() {
		// used to book group face to face appointments
		if (params['group'] && params['user']) {
			return `&group=${params['group']}&user=${params['user']}`;
		}
		return '';
	}
	return new Promise((resolve, reject) => {
		if (date) {
			axios({
				url: `${baseURL}?&service=${
					typeof params['service'] === 'undefined' ? SERVICE_TYPE : params['service']
				}&date=${date}${additionalParams()}`,
				method: 'get',
				headers: { 'Content-type': 'application,json' },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, appointments: response.data });
					} else if (response.status === 204) {
						resolve({ success: true, appointments: [] });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
							authenticated: false,
						});
					} else {
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
}

function getAvailableDates(startDate, endDate, auth_token) {
	const params = getURLParams();

	return new Promise((resolve, reject) => {
		if (startDate && endDate) {
			const headers = { 'Content-type': 'application,json' };
			if (auth_token) {
				headers.Authorization = `Bearer ${auth_token}`;
			}
			axios({
				url: `${baseURL}/datesearch?date_from=${startDate}&date_to=${endDate}&service=${
					typeof params['service'] === 'undefined' ? SERVICE_TYPE : params['service']
				}`,
				method: 'get',
				headers: headers,
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, availableDates: response.data });
					} else if (response.status === 204) {
						resolve({ success: true, availableDates: [] });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
							authenticated: false,
						});
					} else {
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
}

function paymentRequest(slotId, data, auth_token) {
	//TODO should be in component
	const params = getURLParams(window.location.href);

	if (params['group']) data.group = params['group'];
	if (params['user']) data.user = params['user'];
	if (typeof params['token'] !== 'undefined') data.token = params['token'];
	if (typeof params['service'] !== 'undefined') {
		data.service = params['service'];
	} else {
		data.service = SERVICE_TYPE;
	}

	return new Promise((resolve, reject) => {
		if (slotId && data) {
			const headers = { 'Content-type': 'application,json' };
			if (auth_token) {
				headers.Authorization = `Bearer ${auth_token}`;
			}
			axios({
				url: `${baseURL}/${slotId}/payment`,
				method: 'POST',
				headers: headers,
				data: data,
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, confirmation: response.data });
					} else if (response.status === 204) {
						resolve({ success: true, confirmation: {} });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
							authenticated: false,
						});
					} else {
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
}
// Practitioner end points

function getClaimableAppointments(auth_token) {
	return new Promise((resolve, reject) => {
		if (auth_token) {
			axios({
				url: `${baseURL}/getclaimappointments`,
				method: 'get',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, claimable_appointments: response.data });
					} else if (response.status === 204) {
						resolve({ success: true, claimable_appointments: [] });
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
				.catch(({ response: { status }}) => reject({ success: false, error: 'Server Error Occurred', status }));
		} else if (typeof auth_token === 'undefined') {
			reject({ success: false, error: 'Unable to authenticate user.', authenticated: false });
		} else {
			resolve({ success: false, error: 'Missing Details' });
		}
	});
}

function claimAppointment(auth_token, slot_id) {
	return new Promise((resolve, reject) => {
		if (auth_token && slot_id) {
			axios({
				url: `${baseURL}/${slot_id}/claim`,
				method: 'POST',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true });
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
function updateAppointmentStatus(auth_token, slot_id, body) {
	return new Promise((resolve, reject) => {
		if (!!auth_token && !!slot_id) {
			axios({
				url: `${baseURL}/${slot_id}/status`,
				method: 'POST',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
				data: body,
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true });
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
function releaseAppointment(auth_token, slot_id) {
	return new Promise((resolve, reject) => {
		if (auth_token && slot_id) {
			axios({
				url: `${baseURL}/${slot_id}/release`,
				method: 'POST',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true });
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
function sendResult(auth_token, appointment_id, body, patientId) {
	return new Promise((resolve, reject) => {
		body.supervisor = 'Dr. Khaled Helmy';
		body.gmc = '2271298';
		body.medical_clinic = 'Ciconia Recovery Limited';
		body.cqc = '8220927874';
		body.product = 'Roche Rapid Antigen';
		body.type = 'SARS-CoV-2';
		body.metadata = { ...body };
		if (auth_token && appointment_id && patientId) {
			axios({
				url: `${baseURL}/${appointment_id}/booking-users/${patientId}`,
				method: 'PUT',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
				data: body,
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true });
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
function getAppointmentInfo(appointment_id) {
	return new Promise((resolve, reject) => {
		if (appointment_id) {
			axios({
				url: `${baseURL}/${appointment_id}/info`,
				method: 'get',
				headers: { 'Content-type': 'application,json' },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true, appointments: response.data });
					} else if (response.status === 204) {
						resolve({ success: true, appointments: [] });
					} else if (response.status === 403) {
						reject({
							success: false,
							error: 'Unable to authenticate user.',
							authenticated: false,
						});
					} else {
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
}
function updateTerms(appointment_id, body) {
	return new Promise((resolve, reject) => {
		if (appointment_id && !!body) {
			axios({
				url: `${baseURL}/${appointment_id}/updateterms`,
				method: 'PATCH',
				headers: { 'Content-type': 'application,json' },
				data: body,
			})
			.then(response => {
				if (response.status === 200 || response.data.status === 'ok') {
					resolve({ success: true });
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

function sendAlternativeLink(auth_token, appointmentId) {
	return new Promise((resolve, reject) => {
		if (auth_token && appointmentId) {
			axios({
				url: `${baseURL}/${appointmentId}/8x8link`,
				method: 'POST',
				headers: { 'Content-type': 'application,json', Authorization: `Bearer ${auth_token}` },
			})
				.then(response => {
					if (response.status === 200 || response.data.status === 'ok') {
						resolve({ success: true });
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

export default bookingService;
