import { Script4 } from '../Script4';
import { Touch } from './Touch';
import { TouchPhase } from '../enums/TouchPhase';
import { Sprite } from '../display/Sprite';
import { Spine } from '../display/Spine';
import { Rectangle } from '../utils/Rectangle';
import { Point } from '../geom/Point';

export class TouchEvent {

    static readonly TOUCH = 'touch';

    type: TouchPhase;
    target: any;
    currentTarget: any;

	constructor(type: TouchPhase, target: any, currentTarget: any = null) {
		this.type = type;
		this.target = target;
		this.currentTarget = currentTarget;
	}

	getTouch(target: any, swap = false): any {
		if (!target || target.game == null) { return; }
		
		var globalX = target.game.input.x;
		var globalY = target.game.input.y;

		if (this.type == TouchPhase.BEGAN) { Touch.previous = null; }

		if (Touch.previous) { target = Touch.previous; }

		if (!Touch.previous || Touch.previous == undefined) {
			return getObjTouch(target, this);
		} else {
			var point = centerDrag(Touch.previous);
			var endTouch = new Touch(Touch.previous, this.type, point.x, point.y);

			if (this.type == TouchPhase.ENDED) { Touch.previous = null; }

			return endTouch;
		}

		function getObjTouch(_target: any, _this: any): any {
			if (!_target) { return null; }

			if (
                _target instanceof Sprite ||
                _target instanceof Spine ||
                _target instanceof Phaser.Group
            ) {
				var obj: any;

				for (var i = _target.children.length - 1; i > -1; i--) {
					obj = _target.getChildAt(i);

					if (isIntersects(obj) && (obj.inputEnabled || obj.inputEnableChildren)) {
						if (_this.currentTarget == obj) {
							if (_this.type == TouchPhase.BEGAN) {
                                Touch.previous = obj;
                            }

							var point: Point = centerDrag(obj);

							if (
                                _target.getIndex(obj) != (_target.children.length - 1) &&
                                _this.type == TouchPhase.BEGAN &&
                                swap
                            ) {
								// var lastObj: any = _target.getChildAt(_target.numChildren - 1);
								_target.addChild(obj);
							}

							return new Touch(obj, _this.type, point.x, point.y);
						} else {
							var objTouch: any = getObjTouch(obj, _this);

							if (objTouch != null) return objTouch;
						}
					}
				}

				return null;
			} else if (
                isIntersects(_target) &&
                (_target.inputEnabled || _target.inputEnableChildren)
            ) {
				if (_this.type == TouchPhase.BEGAN) {
                    Touch.previous = _target;
                }

				var point: Point = centerDrag(_target);

				return new Touch(_target, _this.type, point.x, point.y);
			}
		}

		function centerDrag(_target: any): Point {
			try {
                let x: number = Script4.core
                    .InputHandler(Script4.core)
                    .globalToLocalX(_target.centerX);
                let y: number = Script4.core
                    .InputHandler(Script4.core)
                    .globalToLocalY(_target.centerY);
                
				var boundsCenterLocalCoord: Point = new Point(x, y);
                
				globalX = globalX + (_target.x - boundsCenterLocalCoord.x);
	            globalY = globalY + (_target.y - boundsCenterLocalCoord.y);
	        } catch (e) { /* Error */ }

			return new Point(globalX, globalY);
		}

		function isIntersects(_target: any): boolean {
			if (_target.getBounds().intersects(new Rectangle(globalX, globalY, 1, 1))) {
				return true;
			}

			return false;
		}
	}
	
}
