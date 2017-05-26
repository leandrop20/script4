class Sprite extends Phaser.Group
{
	constructor(x = 0, y = 0)
	{
		super(core);
		this.position.set(x, y);
		this.inputEnableChildren = true;
		this.touchEventCallBack;
		this.enterFrameEvent;
	}

	get numChildren() { return this.children.length; }

	touchEvent(object, pointer, isDown)
	{
		object = (object instanceof Phaser.Graphics || object instanceof Graphics)?object.parent:object;	
		if (isDown == undefined) {
			object.parent.isTouchDown = true;
			object.game.input.addMoveCallback(object.parent.onMove, object);
			object.parent.touchEventCallBack(new TouchEvent(TouchPhase.BEGAN, object.parent));
		} else {
			object.parent.isTouchDown = false;
			object.game.input.deleteMoveCallback(object.parent.onMove, object);
			object.parent.touchEventCallBack(new TouchEvent(TouchPhase.ENDED, object.parent));
		}
	}

	onMove()
	{
		this.parent.touchEventCallBack(new TouchEvent(TouchPhase.MOVED, this.parent));
	}

	addEventListener(type, listener)
	{
		if (type == 'touch') {
			this.touchEventCallBack = listener;
			this['onChildInputDown'].add(this.touchEvent);
			this['onChildInputUp'].add(this.touchEvent);
			for (var i=0;i<this.numChildren;i++) {
				if (this.getChildAt(i) instanceof TextField || this.getChildAt(i) instanceof Spine) {
					this.getChildAt(i)['onChildInputDown'].add(this.touchEvent);
					this.getChildAt(i)['onChildInputUp'].add(this.touchEvent);
				}
			}
		} else if (type == 'enterFrame') {
			this.enterFrameEvent = this.game.time.events.loop(33, listener, this);
		}
	}

	removeEventListener(type, listener)
	{
		if (type == 'touch') {
			this['onChildInputDown'].remove(this.touchEvent);
			this['onChildInputUp'].remove(this.touchEvent);
			for (var i=0;i<this.numChildren;i++) {
				if (this.getChildAt(i) instanceof TextField || this.getChildAt(i) instanceof Spine) {
					this.getChildAt(i)['onChildInputDown'].remove(this.touchEvent);
					this.getChildAt(i)['onChildInputUp'].remove(this.touchEvent);
				}
			}
		} else if (type == 'enterFrame') {
			if (this.enterFrameEvent) { this.game.time.events.remove(this.enterFrameEvent); this.enterFrameEvent = null; }
		}
	}
}