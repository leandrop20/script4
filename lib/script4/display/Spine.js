class Spine extends PhaserSpine.Spine
{
	constructor(armatureName, x, y)
	{
		super(core, armatureName);
		this.position.set(x, y);
	}

	play(animationName, isLoop = false)
	{
		this.setAnimationByName(0, animationName, isLoop);
	}
}