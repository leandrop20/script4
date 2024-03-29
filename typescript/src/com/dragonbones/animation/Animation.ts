import { BaseObject } from '../core/BaseObject';
import { AnimationState } from './AnimationState';

export class Animation extends BaseObject {

    static _sortAnimationState(a: any, b: any): number {
        return a.layer > b.layer ? 1 : -1;
    }

    static override toString(): string {
        return "[class Animation]";
    }

    _animations: any;
    _animationNames: any[];
    _animationStates: any[];

    timeScale!: number;
    _animationStateDirty!: boolean;
    _timelineStateDirty!: boolean;
    _armature: any;
    _isPlaying!: boolean;
    _time!: number;
    _lastAnimationState: any;

	constructor() {
		super();

		this._animations = {};
        this._animationNames = [];
        this._animationStates = [];
	}

    override _onClear() {
        for (let i in this._animations) {
            delete this._animations[i];
        }

        for (let i = 0, l = this._animationStates.length; i < l; ++i) {
            this._animationStates[i].returnToPool();
        }

        this.timeScale = 1;
        this._animationStateDirty = false;
        this._timelineStateDirty = false;
        this._armature = null;
        this._isPlaying = false;
        this._time = 0;
        this._lastAnimationState = null;
        this._animationNames.length = 0;
        this._animationStates.length = 0;
    }

	_fadeOut(fadeOutTime: any, layer: any, group: any, fadeOutMode: any, pauseFadeOut: any) {
        var i = 0, l = this._animationStates.length;
        var animationState: any = null;
        
        switch (fadeOutMode) {
            case 1 /* SameLayer */:
                for (; i < l; ++i) {
                    animationState = this._animationStates[i];
                    if (animationState.layer == layer) {
                        animationState.fadeOut(fadeOutTime, pauseFadeOut);
                    }
                }
                break;
            case 2 /* SameGroup */:
                for (; i < l; ++i) {
                    animationState = this._animationStates[i];
                    if (animationState.group == group) {
                        animationState.fadeOut(fadeOutTime, pauseFadeOut);
                    }
                }
                break;
            case 4 /* All */:
                for (; i < l; ++i) {
                    animationState = this._animationStates[i];
                    animationState.fadeOut(fadeOutTime, pauseFadeOut);
                    if (fadeOutTime == 0) {
                        animationState.returnToPool();
                    }
                    else {
                        animationState.fadeOut(fadeOutTime, pauseFadeOut);
                    }
                }
                if (fadeOutTime == 0) {
                    this._animationStates.length = 0;
                }
                break;
            case 3 /* SameLayerAndGroup */:
                for (; i < l; ++i) {
                    animationState = this._animationStates[i];
                    if (animationState.layer == layer && animationState.group == group) {
                        animationState.fadeOut(fadeOutTime, pauseFadeOut);
                    }
                }
                break;
            case 0 /* None */:
            default:
                break;
        }
    }

    _updateFFDTimelineStates() {
        for (var i = 0, l = this._animationStates.length; i < l; ++i) {
            this._animationStates[i]._updateFFDTimelineStates();
        }
    }

    _advanceTime(passedTime: number) {
        var self = this;

        if (!self._isPlaying) {
            return;
        }

        if (passedTime < 0) {
            passedTime = -passedTime;
        }

        var animationStateCount = self._animationStates.length;

        if (animationStateCount == 1) {
            var animationState = self._animationStates[0];

            if (animationState._isFadeOutComplete) {
                animationState.returnToPool();
                self._animationStates.length = 0;
                self._animationStateDirty = true;
                self._lastAnimationState = null;
            } else {
                if (self._timelineStateDirty) {
                    animationState._updateTimelineStates();
                }
                animationState._advanceTime(passedTime, 1, 0);
            }
        } else if (animationStateCount > 1) {
            var prevLayer = self._animationStates[0]._layer;
            var weightLeft = 1;
            var layerTotalWeight = 0;
            var animationIndex = 1; // If has multiply animation state, first index is 1.

            for (var i = 0, r = 0; i < animationStateCount; ++i) {
                var animationState = self._animationStates[i];

                if (animationState._isFadeOutComplete) {
                    r++;
                    animationState.returnToPool();
                    self._animationStateDirty = true;
                    
                    if (self._lastAnimationState == animationState) {
                        if (i - r >= 0) {
                            self._lastAnimationState = self._animationStates[i - r];
                        } else {
                            self._lastAnimationState = null;
                        }
                    }
                } else {
                    if (r > 0) {
                        self._animationStates[i - r] = animationState;
                    }

                    if (prevLayer != animationState._layer) {
                        prevLayer = animationState._layer;

                        if (layerTotalWeight >= weightLeft) {
                            weightLeft = 0;
                        } else {
                            weightLeft -= layerTotalWeight;
                        }

                        layerTotalWeight = 0;
                    }

                    if (self._timelineStateDirty) {
                        animationState._updateTimelineStates();
                    }

                    animationState._advanceTime(passedTime, weightLeft, animationIndex);

                    if (animationState._weightResult != 0) {
                        layerTotalWeight += animationState._weightResult;
                        animationIndex++;
                    }
                }

                if (i == animationStateCount - 1 && r > 0) {
                    self._animationStates.length -= r;
                }
            }
        }

        self._timelineStateDirty = false;
    }

    /**
     * @version DragonBones 4.5
     */
    reset() {
        for (var i = 0, l = this._animationStates.length; i < l; ++i) {
            this._animationStates[i].returnToPool();
        }

        this._isPlaying = false;
        this._lastAnimationState = null;
        this._animationStates.length = 0;
    }

    /**
     * @version DragonBones 3.0
     */
    stop(animationName: any = null) {
        if (animationName) {
            var animationState = this.getState(animationName);

            if (animationState) {
                animationState.stop();
            }
        } else {
            this._isPlaying = false;
        }
    }

    /**
     * @version DragonBones 3.0
     */
    play(animationName = null, playTimes: number = -1): any {
        var animationState = null;
        
        if (animationName) {
            animationState = this.fadeIn(animationName, 0, playTimes, 0, null, 4 /* All */);
        } else if (!this._lastAnimationState) {
            var defaultAnimation = this._armature.armatureData.defaultAnimation;

            if (defaultAnimation) {
                animationState = this.fadeIn(defaultAnimation.name, 0, playTimes, 0, null, 4 /* All */);
            }
        } else if (
            !this._isPlaying ||
            (!this._lastAnimationState.isPlaying && !this._lastAnimationState.isCompleted)
        ) {
            this._isPlaying = true;
            this._lastAnimationState.play();
        } else {
            animationState = this.fadeIn(this._lastAnimationState.name, 0, playTimes, 0, null, 4 /* All */);
        }

        return animationState;
    }

    /**
     * @version DragonBones 4.5
     */
    fadeIn(
        animationName: string,
        fadeInTime: number = -1,
        playTimes: number = -1,
        layer: number = 0,
        group: any = null,
        fadeOutMode: any = null, 
        additiveBlending: boolean = false,
        displayControl: boolean = true,
        pauseFadeOut: boolean = true,
        pauseFadeIn: boolean = true
    ): any {
        var animationData = this._animations[animationName];

        if (!animationData) {
            this._time = 0;
            console.warn(
                "Non-existent animation.",
                "DragonBones: " + this._armature.armatureData.parent.name,
                "Armature: " + this._armature.name,
                "Animation: " + animationName
            );

            return null;
        }

        if (this._time != this._time) {
            this._time = 0;
        }

        this._isPlaying = true;

        if (fadeInTime != fadeInTime || fadeInTime < 0) {
            if (this._lastAnimationState) {
                fadeInTime = animationData.fadeInTime;
            } else {
                fadeInTime = 0;
            }
        }
        
        if (playTimes < 0) {
            playTimes = animationData.playTimes;
        }

        this._fadeOut(fadeInTime, layer, group, fadeOutMode, pauseFadeOut);
        this._lastAnimationState = BaseObject.borrowObject(AnimationState);
        this._lastAnimationState._layer = layer;
        this._lastAnimationState._group = group;
        this._lastAnimationState.additiveBlending = additiveBlending;
        this._lastAnimationState.displayControl = displayControl;
        this._lastAnimationState._fadeIn(
            this._armature,
            animationData.animation || animationData,
            animationName,
            playTimes,
            animationData.position,
            animationData.duration,
            this._time,
            1 / animationData.scale,
            fadeInTime,
            pauseFadeIn
        );
        this._animationStates.push(this._lastAnimationState);
        this._animationStateDirty = true;
        this._time = 0;

        if (this._animationStates.length > 1) {
            this._animationStates.sort(Animation._sortAnimationState);
        }

        var slots = this._armature.getSlots();

        for (var i = 0, l = slots.length; i < l; ++i) {
            var slot = slots[i];

            if (slot.inheritAnimation) {
                var childArmature = slot.childArmature;

                if (childArmature &&
                    childArmature.animation.hasAnimation(animationName) &&
                    !childArmature.animation.getState(animationName)) {
                    childArmature.animation.fadeIn(animationName);
                }
            }
        }
        
        if (fadeInTime == 0) {
            this._armature.advanceTime(0); // Blend animation state, update armature. (pass actions and events) 
        }

        return this._lastAnimationState;
    }

    /**
     * @version DragonBones 4.5
     */
    gotoAndPlayByTime(animationName: string, time: number = 0, playTimes: number = -1): any {
        this._time = time;

        return this.fadeIn(animationName, 0, playTimes, 0, null, 4 /* All */);
    }

    /**
     * @version DragonBones 4.5
     */
    gotoAndPlayByFrame(animationName: string, frame: number = 0, playTimes: number = -1): any {
        var animationData = this._animations[animationName];

        if (animationData) {
            this._time = animationData.duration * frame / animationData.frameCount;
        }

        return this.fadeIn(animationName, 0, playTimes, 0, null, 4 /* All */);
    }

    /**
     * @version DragonBones 4.5
     */
    gotoAndPlayByProgress(
        animationName: string,
        progress: number = 0,
        playTimes: number = -1
    ): any {
        var animationData = this._animations[animationName];

        if (animationData) {
            this._time = animationData.duration * Math.max(progress, 0);
        }

        return this.fadeIn(animationName, 0, playTimes, 0, null, 4 /* All */);
    }

    /**
     * @version DragonBones 4.5
     */
    gotoAndStopByTime(animationName: string, time: number = 0): any {
        var animationState = this.gotoAndPlayByTime(animationName, time, 1);

        if (animationState) {
            animationState.stop();
        }

        return animationState;
    }

    /**
     * @version DragonBones 4.5
     */
    gotoAndStopByFrame(animationName: string, frame: number = 0): any {
        var animationState = this.gotoAndPlayByFrame(animationName, frame, 1);

        if (animationState) {
            animationState.stop();
        }

        return animationState;
    }

    /**
     * @version DragonBones 4.5
     */
    gotoAndStopByProgress(animationName: string, progress: number = 0): any {
        var animationState = this.gotoAndPlayByProgress(animationName, progress, 1);

        if (animationState) {
            animationState.stop();
        }

        return animationState;
    }

    /**
     * @version DragonBones 3.0
     */
    getState(animationName: string): any {
        for (var i = 0, l = this._animationStates.length; i < l; ++i) {
            var animationState = this._animationStates[i];

            if (animationState.name == animationName) {
                return animationState;
            }
        }

        return null;
    }

    /**
     * @version DragonBones 3.0
     */
    hasAnimation(animationName: string): any {
        return this._animations[animationName] != null;
    }

    get isPlaying(): boolean {
    	if (this._animationStates.length > 1) {
            return this._isPlaying && !this.isCompleted;
        } else if (this._lastAnimationState) {
            return this._isPlaying && this._lastAnimationState.isPlaying;
        }

        return this._isPlaying;
    }

    get isCompleted(): boolean {
    	if (this._lastAnimationState) {
            if (!this._lastAnimationState.isCompleted) return false;

            for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                if (!this._animationStates[i].isCompleted) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }
    
    get lastAnimationName(): any {
    	return this._lastAnimationState ? this._lastAnimationState.name : null;
    }

    get lastAnimationState(): any {
    	return this._lastAnimationState;
    }

    get animationNames(): any {
    	return this._animationNames;
    }

    get animations(): any {
    	return this._animations;
    }

    set animations(value: any) {
    	var self = this;

        if (this._animations == value) {
            return;
        }

        for (var i in this._animations) {
            delete this._animations[i];
        }

        this._animationNames.length = 0;

        if (value) {
            for (var i in value) {
                this._animations[i] = value[i];
                this._animationNames.push(i);
            }
        }
    }

    /**
     * @deprecated
     * @see #play()
     * @see #fadeIn()
     * @see #gotoAndPlayByTime()
     * @see #gotoAndPlayByFrame()
     * @see #gotoAndPlayByProgress()
     */
    gotoAndPlay(
        animationName: string,
        fadeInTime: number = -1,
        duration: number = -1,
        playTimes: number = -1,
        layer: number = 0,
        group: any = null, 
        fadeOutMode: number = 3,
        pauseFadeOut: boolean = true,
        pauseFadeIn: boolean = true
    ): any {
        var animationState = this.fadeIn(
            animationName,
            fadeInTime,
            playTimes,
            layer,
            group,
            fadeOutMode,
            false,
            true,
            pauseFadeOut,
            pauseFadeIn
        );

        if (animationState && duration && duration > 0) {
            animationState.timeScale = animationState.totalTime / duration;
        }

        return animationState;
    }

    /**
     * @deprecated
     * @see #gotoAndStopByTime()
     * @see #gotoAndStopByFrame()
     * @see #gotoAndStopByProgress()
     */
    gotoAndStop(animationName: string, time: number = 0): any {
        return this.gotoAndStopByTime(animationName, time);
    }

    /**
     * @deprecated
     * @see #animationNames
     * @see #animations
     */
    get animationList(): any {
    	return this._animationNames;
    }

    /**
     * @deprecated
     * @see #animationNames
     * @see #animations
     */
    get animationDataList(): any {
    	var list: any[] = [];

        for (var i = 0, l = this._animationNames.length; i < l; ++i) {
            list.push(this._animations[this._animationNames[i]]);
        }

        return list;
    }

}