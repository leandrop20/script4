class TextField extends Phaser.Group
{
	constructor(width, height, font, text = '', size = null)
	{
		super(core);
		this.inputEnableChildren = true;

		this.w = width;
		this.h = height;

		this.box = new Phaser.Graphics(core, 0, 0);
		this.box.visible = false;
		this.box.lineStyle(1, 0x000000);
		this.box.drawRect(0, 0, width, height);
		this.box.endFill();
		this.addChild(this.box, 0);

		this.field = new Phaser.BitmapText(core, 0, 0, font, text);
		this.field.fontSize = (size)?size:this.field._data.font.size;
		this.field.align = 'right';
		this.field.maxWidth = width;
		this.addChild(this.field);

		var mask = new Phaser.Graphics(core, 0, 0);
		mask.inputEnabled = true;
		mask.beginFill(0x009900);
		mask.drawRect(0, 0, width, height);
		mask.endFill();
		this.addChild(mask);

		this.field.mask = mask;
	}

	/**
	*	value = String text
	*/
	appendText(value)
	{
		this.field.setText(this.field.text + value);
	}

	set text(value) { this.field.setText(value); }

	set border(bool) { this.box.visible = bool; }

	set borderColor(color) { this.box.lineStyle(1, color); }

	/**
	*	value = Align.LEFT (LEFT, CENTER, RIGHT)
	*/
	set hAlign(value)
	{
		if (value == 'center') {
			this.field.anchor.x = 0.5;
			this.field.x = this.w*0.5;
		} else if (value == 'right') {
			this.field.x = this.field.textWidth*0.5;
		}
	}

	/**
	*	value = Align.TOP (TOP, MIDDLE, BOTTOM)
	*/
	set vAlign(value)
	{
		if (value == 'middle') {
			this.field.anchor.y = 0.5;
			this.field.y = this.h*0.5;
		} else if (value == 'bottom') {
			this.field.y = this.field.textHeight;
		}
	}

	align(hAlign = Align.CENTER, vAlign = Align.MIDDLE)
	{
		this.hAlign = hAlign;
		this.vAlign = vAlign;
	}

}