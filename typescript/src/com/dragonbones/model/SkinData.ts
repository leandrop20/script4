import { BaseObject } from '../core/BaseObject';

export class SkinData extends BaseObject {

    slots: any;
    name: any;

	constructor() {
		super();

		this.slots = {};
	}

	static override toString(): string {
        return "[class SkinData]";
    }

    override _onClear() {
        for (var i in this.slots) {
            this.slots[i].returnToPool();
            delete this.slots[i];
        }

        this.name = null;
    }

    addSlot(value: any) {
        if (value && value.slot && !this.slots[value.slot.name]) {
            this.slots[value.slot.name] = value;
        } else {
            throw new Error();
        }
    }

    getSlot(name: string): any {
        return this.slots[name];
    }

}