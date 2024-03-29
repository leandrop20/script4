import { TimelineData } from './TimelineData';

export class AnimationData extends TimelineData {

    boneTimelines: any;
    slotTimelines: any;
    ffdTimelines: any;
    cachedFrames!: any[];

    hasAsynchronyTimeline: boolean = false;
    frameCount!: number;
    playTimes!: number;
    position!: number;
    duration!: number;
    fadeInTime!: number;
    cacheTimeToFrameScale!: number;
    name: any;
    animation: any;

	constructor() {
		super();

		this.boneTimelines = {};
        this.slotTimelines = {};
        this.ffdTimelines = {}; // skin slot displayIndex
        this.cachedFrames = [];
	}

	static override toString() {
        return "[class AnimationData]";
    }

    override _onClear() {
    	super._onClear();

        for (var i in this.boneTimelines) {
            this.boneTimelines[i].returnToPool();
            delete this.boneTimelines[i];
        }

        for (var i in this.slotTimelines) {
            this.slotTimelines[i].returnToPool();
            delete this.slotTimelines[i];
        }

        for (var i in this.ffdTimelines) {
            for (var j in this.ffdTimelines[i]) {
                for (var k in this.ffdTimelines[i][j]) {
                    this.ffdTimelines[i][j][k].returnToPool();
                }
            }

            delete this.ffdTimelines[i];
        }

        this.hasAsynchronyTimeline = false;
        this.frameCount = 0;
        this.playTimes = 0;
        this.position = 0;
        this.duration = 0;
        this.fadeInTime = 0;
        this.cacheTimeToFrameScale = 0;
        this.name = null;
        this.animation = null;
        this.cachedFrames.length = 0;
    }

    cacheFrames(value: any) {
        if (this.animation) return;

        var cacheFrameCount = Math.max(Math.floor((this.frameCount + 1) * this.scale * value), 1);
        this.cacheTimeToFrameScale = cacheFrameCount / (this.duration + 0.000001); //
        this.cachedFrames.length = 0;
        this.cachedFrames.length = cacheFrameCount;

        for (var i in this.boneTimelines) {
            this.boneTimelines[i].cacheFrames(cacheFrameCount);
        }

        for (var i in this.slotTimelines) {
            this.slotTimelines[i].cacheFrames(cacheFrameCount);
        }
    }

    addBoneTimeline(value: any) {
        if (value && value.bone && !this.boneTimelines[value.bone.name]) {
            this.boneTimelines[value.bone.name] = value;
        } else {
            throw new Error();
        }
    }
    
	addSlotTimeline(value: any) {
        if (value && value.slot && !this.slotTimelines[value.slot.name]) {
            this.slotTimelines[value.slot.name] = value;
        } else {
            throw new Error();
        }
    }

    addFFDTimeline(value: any) {
        if (value && value.skin && value.slot) {
            var skin = this.ffdTimelines[value.skin.name] = this.ffdTimelines[value.skin.name] || {};
            var slot = skin[value.slot.slot.name] = skin[value.slot.slot.name] || {};

            if (!slot[value.displayIndex]) {
                slot[value.displayIndex] = value;
            } else {
                throw new Error();
            }
        } else {
            throw new Error();
        }
    }

    getBoneTimeline(name: string): any {
        return this.boneTimelines[name];
    }

    getSlotTimeline(name: string): any {
        return this.slotTimelines[name];
    }

    getFFDTimeline(skinName: string, slotName: string, displayIndex: number): any {
        var skin = this.ffdTimelines[skinName];

        if (skin) {
            var slot = skin[slotName];

            if (slot) {
                return slot[displayIndex];
            }
        }

        return null;
    }

}