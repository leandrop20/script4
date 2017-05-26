class TouchEvent
{
	constructor(type, target)
	{
		this.type = type;
		this.target = target;
	}

	static get TOUCH() { return 'touch'; };

	getTouch(target)
	{
		var globalX = target.game.input.x;
		var globalY = target.game.input.y;
		if (target instanceof Sprite) {
			for(var i=0;i<target.numChildren;i++) {
				if(target.getChildAt(i).getBounds().intersects(new Rectangle(globalX, globalY, 2, 2))) {
					if (target.getChildAt(i) instanceof TextField) {
						globalX = globalX - (target.getChildAt(i).width*0.5);
						globalY = globalY - (target.getChildAt(i).height*0.5);
					}
					if (target.getChildAt(i) instanceof Spine) {
						globalX = globalX;
						globalY = globalY + (target.getChildAt(i).height*0.5);
					}
					return new Touch(target.getChildAt(i), this.type, globalX, globalY);
				}
			}
		} else if (target.getBounds().intersects(new Rectangle(globalX, globalY, 2, 2))) {
			if (target instanceof TextField) {
				globalX = globalX - (target.width*0.5);
				globalY = globalY - (target.height*0.5);
			}
			if (target instanceof Spine) {
				globalX = globalX;
				globalY = globalY + (target.height*0.5);
			}
			return new Touch(target, this.type, globalX, globalY);
		}
		return null;
	}
}