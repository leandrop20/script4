class TouchEvent {

	constructor(type, target, currentTarget) {
		this.type = type;
		this.target = target;
		this.currentTarget = currentTarget;
	}

	static get TOUCH() { return 'touch'; };

	getTouch(target) {
		var globalX = target.game.input.x;
		var globalY = target.game.input.y;

		if (Touch.previous) { target = Touch.previous; }

		if (!Touch.previous || Touch.previous == undefined) {
			return getObjTouch(target, this);
		} else {
			var point = centerDrag(Touch.previous);
			var endTouch = new Touch(Touch.previous, this.type, point.x, point.y);
			if (this.type == TouchPhase.ENDED) { Touch.previous = null; }
			return endTouch;
		}

		function getObjTouch(_target, _this) {
			if (_target instanceof Sprite) {
				var obj;
				for (var i=_target.numChildren-1;i>-1;i--) {
					obj = _target.getChildAt(i);

					if (isIntersects(obj) && (obj.inputEnabled || obj.inputEnableChildren)) {
						if (_this.currentTarget == obj) {
							if (_this.type == TouchPhase.BEGAN) { Touch.previous = obj; }
							var point = centerDrag(obj);
							if (_target.getIndex(obj) != (_target.numChildren-1) 
									&& _this.type == TouchPhase.BEGAN) { 
								_target.addChild(obj); 
							}

							return new Touch(obj, _this.type, point.x, point.y);
						} else {
							return getObjTouch(obj, _this);
						}
					}
				}
			} else if (isIntersects(_target) && (_target.inputEnabled || _target.inputEnableChildren)) {
				if (_this.type == TouchPhase.BEGAN) { Touch.previous = _target; }
				var point = centerDrag(_target);
				// if (_target.parent.getIndex(_target) != (_target.parent.numChildren-1) && _this.type == TouchPhase.BEGAN) { _target.parent.addChild(_target); }

				return new Touch(_target, _this.type, point.x, point.y);
			}
		}

		function centerDrag(_target) {
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