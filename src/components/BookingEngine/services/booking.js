import axios from 'axios';
import { format } from 'date-fns';
import getURLParams from '../../../helpers/getURLParams';

export const SERVICE_TYPE = 'video_gp';

export const api = axios.create({
	baseURL: process.env.REACT_APP_BOOKING_URL
		? process.env.REACT_APP_BOOKING_URL
		: `https://dochq-booking-api-staging.dochq.co.uk/`,
	timeout: 15000,
	headers: { 'Content-Type': 'application/json' },
});

export const bookingSvc = {
	async locationSearch(long, lat) {
		const params = getURLParams(window.location.href);
		const result = await api.get(
			`location_search?longitude=${long}&latitude=${lat}&services=[${
				typeof params['service'] === 'undefined' ? SERVICE_TYPE : params['service']
			}]`
		);
		return result.data;
	},
	async getSlots(location, date = new Date()) {
		date = format(new Date(date), 'dd-MM-yyyy');
		function additionalParams() {
			const params = getURLParams(window.location.href);
			if (params['group'] && params['user']) {
				return `&group=${params['group']}&user=${params['user']}`;
			}
			return '';
		}
		return await new Promise(resolve => {
			const params = getURLParams(window.location.href);
			api
				.get(
					`?&service=${
						typeof params['service'] === 'undefined' ? SERVICE_TYPE : params['service']
					}&date=${date}${additionalParams()}`
				)
				.then(
					result => {
						resolve(result.data);
					},
					error => {
						if (error && error.response) {
							resolve(error.response.data);
						} else {
							console.error(JSON.stringify(error));
							resolve({
								error: error && error.message ? 'Error: ' + error.message : JSON.stringify(error),
							});
						}
					}
				);
		});
	},
	async paymentRequest(slotId, data) {
		//TODO should be in component
		const params = getURLParams(window.location.href);

		if (params['group']) data.group = params['group'];
		if (params['user']) data.user = params['user'];
		if (typeof params['service'] !== 'undefined') {
			data.service = params['service'];
		} else {
			data.service = SERVICE_TYPE;
		}
		if (params['token']) {
			data.token = params['token'];
			return await new Promise(resolve => {
				api.post(`${slotId}/payment`, data).then(
					result => {
						resolve(result.data);
					},
					error => {
						if (error && error.response) {
							resolve(error.response.data);
						}
					}
				);
			});
		} else {
			return await new Promise(resolve => {
				api.post(`${slotId}/payment`, data).then(
					result => {
						resolve(result.data);
					},
					error => {
						if (error && error.response) {
							resolve(error.response.data);
						}
					}
				);
			});
		}
	},
};
