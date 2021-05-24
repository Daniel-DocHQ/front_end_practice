import { ToastsStore } from 'react-toasts';

const copyToClipboard = (ref) => {
	window.getSelection().removeAllRanges();
	var range = document.createRange();
	range.selectNode(ref.current);
	window.getSelection().addRange(range);
	document.execCommand("copy");
	window.getSelection().removeAllRanges();
	ToastsStore.success('Copied');
};

export default copyToClipboard;
