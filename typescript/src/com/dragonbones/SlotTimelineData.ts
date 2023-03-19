import { TimelineData } from './TimelineData';
import { Matrix } from './Matrix';

export class SlotTimelineData extends TimelineData {

    cachedFrames: any[];
    slot: any;

	constructor() {
		super();

		this.cachedFrames = [];
	}

	static cacheFrame(cacheFrames: any, cacheFrameIndex: number, globalTransformMatrix: any) {
        var cacheMatrix = cacheFrames[cacheFrameIndex] = new Matrix();
        cacheMatrix.copyFrom(globalTransformMatrix);
        return cacheMatrix;
    }

    static override toString() {
        return "[class SlotTimelineData]";
    }

    override _onClear() {
        super._onClear();
        this.slot = null;
        this.cachedFrames.length = 0;
    }

    cacheFrames(cacheFrameCount: number) {
        this.cachedFrames.length = 0;
        this.cachedFrames.length = cacheFrameCount;
    }

}