import { BaseObject } from '../core/BaseObject';

export class EventObject extends BaseObject {

    static START: string = 'start';
    static LOOP_COMPLETE: string = 'loopComplete';
    static COMPLETE: string = 'complete';
    static FADE_IN: string = 'fadeIn';
    static FADE_IN_COMPLETE: string = 'fadeInComplete';
    static FADE_OUT: string = 'fadeOut';
    static FADE_OUT_COMPLETE: string = 'fadeOutComplete';
    static FRAME_EVENT: string = 'frameEvent';
    static SOUND_EVENT: string = 'soundEvent';

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

	static override toString(): string {
        return '[class EventObject]';
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

}