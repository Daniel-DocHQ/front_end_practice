import axios from 'axios';
export const API_URL = process.env.REACT_APP_DISCOUNT_URL;
export const api = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	headers: { 'Content-Type': 'application/json' },
});

export const discountSvc = {
	async getDiscountDetails(discountCode) {
		return await new Promise((resolve, reject) => {
			api
				.get(discountCode)
				.then(
					result => {
						if (
							result.data &&
							typeof result.data.active === 'boolean' &&
							result.data.type &&
							result.data.value &&
							result.data.uses
						) {
							if (result.data.active === true && result.data.uses >= 1) {
								resolve({
									valid: true,
									type: result.data.type,
									value: result.data.value,
								});
							} else if (result.data.active === true && result.data.uses <= 0) {
								resolve({
									valid: false,
									reason: 'Exceeded number of uses',
								});
							} else {
								resolve({ valid: false });
							}
						} else {
							reject({
								errorMsg: 'Error verifying discount code',
								error: 'Missing details',
							});
						}
						resolve(result.data);
					},
					error => {
						if (error && error.response) {
							reject({
								errorMsg: 'Error verifying discount code',
								error: 'Error in API call',
							});
						} else {
							reject({
								errorMsg: 'Error verifying discount code',
								error: 'Error in API call, no error response present',
							});
						}
					}
				)
				.catch(err => {
					reject({
						errorMsg: 'Error verifying discount code',
						error: 'Server error',
					});
				});
		});
	},
};
