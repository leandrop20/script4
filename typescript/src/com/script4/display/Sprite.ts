import { Script4 } from '../Script4';
import { TextField } from '../text/TextField';
import { Align } from '../enums/Align';
import { Spine } from './Spine';
import { ButtonSuper } from './ButtonSuper';
import { Graphics } from './Graphics';
import { TouchEvent } from '../events/TouchEvent';
import { TouchPhase } from '../enums/TouchPhase';

export class Sprite extends Phaser.Group {

	touchEventCallBack!: Function | null;
	enterFrameEvent!: Phaser.TimerEvent | null;

	constructor(x: number = 0, y: number = 0) {
		super(Script4.core);
		this.position.set(x, y);
		this.inputEnableChildren = true;
	}

	get scaleX(): number { return this.scale.x; }
	
	set scaleX(value: number) { this.scale.x = value; }
	
	get scaleY(): number { return this.scale.y; }

	set scaleY(value: number) { this.scale.y = value; }

	get numChildren(): number { return this.children.length; }

	getChildByName(value: string): any {
		for (let i = 0;i < this.numChildren; i++) {
			let obj: any = this.getChildAt(i);

			if (obj.name == value) {
				return obj;
			}
		}

		return null;
	}

	touchEvent(object: any, pointer: any, isDown: boolean) {
		var target: any;
		var currentTarget: any;

		if (!(object instanceof ButtonSuper)) {
			object = ((object instanceof Phaser.Graphics || object instanceof Graphics))
				? object.parent
				: object;
			currentTarget = object;
			target = getTarget(object);

			if (target) {
				let touchPhase: TouchPhase;

				if (isDown == undefined) {
					target.isTouchDown = true;
					target.game.input.addMoveCallback(target.onMove, target);
					touchPhase = TouchPhase.BEGAN;
				} else {
					target.isTouchDown = false;
					target.game.input.deleteMoveCallback(target.onMove, target);
					touchPhase = TouchPhase.ENDED;
				}

				target.touchEventCallBack(new TouchEvent(touchPhase, target, currentTarget));
			}
		}

		function getTarget(_obj: any): any {
			if (_obj && !_obj.touchEventCallBack) {
				return getTarget(_obj.parent);
			}

			return _obj;
		}
	}

	onMove() {
		if (this && this.touchEventCallBack) {
			this.touchEventCallBack(new TouchEvent(TouchPhase.MOVED, this));
		}
	}

	addEventListener(type: any, listener: Function) {
		if (!type) throw('event type not found!');

		if (type == 'touch') {
			this.touchEventCallBack = listener;
			this.recursiveSetEvent('add', this, this);
		} else if (type == 'enterFrame') {
			this.enterFrameEvent = this.game.time.events.loop(33, listener, this);
		}
	}

	removeEventListener(type: any, listener: Function) {
		if (!type) throw('event type not found!');

		this.touchEventCallBack = null;

		if (type == 'touch') {
			this.recursiveSetEvent('remove', this, this); 
		} else if (type == 'enterFrame') {
			if (this.enterFrameEvent) {
				this.game.time.events.remove(this.enterFrameEvent);
				this.enterFrameEvent = null;
			}
		}
	}

	recursiveSetEvent(_type: any, _obj: any, _this: any, recursive: boolean = false) {
		if (!recursive) { setEvent(_type, _this); }

		for (var i = 0; i<_obj.numChildren; i++) {
			var i_obj = _obj.getChildAt(i);

			if (i_obj instanceof Sprite || i_obj instanceof Spine || i_obj instanceof TextField) {
				_this.recursiveSetEvent(_type, i_obj, _this, true);
				setEvent(_type, i_obj);
			}
		}

		function setEvent(_type: any, _obj: any) {
			_obj['onChildInputDown'][_type](_this.touchEvent);
			_obj['onChildInputUp'][_type](_this.touchEvent);
		}
	}

	override removeChildren(
		beginIndex?: number | undefined,
		endIndex?: number | undefined
	): PIXI.DisplayObject[] {
		var child: any;

		for (var i = this.numChildren - 1; i > -1; i--) {
			child = this.getChildAt(i);

			if (child.destroyAll) {
				child.destroyAll();
			} else {
				this.removeChild(child);
			}
		}

		return super.removeChildren(beginIndex, endIndex);
	}

	removeFromParent() { if (this.parent) { this.parent.removeChild(this); } }

	set hAlign(value: Align) {
		if (value === Align.CENTER) {
			this.pivot.x = this.getBounds().width * 0.5;
		} else if (value === Align.RIGHT) {
			this.pivot.x = this.getBounds().width;
		} else {
			this.pivot.x = 0.0;
		}
	}

	set vAlign(value: Align) {
		if (value === Align.MIDDLE) {
			this.pivot.y = this.getBounds().height * 0.5;
		} else if (value === Align.BOTTOM) {
			this.pivot.y = this.getBounds().height;
		} else {
			this.pivot.y = 0.0;
		}
	}

	alignPivot(hAlign = Align.CENTER, vAlign = Align.MIDDLE) {
		this.hAlign = hAlign;
		this.vAlign = vAlign;
	}

	override addChild(child: PIXI.DisplayObject): PIXI.DisplayObject {
		this.addTouchEventsInChildren(child);

		return super.addChild(child);
	}

	override addChildAt(child: PIXI.DisplayObject, index: number): PIXI.DisplayObject {
		this.addTouchEventsInChildren(child);

		return super.addChildAt(child, index);
	}

	addTouchEventsInChildren(child: any) {
		if (this.touchEventCallBack) {
			this.recursiveSetEvent('add', child, this);
		} else if (this.parent.touchEventCallBack) {
			this.recursiveSetEvent('add', this, this.parent);
		}
	}

}
