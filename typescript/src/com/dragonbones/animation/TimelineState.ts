import { BaseObject } from '../core/BaseObject';

export class TimelineState extends BaseObject {

    _isCompleted!: boolean;
    _currentPlayTimes!: number;
    _currentTime!: number;
    _timeline: any;
    _isReverse!: boolean;
    _hasAsynchronyTimeline!: boolean;
    _frameRate!: number;
    _keyFrameCount!: number;
    _frameCount!: number;
    _position!: number;
    _duration!: number;
    _animationDutation!: number;
    _timeScale!: number;
    _timeOffset!: number;
    _currentFrame: any;
    _armature: any;
    _animationState: any;

	constructor() {
		super();
	}

	override _onClear() {
        this._isCompleted = false;
        this._currentPlayTimes = -1;
        this._currentTime = -1;
        this._timeline = null;
        this._isReverse = false;
        this._hasAsynchronyTimeline = false;
        this._frameRate = 0;
        this._keyFrameCount = 0;
        this._frameCount = 0;
        this._position = 0;
        this._duration = 0;
        this._animationDutation = 0;
        this._timeScale = 1;
        this._timeOffset = 0;
        this._currentFrame = null;
        this._armature = null;
        this._animationState = null;
    }

    _onUpdateFrame(isUpdate: any) { }

    _onArriveAtFrame(isUpdate: any) { }

    _setCurrentTime(value: any): boolean {
        var self = this;
        var currentPlayTimes = 0;

        if (self._keyFrameCount == 1 && this != self._animationState._timeline) {
            self._isCompleted = true;
            currentPlayTimes = 1;
        } else if (self._hasAsynchronyTimeline) {
            var playTimes = self._animationState.playTimes;
            var totalTime = playTimes * self._duration;
            value *= self._timeScale;

            if (self._timeOffset != 0) {
                value += self._timeOffset * self._animationDutation;
            }

            if (playTimes > 0 && (value >= totalTime || value <= -totalTime)) {
                self._isCompleted = true;
                currentPlayTimes = playTimes;

                if (value < 0) {
                    value = 0;
                } else {
                    value = self._duration;
                }
            } else {
                self._isCompleted = false;

                if (value < 0) {
                    currentPlayTimes = Math.floor(-value / self._duration);
                    value = self._duration - (-value % self._duration);
                } else {
                    currentPlayTimes = Math.floor(value / self._duration);
                    value %= self._duration;
                }

                if (playTimes > 0 && currentPlayTimes > playTimes) {
                    currentPlayTimes = playTimes;
                }
            }

            value += self._position;
        } else {
            self._isCompleted = self._animationState._timeline._isCompleted;
            currentPlayTimes = self._animationState._timeline._currentPlayTimes;
        }

        self._currentPlayTimes = currentPlayTimes;

        if (self._currentTime == value) return false;

        self._isReverse = self._currentTime > value && self._currentPlayTimes == currentPlayTimes;
        self._currentTime = value;

        return true;
    }

    fadeIn(armature: any, animationState: any, timelineData: any, time: any) {
        this._armature = armature;
        this._animationState = animationState;
        this._timeline = timelineData;
        var isMainTimeline = this == this._animationState._timeline;
        this._hasAsynchronyTimeline = isMainTimeline || this._animationState.animationData.hasAsynchronyTimeline;
        this._frameRate = this._armature.armatureData.frameRate;
        this._keyFrameCount = this._timeline.frames.length;
        this._frameCount = this._animationState.animationData.frameCount;
        this._position = this._animationState._position;
        this._duration = this._animationState._duration;
        this._animationDutation = this._animationState.animationData.duration;
        this._timeScale = isMainTimeline ? 1 : (1 / this._timeline.scale);
        this._timeOffset = isMainTimeline ? 0 : this._timeline.offset;
    }

    fadeOut() {}

    update(time: any) {
        var self = this;

        if (!self._isCompleted && self._setCurrentTime(time)) {
            var currentFrameIndex = self._keyFrameCount > 1
                ? Math.floor(self._currentTime * self._frameRate)
                : 0;
            var currentFrame = self._timeline.frames[currentFrameIndex];

            if (self._currentFrame != currentFrame) {
                self._currentFrame = currentFrame;
                self._onArriveAtFrame(true);
            }
            
            self._onUpdateFrame(true);
        }
    }

}