import DetectRTC from 'detectrtc';
export const evaluateDevice = () => {
	console.log(DetectRTC);
	return {
		isWebRTCSupported: DetectRTC.isWebRTCSupported,
		browserName: DetectRTC.browser.name,
		osName: DetectRTC.osName,
		isMobileDevice: DetectRTC.isMobileDevice,
		isIE: DetectRTC.browser.isIE,
		isSafari: DetectRTC.browser.isSafari,
	};
};
