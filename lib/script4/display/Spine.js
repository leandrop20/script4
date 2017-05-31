class Spine extends PhaserSpine.Spine
{
	/**
	*
	* @param armatureName String
	* @param x Number
	* @param y Number
	* @param _args Array [{ anime:, func: }]
	*/
	constructor(armatureName, x = 0, y = 0, _args = [])
	{
		super(core, armatureName);
		this.name = null;
		this.args = _args;
		this.parent.removeChild(this);
		this.position.set(x, y);
		this.inputEnableChildren = true;
		this.lastAnimation;

		var bounds = this.getBounds();
		this.box = new Graphics();
		this.box.beginFill(0x428B36, 0.5);
		this.box.drawRect(bounds.x,bounds.y,bounds.width,bounds.height);
		this.box.endFill();
		this.addChild(this.box);

		/*this.box = new Graphics(-(this.width*0.5), -(this.height));
		this.box.name = 'null';
		this.box.inputEnabled = true;
		this.box.beginFill(0x428B36);
		this.box.drawRect(0, 0, this.width, this.height);
		this.box.endFill();
		this.box.alpha = 0.5;
		this.addChild(this.box);*/
		var _this = this;
		this.state.onComplete = function() { _this.onComplete(); }
	}

	set name(value)
	{
		if (this.box) { this.box.name = value; }
		super.name = value;
	}

	play(animationName, isLoop = false)
	{
		this.setAnimationByName(0, animationName, isLoop);
		this.lastAnimation = animationName;
	}

	onComplete()
	{
		for (var i=0; i<this.args.length; i++) {
			if (this.lastAnimation == this.args[i].anime) {
				this.args[i].func({ target:this, animationName:this.lastAnimation });
			}
		}
	}
}