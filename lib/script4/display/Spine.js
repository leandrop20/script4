class Spine extends PhaserSpine.Spine
{
	constructor(armatureName, x = 0, y = 0)
	{
		super(core, armatureName);
		this.parent.removeChild(this);
		this.position.set(x, y);
		this.inputEnableChildren = true;

		this.box = new Graphics(-(this.width*0.5), -(this.height));
		this.box.name = 'null';
		this.box.inputEnabled = true;
		this.box.beginFill(0x428B36);
		this.box.drawRect(0, 0, this.width, this.height);
		this.box.endFill();
		this.box.alpha = 0.0;
		this.addChild(this.box);
		var _this = this;
	}

	set name(value)
	{
		if (this.box) { this.box.name = value; }
	}

	play(animationName, isLoop = false)
	{
		this.setAnimationByName(0, animationName, isLoop);
	}
}