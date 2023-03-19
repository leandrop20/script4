import { BaseObject } from './BaseObject';

export class SlotDisplayDataSet extends BaseObject {

    static override toString(): string {
        return "[class SlotDisplayDataSet]";
    }

    displays: any[];
    slot: any;

	constructor() {
		super();

		this.displays = [];
	}

    override _onClear(): void {
        for (var i = 0, l = this.displays.length; i < l; ++i) {
            this.displays[i].returnToPool();
        }

        this.slot = null;
        this.displays.length = 0;
    }

}