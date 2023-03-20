import { BaseObject } from '../core/BaseObject';
import { DragonBones } from '../DragonBones';
import { EventObject } from '../event/EventObject';

export class Armature extends BaseObject {

    _bones: any[];
    _slots: any[];
    _actions: any[];
    _events: any[];

    enableCache: boolean;

    userData: any;
    _bonesDirty!: boolean;
    _cacheFrameIndex!: number;
    _armatureData: any;
    _skinData: any;

    _animation: any;
    _display: any;

    _parent: any;
    _replacedTexture: any;
    _eventManager: any;
    _delayDispose!: boolean;
    _lockDispose!: boolean;
    _slotsDirty!: boolean;

	constructor() {
		super();

		 this._bones = [];
        
        /**
         * @private Store slots based on slots' zOrder (From low to high)
         */
        this._slots = [];
        this._actions = [];
        
        this._events = [];

        /**
         * @deprecated
         * @see #cacheFrameRate
         */
        this.enableCache = false;
	}

	static override toString(): string {
        return "[class Armature]";
    }

    override _onClear() {
        for (var i = 0, l = this._bones.length; i < l; ++i) {
            this._bones[i].returnToPool();
        }

        for (var i = 0, l = this._slots.length; i < l; ++i) {
            this._slots[i].returnToPool();
        }

        for (var i = 0, l = this._events.length; i < l; ++i) {
            this._events[i].returnToPool();
        }

        this.userData = null;
        this._bonesDirty = false;
        this._cacheFrameIndex = -1;
        this._armatureData = null;
        this._skinData = null;

        if (this._animation) {
            this._animation.returnToPool();
            this._animation = null;
        }

        if (this._display) {
            this._display._onClear();
            this._display = null;
        }

        this._parent = null;
        this._replacedTexture = null;
        this._eventManager = null;
        this._delayDispose = false;
        this._lockDispose = false;
        this._slotsDirty = false;
        this._bones.length = 0;
        this._slots.length = 0;
        this._actions.length = 0;
        this._events.length = 0;
    }

    _sortBones() {
        var total = this._bones.length;

        if (total <= 0) return;
        
        var sortHelper = this._bones.concat();
        var index = 0;
        var count = 0;
        this._bones.length = 0;

        while (count < total) {
            var bone = sortHelper[index++];

            if (index >= total) {
                index = 0;
            }

            if (this._bones.indexOf(bone) >= 0) continue;

            if (bone.parent && this._bones.indexOf(bone.parent) < 0) continue;

            if (bone.ik && this._bones.indexOf(bone.ik) < 0) continue;

            if (bone.ik && bone.ikChain > 0 && bone.ikChainIndex == bone.ikChain) {
                // ik, parent, bone, children
                this._bones.splice(this._bones.indexOf(bone.parent) + 1, 0, bone);
            } else {
                this._bones.push(bone);
            }

            count++;
        }
    }

    _sortSlots() {
    }

    _doAction(value: any) {
        switch (value.type) {
            case 0 /* Play */:
                this._animation.play(value.data[0], value.data[1]);
                break;
            case 1 /* Stop */:
                this._animation.stop(value.data[0]);
                break;
            case 2 /* GotoAndPlay */:
                this._animation.gotoAndPlayByTime(value.data[0], value.data[1], value.data[2]);
                break;
            case 3 /* GotoAndStop */:
                this._animation.gotoAndStopByTime(value.data[0], value.data[1]);
                break;
            case 4 /* FadeIn */:
                this._animation.fadeIn(value.data[0], value.data[1], value.data[2]);
                break;
            case 5 /* FadeOut */:
                // TODO fade out
                break;
            default:
                break;
        }
    }

    _addBoneToBoneList(value: any) {
        if (this._bones.indexOf(value) < 0) {
            this._bonesDirty = true;
            this._bones.push(value);
            this._animation._timelineStateDirty = true;
        }
    }

	_removeBoneFromBoneList(value: any) {
        var index = this._bones.indexOf(value);

        if (index >= 0) {
            this._bones.splice(index, 1);
            this._animation._timelineStateDirty = true;
        }
    }

    _addSlotToSlotList(value: any) {
        if (this._slots.indexOf(value) < 0) {
            this._slotsDirty = true;
            this._slots.push(value);
            this._animation._timelineStateDirty = true;
        }
    }

    _removeSlotFromSlotList(value: any) {
        var index = this._slots.indexOf(value);

        if (index >= 0) {
            this._slots.splice(index, 1);
            this._animation._timelineStateDirty = true;
        }
    }

    _bufferAction(value: any) {
        this._actions.push(value);
    }

	_bufferEvent(value: any, type: any) {
        value.type = type;
        value.armature = this;
        this._events.push(value);
    }

    /**
     * @version DragonBones 3.0
     */
    dispose() {
        this._delayDispose = true;

        if (!this._lockDispose && this._animation) {
            this.returnToPool();
        }
    }

    /**
     * @version DragonBones 3.0
     */
    advanceTime(passedTime: any) {
        var self = this;

        if (!self._animation) {
            throw new Error("The armature has been disposed.");
        }

        var scaledPassedTime = passedTime * self._animation.timeScale;
        // Animations.
        self._animation._advanceTime(scaledPassedTime);
        // Bones and slots.

        if (self._bonesDirty) {
            self._bonesDirty = false;
            self._sortBones();
        }

        if (self._slotsDirty) {
            self._slotsDirty = false;
            self._sortSlots();
        }

        for (var i = 0, l = self._bones.length; i < l; ++i) {
            self._bones[i]._update(self._cacheFrameIndex);
        }

        for (var i = 0, l = self._slots.length; i < l; ++i) {
            var slot = self._slots[i];
            slot._update(self._cacheFrameIndex);
            var childArmature = slot._childArmature;

            if (childArmature) {
                if (slot.inheritAnimation) {
                    childArmature.advanceTime(scaledPassedTime);
                } else {
                    childArmature.advanceTime(passedTime);
                }
            }
        }
        //
        if (DragonBones.debugDraw) {
            self._display._debugDraw();
        }

        if (!self._lockDispose) {
            self._lockDispose = true;
            
            // Actions and events.
            if (self._events.length > 0) {
                for (var i = 0, l = self._events.length; i < l; ++i) {
                    var event_5 = self._events[i];

                    if (event_5.type == EventObject.SOUND_EVENT) {
                        this._eventManager._dispatchEvent(event_5);
                    } else {
                        self._display._dispatchEvent(event_5);
                    }

                    event_5.returnToPool();
                }

                self._events.length = 0;
            }

            if (self._actions.length > 0) {
                for (var i = 0, l = self._actions.length; i < l; ++i) {
                    var action = self._actions[i];

                    if (action.slot) {
                        var slot = self.getSlot(action.slot.name);

                        if (slot) {
                            var childArmature = slot._childArmature;

                            if (childArmature) {
                                childArmature._doAction(action);
                            }
                        }
                    } else if (action.bone) {
                        for (var i_1 = 0, l_1 = self._slots.length; i_1 < l_1; ++i_1) {
                            var childArmature = self._slots[i_1]._childArmature;

                            if (childArmature) {
                                childArmature._doAction(action);
                            }
                        }
                    } else {
                        this._doAction(action);
                    }
                }

                self._actions.length = 0;
            }

            self._lockDispose = false;
        }

        if (self._delayDispose) {
            self.returnToPool();
        }
    }

    /**
     * @version DragonBones 3.0
     */
    invalidUpdate(boneName: any = null, updateSlotDisplay: any = false) {
        if (boneName) {
            var bone = this.getBone(boneName);

            if (bone) {
                bone.invalidUpdate();

                if (updateSlotDisplay) {
                    for (var i = 0, l = this._slots.length; i < l; ++i) {
                        var slot = this._slots[i];

                        if (slot.parent == bone) {
                            slot.invalidUpdate();
                        }
                    }
                }
            }
        } else {
            for (var i = 0, l = this._bones.length; i < l; ++i) {
                this._bones[i].invalidUpdate();
            }

            if (updateSlotDisplay) {
                for (var i = 0, l = this._slots.length; i < l; ++i) {
                    this._slots[i].invalidUpdate();
                }
            }
        }
    }

    /**
     * @version DragonBones 3.0
     */
    getSlot(name: any): any {
        for (var i = 0, l = this._slots.length; i < l; ++i) {
            var slot = this._slots[i];

            if (slot.name == name) {
                return slot;
            }
        }

        return null;
    }

    /**
     * @version DragonBones 3.0
     */
    getSlotByDisplay(display: any): any {
        if (display) {
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var slot = this._slots[i];

                if (slot.display == display) {
                    return slot;
                }
            }
        }

        return null;
    }

    /**
     * @version DragonBones 3.0
     */
    addSlot(value: any, parentName: any) {
        var bone = this.getBone(parentName);

        if (bone) {
            value._setArmature(this);
            value._setParent(bone);
        } else {
            throw new Error();
        }
    }

    /**
     * @version DragonBones 3.0
     */
    removeSlot(value: any) {
        if (value && value.armature == this) {
            value._setParent(null);
            value._setArmature(null);
        } else {
            throw new Error();
        }
    }

    /**
     * @version DragonBones 3.0
     */
    getBone(name: any): any {
        for (var i = 0, l = this._bones.length; i < l; ++i) {
            var bone = this._bones[i];

            if (bone.name == name) {
                return bone;
            }
        }
        
        return null;
    }

    /**
     * @version DragonBones 3.0
     */
    getBoneByDisplay(display: any): any {
        var slot = this.getSlotByDisplay(display);

        return slot ? slot.parent : null;
    }

    /**
     * @version DragonBones 3.0
     */
    addBone(value: any, parentName = null) {
        if (value) {
            value._setArmature(this);
            value._setParent(parentName ? this.getBone(parentName) : null);
        } else {
            throw new Error();
        }
    }

    /**
     * @version DragonBones 3.0
     */
    removeBone(value: any) {
        if (value && value.armature == this) {
            value._setParent(null);
            value._setArmature(null);
        } else {
            throw new Error();
        }
    }

    /**
     * @version DragonBones 4.5
     */
    replaceTexture(texture: any) {
        this._replacedTexture = texture;

        for (var i = 0, l = this._slots.length; i < l; ++i) {
            this._slots[i].invalidUpdate();
        }
    }

    /**
     * @version DragonBones 3.0
     */
    getBones(): any {
        return this._bones;
    }

    /**
     * @version DragonBones 3.0
     */
    getSlots(): any {
        return this._slots;
    }

    /**
     * @version DragonBones 3.0
     */
    get name(): any {
    	return this._armatureData ? this._armatureData.name : null;
    }

    get armatureData(): any {
    	return this._armatureData;
    }

    get animation(): any {
    	return this._animation;
    }

    get display(): any {
    	return this._display;
    }

    get parent(): any {
    	return this._parent;
    }
    
    get cacheFrameRate(): any {
    	return this._armatureData.cacheFrameRate;
    }

    set cacheFrameRate(value) {
    	if (this._armatureData.cacheFrameRate != value) {
            this._armatureData.cacheFrames(value);

            // Set child armature frameRate.
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var slot = this._slots[i];
                var childArmature = slot.childArmature;
                
                if (childArmature && childArmature.cacheFrameRate == 0) {
                    childArmature.cacheFrameRate = value;
                }
            }
        }
    }

    /**
     * @version DragonBones 4.5
     */
    enableAnimationCache(frameRate: any) {
        this.cacheFrameRate = frameRate;
    }

    /**
     * @version DragonBones 3.0
     */
    hasEventListener(type: any) {
        this._display.hasEvent(type);
    }

    /**
     * @version DragonBones 3.0
     */
    addEventListener(type: any, listener: any, target: any) {
        this._display.addEvent(type, listener, target);
    }

    /**
     * @version DragonBones 3.0
     */
    removeEventListener(type: any, listener: any, target: any) {
        this._display.removeEvent(type, listener, target);
    }

    /**
     * @deprecated
     * @see #display
     */
    getDisplay(): any {
        return this._display;
    }

}