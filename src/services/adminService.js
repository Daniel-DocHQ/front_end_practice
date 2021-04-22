import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;

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
	uploadCsvFile(type, data, token) {
		return new Promise((resolve, reject) => {
			if (typeof token !== 'undefined') {
				axios.post(`${baseUrl}/v1/certificate-auth/upload?type=${type}`, data, {
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
	}
};

export default adminService;
