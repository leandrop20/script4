import { TweenFrameData } from './TweenFrameData';
import { ColorTransform } from '../geom/ColorTransform';

export class SlotFrameData extends TweenFrameData {

    static DEFAULT_COLOR: ColorTransform = new ColorTransform();

    displayIndex: number = 0;
    zOrder: number = 0;
    color: any;

	constructor() {
		super();
	}

	static generateColor(): ColorTransform {
        return new ColorTransform();
    }

    static override toString(): string {
        return "[class SlotFrameData]";
    }

    override _onClear() {
        super._onClear();
        this.displayIndex = 0;
        this.zOrder = 0;
        this.color = null;
    }

}