import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;
const bookingUrl = process.env.REACT_APP_BOOKING_URL;

const adminService = {
	getAppointments(token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/admin/appointments`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								appointments: response.data,
							});
						} else if ((response.status === 200 || response.status === 404) && response.data === null) {
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
	getAllAppointments(dateRange, token) {
		const { start_time, end_time } = dateRange;
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${bookingUrl}/admin/allappointments?start_time=${start_time}&end_time=${end_time}`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								appointments: response.data,
							});
						} else if ((response.status === 200 || response.status === 404) && response.data === null) {
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
					.catch(err => {
						console.log(err);
						reject({
							success: false,
						});
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	getOrderInfo(orderId) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'get',
				url: `${baseUrl}/v1/order/${orderId}`,
			})
				.then(response => {
					if ((response.status === 200 || response.data.status === 'ok') && response.data) {
						resolve({
							success: true,
							order: response.data,
						});
					} else if ((response.status === 200 || response.status === 404) && response.data === null) {
						resolve({
							success: true,
							order: null,
						});
					} else {
						resolve({
							success: false,
							error: 'Unable to get order information',
						});
					}
				})
				.catch(err => {
					console.log(err);
					reject({
						success: false,
					});
				});
		});
	},
	getOrderProducts(orderId) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'get',
				url: `${baseUrl}/v1/order/${orderId}/product?fulfilled=true`,
			})
				.then(response => {
					if ((response.status === 200 || response.data.status === 'ok') && response.data) {
						resolve({
							success: true,
							order: response.data,
						});
					} else if ((response.status === 200 || response.status === 404) && response.data === null) {
						resolve({
							success: true,
							order: null,
						});
					} else {
						resolve({
							success: false,
							error: 'Unable to get order information',
						});
					}
				})
				.catch(err => {
					console.log(err);
					reject({
						success: false,
					});
				});
		});
	},
	uploadCsvFile(type, data, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.post(`${baseUrl}/v1/certificate/upload?type=${type}`, data, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								certificates: response.data.certificates,
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to upload file',
							});
						}
					})
					.catch(err => {
						reject({
							success: false,
							error: 'Unable to upload file',
						});
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	sendCertificateEmail(id, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.post(`${baseUrl}/v1/certificate/${id}/email`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to send email',
							});
						}
					})
					.catch(err => {
						reject({
							success: false,
							error: 'Unable to send email',
						});
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	resendMessages(data, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.post(`${baseUrl}/v1/processor/event/run`, data, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to run this process',
							});
						}
					})
					.catch(err => {
						reject({
							success: false,
							error: 'Unable to run this process',
						});
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	}
};

export default adminService;
