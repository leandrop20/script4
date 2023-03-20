import { BaseObject } from '../core/BaseObject';

export class SlotDisplayDataSet extends BaseObject {

    displays: any[];
    slot: any;

	constructor() {
		super();

		this.displays = [];
	}

	static override toString(): string {
        return "[class SlotDisplayDataSet]";
    }

    override _onClear() {
        for (var i = 0, l = this.displays.length; i < l; ++i) {
            this.displays[i].returnToPool();
        }

        this.slot = null;
        this.displays.length = 0;
    }

}