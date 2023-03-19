import { TimelineData } from './TimelineData';
import { Transform } from './Transform';
import { Matrix } from './Matrix';

export class BoneTimelineData extends TimelineData {

    originTransform: Transform;
    cachedFrames: any[];
    bone: any;

	constructor() {
		super();

		this.originTransform = new Transform();
		this.cachedFrames = [];
	}

	static cacheFrame(cacheFrames: any, cacheFrameIndex: any, globalTransformMatrix: any) {
        var cacheMatrix = cacheFrames[cacheFrameIndex] = new Matrix();
        cacheMatrix.copyFrom(globalTransformMatrix);
        return cacheMatrix;
    }

    static override toString() {
        return "[class BoneTimelineData]";
    }

    override _onClear() {
        super._onClear();
        this.bone = null;
        this.originTransform.identity();
        this.cachedFrames.length = 0;
    }

    cacheFrames(cacheFrameCount: number) {
        this.cachedFrames.length = 0;
        this.cachedFrames.length = cacheFrameCount;
    }

}