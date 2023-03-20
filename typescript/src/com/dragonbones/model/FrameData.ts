import { BaseObject } from '../core/BaseObject';

export class FrameData extends BaseObject {

    position!: number;
    duration!: number;
    prev: any;
    next: any;

	constructor() {
		super();
	}

	override _onClear() {
        this.position = 0;
        this.duration = 0;
        this.prev = null;
        this.next = null;
    }

}