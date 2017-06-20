import * as moment from 'moment';
import {noView} from 'aurelia-framework';

@noView
export class Utility {

	areEqual(obj1, obj2) {
		return Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]));
	};

	getDate(time) {
		var date = new Date(time);
		return moment.default(time).format("dddd @ hh:mm a");
	}
}
