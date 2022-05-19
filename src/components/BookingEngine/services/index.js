import axios from 'axios';
import { format } from 'date-fns';
export const bookingAPIUrl = process.env.REACT_APP_BOOKING_URL;
export const SERVICES_SEARCH_URL = '_/services';
export const LOCATION_SEARCH = 'location_search';
export const SERVICE_TYPE = 'video_gp';

export const api = axios.create({
	baseURL: bookingAPIUrl,
	timeout: 10000,
	headers: { 'Content-Type': 'application/json' },
});

export const bookingSvc = {
	async locationSearch(long, lat) {
		const result = await api.get(
			`${LOCATION_SEARCH}?longitude=${long}&latitude=${lat}&services=[${SERVICE_TYPE}]`
		);
		return result.data;
	},
	async getSlots(location, date = new Date()) {
		date = format(new Date(date), 'dd-MM-yyyy');

		return await new Promise(resolve => {
			api.get(`?service=${SERVICE_TYPE}&date=${date}`).then(
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
	},
};
