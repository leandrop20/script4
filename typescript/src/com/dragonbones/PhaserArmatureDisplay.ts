import { Script4 } from '../script4/Script4';
import { PhaserFactory } from './PhaserFactory';
import { DragonBones } from './DragonBones';

export class PhaserArmatureDisplay extends Phaser.Sprite {

    maxX: number;
    maxY: number;

    _armature: any;
    _debugDrawer: any;

	constructor() {
		super(Script4.core, 0, 0);

		this.maxX = 0;
		this.maxY = 0;
	}

	SetBounds(force: any) {
        if (force || this.maxX < this.getBounds().width)
            this.maxX = this.getBounds().width;
        if (force || this.maxY < this.getBounds().height)
            this.maxY = this.getBounds().height;
        this.body.setSize(this.maxX / 2, this.maxX / 2, this.maxY, 0);
    }

    _onClear() {
        this._armature = null;
        if (this._debugDrawer) {
            this._debugDrawer.destroy(true);
            this._debugDrawer = null;
        }
        this.destroy(true);
    }

    _dispatchEvent(eventObject: any) {
        //this.emit(eventObject.type, eventObject);
    }

    _debugDraw() {
        if (!this._debugDrawer) {
            this._debugDrawer = new Phaser.Graphics(DragonBones.GAME);
        }
        this.addChild(this._debugDrawer);
        this._debugDrawer.clear();
        var bones = this._armature.getBones();
        for (var i = 0, l = bones.length; i < l; ++i) {
            var bone = bones[i];
            var boneLength = Math.max(bone.length, 5);
            var startX = bone.globalTransformMatrix.tx;
            var startY = bone.globalTransformMatrix.ty;
            var endX = startX + bone.globalTransformMatrix.a * boneLength;
            var endY = startY + bone.globalTransformMatrix.b * boneLength;
            this._debugDrawer.lineStyle(1, bone.ik ? 0xFF0000 : 0x00FF00, 0.5);
            this._debugDrawer.moveTo(startX, startY);
            this._debugDrawer.lineTo(endX, endY);
        }
    }

    hasEvent(type: any): boolean {
        //return <boolean>this.listeners(type, true);
        return false;
    }
    
    addEvent(type: any, listener: any, target: any) {
        //this.addListener(type, listener, target);
    }

    removeEvent(type: any, listener: any, target: any) {
        //this.removeListener(type, listener, target);
    }

    advanceTimeBySelf(on: any) {
        if (on) {
            PhaserFactory._clock.add(this._armature);
        }
        else {
            PhaserFactory._clock.remove(this._armature);
        }
    }

    dispose() {
        if (this._armature) {
            this.advanceTimeBySelf(false);
            this._armature.dispose();
            this._armature = null;
        }
    }

    get armature(): any {
    	return this._armature;
    }

    get animation(): any {
    	return this._armature.animation;
    }

    animate(key: any) {
        if (this.animation.lastAnimationName == key)
            return;
        this.animation.play(key);
        for (var i = this.children.length - 1; i >= 0; i--) {
            var item: any = this.getChildAt(i);
            if (item.texture == null)
                this.removeChildAt(i);
        }
    }

}