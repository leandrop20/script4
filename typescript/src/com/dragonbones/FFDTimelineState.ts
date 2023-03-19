import { TweenTimelineState } from './TweenTimelineState';
import { DragonBones } from './DragonBones';
import { BaseObject } from './BaseObject';
import { ExtensionFrameData } from './ExtensionFrameData';

export class FFDTimelineState extends TweenTimelineState {

    _ffdVertices: any[];
    slot: any;
    _tweenFFD!: number;
    _slotFFDVertices: any;
    _durationFFDFrame: any;

	constructor() {
		super();

		this._ffdVertices = [];
	}

	static override toString() {
        return "[class FFDTimelineState]";
    }

    override _onClear() {
        super._onClear();
        this.slot = null;
        this._tweenFFD = 0 /* None */;
        this._slotFFDVertices = null;
        if (this._durationFFDFrame) {
            this._durationFFDFrame.returnToPool();
            this._durationFFDFrame = null;
        }
        if (this._ffdVertices.length) {
            this._ffdVertices.length = 0;
        }
    }

    override _onArriveAtFrame(isUpdate: any) {
        var self = this;
        super._onArriveAtFrame(isUpdate);
        self._tweenFFD = 0 /* None */;
        if (self._tweenEasing != DragonBones.NO_TWEEN || self._curve) {
            self._tweenFFD = self._updateExtensionKeyFrame(
                self._currentFrame,
                self._currentFrame.next,
                self._durationFFDFrame
            );
        }
        if (self._tweenFFD == 0 /* None */) {
            var currentFFDVertices = self._currentFrame.tweens;
            for (var i = 0, l = currentFFDVertices.length; i < l; ++i) {
                if (self._slotFFDVertices[i] != currentFFDVertices[i]) {
                    self._tweenFFD = 1 /* Once */;
                    break;
                }
            }
        }
    }

    override _onUpdateFrame(isUpdate: any) {
        var self = this;
        super._onUpdateFrame(isUpdate);
        var tweenProgress = 0;
        if (self._tweenFFD != 0 /* None */) {
            if (self._tweenFFD == 1 /* Once */) {
                self._tweenFFD = 0 /* None */;
                tweenProgress = 0;
            }
            else {
                tweenProgress = self._tweenProgress;
            }
            var currentFFDVertices = self._currentFrame.tweens;
            var nextFFDVertices = self._durationFFDFrame.tweens;
            for (var i = 0, l = currentFFDVertices.length; i < l; ++i) {
                self._ffdVertices[i] = currentFFDVertices[i] + nextFFDVertices[i] * tweenProgress;
            }
            self.slot._ffdDirty = true;
        }
    }

    override fadeIn(armature: any, animationState: any, timelineData: any, time: any) {
        super.fadeIn(armature, animationState, timelineData, time);
        this._slotFFDVertices = this.slot._ffdVertices;
        this._durationFFDFrame = BaseObject.borrowObject(ExtensionFrameData);
        this._durationFFDFrame.tweens.length = this._slotFFDVertices.length;
        this._ffdVertices.length = this._slotFFDVertices.length;
        for (let i = 0, l = this._durationFFDFrame.tweens.length; i < l; ++i) {
            this._durationFFDFrame.tweens[i] = 0;
        }
        for (let i = 0, l = this._ffdVertices.length; i < l; ++i) {
            this._ffdVertices[i] = 0;
        }
    }

    override update(time: any) {
        var self = this;
        super.update(time);
        // Blend animation.
        var weight = self._animationState._weightResult;
        if (weight > 0) {
            if (self.slot._blendIndex == 0) {
                for (var i = 0, l = self._ffdVertices.length; i < l; ++i) {
                    self._slotFFDVertices[i] = self._ffdVertices[i] * weight;
                }
            }
            else {
                for (var i = 0, l = self._ffdVertices.length; i < l; ++i) {
                    self._slotFFDVertices[i] += self._ffdVertices[i] * weight;
                }
            }
            self.slot._blendIndex++;
            var fadeProgress = self._animationState._fadeProgress;
            if (fadeProgress < 1) {
                self.slot._ffdDirty = true;
            }
        }
    }

}