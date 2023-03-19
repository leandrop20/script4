import { Point } from './Point';
import { Transform } from './Transform';
import { Matrix } from './Matrix';
import { DragonBones } from './DragonBones';
import { BaseObject } from './BaseObject';
import { AnimationFrameData } from './AnimationFrameData';
import { ObjectDataParser } from './ObjectDataParser';
import { Rectangle } from './Rectangle';
import { TweenTimelineState } from './TweenTimelineState';

export class DataParser {

    static DATA_VERSION_2_3: string = '2.3';
    static DATA_VERSION_3_0: string = '3.0';
    static DATA_VERSION_4_0: string = '4.0';
    static DATA_VERSION: string = '4.5';
    static TEXTURE_ATLAS: string = 'TextureAtlas';
    static SUB_TEXTURE: string = 'SubTexture';
    static FORMAT: string = 'format';
    static IMAGE_PATH: string = 'imagePath';
    static WIDTH: string = 'width';
    static HEIGHT: string = 'height';
    static ROTATED: string = 'rotated';
    static FRAME_X: string = 'frameX';
    static FRAME_Y: string = 'frameY';
    static FRAME_WIDTH: string = 'frameWidth';
    static FRAME_HEIGHT: string = 'frameHeight';
    static DRADON_BONES: string = 'dragonBones';
    static ARMATURE: string = 'armature';
    static BONE: string = 'bone';
    static IK: string = 'ik';
    static SLOT: string = 'slot';
    static SKIN: string = 'skin';
    static DISPLAY: string = 'display';
    static ANIMATION: string = 'animation';
    static FFD: string = 'ffd';
    static FRAME: string = 'frame';
    static PIVOT: string = 'pivot';
    static TRANSFORM: string = 'transform';
    static AABB: string = 'aabb';
    static COLOR: string = 'color';
    static FILTER: string = 'filter';
    static VERSION: string = 'version';
    static IS_GLOBAL: string = 'isGlobal';
    static FRAME_RATE: string = 'frameRate';
    static TYPE: string = 'type';
    static NAME: string = 'name';
    static PARENT: string = 'parent';
    static LENGTH: string = 'length';
    static DATA: string = 'data';
    static DISPLAY_INDEX: string = 'displayIndex';
    static Z_ORDER: string = 'z';
    static BLEND_MODE: string = 'blendMode';
    static INHERIT_TRANSLATION: string = 'inheritTranslation';
    static INHERIT_ROTATION: string = 'inheritRotation';
    static INHERIT_SCALE: string = 'inheritScale';
    static TARGET: string = 'target';
    static BEND_POSITIVE: string = 'bendPositive';
    static CHAIN: string = 'chain';
    static WEIGHT: string = 'weight';
    static FADE_IN_TIME: string = 'fadeInTime';
    static PLAY_TIMES: string = 'playTimes';
    static SCALE: string = 'scale';
    static OFFSET: string = 'offset';
    static POSITION: string = 'position';
    static DURATION: string = 'duration';
    static TWEEN_EASING: string = 'tweenEasing';
    static TWEEN_ROTATE: string = 'tweenRotate';
    static TWEEN_SCALE: string = 'tweenScale';
    static CURVE: string = 'curve';
    static EVENT: string = 'event';
    static SOUND: string = 'sound';
    static ACTION: string = 'action';
    static ACTIONS: string = 'actions';
    static DEFAULT_ACTIONS: string = 'defaultActions';
    static X: string = 'x';
    static Y: string = 'y';
    static SKEW_X: string = 'skX';
    static SKEW_Y: string = 'skY';
    static SCALE_X: string = 'scX';
    static SCALE_Y: string = 'scY';
    static ALPHA_OFFSET: string = 'aO';
    static RED_OFFSET: string = 'rO';
    static GREEN_OFFSET: string = 'gO';
    static BLUE_OFFSET: string = 'bO';
    static ALPHA_MULTIPLIER: string = 'aM';
    static RED_MULTIPLIER: string = 'rM';
    static GREEN_MULTIPLIER: string = 'gM';
    static BLUE_MULTIPLIER: string = 'bM';
    static UVS: string = 'uvs';
    static VERTICES: string = 'vertices';
    static TRIANGLES: string = 'triangles';
    static WEIGHTS: string = 'weights';
    static SLOT_POSE: string = 'slotPose';
    static BONE_POSE: string = 'bonePose';
    static TWEEN: string = 'tween';
    static KEY: string = 'key';
    static COLOR_TRANSFORM: string = 'colorTransform';
    static TIMELINE: string = 'timeline';
    static PIVOT_X: string = 'pX';
    static PIVOT_Y: string = 'pY';
    static LOOP: string = 'loop';
    static AUTO_TWEEN: string = 'autoTween';
    static HIDE: string = 'hide';
    static RECTANGLE: string = 'rectangle';
    static ELLIPSE: string = 'ellipse';

    _data: any;
    _armature: any;
    _skin: any;
    _slotDisplayDataSet: any;
    _mesh: any;
    _animation: any;
    _timeline: any;
    _isOldData: boolean;
    _isGlobalTransform: boolean;
    _isAutoTween: boolean;
    _animationTweenEasing: number;
    _timelinePivot: Point;
    _helpPoint: Point;
    _helpTransformA: Transform;
    _helpTransformB: Transform;
    _helpMatrix: Matrix;
    _rawBones: any[];

	constructor() {
		this._data = null;
        this._armature = null;
        this._skin = null;
        this._slotDisplayDataSet = null;
        this._mesh = null;
        this._animation = null;
        this._timeline = null;
        this._isOldData = false; // For 2.x ~ 3.x
        this._isGlobalTransform = false; // For 2.x ~ 3.x
        this._isAutoTween = false; // For 2.x ~ 3.x
        this._animationTweenEasing = 0; // For 2.x ~ 3.x
        this._timelinePivot = new Point(); // For 2.x ~ 3.x
        this._helpPoint = new Point();
        this._helpTransformA = new Transform();
        this._helpTransformB = new Transform();
        this._helpMatrix = new Matrix();
        this._rawBones = []; // For skinned mesh
	}

	static _getArmatureType(value: string) {
        switch (value.toLowerCase()) {
            case 'stage':
                return 0 /* Armature */;
            case 'armature':
                return 0 /* Armature */;
            case 'movieclip':
                return 1 /* MovieClip */;
            default:
                return 0 /* Armature */;
        }
    }

    static _getDisplayType(value: string) {
        switch (value.toLowerCase()) {
            case 'image':
                return 0 /* Image */;
            case 'armature':
                return 1 /* Armature */;
            case 'mesh':
                return 2 /* Mesh */;
            default:
                return 0 /* Image */;
        }
    }

    static _getBlendMode(value: string) {
        switch (value.toLowerCase()) {
            case 'normal':
                return 0 /* Normal */;
            case 'add':
                return 1 /* Add */;
            case 'alpha':
                return 2 /* Alpha */;
            case 'darken':
                return 3 /* Darken */;
            case 'difference':
                return 4 /* Difference */;
            case 'erase':
                return 5 /* Erase */;
            case 'hardlight':
                return 6 /* HardLight */;
            case 'invert':
                return 7 /* Invert */;
            case 'layer':
                return 8 /* Layer */;
            case 'lighten':
                return 9 /* Lighten */;
            case 'multiply':
                return 10 /* Multiply */;
            case 'overlay':
                return 11 /* Overlay */;
            case 'screen':
                return 12 /* Screen */;
            case 'subtract':
                return 13 /* Subtract */;
            default:
                return 0 /* Normal */;
        }
    }

    static _getActionType(value: string) {
        switch (value.toLowerCase()) {
            case 'play':
                return 0 /* Play */;
            case 'stop':
                return 1 /* Stop */;
            case 'gotoandplay':
                return 2 /* GotoAndPlay */;
            case 'gotoandstop':
                return 3 /* GotoAndStop */;
            case 'fadein':
                return 4 /* FadeIn */;
            case 'fadeout':
                return 5 /* FadeOut */;
            default:
                return 4 /* FadeIn */;
        }
    }

    _getTimelineFrameMatrix(
        animation: any,
        timeline: any,
        position: number,
        transform: Transform
    ) {
        var frameIndex = Math.floor(position * animation.frameCount / animation.duration);
        if (timeline.frames.length == 1 || frameIndex >= timeline.frames.length) {
            transform.copyFrom(timeline.frames[0].transform);
        }
        else {
            var frame = timeline.frames[frameIndex];
            var tweenProgress = 0;
            if (frame.tweenEasing != DragonBones.NO_TWEEN) {
                tweenProgress = (position - frame.position) / frame.duration;
                if (frame.tweenEasing != 0) {
                    tweenProgress = TweenTimelineState._getEasingValue(tweenProgress, frame.tweenEasing);
                }
            }
            else if (frame.curve) {
                tweenProgress = (position - frame.position) / frame.duration;
                tweenProgress = TweenTimelineState._getCurveEasingValue(tweenProgress, frame.curve);
            }
            var nextFrame = frame.next;
            transform.x = nextFrame.transform.x - frame.transform.x;
            transform.y = nextFrame.transform.y - frame.transform.y;
            transform.skewX = Transform.normalizeRadian(nextFrame.transform.skewX - frame.transform.skewX);
            transform.skewY = Transform.normalizeRadian(nextFrame.transform.skewY - frame.transform.skewY);
            transform.scaleX = nextFrame.transform.scaleX - frame.transform.scaleX;
            transform.scaleY = nextFrame.transform.scaleY - frame.transform.scaleY;
            transform.x = frame.transform.x + transform.x * tweenProgress;
            transform.y = frame.transform.y + transform.y * tweenProgress;
            transform.skewX = frame.transform.skewX + transform.skewX * tweenProgress;
            transform.skewY = frame.transform.skewY + transform.skewY * tweenProgress;
            transform.scaleX = frame.transform.scaleX + transform.scaleX * tweenProgress;
            transform.scaleY = frame.transform.scaleY + transform.scaleY * tweenProgress;
        }
        transform.add(timeline.originTransform);
    }

    _globalToLocal(armature: any) {
        var keyFrames = [];
        var bones = armature.sortedBones.concat().reverse();
        for (var i = 0, l = bones.length; i < l; ++i) {
            var bone = bones[i];
            if (bone.parent) {
                bone.parent.transform.toMatrix(this._helpMatrix);
                this._helpMatrix.invert();
                this._helpMatrix.transformPoint(bone.transform.x, bone.transform.y, this._helpPoint);
                bone.transform.x = this._helpPoint.x;
                bone.transform.y = this._helpPoint.y;
                bone.transform.rotation -= bone.parent.transform.rotation;
            }
            for (var i_2 in armature.animations) {
                var animation = armature.animations[i_2];
                var timeline = animation.getBoneTimeline(bone.name);
                if (!timeline) {
                    continue;
                }
                var parentTimeline = bone.parent ? animation.getBoneTimeline(bone.parent.name) : null;
                this._helpTransformB.copyFrom(timeline.originTransform);
                keyFrames.length = 0;
                for (var i_3 = 0, l_2 = timeline.frames.length; i_3 < l_2; ++i_3) {
                    var frame = timeline.frames[i_3];
                    if (keyFrames.indexOf(frame) >= 0) {
                        continue;
                    }
                    keyFrames.push(frame);
                    if (parentTimeline) {
                        this._getTimelineFrameMatrix(animation, parentTimeline, frame.position, this._helpTransformA);
                        frame.transform.add(this._helpTransformB);
                        this._helpTransformA.toMatrix(this._helpMatrix);
                        this._helpMatrix.invert();
                        this._helpMatrix.transformPoint(frame.transform.x, frame.transform.y, this._helpPoint);
                        frame.transform.x = this._helpPoint.x;
                        frame.transform.y = this._helpPoint.y;
                        frame.transform.rotation -= this._helpTransformA.rotation;
                    }
                    else {
                        frame.transform.add(this._helpTransformB);
                    }
                    frame.transform.minus(bone.transform);
                    if (i_3 == 0) {
                        timeline.originTransform.copyFrom(frame.transform);
                        frame.transform.identity();
                    }
                    else {
                        frame.transform.minus(timeline.originTransform);
                    }
                }
            }
        }
    }

    _mergeFrameToAnimationTimeline(framePostion: any, actions: any, events: any) {
        var frameStart = Math.floor(framePostion * this._armature.frameRate); // uint()
        var frames = this._animation.frames;
        if (frames.length == 0) {
            var startFrame = BaseObject.borrowObject(AnimationFrameData); // Add start frame.
            startFrame.position = 0;
            if (this._animation.frameCount > 1) {
                frames.length = this._animation.frameCount + 1; // One more count for zero duration frame.
                var endFrame = BaseObject.borrowObject(AnimationFrameData); // Add end frame to keep animation timeline has two different frames atleast.
                endFrame.position = this._animation.frameCount / this._armature.frameRate;
                frames[0] = startFrame;
                frames[this._animation.frameCount] = endFrame;
            }
        }
        var insertedFrame = null;
        var replacedFrame = frames[frameStart];
        if (replacedFrame && (frameStart == 0 || frames[frameStart - 1] == replacedFrame.prev)) {
            insertedFrame = replacedFrame;
        }
        else {
            insertedFrame = BaseObject.borrowObject(AnimationFrameData); // Create frame.
            insertedFrame.position = frameStart / this._armature.frameRate;
            frames[frameStart] = insertedFrame;
            for (var i = frameStart + 1, l = frames.length; i < l; ++i) {
                if (replacedFrame && frames[i] == replacedFrame) {
                    frames[i] = null;
                }
            }
        }
        if (actions) {
            for (var i = 0, l = actions.length; i < l; ++i) {
                insertedFrame.actions.push(actions[i]);
            }
        }
        if (events) {
            for (var i = 0, l = events.length; i < l; ++i) {
                insertedFrame.events.push(events[i]);
            }
        }
        // Modify frame link and duration.
        var prevFrame = null;
        var nextFrame = null;
        for (var i = 0, l = frames.length; i < l; ++i) {
            var currentFrame = frames[i];
            if (currentFrame && nextFrame != currentFrame) {
                nextFrame = currentFrame;
                if (prevFrame) {
                    nextFrame.prev = prevFrame;
                    prevFrame.next = nextFrame;
                    prevFrame.duration = nextFrame.position - prevFrame.position;
                }
                prevFrame = nextFrame;
            }
            else {
                frames[i] = prevFrame;
            }
        }
        nextFrame.duration = this._animation.duration - nextFrame.position;
        nextFrame = frames[0];
        prevFrame.next = nextFrame;
        nextFrame.prev = prevFrame;
    }

    /**
     * @deprecated
     * @see BaseFactory#parseDragonBonesData()
     */
    static parseDragonBonesData(rawData: any) {
        return ObjectDataParser.getInstance().parseDragonBonesData(rawData);
    }

    /**
     * @deprecated
     * @see BaseFactory#parsetTextureAtlasData()
     */
    static parseTextureAtlasData (rawData: any, scale = 1) {
        var textureAtlasData: any = {};
        var subTextureList = rawData[DataParser.SUB_TEXTURE];
        for (var i = 0, len = subTextureList.length; i < len; i++) {
            var subTextureObject = subTextureList[i];
            var subTextureName = subTextureObject[DataParser.NAME];
            var subTextureRegion = new Rectangle();
            var subTextureFrame = null;
            subTextureRegion.x = subTextureObject[DataParser.X] / scale;
            subTextureRegion.y = subTextureObject[DataParser.Y] / scale;
            subTextureRegion.width = subTextureObject[DataParser.WIDTH] / scale;
            subTextureRegion.height = subTextureObject[DataParser.HEIGHT] / scale;
            if (DataParser.FRAME_WIDTH in subTextureObject) {
                subTextureFrame = new Rectangle();
                subTextureFrame.x = subTextureObject[DataParser.FRAME_X] / scale;
                subTextureFrame.y = subTextureObject[DataParser.FRAME_Y] / scale;
                subTextureFrame.width = subTextureObject[DataParser.FRAME_WIDTH] / scale;
                subTextureFrame.height = subTextureObject[DataParser.FRAME_HEIGHT] / scale;
            }
            textureAtlasData[subTextureName] = { region: subTextureRegion, frame: subTextureFrame, rotated: false };
        }
        return textureAtlasData;
    }

}