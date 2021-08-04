import axios from 'axios';

const baseUrl = process.env.REACT_APP_GOOGLE_URL;
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

const googleService = {
	getTimezone(location) {
		return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: `${baseUrl}/timezone/json?location=${location}&key=${apiKey}`,
            })
                .then(response => {
                    if ((response.status === 200 || response.data.status === 'ok') && response.data) {
                        resolve({
                            success: true,
                            timezone: response.data,
                        });
                    } else if ((response.status === 200 || response.status === 404) && response.data === null) {
                        resolve({
                            success: true,
                            timezone: {},
                        });
                    } else {
                        resolve({
                            success: false,
                            error: 'Unable to retrieve timezone.',
                        });
                    }
                })
                .catch(err => console.error(err));
		});
	},
};

export default googleService;
