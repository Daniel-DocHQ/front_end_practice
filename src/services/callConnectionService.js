import axios from 'axios';
const baseUrl = process.env.REACT_APP_BOOKING_URL
	? process.env.REACT_APP_BOOKING_URL
	: `https://dochq-booking-api-staging.dochq.co.uk`;
const callSvc = {
	checkSlot(appointmentId) {
		return new Promise((resolve, reject) => {
			if (typeof appointmentId !== 'undefined') {
				axios({
					method: 'get',
					url: `${baseUrl}/${appointmentId}/check`,
				})
					.then(response => {
						if ((response.status === 200 || response.data.status === 'ok') && response.data) {
							resolve({
								exists: response.data.exists,
								start_time: new Date(response.data.start_time),
								testing_kit_id: response.data.testing_kit_id,
							});
						} else if (
							(response.status === 200 && response.data === null) ||
							!response.data.exists
						) {
							resolve({
								exists: false,
							});
						} else {
							resolve({
								success: false,
								error: 'Unable to retrieve appointment.',
							});
						}
					})
					.catch(err => reject({ success: false, error: 'Unable to retrieve appointment' }));
			} else {
				resolve({ success: false });
			}
		});
	},
};
export default callSvc;
