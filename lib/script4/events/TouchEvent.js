class TouchEvent
{
	constructor(type, target, currentTarget)
	{
		this.type = type;
		this.target = target;
		this.currentTarget = currentTarget;
	}

	static get TOUCH() { return 'touch'; };

	getTouch(target)
	{
		var globalX = target.game.input.x;
		var globalY = target.game.input.y;

		if (Touch.previous) { target = Touch.previous; }

		if (!Touch.previous || Touch.previous == undefined) {
			if (isIntersects(target) && (target.inputEnabled || target.inputEnableChildren)) {
				if (this.type == TouchPhase.BEGAN) { Touch.previous = target; }
				var point = centerDrag(target);
				// if (target.parent.getIndex(target) != (target.parent.numChildren-1) && this.type == TouchPhase.BEGAN) { target.parent.addChild(target); }

				return new Touch(target, this.type, point.x, point.y);
			}
		} else {
			var point = centerDrag(Touch.previous);
			var endTouch = new Touch(Touch.previous, this.type, point.x, point.y);
			if (this.type == TouchPhase.ENDED) { Touch.previous = null; }
			return endTouch;
		}

		function centerDrag(_target)
		{
			try {
				var boundsCenterLocalCoord = new Phaser.InputHandler(core).globalToLocal(new Phaser.Point(_target.centerX, _target.centerY));
				globalX = globalX + (_target.x - boundsCenterLocalCoord.x);
	            globalY = globalY + (_target.y - boundsCenterLocalCoord.y);
	        } catch (e) {
	        	//Error
	        }
			return new Point(globalX, globalY);
		}

		function isIntersects(_target) {
			if (_target.getBounds().intersects(new Rectangle(globalX, globalY, 1, 1))) {
				return true;
			}
			return false;
		}

		return null;
	}
}