import axios from 'axios';

const baseUrl = process.env.REACT_APP_BOOKING_URL;
const delfinUrl = process.env.REACT_APP_DELFIN_URL;

const nurseSvc = {
	getAppointments(token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/getappointments`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								appointments: response.data,
							});
						} else if (response.status === 200 && response.data === null) {
							resolve({
								success: true,
								appointments: [],
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to retrieve appointments.',
							});
						}
					})
					.catch(err => console.error(err));
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	getAppointmentDetails(appointmentId, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/${appointmentId}`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								appointment: response.data,
							});
						} else if (response.status === 200 && response.data === null) {
							resolve({
								success: true,
								appointment: [],
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to retrieve appointments.',
							});
						}
					})
					.catch(err => reject(err));
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	getPastAppointments(token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/getpastappointments`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								appointments: response.data,
							});
						} else if (response.status === 200 && response.data === null) {
							resolve({
								success: true,
								appointments: [],
							});
						} else {
							reject({
								success: false,
								error: 'Unable to retrieve appointments.',
							});
						}
					})
					.catch(err => console.error(err));
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	addNotes(appointmentId, notes, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'post',
					url: `${baseUrl}/${appointmentId}/addnote`,
					headers: {
						Authorization: `Bearer ${token}`,
					},
					data: { content: notes },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to update notes.',
							});
						}
					})
					.catch(err => {
						reject({
							success: false,
							error: 'Unable to update notes.',
						});
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	uploadImage(appointmentId, formData, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'post',
					url: `${baseUrl}/${appointmentId}/uploadfile`,
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data',
					},
					data: formData,
				})
					.then(response => {
						if (response.status === 200 || response.data.status === 'ok') {
							resolve({
								success: true,
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to update image.',
							});
						}
					})
					.catch(err => {
						reject({
							success: false,
							error: 'Unable to update image.',
						});
					});
			} else {
				// return unauthorized
				return { success: false, authenticated: false };
			}
		});
	},
	endAppointment(nurseId, appointmentId, token) {},
	getPatientNotes(appointmentId, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/${appointmentId}/noteshistory`,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								appointments: response.data,
							});
						} else if (response.status === 200 && response.data === null) {
							resolve({
								success: true,
								appointments: [],
							});
						} else {
							reject({
								success: false,
								error: 'Unable to retrieve notes history.',
							});
						}
					})
					.catch(err => reject(err));
			} else {
				// return unauthorized
				resolve({
					success: false,
					authenticated: false,
				});
			}
		});
	},
	updateTestKit(token, appointmentId, result) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'patch',
					url: `${delfinUrl}/${appointmentId}/result`,
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data',
					},
					data: result,
				})
					.then(response => {
						if (response.status === 200 || response.data.status === 'ok') {
							resolve({
								success: true,
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to update test kit.',
							});
						}
					})
					.catch(err => {
						reject({
							success: false,
							error: 'Unable to update test kit.',
						});
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	getPatientTestResults(patientEmail, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${delfinUrl}/user/${patientEmail}/history`,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								test_results: response.data,
							});
						} else if (response.status === 200 && response.data === null) {
							resolve({
								success: true,
								test_results: [],
							});
						} else {
							reject({
								success: false,
								error: 'Unable to retrieve notes history.',
							});
						}
					})
					.catch(err => reject(err));
			} else {
				// return unauthorized
				resolve({
					success: false,
					authenticated: false,
				});
			}
		});
	},
	updateLastOnline(token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'patch',
					url: `${baseUrl}/practitioner`,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								test_results: response.data,
							});
						} else if (response.status === 200 && response.data === null) {
							resolve({
								success: true,
								test_results: [],
							});
						} else {
							reject({
								success: false,
								error: 'Unable to request',
							});
						}
					})
					.catch(err => reject(err));
			} else {
				// return unauthorized
				resolve({
					success: false,
					authenticated: false,
				});
			}
		});
	},
	getTodayDoctors(token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/practitioner`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								appointments: response.data,
							});
						} else  {
							resolve({
								success: true,
								appointments: [],
							});
						}
					})
					.catch(err => {
						console.error(err)
						resolve({success: true, appointment: []})
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	getPractitionerInformation(token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/practitioner/me`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								appointments: response.data,
							});
						} else  {
							resolve({
								success: true,
								appointments: [],
							});
						}
					})
					.catch(err => {
						console.error(err)
						resolve({success: true, appointment: []})
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
};
export default nurseSvc;
