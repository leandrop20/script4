import { DataParser } from './DataParser';
import { DragonBonesData } from '../model/DragonBonesData';
import { BaseObject } from '../core/BaseObject';
import { ArmatureData } from '../model/ArmatureData';
import { BoneData } from '../model/BoneData';
import { SlotData } from '../model/SlotData';
import { SkinData } from '../model/SkinData';
import { SlotDisplayDataSet } from '../armature/SlotDisplayDataSet';
import { DisplayData } from '../model/DisplayData';
import { AnimationData } from '../model/AnimationData';
import { BoneTimelineData } from '../model/BoneTimelineData';
import { SlotTimelineData } from '../model/SlotTimelineData';
import { AnimationFrameData } from '../model/AnimationFrameData';
import { BoneFrameData } from '../model/BoneFrameData';
import { SlotFrameData } from '../model/SlotFrameData';
import { ActionData } from '../model/ActionData';
import { TextureData } from '../model/TextureData';
import { TweenFrameData } from '../model/TweenFrameData';
import { PhaserDragonBones } from '../PhaserDragonBones';
import { MeshData } from '../model/MeshData';
import { Matrix } from '../geom/Matrix';
import { FFDTimelineData } from '../model/FFDTimelineData';
import { ExtensionFrameData } from '../model/ExtensionFrameData';
import { EventData } from '../model/EventData';
import { Transform } from '../geom/Transform';

export class ObjectDataParser extends DataParser {

    /**
     * @deprecated
     * @see BaseFactory#parseDragonBonesData()
     */
    static getInstance() {
        if (!ObjectDataParser._instance) {
            ObjectDataParser._instance = new ObjectDataParser();
        }
        
        return ObjectDataParser._instance;
    }

    private static _instance: ObjectDataParser;

	constructor() {
		super();
	}

	static _getBoolean(rawData: any, key: any, defaultValue: any): any {
        if (key in rawData) {
            var value = rawData[key];
            var valueType = typeof value;

            if (valueType == "boolean") {
                return value;
            } else if (valueType == "string") {
                switch (value) {
                    case "0":
                    case "NaN":
                    case "":
                    case "false":
                    case "null":
                    case "undefined":
                        return false;
                    default:
                        return true;
                }
            } else {
                return !!value;
            }
        }

        return defaultValue;
    }

    static _getNumber(rawData: any, key: any, defaultValue: any): any {
        if (key in rawData) {
            var value = rawData[key];

            if (value == null || value == "NaN") {
                return defaultValue;
            }

            return +value || 0;
        }

        return defaultValue;
    }

    static _getString(rawData: any, key: any, defaultValue: any): any {
        if (key in rawData) {
            return String(rawData[key]);
        }

        return defaultValue;
    }
    
    static _getParameter(rawData: any, index: number, defaultValue: any): any {
        if (rawData.length > index) {
            return rawData[index];
        }

        return defaultValue;
    }

    _parseArmature(rawData: any, scale: any): any {
        var armature = BaseObject.borrowObject(ArmatureData);
        armature.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
        armature.frameRate = ObjectDataParser._getNumber(
            rawData,
            ObjectDataParser.FRAME_RATE,
            this._data.frameRate
        ) || this._data.frameRate;
        armature.scale = scale;

        if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] == "string") {
            armature.type = ObjectDataParser._getArmatureType(rawData[ObjectDataParser.TYPE]);
        } else {
            armature.type = ObjectDataParser._getNumber(
                rawData,
                ObjectDataParser.TYPE,
                0 /* Armature */
            );
        }

        this._armature = armature;
        this._rawBones.length = 0;

        if (ObjectDataParser.AABB in rawData) {
            var aabbObject = rawData[ObjectDataParser.AABB];
            armature.aabb.x = ObjectDataParser._getNumber(aabbObject, ObjectDataParser.X, 0);
            armature.aabb.y = ObjectDataParser._getNumber(aabbObject, ObjectDataParser.Y, 0);
            armature.aabb.width = ObjectDataParser._getNumber(aabbObject, ObjectDataParser.WIDTH, 0);
            armature.aabb.height = ObjectDataParser._getNumber(aabbObject, ObjectDataParser.HEIGHT, 0);
        }

        if (ObjectDataParser.BONE in rawData) {
            var bones = rawData[ObjectDataParser.BONE];

            for (var i = 0, l = bones.length; i < l; ++i) {
                var boneObject = bones[i];
                var bone = this._parseBone(boneObject);
                armature.addBone(
                    bone,
                    ObjectDataParser._getString(boneObject, ObjectDataParser.PARENT, null)
                );
                this._rawBones.push(bone);
            }
        }

        if (ObjectDataParser.IK in rawData) {
            var iks = rawData[ObjectDataParser.IK];

            for (var i = 0, l = iks.length; i < l; ++i) {
                this._parseIK(iks[i]);
            }
        }

        if (ObjectDataParser.SLOT in rawData) {
            var slots = rawData[ObjectDataParser.SLOT];
            var zOrder = 0;

            for (var i = 0, l = slots.length; i < l; ++i) {
                armature.addSlot(this._parseSlot(slots[i], zOrder++));
            }
        }

        if (ObjectDataParser.SKIN in rawData) {
            var skins = rawData[ObjectDataParser.SKIN];

            for (var i = 0, l = skins.length; i < l; ++i) {
                armature.addSkin(this._parseSkin(skins[i]));
            }
        }

        if (ObjectDataParser.ANIMATION in rawData) {
            var animations = rawData[ObjectDataParser.ANIMATION];

            for (var i = 0, l = animations.length; i < l; ++i) {
                armature.addAnimation(this._parseAnimation(animations[i]));
            }
        }

        if ((ObjectDataParser.ACTIONS in rawData) ||
            (ObjectDataParser.DEFAULT_ACTIONS in rawData)) {
            this._parseActionData(rawData, armature.actions, null, null);
        }

        if (this._isOldData && this._isGlobalTransform) {
            this._globalToLocal(armature);
        }

        this._armature = null;
        this._rawBones.length = 0;

        return armature;
    }

    _parseBone(rawData: any): any {
        var bone = BaseObject.borrowObject(BoneData);
        bone.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
        bone.inheritTranslation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_TRANSLATION, true);
        bone.inheritRotation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_ROTATION, true);
        bone.inheritScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_SCALE, true);
        bone.length = ObjectDataParser._getNumber(rawData, ObjectDataParser.LENGTH, 0) * this._armature.scale;

        if (ObjectDataParser.TRANSFORM in rawData) {
            this._parseTransform(rawData[ObjectDataParser.TRANSFORM], bone.transform);
        }

        if (this._isOldData) {
            bone.inheritScale = false;
        }

        return bone;
    }

    _parseIK(rawData: any) {
        var bone = this._armature.getBone(
            ObjectDataParser._getString(rawData, (ObjectDataParser.BONE in rawData)
                ? ObjectDataParser.BONE
                : ObjectDataParser.NAME, null
            )
        );

        if (bone) {
            bone.ik = this._armature.getBone(
                ObjectDataParser._getString(rawData, ObjectDataParser.TARGET, null)
            );
            bone.bendPositive = ObjectDataParser._getBoolean(rawData, ObjectDataParser.BEND_POSITIVE, true);
            bone.chain = ObjectDataParser._getNumber(rawData, ObjectDataParser.CHAIN, 0);
            bone.weight = ObjectDataParser._getNumber(rawData, ObjectDataParser.WEIGHT, 1);

            if (bone.chain > 0 && bone.parent && !bone.parent.ik) {
                bone.parent.ik = bone.ik;
                bone.parent.chainIndex = 0;
                bone.parent.chain = 0;
                bone.chainIndex = 1;
            } else {
                bone.chain = 0;
                bone.chainIndex = 0;
            }
        }
    }
 
    _parseSlot(rawData: any, zOrder: any): any {
        var slot = BaseObject.borrowObject(SlotData);
        slot.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
        slot.parent = this._armature.getBone(
            ObjectDataParser._getString(rawData, ObjectDataParser.PARENT, null)
        );
        slot.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
        slot.zOrder = ObjectDataParser._getNumber(rawData, ObjectDataParser.Z_ORDER, zOrder); // TODO zOrder.

        if ((ObjectDataParser.COLOR in rawData) || (ObjectDataParser.COLOR_TRANSFORM in rawData)) {
            slot.color = SlotData.generateColor();
            this._parseColorTransform(
                rawData[ObjectDataParser.COLOR] || rawData[ObjectDataParser.COLOR_TRANSFORM],
                slot.color
            );
        } else {
            slot.color = SlotData.DEFAULT_COLOR;
        }

        if (
            ObjectDataParser.BLEND_MODE in rawData &&
            typeof rawData[ObjectDataParser.BLEND_MODE] == "string"
        ) {
            slot.blendMode = ObjectDataParser._getBlendMode(rawData[ObjectDataParser.BLEND_MODE]);
        } else {
            slot.blendMode = ObjectDataParser._getNumber(
                rawData,
                ObjectDataParser.BLEND_MODE,
                0 /* Normal */
            );
        }

        if ((ObjectDataParser.ACTIONS in rawData) || (ObjectDataParser.DEFAULT_ACTIONS in rawData)) {
            this._parseActionData(rawData, slot.actions, null, null);
        }

        if (this._isOldData) {
            if (ObjectDataParser.COLOR_TRANSFORM in rawData) {
                slot.color = SlotData.generateColor();
                this._parseColorTransform(rawData[ObjectDataParser.COLOR_TRANSFORM], slot.color);
            } else {
                slot.color = SlotData.DEFAULT_COLOR;
            }
        }

        return slot;
    }
 
    _parseSkin(rawData: any): any {
        var skin = BaseObject.borrowObject(SkinData);
        skin.name = ObjectDataParser._getString(
            rawData,
            ObjectDataParser.NAME,
            "__default"
        ) || "__default";

        if (ObjectDataParser.SLOT in rawData) {
            this._skin = skin;
            var slots = rawData[ObjectDataParser.SLOT];
            var zOrder = 0;

            for (var i = 0, l = slots.length; i < l; ++i) {
                if (this._isOldData) {
                    this._armature.addSlot(this._parseSlot(slots[i], zOrder++));
                }

                skin.addSlot(this._parseSlotDisplaySet(slots[i]));
            }

            this._skin = null;
        }

        return skin;
    }
 
    _parseSlotDisplaySet(rawData: any): any {
        var slotDisplayDataSet = BaseObject.borrowObject(SlotDisplayDataSet);
        slotDisplayDataSet.slot = this._armature.getSlot(
            ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null)
        );

        if (ObjectDataParser.DISPLAY in rawData) {
            var displayObjectSet = rawData[ObjectDataParser.DISPLAY];
            var displayDataSet = slotDisplayDataSet.displays;
            this._slotDisplayDataSet = slotDisplayDataSet;

            for (var i = 0, l = displayObjectSet.length; i < l; ++i) {
                displayDataSet.push(this._parseDisplay(displayObjectSet[i]));
            }

            this._slotDisplayDataSet = null;
        }

        return slotDisplayDataSet;
    }
 
    _parseDisplay(rawData: any): any {
        var display = BaseObject.borrowObject(DisplayData);
        display.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);

        if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] == "string") {
            display.type = ObjectDataParser._getDisplayType(rawData[ObjectDataParser.TYPE]);
        } else {
            display.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, 0 /* Image */);
        }

        display.isRelativePivot = true;

        if (ObjectDataParser.PIVOT in rawData) {
            var pivotObject = rawData[ObjectDataParser.PIVOT];
            display.pivot.x = ObjectDataParser._getNumber(pivotObject, ObjectDataParser.X, 0);
            display.pivot.y = ObjectDataParser._getNumber(pivotObject, ObjectDataParser.Y, 0);
        } else if (this._isOldData) {
            var transformObject = rawData[ObjectDataParser.TRANSFORM];
            display.isRelativePivot = false;
            display.pivot.x = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_X, 0) * this._armature.scale;
            display.pivot.y = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_Y, 0) * this._armature.scale;
        } else {
            display.pivot.x = 0.5;
            display.pivot.y = 0.5;
        }

        if (ObjectDataParser.TRANSFORM in rawData) {
            this._parseTransform(rawData[ObjectDataParser.TRANSFORM], display.transform);
        }
        
        switch (display.type) {
            case 0 /* Image */:
                break;
            case 1 /* Armature */:
                break;
            case 2 /* Mesh */:
                display.mesh = this._parseMesh(rawData);
                break;
        }

        return display;
    }
 
    _parseMesh(rawData: any): any {
        var mesh = BaseObject.borrowObject(MeshData);
        var rawVertices = rawData[ObjectDataParser.VERTICES];
        var rawUVs = rawData[ObjectDataParser.UVS];
        var rawTriangles = rawData[ObjectDataParser.TRIANGLES];
        var numVertices = Math.floor(rawVertices.length / 2); // uint
        var numTriangles = Math.floor(rawTriangles.length / 3); // uint
        var inverseBindPose = new Array(this._armature.sortedBones.length);
        mesh.skinned = (ObjectDataParser.WEIGHTS in rawData) && rawData[ObjectDataParser.WEIGHTS].length > 0;
        mesh.uvs.length = numVertices * 2;
        mesh.vertices.length = numVertices * 2;
        mesh.vertexIndices.length = numTriangles * 3;

        if (mesh.skinned) {
            mesh.boneIndices.length = numVertices;
            mesh.weights.length = numVertices;
            mesh.boneVertices.length = numVertices;

            if (ObjectDataParser.SLOT_POSE in rawData) {
                var rawSlotPose = rawData[ObjectDataParser.SLOT_POSE];
                mesh.slotPose.a = rawSlotPose[0];
                mesh.slotPose.b = rawSlotPose[1];
                mesh.slotPose.c = rawSlotPose[2];
                mesh.slotPose.d = rawSlotPose[3];
                mesh.slotPose.tx = rawSlotPose[4];
                mesh.slotPose.ty = rawSlotPose[5];
            }

            if (ObjectDataParser.BONE_POSE in rawData) {
                var rawBonePose = rawData[ObjectDataParser.BONE_POSE];

                for (var i = 0, l = rawBonePose.length; i < l; i += 7) {
                    var rawBoneIndex = rawBonePose[i]; // uint
                    var boneMatrix = inverseBindPose[rawBoneIndex] = new Matrix();
                    boneMatrix.a = rawBonePose[i + 1];
                    boneMatrix.b = rawBonePose[i + 2];
                    boneMatrix.c = rawBonePose[i + 3];
                    boneMatrix.d = rawBonePose[i + 4];
                    boneMatrix.tx = rawBonePose[i + 5];
                    boneMatrix.ty = rawBonePose[i + 6];
                    boneMatrix.invert();
                }
            }
        }

        for (var i = 0, iW = 0, l = rawVertices.length; i < l; i += 2) {
            var iN = i + 1;
            var vertexIndex = i / 2;
            var x = mesh.vertices[i] = rawVertices[i] * this._armature.scale;
            var y = mesh.vertices[iN] = rawVertices[iN] * this._armature.scale;
            mesh.uvs[i] = rawUVs[i];
            mesh.uvs[iN] = rawUVs[iN];

            if (mesh.skinned) {
                var rawWeights = rawData[ObjectDataParser.WEIGHTS];
                var numBones = rawWeights[iW]; // uint
                var indices = mesh.boneIndices[vertexIndex] = new Array(numBones);
                var weights = mesh.weights[vertexIndex] = new Array(numBones);
                var boneVertices = mesh.boneVertices[vertexIndex] = new Array(numBones * 2);
                mesh.slotPose.transformPoint(x, y, this._helpPoint);
                x = mesh.vertices[i] = this._helpPoint.x;
                y = mesh.vertices[iN] = this._helpPoint.y;

                for (var iB = 0; iB < numBones; ++iB) {
                    var iI = iW + 1 + iB * 2;
                    var rawBoneIndex = rawWeights[iI]; // uint
                    var boneData = this._rawBones[rawBoneIndex];
                    var boneIndex = mesh.bones.indexOf(boneData);

                    if (boneIndex < 0) {
                        boneIndex = mesh.bones.length;
                        mesh.bones[boneIndex] = boneData;
                        mesh.inverseBindPose[boneIndex] = inverseBindPose[rawBoneIndex];
                    }

                    mesh.inverseBindPose[boneIndex].transformPoint(x, y, this._helpPoint);
                    indices[iB] = boneIndex;
                    weights[iB] = rawWeights[iI + 1];
                    boneVertices[iB * 2] = this._helpPoint.x;
                    boneVertices[iB * 2 + 1] = this._helpPoint.y;
                }

                iW += numBones * 2 + 1;
            }
        }

        for (var i = 0, l = rawTriangles.length; i < l; ++i) {
            mesh.vertexIndices[i] = rawTriangles[i];
        }

        return mesh;
    }
 
    _parseAnimation(rawData: any): any {
        var animation = BaseObject.borrowObject(AnimationData);
        animation.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "__default") || "__default";
        animation.frameCount = Math.max(ObjectDataParser._getNumber(rawData, ObjectDataParser.DURATION, 1), 1);
        animation.position = ObjectDataParser._getNumber(rawData, ObjectDataParser.POSITION, 0) / this._armature.frameRate;
        animation.duration = animation.frameCount / this._armature.frameRate;
        animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.PLAY_TIMES, 1);
        animation.fadeInTime = ObjectDataParser._getNumber(rawData, ObjectDataParser.FADE_IN_TIME, 0);
        this._animation = animation;
        var animationName = ObjectDataParser._getString(rawData, ObjectDataParser.ANIMATION, null);

        if (animationName) {
            animation.animation = this._armature.getAnimation(animationName);

            if (!animation.animation) {}

            return animation;
        }

        this._parseTimeline(rawData, animation, this._parseAnimationFrame);

        if (ObjectDataParser.BONE in rawData) {
            var boneTimelines = rawData[ObjectDataParser.BONE];

            for (var i = 0, l = boneTimelines.length; i < l; ++i) {
                animation.addBoneTimeline(this._parseBoneTimeline(boneTimelines[i]));
            }
        }

        if (ObjectDataParser.SLOT in rawData) {
            var slotTimelines = rawData[ObjectDataParser.SLOT];

            for (var i = 0, l = slotTimelines.length; i < l; ++i) {
                animation.addSlotTimeline(this._parseSlotTimeline(slotTimelines[i]));
            }
        }

        if (ObjectDataParser.FFD in rawData) {
            var ffdTimelines = rawData[ObjectDataParser.FFD];

            for (var i = 0, l = ffdTimelines.length; i < l; ++i) {
                animation.addFFDTimeline(this._parseFFDTimeline(ffdTimelines[i]));
            }
        }

        if (this._isOldData) {
            this._isAutoTween = ObjectDataParser._getBoolean(rawData, ObjectDataParser.AUTO_TWEEN, true);
            this._animationTweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, 0) || 0;
            animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.LOOP, 1);

            if (ObjectDataParser.TIMELINE in rawData) {
                var timelines = rawData[ObjectDataParser.TIMELINE];

                for (var i = 0, l = timelines.length; i < l; ++i) {
                    animation.addBoneTimeline(this._parseBoneTimeline(timelines[i]));
                }

                for (var i = 0, l = timelines.length; i < l; ++i) {
                    animation.addSlotTimeline(this._parseSlotTimeline(timelines[i]));
                }
            }
        } else {
            this._isAutoTween = false;
            this._animationTweenEasing = 0;
        }

        for (let i in this._armature.bones) {
            var bone = this._armature.bones[i];

            if (!animation.getBoneTimeline(bone.name)) {
                var boneTimeline = BaseObject.borrowObject(BoneTimelineData);
                var boneFrame = BaseObject.borrowObject(BoneFrameData);
                boneTimeline.bone = bone;
                boneTimeline.frames[0] = boneFrame;
                animation.addBoneTimeline(boneTimeline);
            }
        }

        for (let i in this._armature.slots) {
            var slot = this._armature.slots[i];

            if (!animation.getSlotTimeline(slot.name)) {
                var slotTimeline = BaseObject.borrowObject(SlotTimelineData);
                var slotFrame = BaseObject.borrowObject(SlotFrameData);
                slotTimeline.slot = slot;
                slotFrame.displayIndex = slot.displayIndex;

                //slotFrame.zOrder = -2; // TODO zOrder.
                if (slot.color == SlotData.DEFAULT_COLOR) {
                    slotFrame.color = SlotFrameData.DEFAULT_COLOR;
                } else {
                    slotFrame.color = SlotFrameData.generateColor();
                    slotFrame.color.copyFrom(slot.color);
                }

                slotTimeline.frames[0] = slotFrame;
                animation.addSlotTimeline(slotTimeline);

                if (this._isOldData) {
                    slotFrame.displayIndex = -1;
                }
            }
        }

        this._animation = null;

        return animation;
    }
 
    _parseBoneTimeline(rawData: any): any {
        var timeline = BaseObject.borrowObject(BoneTimelineData);
        timeline.bone = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));
        this._parseTimeline(rawData, timeline, this._parseBoneFrame);
        var originTransform = timeline.originTransform;
        var prevFrame = null;

        for (var i = 0, l = timeline.frames.length; i < l; ++i) {
            var frame = timeline.frames[i];

            if (!prevFrame) {
                originTransform.copyFrom(frame.transform);
                frame.transform.identity();

                if (originTransform.scaleX == 0) {
                    originTransform.scaleX = 0.001;
                }

                if (originTransform.scaleY == 0) {
                    originTransform.scaleY = 0.001;
                }
            } else if (prevFrame != frame) {
                frame.transform.minus(originTransform);
            }

            prevFrame = frame;
        }

        if (timeline.scale != 1 || timeline.offset != 0) {
            this._animation.hasAsynchronyTimeline = true;
        }

        if (
            this._isOldData &&
            ((ObjectDataParser.PIVOT_X in rawData) || (ObjectDataParser.PIVOT_Y in rawData))
        ) {
            this._timelinePivot.x = ObjectDataParser._getNumber(rawData, ObjectDataParser.PIVOT_X, 0);
            this._timelinePivot.y = ObjectDataParser._getNumber(rawData, ObjectDataParser.PIVOT_Y, 0);
        } else {
            this._timelinePivot.clear();
        }

        return timeline;
    }

    _parseSlotTimeline(rawData: any): any {
        var timeline = BaseObject.borrowObject(SlotTimelineData);
        timeline.slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));
        this._parseTimeline(rawData, timeline, this._parseSlotFrame);

        if (timeline.scale != 1 || timeline.offset != 0) {
            this._animation.hasAsynchronyTimeline = true;
        }

        return timeline;
    };
 
    _parseFFDTimeline(rawData: any): any {
        var timeline = BaseObject.borrowObject(FFDTimelineData);
        timeline.skin = this._armature.getSkin(ObjectDataParser._getString(rawData, ObjectDataParser.SKIN, null));
        timeline.slot = timeline.skin.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.SLOT, null)); // NAME;
        var meshName = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);

        for (var i = 0, l = timeline.slot.displays.length; i < l; ++i) {
            var displayData = timeline.slot.displays[i];

            if (displayData.mesh && displayData.name == meshName) {
                timeline.displayIndex = i; // rawData[DISPLAY_INDEX];
                this._mesh = displayData.mesh; // Find the ffd's mesh.
                break;
            }
        }

        this._parseTimeline(rawData, timeline, this._parseFFDFrame);
        this._mesh = null;

        return timeline;
    }
    
    _parseAnimationFrame(rawData: any, frameStart: any, frameCount: any): any {
        var frame = BaseObject.borrowObject(AnimationFrameData);
        this._parseFrame(rawData, frame, frameStart, frameCount);

        if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
            this._parseActionData(rawData, frame.actions, null, null);
        }

        if ((ObjectDataParser.EVENT in rawData) || (ObjectDataParser.SOUND in rawData)) {
            this._parseEventData(rawData, frame.events, null, null);
        }

        return frame;
    }
 
    _parseBoneFrame(rawData: any, frameStart: any, frameCount: any): any {
        var frame = BaseObject.borrowObject(BoneFrameData);
        frame.tweenRotate = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_ROTATE, 0);
        frame.tweenScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.TWEEN_SCALE, true);
        this._parseTweenFrame(rawData, frame, frameStart, frameCount);

        if (ObjectDataParser.TRANSFORM in rawData) {
            var transformObject = rawData[ObjectDataParser.TRANSFORM];
            this._parseTransform(transformObject, frame.transform);

            if (this._isOldData) {
                this._helpPoint.x = this._timelinePivot.x + ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_X, 0);
                this._helpPoint.y = this._timelinePivot.y + ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_Y, 0);
                frame.transform.toMatrix(this._helpMatrix);
                this._helpMatrix.transformPoint(this._helpPoint.x, this._helpPoint.y, this._helpPoint, true);
                frame.transform.x += this._helpPoint.x;
                frame.transform.y += this._helpPoint.y;
            }
        }

        var bone = this._timeline.bone;
        var actions: any[] = [];
        var events: any[] = [];

        if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
            var slot = this._armature.getSlot(bone.name);
            this._parseActionData(rawData, actions, bone, slot);
        }

        if ((ObjectDataParser.EVENT in rawData) || (ObjectDataParser.SOUND in rawData)) {
            this._parseEventData(rawData, events, bone, null);
        }

        if (actions.length > 0 || events.length > 0) {
            this._mergeFrameToAnimationTimeline(frame.position, actions, events); // Merge actions and events to animation timeline.
        }

        return frame;
    }
    
    _parseSlotFrame(rawData: any, frameStart: any, frameCount: any): any {
        var frame = BaseObject.borrowObject(SlotFrameData);
        frame.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
        //frame.zOrder = _getNumber(rawData, Z_ORDER, -1); // TODO zorder
        this._parseTweenFrame(rawData, frame, frameStart, frameCount);

        if ((ObjectDataParser.COLOR in rawData) || (ObjectDataParser.COLOR_TRANSFORM in rawData)) {
            frame.color = SlotFrameData.generateColor();
            this._parseColorTransform(
                rawData[ObjectDataParser.COLOR] || rawData[ObjectDataParser.COLOR_TRANSFORM],
                frame.color
            );
        } else {
            frame.color = SlotFrameData.DEFAULT_COLOR;
        }

        if (this._isOldData) {
            if (ObjectDataParser._getBoolean(rawData, ObjectDataParser.HIDE, false)) {
                frame.displayIndex = -1;
            }
        } else if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
            var slot = this._timeline.slot;
            var actions: any[] = [];
            this._parseActionData(rawData, actions, slot.parent, slot);
            this._mergeFrameToAnimationTimeline(frame.position, actions, null); // Merge actions and events to animation timeline.
        }

        return frame;
    }
    
    _parseFFDFrame(rawData: any, frameStart: any, frameCount: any): any {
        var frame = BaseObject.borrowObject(ExtensionFrameData);
        frame.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, 0 /* FFD */);
        this._parseTweenFrame(rawData, frame, frameStart, frameCount);
        var rawVertices = rawData[ObjectDataParser.VERTICES];
        var offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0); // uint
        var x = 0;
        var y = 0;

        for (var i = 0, l = this._mesh.vertices.length; i < l; i += 2) {
            if (!rawVertices || i < offset || i - offset >= rawVertices.length) {
                x = 0;
                y = 0;
            } else {
                x = rawVertices[i - offset] * this._armature.scale;
                y = rawVertices[i + 1 - offset] * this._armature.scale;
            }

            if (this._mesh.skinned) {
                this._mesh.slotPose.transformPoint(x, y, this._helpPoint, true);
                x = this._helpPoint.x;
                y = this._helpPoint.y;
                var boneIndices = this._mesh.boneIndices[i / 2];

                for (var iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                    var boneIndex = boneIndices[iB];
                    this._mesh.inverseBindPose[boneIndex].transformPoint(x, y, this._helpPoint, true);
                    frame.tweens.push(this._helpPoint.x, this._helpPoint.y);
                }
            } else {
                frame.tweens.push(x, y);
            }
        }

        return frame;
    }
    
    _parseTweenFrame(rawData: any, frame: any, frameStart: any, frameCount: any) {
        this._parseFrame(rawData, frame, frameStart, frameCount);

        if (frame.duration > 0) {
            if (ObjectDataParser.TWEEN_EASING in rawData) {
                frame.tweenEasing = ObjectDataParser._getNumber(
                    rawData,
                    ObjectDataParser.TWEEN_EASING,
                    PhaserDragonBones.NO_TWEEN
                );
            } else if (this._isOldData) {
                frame.tweenEasing = this._isAutoTween
                    ? this._animationTweenEasing
                    : PhaserDragonBones.NO_TWEEN;
            } else {
                frame.tweenEasing = PhaserDragonBones.NO_TWEEN;
            }

            if (
                this._isOldData &&
                this._animation.scale == 1 &&
                this._timeline.scale == 1 &&
                frame.duration * this._armature.frameRate < 2
            ) {
                frame.tweenEasing = PhaserDragonBones.NO_TWEEN;
            }

            if (ObjectDataParser.CURVE in rawData) {
                frame.curve = TweenFrameData.samplingCurve(
                    rawData[ObjectDataParser.CURVE],
                    frameCount
                );
            }
        } else {
            frame.tweenEasing = PhaserDragonBones.NO_TWEEN;
            frame.curve = null;
        }
    }
    
    _parseFrame(rawData: any, frame: any, frameStart: number, frameCount: number) {
        frame.position = frameStart / this._armature.frameRate;
        frame.duration = frameCount / this._armature.frameRate;
    }
    
    _parseTimeline(rawData: any, timeline: any, frameParser: any) {
        timeline.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, 1);
        timeline.offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0);
        this._timeline = timeline;

        if (ObjectDataParser.FRAME in rawData) {
            var rawFrames = rawData[ObjectDataParser.FRAME];

            if (rawFrames.length > 0) {
                if (rawFrames.length == 1) {
                    timeline.frames.length = 1;
                    timeline.frames[0] = frameParser.call(
                        this,
                        rawFrames[0],
                        0,
                        ObjectDataParser._getNumber(rawFrames[0], ObjectDataParser.DURATION, 1)
                    );
                } else {
                    timeline.frames.length = this._animation.frameCount + 1;
                    var frameStart = 0;
                    var frameCount = 0;
                    var frame = null;
                    var prevFrame = null;

                    for (var i = 0, iW = 0, l = timeline.frames.length; i < l; ++i) {
                        if (frameStart + frameCount <= i && iW < rawFrames.length) {
                            var frameObject = rawFrames[iW++];
                            frameStart = i;
                            frameCount = ObjectDataParser._getNumber(frameObject, ObjectDataParser.DURATION, 1);
                            frame = frameParser.call(this, frameObject, frameStart, frameCount);

                            if (prevFrame) {
                                prevFrame.next = frame;
                                frame.prev = prevFrame;

                                if (this._isOldData) {
                                    if (
                                        prevFrame instanceof TweenFrameData &&
                                        frameObject[ObjectDataParser.DISPLAY_INDEX] == -1
                                    ) {
                                        prevFrame.tweenEasing = PhaserDragonBones.NO_TWEEN;
                                    }
                                }
                            }
                            prevFrame = frame;
                        }
                        timeline.frames[i] = frame;
                    }
                    frame.duration = this._animation.duration - frame.position; // Modify last frame duration.
                    frame = timeline.frames[0];
                    prevFrame.next = frame;
                    frame.prev = prevFrame;
                    
                    if (this._isOldData) {
                        if (prevFrame instanceof TweenFrameData && rawFrames[0][ObjectDataParser.DISPLAY_INDEX] == -1) {
                            prevFrame.tweenEasing = PhaserDragonBones.NO_TWEEN;
                        }
                    }
                }
            }
        }

        this._timeline = null;
    }
    
    _parseActionData(rawData: any, actions: any, bone: any, slot: any) {
        var actionsObject = rawData[ObjectDataParser.ACTION] ||
            rawData[ObjectDataParser.ACTIONS] ||
            rawData[ObjectDataParser.DEFAULT_ACTIONS];

        if (typeof actionsObject == "string") {
            var actionData = BaseObject.borrowObject(ActionData);
            actionData.type = 4 /* FadeIn */;
            actionData.bone = bone;
            actionData.slot = slot;
            actionData.data[0] = actionsObject;
            actionData.data[1] = -1;
            actionData.data[2] = -1;
            actions.push(actionData);
        } else if (actionsObject instanceof Array) {
            for (var i = 0, l = actionsObject.length; i < l; ++i) {
                var actionObject = actionsObject[i];
                var isArray = actionObject instanceof Array;
                var actionData = BaseObject.borrowObject(ActionData);
                var animationName = isArray
                    ? ObjectDataParser._getParameter(actionObject, 1, null)
                    : ObjectDataParser._getString(actionObject, "gotoAndPlay", null);

                if (isArray) {
                    var actionType = actionObject[0];

                    if (typeof actionType == "string") {
                        actionData.type = ObjectDataParser._getActionType(actionType);
                    } else {
                        actionData.type = ObjectDataParser._getParameter(actionObject, 0, 4 /* FadeIn */);
                    }
                } else {
                    actionData.type = 2 /* GotoAndPlay */;
                }

                switch (actionData.type) {
                    case 0 /* Play */:
                        actionData.data[0] = animationName;
                        actionData.data[1] = isArray ? ObjectDataParser._getParameter(actionObject, 2, -1) : -1; // playTimes
                        break;
                    case 1 /* Stop */:
                        actionData.data[0] = animationName;
                        break;
                    case 2 /* GotoAndPlay */:
                        actionData.data[0] = animationName;
                        actionData.data[1] = isArray ? ObjectDataParser._getParameter(actionObject, 2, 0) : 0; // time
                        actionData.data[2] = isArray ? ObjectDataParser._getParameter(actionObject, 3, -1) : -1; // playTimes
                        break;
                    case 3 /* GotoAndStop */:
                        actionData.data[0] = animationName;
                        actionData.data[1] = isArray ? ObjectDataParser._getParameter(actionObject, 2, 0) : 0; // time
                        break;
                    case 4 /* FadeIn */:
                        actionData.data[0] = animationName;
                        actionData.data[1] = isArray ? ObjectDataParser._getParameter(actionObject, 2, -1) : -1; // fadeInTime
                        actionData.data[2] = isArray ? ObjectDataParser._getParameter(actionObject, 3, -1) : -1; // playTimes
                        break;
                    case 5 /* FadeOut */:
                        actionData.data[0] = animationName;
                        actionData.data[1] = isArray ? ObjectDataParser._getParameter(actionObject, 2, 0) : 0; // fadeOutTime
                        break;
                }

                actionData.bone = bone;
                actionData.slot = slot;
                actions.push(actionData);
            }
        }
    }
    
    _parseEventData(rawData: any, events: any, bone: any, slot: any) {
        if (ObjectDataParser.SOUND in rawData) {
            var soundEventData = BaseObject.borrowObject(EventData);
            soundEventData.type = 11 /* Sound */;
            soundEventData.name = rawData[ObjectDataParser.SOUND];
            soundEventData.bone = bone;
            soundEventData.slot = slot;
            events.push(soundEventData);
        }

        if (ObjectDataParser.EVENT in rawData) {
            var eventData = BaseObject.borrowObject(EventData);
            eventData.type = 10 /* Frame */;
            eventData.name = rawData[ObjectDataParser.EVENT];
            eventData.bone = bone;
            eventData.slot = slot;

            if (ObjectDataParser.DATA in rawData) {
                eventData.data = rawData[ObjectDataParser.DATA];
            }

            events.push(eventData);
        }
    }

    _parseTransform(rawData: any, transform: Transform) {
        transform.x = ObjectDataParser._getNumber(rawData, ObjectDataParser.X, 0) * this._armature.scale;
        transform.y = ObjectDataParser._getNumber(rawData, ObjectDataParser.Y, 0) * this._armature.scale;
        transform.skewX = ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_X, 0) * PhaserDragonBones.ANGLE_TO_RADIAN;
        transform.skewY = ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_Y, 0) * PhaserDragonBones.ANGLE_TO_RADIAN;
        transform.scaleX = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_X, 1);
        transform.scaleY = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_Y, 1);
    }

    _parseColorTransform(rawData: any, color: any) {
        color.alphaMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.ALPHA_MULTIPLIER, 100) * 0.01;
        color.redMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.RED_MULTIPLIER, 100) * 0.01;
        color.greenMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.GREEN_MULTIPLIER, 100) * 0.01;
        color.blueMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLUE_MULTIPLIER, 100) * 0.01;
        color.alphaOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.ALPHA_OFFSET, 0);
        color.redOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.RED_OFFSET, 0);
        color.greenOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.GREEN_OFFSET, 0);
        color.blueOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLUE_OFFSET, 0);
    }
    
    parseDragonBonesData(rawData: any, scale: number = 1): any {
        if (rawData) {
            var version = ObjectDataParser._getString(rawData, ObjectDataParser.VERSION, null);
            this._isOldData = version == ObjectDataParser.DATA_VERSION_2_3 || version == ObjectDataParser.DATA_VERSION_3_0;

            if (this._isOldData) {
                this._isGlobalTransform = ObjectDataParser._getBoolean(rawData, ObjectDataParser.IS_GLOBAL, true);
            } else {
                this._isGlobalTransform = false;
            }
            
            if (version == ObjectDataParser.DATA_VERSION ||
                version == ObjectDataParser.DATA_VERSION_4_0 ||
                this._isOldData) {
                var data = BaseObject.borrowObject(DragonBonesData);
                data.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
                data.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, 24) || 24;

                if (ObjectDataParser.ARMATURE in rawData) {
                    this._data = data;
                    var armatures = rawData[ObjectDataParser.ARMATURE];

                    for (var i = 0, l = armatures.length; i < l; ++i) {
                        data.addArmature(this._parseArmature(armatures[i], scale));
                    }

                    this._data = null;
                }

                return data;
            } else {
                throw new Error("Nonsupport data version.");
            }
        } else {
            throw new Error("No data.");
        }
        // return null;
    }
    
    parseTextureAtlasData(rawData: any, textureAtlasData: any, scale: number = 0) {
        if (rawData) {
            textureAtlasData.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            textureAtlasData.imagePath = ObjectDataParser._getString(rawData, ObjectDataParser.IMAGE_PATH, null);
            // Texture format.
            if (scale > 0) {
                textureAtlasData.scale = scale;
            } else {
                scale = textureAtlasData.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, textureAtlasData.scale);
            }

            scale = 1 / scale;

            if (ObjectDataParser.SUB_TEXTURE in rawData) {
                var textures = rawData[ObjectDataParser.SUB_TEXTURE];

                for (var i = 0, l = textures.length; i < l; ++i) {
                    var textureObject = textures[i];
                    var textureData = textureAtlasData.generateTextureData();
                    textureData.name = ObjectDataParser._getString(textureObject, ObjectDataParser.NAME, null);
                    textureData.rotated = ObjectDataParser._getBoolean(textureObject, ObjectDataParser.ROTATED, false);
                    textureData.region.x = ObjectDataParser._getNumber(textureObject, ObjectDataParser.X, 0) * scale;
                    textureData.region.y = ObjectDataParser._getNumber(textureObject, ObjectDataParser.Y, 0) * scale;
                    textureData.region.width = ObjectDataParser._getNumber(textureObject, ObjectDataParser.WIDTH, 0) * scale;
                    textureData.region.height = ObjectDataParser._getNumber(textureObject, ObjectDataParser.HEIGHT, 0) * scale;
                    var frameWidth = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_WIDTH, -1);
                    var frameHeight = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_HEIGHT, -1);

                    if (frameWidth > 0 && frameHeight > 0) {
                        textureData.frame = TextureData.generateRectangle();
                        textureData.frame.x = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_X, 0) * scale;
                        textureData.frame.y = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_Y, 0) * scale;
                        textureData.frame.width = frameWidth * scale;
                        textureData.frame.height = frameHeight * scale;
                    }
                    
                    textureAtlasData.addTexture(textureData);
                }
            }
        } else {
            throw new Error("No data.");
        }
    }

}