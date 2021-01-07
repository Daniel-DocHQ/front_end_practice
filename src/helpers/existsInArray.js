function existsInArray(array, field) {
	return (
		typeof array !== 'undefined' &&
		array.length > 0 &&
		typeof array.find(arrayItem => arrayItem === field) !== 'undefined'
	);
}
export default existsInArray;
