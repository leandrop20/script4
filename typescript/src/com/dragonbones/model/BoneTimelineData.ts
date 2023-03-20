import { TimelineData } from './TimelineData';
import { Transform } from '../geom/Transform';
import { Matrix } from '../geom/Matrix';

export class BoneTimelineData extends TimelineData {

    originTransform: Transform;
    cachedFrames: any[];
    bone: any;

	constructor() {
		super();

		this.originTransform = new Transform();
		this.cachedFrames = [];
	}

	static cacheFrame(
        cacheFrames: any,
        cacheFrameIndex: number,
        globalTransformMatrix: Matrix
    ): Matrix {
        var cacheMatrix = cacheFrames[cacheFrameIndex] = new Matrix();
        cacheMatrix.copyFrom(globalTransformMatrix);

        return cacheMatrix;
    }

    static override toString(): string {
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