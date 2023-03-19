import { TweenFrameData } from './TweenFrameData';

export class ExtensionFrameData extends TweenFrameData {

    tweens: any[];
    keys: any[];
    type!: number;

	constructor() {
		super();

		this.tweens = [];
		this.keys = [];
	}

	static override toString() {
        return "[class ExtensionFrameData]";
    }

    override _onClear() {
        super._onClear();
        this.type = 0 /* FFD */;
        this.tweens.length = 0;
        this.keys.length = 0;
    }

}