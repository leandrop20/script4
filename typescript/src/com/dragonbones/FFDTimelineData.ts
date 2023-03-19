import { TimelineData } from './TimelineData';

export class FFDTimelineData extends TimelineData {

    displayIndex!: number;
    skin: any;
    slot: any;

	constructor() {
		super();
	}

	static override toString() {
        return "[class FFDTimelineData]";
    }

    override _onClear() {
        super._onClear();
        this.displayIndex = 0;
        this.skin = null;
        this.slot = null;
    }

}