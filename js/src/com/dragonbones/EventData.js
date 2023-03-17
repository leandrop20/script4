import BaseObject from './BaseObject';

export default class EventData extends BaseObject {

	constructor() {
		super();
	}

	static toString() {
        return "[class EventData]";
    }

    _onClear() {
        this.type = 10 /* Frame */;
        this.name = null;
        this.data = null;
        this.bone = null;
        this.slot = null;
    }

}