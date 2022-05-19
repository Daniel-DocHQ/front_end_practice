Date.prototype.addDays = function(days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

function getDates(startDate, stopDate) {
	var dateArray = new Array();
	var currentDate = startDate;
	while (currentDate <= stopDate) {
		dateArray.push(new Date(currentDate));
		currentDate = currentDate.addDays(1);
	}
	return dateArray;
}

export function calcWorkingDays(startDate, endDate) {
	const dates = getDates(new Date(startDate), new Date(endDate));
	// remove weekends
	const noWeekends = dates.filter(date => {
		const day = new Date(date).getDay();
		if (day === 0 || day === 6) {
			return false;
		} else {
			return true;
		}
	});
	return noWeekends;
}

export function calc7thWorkingDay(startDate) {
	const today = new Date(startDate);
	const in9days = new Date(today.setDate(today.getDate() + 9));
	const dates = getDates(new Date(startDate), new Date(in9days));
	// remove weekends
	const noWeekends = dates.filter(date => {
		const day = new Date(date).getDay();
		if (day === 0 || day === 6) {
			return false;
		} else {
			return true;
		}
	});
	return noWeekends[noWeekends.length - 1];
}
export function calc8thWorkingDay(startDate) {
	const today = new Date(startDate);
	const in11days = new Date(today.setDate(today.getDate() + 11));
	const dates = getDates(new Date(startDate), new Date(in11days));
	// remove weekends
	const noWeekends = dates.filter(date => {
		const day = new Date(date).getDay();
		if (day === 0 || day === 6) {
			return false;
		} else {
			return true;
		}
	});
	return noWeekends[noWeekends.length - 1];
}
