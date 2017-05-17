class TextField extends Phaser.Group
{
	constructor(width, height, font, text = '', size = null)
	{
		super(core);

		this.box = new Phaser.Graphics(core, 0, 0);
		this.box.visible = false;
		this.box.lineStyle(1, 0x000000);
		this.box.drawRect(0, 0, width, height);
		this.box.endFill();
		this.addChild(this.box, 0);

		this.field = new Phaser.BitmapText(core, 0, 0, font, text);
		this.field.fontSize = (size)?size:this.field._data.font.size;
		this.field.maxWidth = width;
		this.addChild(this.field);

		var mask = new Phaser.Graphics(core, 0, 0);
		mask.beginFill(0x009900);
		mask.drawRect(0, 0, width, height);
		mask.endFill();
		this.addChild(mask);

		this.field.mask = mask;
	}

	appendText(value)
	{
		this.field.setText(this.field.text + value);
	}

	set text(value) { this.field.setText(value); }

	set border(bool) { this.box.visible = bool; }

	set borderColor(color) { this.box.lineStyle(1, color); }

}