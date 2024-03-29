import { BaseObject } from '../core/BaseObject';
import { AnimationTimelineState } from './AnimationTimelineState';
import { BoneTimelineState } from './BoneTimelineState';
import { SlotTimelineState } from './SlotTimelineState';
import { EventObject } from '../event/EventObject';
import { FFDTimelineState } from './FFDTimelineState';

export class AnimationState extends BaseObject {

    static stateActionEnabled: boolean = true;

    _boneMask: any[];
    _boneTimelines: any[];
    _slotTimelines: any[];
    _ffdTimelines: any[];
    autoTween: boolean;

    displayControl!: boolean;
    additiveBlending!: boolean;
    actionEnabled!: boolean;
    playTimes!: number;
    timeScale!: number;
    weight!: number;
    autoFadeOutTime!: number;
    fadeTotalTime!: number;
    _isFadeOutComplete!: boolean;
    _layer!: number;
    _position!: number;
    _duration!: number;
    _weightResult!: number;
    _fadeProgress!: number;
    _group: any;
    _timeline: any;

    _isPlaying!: boolean;
    _isPausePlayhead!: boolean;
    _isFadeOut!: boolean;
    _fadeTime!: number;
    _time!: number;
    _name: any;
    _armature: any;
    _animationData: any;

	constructor() {
		super();

		this._boneMask = [];
        this._boneTimelines = [];
        this._slotTimelines = [];
        this._ffdTimelines = [];
        this.autoTween = false;
	}

	static override toString(): string {
        return "[class AnimationState]";
    }

    override _onClear() {
        for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
            this._boneTimelines[i].returnToPool();
        }

        for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
            this._slotTimelines[i].returnToPool();
        }

        for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
            this._ffdTimelines[i].returnToPool();
        }

        this.displayControl = true;
        this.additiveBlending = false;
        this.actionEnabled = false;
        this.playTimes = 1;
        this.timeScale = 1;
        this.weight = 1;
        this.autoFadeOutTime = -1;
        this.fadeTotalTime = 0;
        this._isFadeOutComplete = false;
        this._layer = 0;
        this._position = 0;
        this._duration = 0;
        this._weightResult = 0;
        this._fadeProgress = 0;
        this._group = null;

        if (this._timeline) {
            this._timeline.returnToPool();
            this._timeline = null;
        }

        this._isPlaying = true;
        this._isPausePlayhead = false;
        this._isFadeOut = false;
        this._fadeTime = 0;
        this._time = 0;
        this._name = null;
        this._armature = null;
        this._animationData = null;
        this._boneMask.length = 0;
        this._boneTimelines.length = 0;
        this._slotTimelines.length = 0;
        this._ffdTimelines.length = 0;
    }

    _advanceFadeTime(passedTime: any) {
        var self = this;

        if (passedTime < 0) {
            passedTime = -passedTime;
        }

        self._fadeTime += passedTime;
        var fadeProgress = 0;

        if (self._fadeTime >= self.fadeTotalTime) {
            fadeProgress = self._isFadeOut ? 0 : 1;
        } else if (self._fadeTime > 0) {
            fadeProgress = self._isFadeOut ? (1 - self._fadeTime / self.fadeTotalTime) : (self._fadeTime / self.fadeTotalTime);
        } else {
            fadeProgress = self._isFadeOut ? 1 : 0;
        }

        if (self._fadeProgress != fadeProgress) {
            self._fadeProgress = fadeProgress;
            var eventDispatcher = self._armature._display;

            if (self._fadeTime <= passedTime) {
                if (self._isFadeOut) {
                    if (eventDispatcher.hasEvent(EventObject.FADE_OUT)) {
                        var event_1 = BaseObject.borrowObject(EventObject);
                        event_1.animationState = this;
                        self._armature._bufferEvent(event_1, EventObject.FADE_OUT);
                    }
                } else {
                    if (eventDispatcher.hasEvent(EventObject.FADE_IN)) {
                        var event_2 = BaseObject.borrowObject(EventObject);
                        event_2.animationState = this;
                        self._armature._bufferEvent(event_2, EventObject.FADE_IN);
                    }
                }
            }

            if (self._fadeTime >= self.fadeTotalTime) {
                if (self._isFadeOut) {
                    self._isFadeOutComplete = true;

                    if (eventDispatcher.hasEvent(EventObject.FADE_OUT_COMPLETE)) {
                        var event_3 = BaseObject.borrowObject(EventObject);
                        event_3.animationState = this;
                        self._armature._bufferEvent(event_3, EventObject.FADE_OUT_COMPLETE);
                    }
                } else {
                    self._isPausePlayhead = false;

                    if (eventDispatcher.hasEvent(EventObject.FADE_IN_COMPLETE)) {
                        var event_4 = BaseObject.borrowObject(EventObject);
                        event_4.animationState = this;
                        self._armature._bufferEvent(event_4, EventObject.FADE_IN_COMPLETE);
                    }
                }
            }
        }
    }

    _isDisabled(slot: any): boolean {
        if (
            this.displayControl &&
            (
                !slot.displayController ||
                slot.displayController == this._name ||
                slot.displayController == this._group
            )
        ) {
            return false;
        }

        return true;
    }

    _fadeIn(
        armature: any,
        clip: any,
        animationName: any,
        playTimes: any,
        position: any,
        duration: any,
        time: any,
        timeScale: any,
        fadeInTime: any,
        pausePlayhead: any
    ) {
        this._armature = armature;
        this._animationData = clip;
        this._name = animationName;
        this.actionEnabled = AnimationState.stateActionEnabled;
        this.playTimes = playTimes;
        this.timeScale = timeScale;
        this.fadeTotalTime = fadeInTime;
        this._position = position;
        this._duration = duration;
        this._time = time;
        this._isPausePlayhead = pausePlayhead;

        if (this.fadeTotalTime == 0) {
            this._fadeProgress = 0.999999;
        }

        this._timeline = BaseObject.borrowObject(AnimationTimelineState);
        this._timeline.fadeIn(this._armature, this, this._animationData, this._time);
        this._updateTimelineStates();
    }

    _updateTimelineStates() {
        var time = this._time;

        if (!this._animationData.hasAsynchronyTimeline) {
            time = this._timeline._currentTime;
        }

        var boneTimelineStates: any = {};
        var slotTimelineStates: any = {};

        for (let i = 0, l = this._boneTimelines.length; i < l; ++i) {
            var boneTimelineState = this._boneTimelines[i];
            boneTimelineStates[boneTimelineState.bone.name] = boneTimelineState;
        }

        var bones = this._armature.getBones();

        for (let i = 0, l = bones.length; i < l; ++i) {
            var bone = bones[i];
            var boneTimelineName = bone.name;
            var boneTimelineData = this._animationData.getBoneTimeline(boneTimelineName);

            if (boneTimelineData && this.containsBoneMask(boneTimelineName)) {
                var boneTimelineState = boneTimelineStates[boneTimelineName];

                if (boneTimelineState) {
                    delete boneTimelineStates[boneTimelineName];
                } else {
                    boneTimelineState = BaseObject.borrowObject(BoneTimelineState);
                    boneTimelineState.bone = bone;
                    boneTimelineState.fadeIn(this._armature, this, boneTimelineData, time);
                    this._boneTimelines.push(boneTimelineState);
                }
            }
        }

        for (let i in boneTimelineStates) {
            var boneTimelineState = boneTimelineStates[i];
            boneTimelineState.bone.invalidUpdate(); //
            this._boneTimelines.splice(this._boneTimelines.indexOf(boneTimelineState), 1);
            boneTimelineState.returnToPool();
        }

        for (let i = 0, l = this._slotTimelines.length; i < l; ++i) {
            var slotTimelineState = this._slotTimelines[i];
            slotTimelineStates[slotTimelineState.slot.name] = slotTimelineState;
        }

        var slots = this._armature.getSlots();

        for (let i = 0, l = slots.length; i < l; ++i) {
            var slot = slots[i];
            var slotTimelineName = slot.name;
            var parentTimelineName = slot.parent.name;
            var slotTimelineData = this._animationData.getSlotTimeline(slotTimelineName);

            if (slotTimelineData && this.containsBoneMask(parentTimelineName) && !this._isFadeOut) {
                var slotTimelineState = slotTimelineStates[slotTimelineName];

                if (slotTimelineState) {
                    delete slotTimelineStates[slotTimelineName];
                } else {
                    slotTimelineState = BaseObject.borrowObject(SlotTimelineState);
                    slotTimelineState.slot = slot;
                    slotTimelineState.fadeIn(this._armature, this, slotTimelineData, time);
                    this._slotTimelines.push(slotTimelineState);
                }
            }
        }

        for (var i in slotTimelineStates) {
            var slotTimelineState = slotTimelineStates[i];
            this._slotTimelines.splice(this._slotTimelines.indexOf(slotTimelineState), 1);
            slotTimelineState.returnToPool();
        }

        this._updateFFDTimelineStates();
    }

    _updateFFDTimelineStates() {
        var time = this._time;

        if (!this._animationData.hasAsynchronyTimeline) {
            time = this._timeline._currentTime;
        }

        var ffdTimelineStates: any = {};

        for (let i = 0, l = this._ffdTimelines.length; i < l; ++i) {
            var ffdTimelineState = this._ffdTimelines[i];
            ffdTimelineStates[ffdTimelineState.slot.name] = ffdTimelineState;
        }

        var slots = this._armature.getSlots();

        for (let i = 0, l = slots.length; i < l; ++i) {
            var slot = slots[i];
            var slotTimelineName = slot.name;
            var parentTimelineName = slot.parent.name;

            if (slot._meshData) {
                var displayIndex = slot.displayIndex;
                var rawMeshData = displayIndex < slot._displayDataSet.displays.length
                    ? slot._displayDataSet.displays[displayIndex].mesh
                    : null;

                if (slot._meshData == rawMeshData) {
                    var ffdTimelineData = this._animationData.getFFDTimeline(
                        this._armature._skinData.name,
                        slotTimelineName,
                        displayIndex
                    );
                    
                    if (ffdTimelineData && this.containsBoneMask(parentTimelineName)) {
                        var ffdTimelineState = ffdTimelineStates[slotTimelineName];

                        if (ffdTimelineState && ffdTimelineState._timeline == ffdTimelineData) {
                            delete ffdTimelineStates[slotTimelineName];
                        } else {
                            ffdTimelineState = BaseObject.borrowObject(FFDTimelineState);
                            ffdTimelineState.slot = slot;
                            ffdTimelineState.fadeIn(this._armature, this, ffdTimelineData, time);
                            this._ffdTimelines.push(ffdTimelineState);
                        }
                    } else {
                        for (let iF = 0, lF = slot._ffdVertices.length; iF < lF; ++iF) {
                            slot._ffdVertices[iF] = 0;
                        }

                        slot._ffdDirty = true;
                    }
                }
            }
        }

        for (let i in ffdTimelineStates) {
            var ffdTimelineState = ffdTimelineStates[i];
            //ffdTimelineState.slot._ffdDirty = true;
            this._ffdTimelines.splice(this._ffdTimelines.indexOf(ffdTimelineState), 1);
            ffdTimelineState.returnToPool();
        }
    }

    _advanceTime(passedTime: any, weightLeft: any, index: number) {
        var self = this;
        // Update fade time. (Still need to be update even if the passedTime is zero)
        self._advanceFadeTime(passedTime);
        // Update time.
        passedTime *= self.timeScale;
        if (passedTime != 0 && self._isPlaying && !self._isPausePlayhead) {
            self._time += passedTime;
        }
        // Blend weight.
        self._weightResult = self.weight * self._fadeProgress * weightLeft;

        if (self._weightResult != 0) {
            var isCacheEnabled = self._fadeProgress >= 1 && index == 0 && self._armature.cacheFrameRate > 0;
            var cacheTimeToFrameScale = self._animationData.cacheTimeToFrameScale;
            var isUpdatesTimeline = true;
            var isUpdatesBoneTimeline = true;
            var time = cacheTimeToFrameScale * 2;
            time = isCacheEnabled ? (Math.floor(self._time * time) / time) : self._time; // Cache time internval.
            // Update main timeline.                
            self._timeline.update(time);

            if (!self._animationData.hasAsynchronyTimeline) {
                time = self._timeline._currentTime;
            }

            if (isCacheEnabled) {
                var cacheFrameIndex = Math.floor(self._timeline._currentTime * cacheTimeToFrameScale); // uint

                if (self._armature._cacheFrameIndex == cacheFrameIndex) {
                    isUpdatesTimeline = false;
                    isUpdatesBoneTimeline = false;
                } else {
                    self._armature._cacheFrameIndex = cacheFrameIndex;

                    if (self._armature._animation._animationStateDirty) {
                        self._armature._animation._animationStateDirty = false;

                        for (let i = 0, l = self._boneTimelines.length; i < l; ++i) {
                            var boneTimeline = self._boneTimelines[i];
                            boneTimeline.bone._cacheFrames = boneTimeline._timeline.cachedFrames;
                        }

                        for (let i = 0, l = self._slotTimelines.length; i < l; ++i) {
                            var slotTimeline = self._slotTimelines[i];
                            slotTimeline.slot._cacheFrames = slotTimeline._timeline.cachedFrames;
                        }
                    }

                    if (self._animationData.cachedFrames[cacheFrameIndex]) {
                        isUpdatesBoneTimeline = false;
                    } else {
                        self._animationData.cachedFrames[cacheFrameIndex] = true;
                    }
                }
            } else {
                self._armature._cacheFrameIndex = -1;
            }

            if (isUpdatesTimeline) {
                if (isUpdatesBoneTimeline) {
                    for (let i = 0, l = self._boneTimelines.length; i < l; ++i) {
                        self._boneTimelines[i].update(time);
                    }
                }

                for (let i = 0, l = self._slotTimelines.length; i < l; ++i) {
                    self._slotTimelines[i].update(time);
                }

                for (let i = 0, l = self._ffdTimelines.length; i < l; ++i) {
                    self._ffdTimelines[i].update(time);
                }
            }
        }

        if (self.autoFadeOutTime >= 0 && self._fadeProgress >= 1 && self._timeline._isCompleted) {
            self.fadeOut(self.autoFadeOutTime);
        }
    }

    /**
     * @version DragonBones 3.0
     */
    play() {
        this._isPlaying = true;
    }

    /**
     * @version DragonBones 3.0
     */
    stop() {
        this._isPlaying = false;
    }

    /**
     * @version DragonBones 3.0
     */
    fadeOut(fadeOutTime: any, pausePlayhead: boolean = true) {
        if (fadeOutTime < 0 || fadeOutTime != fadeOutTime) {
            fadeOutTime = 0;
        }

        this._isPausePlayhead = pausePlayhead;

        if (this._isFadeOut) {
            // If the animation is already in fade out, the new fade out will be ignored.
            if (fadeOutTime > fadeOutTime - this._fadeTime) return;
        } else {
            this._isFadeOut = true;

            if (fadeOutTime == 0 || this._fadeProgress <= 0) {
                this._fadeProgress = 0.000001; // Modify _fadeProgress to different value.
            }

            for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                this._boneTimelines[i].fadeOut();
            }

            for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                this._slotTimelines[i].fadeOut();
            }
        }

        this.displayControl = false;
        this.fadeTotalTime = this._fadeProgress > 0.000001 ? fadeOutTime / this._fadeProgress : 0;
        this._fadeTime = this.fadeTotalTime * (1 - this._fadeProgress);
    }

    /**
     * @version DragonBones 3.0
     */
    containsBoneMask(name: any): any {
        return !this._boneMask.length || this._boneMask.indexOf(name) >= 0;
    }

    /**
     * @version DragonBones 3.0
     */
    addBoneMask(name: any, recursive: boolean = true) {
        var currentBone = this._armature.getBone(name);

        if (!currentBone) return;

        if (this._boneMask.indexOf(name) < 0 &&
            this._animationData.getBoneTimeline(name)) {
            this._boneMask.push(name);
        }

        if (recursive) {
            var bones = this._armature.getBones();

            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                var boneName = bone.name;

                if (this._boneMask.indexOf(boneName) < 0 &&
                    this._animationData.getBoneTimeline(boneName) &&
                    currentBone.contains(bone)) {
                    this._boneMask.push(boneName);
                }
            }
        }

        this._updateTimelineStates();
    }

    /**
     * @version DragonBones 3.0
     */
    removeBoneMask(name: any, recursive: boolean = true) {
        var index = this._boneMask.indexOf(name);

        if (index >= 0) {
            this._boneMask.splice(index, 1);
        }

        if (recursive) {
            var currentBone = this._armature.getBone(name);

            if (currentBone) {
                var bones = this._armature.getBones();

                for (var i = 0, l = bones.length; i < l; ++i) {
                    var bone = bones[i];
                    var boneName = bone.name;
                    var index_1 = this._boneMask.indexOf(boneName);

                    if (index_1 >= 0 &&
                        currentBone.contains(bone)) {
                        this._boneMask.splice(index_1, 1);
                    }
                }
            }
        }

        this._updateTimelineStates();
    }

    /**
     * @version DragonBones 3.0
     */
    removeAllBoneMask() {
        this._boneMask.length = 0;
        this._updateTimelineStates();
    }

    get layer(): any {
    	return this._layer;
    }

    get group(): any {
    	return this._group;
    }

    get name(): any {
    	return this._name;
    }

    get animationData(): any {
    	return this._animationData;
    }

    get isCompleted(): boolean {
    	return this._timeline._isCompleted;
    }

    get isPlaying(): boolean {
    	return this._isPlaying && !this._timeline._isCompleted;
    }

    get currentPlayTimes(): any {
    	return this._timeline._currentPlayTimes;
    }

    get totalTime(): number {
    	return this._duration;
    }

    get currentTime(): number {
    	return this._timeline._currentTime;
    }

    set currentTime(value: number) {
    	if (value < 0 || value != value) {
            value = 0;
        }

        var currentPlayTimes = this._timeline._currentPlayTimes - (this._timeline._isCompleted ? 1 : 0);
        value = (value % this._duration) + currentPlayTimes * this._duration;

        if (this._time == value) return;

        this._time = value;
        this._timeline.setCurrentTime(this._time);

        for (let i = 0, l = this._boneTimelines.length; i < l; ++i) {
            this._boneTimelines[i]._isCompleted = false;
        }

        for (let i = 0, l = this._slotTimelines.length; i < l; ++i) {
            this._slotTimelines[i]._isCompleted = false;
        }

        for (let i = 0, l = this._ffdTimelines.length; i < l; ++i) {
            this._ffdTimelines[i]._isCompleted = false;
        }
    }
    
	get clip(): any {
		return this._animationData;
	}

}