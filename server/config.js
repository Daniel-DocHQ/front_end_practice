module.exports = {
	twilio: {
		accountSid:
			typeof process.env.REACT_APP_TWILIO_ACCOUNT_SID !== 'undefined'
				? process.env.REACT_APP_TWILIO_ACCOUNT_SID
				: 'AC9bf0a45db52d3044f2e1f1874f746eaa',
		apiKey:
			typeof process.env.REACT_APP_TWILIO_API_KEY !== 'undefined'
				? process.env.REACT_APP_TWILIO_API_KEY
				: 'SK1b7bc2faeaf6c323223c15d50bc54150',
		apiSecret:
			typeof process.env.REACT_APP_TWILIO_API_SECRET !== 'undefined'
				? process.env.REACT_APP_TWILIO_API_SECRET
				: 'vYoZBNVhH14hfuFSX5lNK8iplUZiFCog',
	},
};
