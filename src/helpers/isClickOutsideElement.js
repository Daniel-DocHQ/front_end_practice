function isClickOutsideElement(elementIdentifier, event) {
	try {
		let clickedOutside = event.target.closest(elementIdentifier);
		return clickedOutside === null;
	} catch (error) {
		return false;
	}
}
export default isClickOutsideElement;
