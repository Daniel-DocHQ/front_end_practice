const getURLParams = function(string) {
	try {
		const locationString = typeof string === 'undefined' ? window.location.href : string;
		const hashes = locationString.slice(locationString.indexOf('?') + 1).split('&');
		const params = {};
		hashes.forEach(hash => {
			const match = hash.match(/([^=]+?)=(.+)/);
			const key = match[1];
			const val = match[2];
			params[key] = decodeURIComponent(val);
		});
		return params;
	} catch (error) {
		return { error: 'Error parsing URL params or none present' };
	}
};

export default getURLParams;
