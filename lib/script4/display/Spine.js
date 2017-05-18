class Spine extends PhaserSpine.Spine
{
	constructor(armatureName, x = 0, y = 0)
	{
		super(core, armatureName);
		this.position.set(x, y);
		this.inputEnableChildren = true;

		var box = new Graphics(-(this.width*0.5), -(this.height));
		box.inputEnabled = true;
		box.beginFill(0x428B36);
		box.drawRect(0, 0, this.width, this.height);
		box.endFill();
		this.addChild(box);
	}

	play(animationName, isLoop = false)
	{
		this.setAnimationByName(0, animationName, isLoop);
	}
}