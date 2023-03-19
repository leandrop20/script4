import { BaseObject } from './BaseObject';

export class EventObject extends BaseObject {

    type: any;
    name: any;
    data: any;
    armature: any;
    bone: any;
    slot: any;
    animationState: any;
    frame: any;
    userData: any;

	constructor() {
		super();
	}

	static override toString() {
        return "[class EventObject]";
    }

    override _onClear() {
        this.type = null;
        this.name = null;
        this.data = null;
        this.armature = null;
        this.bone = null;
        this.slot = null;
        this.animationState = null;
        this.frame = null;
        this.userData = null;
    }

    static get START() { return "start"; }
    static get LOOP_COMPLETE() { return "loopComplete"; }
    static get COMPLETE() { return "complete"; }
    static get FADE_IN() { return "fadeIn"; }
    static get FADE_IN_COMPLETE() { return "fadeInComplete"; }
    static get FADE_OUT() { return "fadeOut"; }
    static get FADE_OUT_COMPLETE() { return "fadeOutComplete"; }
    static get FRAME_EVENT() { return "frameEvent"; }
    static get SOUND_EVENT() { return "soundEvent"; }

}