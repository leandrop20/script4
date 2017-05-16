class TextField extends Phaser.BitmapText
{
	constructor(width, height, font, text = '')
	{
		super(core, 0, 0, font, text, 64);
		// this.width = width;
		// this.height = height;
		this.anchor.set(0.5);
	}

	// set text(value) { this.setText(value); }

	appendText(value)
	{
		// this.setText(this.text+value);
	}

}