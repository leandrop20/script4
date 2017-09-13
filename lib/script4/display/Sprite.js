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

	get scaleX() { return this.scale.x; }
	
	set scaleX(value) { this.scale.x = value; }
	
	get scaleY() { return this.scale.y; }

	set scaleY(value) { this.scale.y = value; }

	get numChildren() { return this.children.length; }

	getChildByName(value)
	{
		for (var i=0;i<this.numChildren;i++) {
			if (this.getChildAt(i).name == value) {
				return this.getChildAt(i);
			}
		}
		return null;
	}

	touchEvent(object, pointer, isDown)
	{
		var target;
		var currentTarget;
		if (!(object instanceof ButtonSuper)) {
			object = ((object instanceof Phaser.Graphics || object instanceof Graphics))?object.parent:object;
			currentTarget = object;
			target = getTarget(object);

			if (isDown == undefined) {
				target.isTouchDown = true;
				target.game.input.addMoveCallback(target.onMove, target);
				target.touchEventCallBack(new TouchEvent(TouchPhase.BEGAN, target, currentTarget));
			} else {
				target.isTouchDown = false;
				target.game.input.deleteMoveCallback(target.onMove, target);
				target.touchEventCallBack(new TouchEvent(TouchPhase.ENDED, target, currentTarget));
			}
		}

		function getTarget(_obj) {
			if (!_obj.touchEventCallBack) {
				return getTarget(_obj.parent);
			}
			return _obj;
		}
	}

	onMove()
	{
		this.touchEventCallBack(new TouchEvent(TouchPhase.MOVED, this));
	}

	addEventListener(type, listener)
	{
		if (type == 'touch') {
			this.touchEventCallBack = listener;
			this['onChildInputDown'].add(this.touchEvent);
			this['onChildInputUp'].add(this.touchEvent);
			for (var i=0;i<this.numChildren;i++) {
				var i_obj = this.getChildAt(i);
				if (i_obj instanceof Sprite) {
					for (var j=0;j<i_obj.numChildren;j++) {
						var j_obj = i_obj.getChildAt(j);
						if (j_obj instanceof Sprite || j_obj instanceof Spine || j_obj instanceof TextField) {
							for (var k=0;k<j_obj.numChildren;k++) {
								var k_obj = j_obj.getChildAt(k);
								if (k_obj instanceof Sprite || k_obj instanceof Spine || k_obj instanceof TextField) {
									k_obj['onChildInputDown'].add(this.touchEvent);
									k_obj['onChildInputUp'].add(this.touchEvent);
								}
							}
							j_obj['onChildInputDown'].add(this.touchEvent);
							j_obj['onChildInputUp'].add(this.touchEvent);
						}
					}
					i_obj['onChildInputDown'].add(this.touchEvent);
					i_obj['onChildInputUp'].add(this.touchEvent);
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
				var i_obj = this.getChildAt(i);
				if (i_obj instanceof Sprite) {
					for (var j=0;j<i_obj.numChildren;j++) {
						var j_obj = i_obj.getChildAt(j);
						if (j_obj instanceof Sprite || j_obj instanceof Spine || j_obj instanceof TextField) {
							for (var k=0;k<j_obj.numChildren;k++) {
								var k_obj = j_obj.getChildAt(k);
								if (k_obj instanceof Sprite || k_obj instanceof Spine || k_obj instanceof TextField) {
									k_obj['onChildInputDown'].remove(this.touchEvent);
									k_obj['onChildInputUp'].remove(this.touchEvent);
								}
							}
							j_obj['onChildInputDown'].remove(this.touchEvent);
							j_obj['onChildInputUp'].remove(this.touchEvent);
						}
					}
					i_obj['onChildInputDown'].remove(this.touchEvent);
					i_obj['onChildInputUp'].remove(this.touchEvent);
				}
			}
		} else if (type == 'enterFrame') {
			if (this.enterFrameEvent) { this.game.time.events.remove(this.enterFrameEvent); this.enterFrameEvent = null; }
		}
	}

	removeChildren()
	{
		for (var i=this.numChildren-1;i>-1;i--) {
			if (this.getChildAt(i) instanceof SimpleButton || this.getChildAt(i) instanceof TextField) {
				this.getChildAt(i).destroyAll();
			} else {
				this.removeChild(this.getChildAt(i));
			}
		}
	}

	removeFromParent() { this.parent.removeChild(this); }

}