import { Script4 } from '../Script4';
import PhaserSpine from '../../phaser-spine';
import { Graphics } from './Graphics';
import { ButtonSuper } from './ButtonSuper';
import { TextField } from '../text/TextField';
import { TouchEvent } from '../events/TouchEvent';
import { TouchPhase } from '../enums/TouchPhase';
import { IAnimationArg } from '../interface/IAnimationArg';

export class Spine extends PhaserSpine.Spine {

    box: Graphics;
    enterFrameEvent!: Phaser.TimerEvent | null;

    args: IAnimationArg[];
    touchEventCallBack!: Function;
    lastAnimation!: string;

	constructor(armatureName: string, x: number = 0, y: number = 0, _args: IAnimationArg[] = []) {
		super(Script4.core, armatureName);
		this.name = '';
		this.args = _args;
		this.parent.removeChild(this);
		this.position.set(x, y);
		this.inputEnableChildren = true;
		
		this.enterFrameEvent;

		let bounds = this.getBounds();
		this.box = new Graphics();
		this.box.inputEnabled = true;
		this.box.beginFill(0x428B36, 0.0);

		if (bounds.centerX == 1) { bounds.x = bounds.x * 2; }
		if (bounds.centerY == 1) { bounds.y = bounds.y * 2; }

		this.box.drawRect(bounds.x,bounds.y,bounds.width,bounds.height);
		this.box.endFill();
		this.addChild(this.box);

		let _this = this;
		this.state.onComplete = function(): void { _this.onComplete(); }
	}

	override set name(value: string) {
		if (this.box) { this.box.name = value; }

		super.name = value;
	}

	set animationSpeed(value: number) {
		this.state.timeScale = value;
	}

	play(animationName: string, isLoop: boolean = false, animationSpeed: number = 1.0): void {
		this.animationSpeed = animationSpeed;
		this.setAnimationByName(0, animationName, isLoop);
		this.lastAnimation = animationName;
	}

	onComplete(): void {
		for (let i = 0; i < this.args.length; i++) {
			if (this.lastAnimation == this.args[i].anime) {
				this.args[i].func({ target: this, animationName: this.lastAnimation });
			}
		}
	}

	getBone(name: string): any {
        for (let bone of this.skeleton.bones) {
            if (bone.data.name == name) {
                return bone;
            }
        }

		return null;
	}

	getSlot(name: string): any {
		for (let slot of this.skeleton.slots) {
			if (slot.currentSpriteName == name) {
				return slot;
			}
		}

		return null;
	}

	get numChildren(): number {
        return this.children.length;
    }

	touchEvent(object: any, pointer: any, isDown: boolean): void {
		if (!(object instanceof ButtonSuper)) {
			object = (object instanceof Phaser.Graphics || object instanceof Graphics)
                ? object.parent
                : object;
            
			if (isDown == undefined) {
				object.isTouchDown = true;
				object.game.input.addMoveCallback(object.onMove, object);
				object.touchEventCallBack(new TouchEvent(TouchPhase.BEGAN, object.parent));
			} else {
				object.isTouchDown = false;
				object.game.input.deleteMoveCallback(object.onMove, object);
				object.touchEventCallBack(new TouchEvent(TouchPhase.ENDED, object.parent));
			}
		}
	}

	onMove(): void {
		this.touchEventCallBack(new TouchEvent(TouchPhase.MOVED, this.parent));
	}

	addEventListener(type: any, listener: Function): void {
		if (!type) throw('event type not found!');

		if (type == 'touch') {
			this.touchEventCallBack = listener;
			this['onChildInputDown'].add(this.touchEvent);
			this['onChildInputUp'].add(this.touchEvent);

			for (let i = 0;i < this.numChildren; i++) {
                let obj: any = this.getChildAt(i);

				if (obj instanceof TextField || obj instanceof Spine) {
					obj['onChildInputDown'].add(this.touchEvent);
					obj['onChildInputUp'].add(this.touchEvent);
				}
			}
		} else if (type == 'enterFrame') {
			this.enterFrameEvent = this.game.time.events.loop(33, listener, this);
		}
	}

	removeEventListener(type: any, listener: Function): void {
		if (!type) throw('event type not found!');

		if (type == 'touch') {
			this['onChildInputDown'].remove(this.touchEvent);
			this['onChildInputUp'].remove(this.touchEvent);

			for (let i = 0;i < this.numChildren; i++) {
                let obj: any = this.getChildAt(i);

				if (obj instanceof TextField || obj instanceof Spine) {
					obj['onChildInputDown'].remove(this.touchEvent);
					obj['onChildInputUp'].remove(this.touchEvent);
				}
			}
		} else if (type == 'enterFrame') {
			if (this.enterFrameEvent) { 
				this.game.time.events.remove(this.enterFrameEvent);
                this.enterFrameEvent = null;
			}
		}
	}

	removeFromParent(): void { 
		for (let i = this.numChildren - 1; i > -1; i--) {
            let obj: any = this.getChildAt(i);
			this.removeChild(obj);
		}

		this.killAll();

		if (this.parent) {
            this.parent.removeChild(this);
        }
	}

}