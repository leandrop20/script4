export class ScrollEvent {

	static readonly TWEEN_COMPLETE = 'myTweenComplete';
	static readonly MASK_WIDTH = 'myMaskWidth';
	static readonly MASK_HEIGHT = 'myMaskHeight';
	static readonly ENTER_FRAME = 'myEnterFrame';

	static readonly MOUSE_DOWN = 'onMouseDown';
	static readonly MOUSE_MOVE = 'onMouseMove';
	static readonly MOUSE_UP = 'onMouseUp';

	static readonly TOUCH_TWEEN_UPDATE = 'touchTweenUpdate';
	static readonly TOUCH_TWEEN_COMPLETE = 'touchTweenComplete';

	_param: any;

	constructor(
		type: any,
		data: any = null,
		bubbles: boolean = false,
		cancelable: boolean = false
	) {
		this._param = data;
	}

	get param(): any { return this._param; }

}
