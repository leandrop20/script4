import { ImageSuper } from '../com/script4/display/ImageSuper';
import { Sprite } from '../com/script4/display/Sprite';
import { Orientation } from '../com/script4/enums/Orientation';
import { TouchPhase } from '../com/script4/enums/TouchPhase';
import { TouchEvent } from '../com/script4/events/TouchEvent';
import { Point } from '../com/script4/geom/Point';
import { Scroller } from '../com/script4/utils/Scroller';

export class ScrollerTest extends Sprite {

	container: Sprite;
	scroller: Scroller;

	initY: number;
	moving: boolean;

	constructor() {
		super();

		this.initY = 0;
		this.moving = false;

		this.container = new Sprite();
		this.addChild(this.container);

		var obj: ImageSuper;

		for (var i = 0; i < 10; i++) {
			obj = new ImageSuper('imgLoad', 300, (70 * i));
			this.container.addChild(obj);
		}

		this.scroller = new Scroller();
		this.scroller.orientation = Orientation.VERTICAL;
		this.scroller.boundHeight = 450;
		this.scroller.content = this.container;
		this.scroller.yPerc = 0;

		this.events('add');
	}

	onTouch(e: TouchEvent) {
		var touch = e.getTouch(this);
		if (touch) {
			if (touch.phase === TouchPhase.BEGAN) {
				this.initY = touch.globalY;
			} else if (touch.phase == TouchPhase.MOVED) {
				if (touch.globalY > this.initY + 10 || touch.globalY < this.initY - 10) {
					e.target.scroller.startScroll(
						new Point(this.game.input.x, this.game.input.y)
					);
					this.moving = true;
				}
			} else if (touch.phase == TouchPhase.ENDED) {
				this.initY = 0;
				if (this.moving) {
					this.moving = false;
					e.target.scroller.fling();
				}
			}
		}
	}

	events(_type: string) {
		let _this: any = this;
		_this[_type + 'EventListener'](TouchEvent.TOUCH, this.onTouch);
	}

}