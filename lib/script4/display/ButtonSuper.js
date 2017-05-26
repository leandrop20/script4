class ButtonSuper extends Phaser.Button
{
	constructor(texture, x = 0, y = 0, callBack = null)
	{
		super(core, x, y, texture, callBack);
		this.anchor.set(0.5);
		this.scaleWhenDown = 0.95;
		this.onInputDown.add(this.onDown, this);
		this.onInputUp.add(this.onUp, this);
	}

	onDown()
	{
		this.scale.set(this.scaleWhenDown);
	}

	onUp()
	{
		this.scale.set(1.0);
	}

	addEventListener(type, listener)
	{
		this[type].add(listener);
	}

	removeEventListener(type, listener)
	{
		this[type].remove(listener);
	}
}