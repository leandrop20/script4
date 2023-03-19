import { BaseObject } from './BaseObject';

export class TimelineData extends BaseObject {

    frames: any[];

    scale!: number;
    offset!: number;

	constructor() {
		super();

		this.frames = [];
	}

	override _onClear () {
        var prevFrame = null;
        for (var i = 0, l = this.frames.length; i < l; ++i) {
            var frame = this.frames[i];
            if (prevFrame && frame != prevFrame) {
                prevFrame.returnToPool();
            }
            prevFrame = frame;
        }
        this.scale = 1;
        this.offset = 0;
        this.frames.length = 0;
    }

}