import axios from 'axios';

const baseUrl = process.env.REACT_APP_BOOKING_URL;

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
};

export default adminService;
