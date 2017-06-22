import * as moment from 'moment';


	export function getDate(time) {
		var date = new Date(time);
		return moment.default(time).format("dddd @ hh:mm a");
	};
