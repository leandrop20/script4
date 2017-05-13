class Sprite extends Phaser.Sprite
{
	constructor(texture, x = 0, y = 0)
	{
		super(core, x, y, texture);
		this.anchor.set(0.5);
	}
}