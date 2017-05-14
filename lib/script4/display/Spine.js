class Spine extends PhaserSpine.Spine
{
	constructor(armatureName, x = 0, y = 0)
	{
		super(core, armatureName);
		this.position.set(x, y);
	}

	play(animationName, isLoop = false)
	{
		this.setAnimationByName(0, animationName, isLoop);
	}
}