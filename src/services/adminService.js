import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;
const bookingUrl = process.env.REACT_APP_BOOKING_URL;

const adminService = {
	getAppointments(token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${bookingUrl}/admin/allappointments`,
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
	getApprovedProducts() {
		return new Promise((resolve, reject) => {
			axios.get(`${baseUrl}/v1/approved_kits`)
				.then(response => {
					if ((response.status === 200 || response.data.status === 'ok') && response.data) {
						resolve({
							success: true,
							kits: response.data,
						});
					} else {
						resolve({
							success: false,
							error: response.data.message || 'Something went wrong',
						});
					}
				})
				.catch(err => {
					if (err && err.response && err.response.data && err.response.data.message) {
						reject({ success: false, error: err.response.data.message, });
					} else {
						reject({ success: false, error: 'Something went wrong, please try again.' });
					}
				});
		});
	},
	getShiftOverview({ token, dateRange }) {
		return new Promise((resolve, reject) => {
			const { start_time, end_time } = dateRange;
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${bookingUrl}/practitioner?date_from=${start_time}&date_to=${end_time}`,
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
	getNextAppointments({ token, dateRange, userId }) {
		return new Promise((resolve, reject) => {
			const { start_time, end_time } = dateRange;
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${bookingUrl}/search?q=user:${userId} AND start_time:[${start_time} TO ${end_time}] AND claimable_slot:false AND NOT status:(LOCKED OR PROVIDER_CANCELLED OR UNAVAILABLE OR USER_CANCELLED OR COMPLETED OR AVAILABLE)&sort=start_time:asc`,
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
						if (err && err.response && err.response.data && err.response.data.message) {
							reject({ success: false, error: err.response.data.message, });
						} else reject({ success: false });
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	getLiveAppointments({token, dateRange}) {
		return new Promise((resolve, reject) => {
			const { start_time, end_time } = dateRange;
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${bookingUrl}/search?q=start_time:[${start_time} TO ${end_time}] AND NOT type:video_gp_tui AND status:(WAITING OR PATIENT_ATTENDED OR PRACTITIONER_ATTENDED OR IN_PROGRESS OR ON_HOLD OR PRACTITIONER_LEFT OR PATIENT_LEFT)&inc_practitioner_name=1&sort=start_time:asc`,
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
	generateDiscount(token, data) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.post(`${baseUrl}/v1/discount`, data, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
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
								error: response.data.message || 'Something went wrong',
							});
						}
					})
					.catch(err => {
						if (err && err.response && err.response.data && err.response.data.message) {
							reject({ success: false, error: err.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.' });
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	useDiscountCode(code) {
		return new Promise((resolve, reject) => {
			axios.post(`${baseUrl}/v1/discount/${code}/apply`)
				.then(response => {
					if ((response.status === 200 || response.data.status === 'ok') && response.data) {
						resolve({
							success: true,
							data: response.data,
						});
					} else {
						resolve({
							success: false,
							error: response.data.message || 'Something went wrong',
						});
					}
				})
				.catch(err => {
					if (err && err.response && err.response.data && err.response.data.message) {
						reject({ success: false, error: err.response.data.message, });
					} else {
						reject({ success: false, error: 'Something went wrong, please try again.' });
					}
				});
		});
	},
	createOrder(body) {
		return new Promise((resolve, reject) => {
			if (body) {
				axios({
					url: `${baseUrl}/v1/order`,
					method: 'POST',
					data: body,
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							// price, delivery_date, appointment_date
							resolve({ success: true, order_details: response.data });
						} else {
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				reject({ success: false, error: 'Missing details' });
			}
		});
	},
	getProducts() {
		return new Promise((resolve, reject) => {
			axios({
				url: `${baseUrl}/v1/product?include_inactive=true`,
				method: 'GET',
			})
				.then(response => {
					if ((response.status === 200 || response.data.status === 'ok') && response.data) {
						resolve({ success: true, products: response.data.products });
					} else {
						reject({
							success: false,
							error: response.data.message,
						});
					}
				})
				.catch(errResp => {
					if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
						reject({ success: false, error: errResp.response.data.message, });
					} else {
						reject({ success: false, error: 'Something went wrong, please try again.'});
					}
				});
		});
	},
	deleteProduct(token, id) {
		return new Promise((resolve, reject) => {
			if (token && id) {
				axios({
					url: `${baseUrl}/v1/product/${id}/delete`,
					method: 'POST',
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							// price, delivery_date, appointment_date
							resolve({ success: true, token: response.data.token });
						} else {
							// TODO needs better error handling
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				reject({ success: false, error: 'Missing details' });
			}
		});
	},
	switchProductStatus(token, id, value) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.put(`${baseUrl}/v1/product/${id}`, value, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								data: response.data,
							});
						} else {
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	deactivateAllProducts(token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.put(`${baseUrl}/v1/product/switch`, {}, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if (response.status === 200) {
							resolve({
								success: true,
							});
						} else {
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	getProduct(id, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined' || !id) {
				axios({
					method: 'get',
					url: `${baseUrl}/v1/product/${id}`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								product: response.data,
							});
						} else if ((response.status === 200 || response.status === 404) && response.data === null) {
							resolve({
								success: true,
								product: null,
							});
						} else {
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	getDropbox(id, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined' || !id) {
				axios({
					method: 'get',
					url: `${baseUrl}/v1/dropbox/${id}`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								dropbox: response.data,
							});
						} else if ((response.status === 200 || response.status === 404) && response.data === null) {
							resolve({
								success: true,
								dropbox: null,
							});
						} else {
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	getIvrToken(name) {
		return new Promise((resolve, reject) => {
			if (name) {
				axios({
					url: `${baseUrl}/v1/av-services/ivr-handshake`,
					method: 'POST',
					data: { name },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							// price, delivery_date, appointment_date
							resolve({ success: true, token: response.data.token });
						} else {
							// TODO needs better error handling
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				reject({ success: false, error: 'Missing details' });
			}
		});
	},
	getDropboxReceipts(id, date, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined' || !id) {
				axios({
					method: 'get',
					url: `${baseUrl}/v1/dropbox/${id}/receipts?date=${date}`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data && response.data.receipts) {
							resolve({
								success: true,
								receipts: response.data.receipts,
							});
						} else if ((response.status === 200 || response.status === 404)) {
							resolve({
								success: true,
								receipts: null,
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to retrieve dropbox.',
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
	checkPurchaseCodeInfo(purchaseCode) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'get',
				url: `${baseUrl}/v1/discount/${purchaseCode}`,
			})
				.then(response => {
					if (response.status === 200 && response.data) {
						resolve({
							success: true,
							data: response.data,
						});
					} else {
						resolve({
							success: false,
							error: response.data.message || 'Something went wrong',
						});
					}
				})
				.catch(err => {
					if (err && err.response && err.response.data && err.response.data.message) {
						reject({ success: false, error: err.response.data.message, });
					} else {
						reject({ success: false, error: 'Something went wrong, please try again.' });
					}
				});
		});
	},
	getPickups(token, date) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/v1/dropbox/pickups?date=${date}`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								dropboxes: response.data.pickup_groups,
							});
						} else if (response.status === 200 && !response.data) {
							resolve({
								success: true,
								dropboxes: [],
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to retrieve drop boxes.',
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
	getDiscounts(token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/v1/discount`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data && response.data.discounts) {
							resolve({
								success: true,
								discounts: response.data.discounts,
							});
						} else if (response.status === 200 && !response.data.discounts) {
							resolve({
								success: true,
								discounts: [],
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to retrieve drop boxes.',
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
	getDropboxes(token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/v1/dropbox`,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data && response.data.dropboxes) {
							resolve({
								success: true,
								dropboxes: response.data.dropboxes,
							});
						} else if (response.status === 200 && !response.data.dropboxes) {
							resolve({
								success: true,
								dropboxes: [],
							});
						} else {
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	switchDropboxStatus(token, id) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.put(`${baseUrl}/v1/dropbox/${id}/switch`, {}, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								data: response.data,
							});
						} else {
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	deactivateAllDropboxes(token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.put(`${baseUrl}/v1/dropbox/switch`, {}, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if (response.status === 200) {
							resolve({
								success: true,
							});
						} else {
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	editProduct(id, token, data) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.put(`${baseUrl}/v1/product/${id}`, data, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								data: response.data,
							});
						} else {
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	editDropbox(id, token, data) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.put(`${baseUrl}/v1/dropbox/${id}`, data, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								data: response.data,
							});
						} else {
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	createProduct(token, data) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.post(`${baseUrl}/v1/product`, data, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								data: response.data,
							});
						} else {
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	createDropbox(token, data) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.post(`${baseUrl}/v1/dropbox`, data, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								data: response.data,
							});
						} else {
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	getPrcTests(token, time_from, time_to) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${bookingUrl}/getresults?time_from=${time_from}&time_to=${time_to}`,
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
								results: [],
								error: 'Unable to fetch results',
							});
						}
					})
					.catch(err => {
						if (err && err.response && err.response.data && err.response.data.message) {
							reject({ success: false, error: err.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.' });
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	getOrders(token, page, email, discount, page_size = 50) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/v1/order?page=${page}&page_size=${page_size}${!!email ? `&email=${email}` : ''}${!!discount ? `&discount=${discount}` : ''}`,
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
								error: response.data.message || 'Something went wrong',
							});
						}
					})
					.catch(err => {
						if (err && err.response && err.response.data && err.response.data.message) {
							reject({ success: false, error: err.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.' });
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	switchCollectionInfo(id, token, value) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.put(`${baseUrl}/v1/collection/${id}`, value, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								success: true,
								data: response.data,
							});
						} else {
							reject({
								success: false,
								error: response.data.message,
							});
						}
					})
					.catch(errResp => {
						if (errResp && errResp.response && errResp.response.data && errResp.response.data.message) {
							reject({ success: false, error: errResp.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.'});
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	getCollectionInfo(orderId, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/v1/collection/${orderId}`,
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
								error: response.data.message || 'Something went wrong',
							});
						}
					})
					.catch(err => {
						if (err && err.response && err.response.data && err.response.data.message) {
							reject({ success: false, error: err.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.' });
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	getFlightDetails(order_short_token) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'get',
				url: `${baseUrl}/v1/flight-order/${order_short_token}`,
			})
				.then(response => {
					if ((response.status === 200 || response.data.status === 'ok') && response.data) {
						resolve({
							success: true,
							flightDetails: response.data,
						});
					} else if ((response.status === 200 || response.status === 404) && response.data === null) {
						resolve({
							success: true,
							data: null,
						});
					} else {
						resolve({
							success: false,
							error: response.data.message || 'Something went wrong',
						});
					}
				})
				.catch(err => {
					if (err && err.response && err.response.data && err.response.data.message) {
						reject({ success: false, error: err.response.data.message, });
					} else {
						reject({ success: false, error: 'Something went wrong, please try again.' });
					}
				});
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
								error: response.data.message || 'Something went wrong',
							});
						}
					})
					.catch(err => {
						if (err && err.response && err.response.data && err.response.data.message) {
							reject({ success: false, error: err.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.' });
						}
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
							resolve({
								success: false,
								error: response.data.message || 'Something went wrong',
							});
						}
					})
					.catch(err => {
						if (err && err.response && err.response.data && err.response.data.message) {
							reject({ success: false, error: err.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.' });
						}
					});
			} else {
				reject({ success: false, error: 'Missing details' });
			}
		});
	},
	getAppointmentsSearch({
		dateRange,
		status,
		token,
		practitionerName = true,
		userId,
	}) {
		const { start_time, end_time } = dateRange;
		const statusQuery = status === 'CLAIMABLE'
			? `claimable_slot:true`
			: status === 'WAITING'
				? `${!!userId
					? `status:(${status} OR IN_PROGRESS OR PRACTITIONER_ATTENDED OR PATIENT_ATTENDED OR PRACTITIONER_LEFT OR PATIENT_LEFT)`
					: `status:${status}`} AND claimable_slot:false`
				: `status:${status}`;
		const userQuery = !!userId ? ` AND user:${userId}` : '';
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${bookingUrl}/search?q=${statusQuery}${userQuery}${status !== 'AVAILABLE' ? ' AND NOT type:video_gp_tui' : ''} AND start_time:[${start_time} TO ${end_time}]${practitionerName ? '&inc_practitioner_name=1' : ''}&sort=start_time:asc`,
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
								error: response.data.message || 'Something went wrong',
							});
						}
					})
					.catch(err => {
						if (err && err.response && err.response.data && err.response.data.message) {
							reject({ success: false, error: err.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.' });
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	getAllAppointments({ dateRange, token }) {
		const { start_time, end_time } = dateRange;

		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios({
					method: 'get',
					url: `${bookingUrl}/search?q=start_time:[${start_time} TO ${end_time}]&inc_practitioner_name=1&sort=start_time:asc`,
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
								error: response.data.message || 'Something went wrong',
							});
						}
					})
					.catch(err => {
						if (err && err.response && err.response.data && err.response.data.message) {
							reject({ success: false, error: err.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.' });
						}
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
							error: response.data.message || 'Something went wrong',
						});
					}
				})
				.catch(err => {
					if (err && err.response && err.response.data && err.response.data.message) {
						reject({ success: false, error: err.response.data.message, });
					} else {
						reject({ success: false, error: 'Something went wrong, please try again.' });
					}
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
							error: response.data.message || 'Something went wrong',
						});
					}
				})
				.catch(err => {
					if (err && err.response && err.response.data && err.response.data.message) {
						reject({ success: false, error: err.response.data.message, });
					} else {
						reject({ success: false, error: 'Something went wrong, please try again.' });
					}
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
								error: response.data.message || 'Something went wrong',
							});
						}
					})
					.catch(err => {
						if (err && err.response && err.response.data && err.response.data.message) {
							reject({ success: false, error: err.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.' });
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	},
	updateOrderNotes(data, id, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.put(`${baseUrl}/v1/order/${id}`, data, {
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
								error: response.data.message || 'Something went wrong',
							});
						}
					})
					.catch(err => {
						if (err && err.response && err.response.data && err.response.data.message) {
							reject({ success: false, error: err.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.' });
						}
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
								error: response.data.message || 'Something went wrong',
							});
						}
					})
					.catch(err => {
						if (err && err.response && err.response.data && err.response.data.message) {
							reject({ success: false, error: err.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.' });
						}
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
								data: response.data,
							});
						} else {
							resolve({
								success: false,
								error: response.data.message || 'Something went wrong',
							});
						}
					})
					.catch(err => {
						if (err && err.response && err.response.data && err.response.data.message) {
							reject({ success: false, error: err.response.data.message, });
						} else {
							reject({ success: false, error: 'Something went wrong, please try again.' });
						}
					});
			} else {
				// return unauthorized
				resolve({ success: false, authenticated: false });
			}
		});
	}
};

export default adminService;
