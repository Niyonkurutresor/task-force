const formatDate = (inputDate: Date | string) => {
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	const date = new Date(inputDate);
	const year = date.getFullYear();
	const month = months[date.getMonth()];
	const day = date.getDate();

	return `${year} ${month} ${day}`;
};

export default formatDate;
