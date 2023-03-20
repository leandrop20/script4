import { BaseObject } from '../core/BaseObject';

export class ActionData extends BaseObject {

    data: any[];
    type!: number;
    bone: any;
    slot: any;

	constructor() {
		super();

		this.data = [];
	}

	static override toString(): string {
        return "[class ActionData]";
    }

    override _onClear() {
        this.type = 0 /* Play */;
        this.bone = null;
        this.slot = null;
        this.data.length = 0;
    };

}