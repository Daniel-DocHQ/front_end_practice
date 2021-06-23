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
	getPrcTests(token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/v1/result?inc_booking=true`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								results: response.data,
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to fetch results',
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
	getOrders(token, page, email) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/v1/order?page=${page}${!!email ? `&email=${email}`: ''}`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								data: response.data,
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to fetch orders',
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
	getOrderDetails(orderId, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/v1/order/${orderId}`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								data: response.data,
							});
						} else if ((response.status === 200 || response.status === 404) && response.data === null) {
							resolve({
								success: true,
								data: null,
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to fetch order details.',
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
	validateDiscountCode(discountCode) {
		return new Promise((resolve, reject) => {
			if (discountCode) {
				axios({
					url: `${baseUrl}/v1/discount/${discountCode}`,
					method: 'GET',
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							// postUrl, reference
							resolve({ success: true, data: response.data });
						} else {
							// TODO needs better error handling
							reject({
								success: false,
								error: 'Something went wrong, please try again.',
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.message) {
							reject({ success: false, error: errResp.response.message });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.' });
						}
					});
			} else {
				reject({ success: false, error: 'Missing details' });
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
