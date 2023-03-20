import { BaseObject } from '../core/BaseObject';

export class EventData extends BaseObject {

    type!: number;
    name: any;
    data: any;
    bone: any;
    slot: any;

	constructor() {
		super();
	}

	static override toString() {
        return "[class EventData]";
    }

    override _onClear() {
        this.type = 10 /* Frame */;
        this.name = null;
        this.data = null;
        this.bone = null;
        this.slot = null;
    }

}