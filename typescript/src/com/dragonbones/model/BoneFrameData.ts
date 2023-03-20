import { TweenFrameData } from './TweenFrameData';
import { Transform } from '../geom/Transform';

export class BoneFrameData extends TweenFrameData {

    transform: Transform;
    tweenScale!: boolean;
    tweenRotate!: number;

	constructor() {
		super();

		this.transform = new Transform();
	}

	static override toString(): string {
        return "[class BoneFrameData]";
    }

    override _onClear() {
        super._onClear();
        this.tweenScale = false;
        this.tweenRotate = 0;
        this.transform.identity();
    }

}