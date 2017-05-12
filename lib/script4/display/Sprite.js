class Sprite extends Phaser.Group
{
	constructor(x = 0, y = 0)
	{
		super(core);
		this.position.set(x, y);
	}
}