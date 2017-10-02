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
			this.recursiveSetEvent('add', this, this);
		} else if (type == 'enterFrame') {
			this.enterFrameEvent = this.game.time.events.loop(33, listener, this);
		}
	}

	removeEventListener(type, listener)
	{
		if (type == 'touch') {
			this.recursiveSetEvent('remove', this, this);
		} else if (type == 'enterFrame') {
			if (this.enterFrameEvent) { this.game.time.events.remove(this.enterFrameEvent); this.enterFrameEvent = null; }
		}
	}

	recursiveSetEvent(_type, _obj, _this, recursive = false)
	{
		if (!recursive) { setEvent(_type, _this); }

		for (var i=0;i<_obj.numChildren;i++) {
			var i_obj = _this.getChildAt(i);
			if (i_obj instanceof Sprite || i_obj instanceof Spine || i_obj instanceof TextField) {
				_this.recursiveSetEvent(_type, i_obj, _this, true);
				setEvent(_type, i_obj);
			}
		}

		function setEvent(_type, _obj)
		{
			_obj['onChildInputDown'][_type](_this.touchEvent);
			_obj['onChildInputUp'][_type](_this.touchEvent);
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